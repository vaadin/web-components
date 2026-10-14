#!/usr/bin/env node

/**
 * Compares the public API that `custom-elements.json` and the web-types files
 * describe between a base ref and the working tree.
 *
 * Usage:
 *   yarn workspace @vaadin/manifest-tools compare [--base <ref>] [--out <dir>] [--base-label <text>] [--head-label <text>]
 *
 * Snapshots <ref> (default `origin/main`) in a temporary worktree with its own
 * `yarn install`, as `patches/` can change the analyzer, and the working tree.
 * Prints the PR comment, and with `--out` writes `cem-api.diff`, `comment.md`
 * and `status.json` to <dir>, which is relative to the repo root. The CEM API workflow runs the same command.
 * When no input of the manifests changed since <ref>, the generation is
 * skipped and the comment says "No API changes."
 */
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  diffStats,
  parseDiff,
  parseSnapshot,
  renderComment,
  snapshotManifest,
  snapshotWebTypes,
} from '../lib/api-snapshot.js';

const USAGE =
  'Usage: yarn workspace @vaadin/manifest-tools compare [--base <ref>] [--out <dir>] [--base-label <text>] [--head-label <text>]';

// The files that the manifests are generated from, as git pathspecs
const INPUTS = ['packages/*/src/*', 'manifest', 'scripts/buildWebtypes.js', 'patches', 'yarn.lock'];

const [command, ...args] = process.argv.slice(2);
const option = (name) => {
  const index = args.indexOf(`--${name}`);
  if (index === -1) {
    return undefined;
  }
  const value = args[index + 1];
  if (value === undefined || value.startsWith('--')) {
    console.error(`--${name} needs a value\n${USAGE}`);
    process.exit(1);
  }
  return value;
};

const run = (cmd, cmdArgs, cwd) =>
  execFileSync(cmd, cmdArgs, {
    cwd,
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 1 << 28,
  });

const CONFIG = 'manifest/custom-elements-manifest.config.js';

/** @return {string[]} the package directory names, sorted, without stray files such as `.DS_Store` */
const packageDirs = (dir) =>
  fs
    .readdirSync(path.join(dir, 'packages'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

/**
 * @param {string} dir the checkout to generate the manifests in
 * @return {{ manifest: object, webTypes: object[] }}
 */
function generate(dir) {
  if (!fs.existsSync(path.join(dir, CONFIG))) {
    throw new Error(`${dir} has no ${CONFIG}, the base is too old to compare`);
  }

  // Leftovers of another revision would end up in the snapshot
  fs.rmSync(path.join(dir, 'custom-elements.json'), { force: true });
  for (const pkg of packageDirs(dir)) {
    for (const file of ['custom-elements.json', 'web-types.json', 'web-types.lit.json']) {
      fs.rmSync(path.join(dir, 'packages', pkg, file), { force: true });
    }
  }

  run(path.join(dir, 'node_modules/.bin/custom-elements-manifest'), ['analyze', '--config', CONFIG], dir);
  run('node', ['manifest/scripts/split-cem.js'], dir);
  run('node', ['scripts/buildWebtypes.js'], dir);

  const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'custom-elements.json'), 'utf-8'));
  const webTypes = [];
  for (const pkg of packageDirs(dir)) {
    const filePath = path.join(dir, 'packages', pkg, 'web-types.json');
    if (fs.existsSync(filePath)) {
      webTypes.push(JSON.parse(fs.readFileSync(filePath, 'utf-8')));
    }
  }
  return { manifest, webTypes };
}

function snapshot(dir, outDir) {
  const { manifest, webTypes } = generate(dir);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'custom-elements.api'), snapshotManifest(manifest));
  fs.writeFileSync(path.join(outDir, 'web-types.api'), snapshotWebTypes(webTypes));
}

/**
 * @return {{ raw: string, diff: string, stats: object }}
 */
function diffFiles(baseFile, headFile) {
  const result = spawnSync(
    'git',
    [
      'diff',
      '--no-index',
      '--no-color',
      '-U0',
      '--src-prefix=base/',
      '--dst-prefix=head/',
      path.resolve(baseFile),
      path.resolve(headFile),
    ],
    { encoding: 'utf-8', maxBuffer: 1 << 28 },
  );
  if (result.status !== 0 && result.status !== 1) {
    throw new Error(result.stderr);
  }
  // git drops the leading slash of absolute paths after the prefix
  const raw = result.stdout
    .replaceAll(`base/${path.resolve(baseFile).slice(1)}`, `base/${path.basename(baseFile)}`)
    .replaceAll(`head/${path.resolve(headFile).slice(1)}`, `head/${path.basename(headFile)}`);
  const stats = diffStats(
    parseSnapshot(fs.readFileSync(baseFile, 'utf-8')),
    parseSnapshot(fs.readFileSync(headFile, 'utf-8')),
  );
  return { raw, diff: parseDiff(raw), stats };
}

/** Writes `cem-api.diff`, `comment.md` and `status.json` to `outDir` and returns the comment. */
function report(cem, webTypes, outDir, labels) {
  const changes = Boolean(cem.diff || webTypes.diff);
  const comment = renderComment(cem, webTypes, labels);

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'cem-api.diff'), (cem.raw ?? '') + (webTypes.raw ?? ''));
  fs.writeFileSync(path.join(outDir, 'comment.md'), comment);
  fs.writeFileSync(
    path.join(outDir, 'status.json'),
    `${JSON.stringify({ changes, cem: cem.stats, webTypes: webTypes.stats })}\n`,
  );
  return comment;
}

function diff(baseDir, headDir, outDir, labels) {
  const cem = diffFiles(path.join(baseDir, 'custom-elements.api'), path.join(headDir, 'custom-elements.api'));
  const webTypes = diffFiles(path.join(baseDir, 'web-types.api'), path.join(headDir, 'web-types.api'));
  return report(cem, webTypes, outDir, labels);
}

/**
 * @param {string} rootDir
 * @param {string} sha the base commit
 * @return {boolean} whether a tracked or untracked file under `INPUTS` differs from the base
 */
function inputsChanged(rootDir, sha) {
  const tracked = spawnSync('git', ['diff', '--quiet', sha, '--', ...INPUTS], { cwd: rootDir });
  const untracked = run('git', ['ls-files', '--others', '--exclude-standard', '--', ...INPUTS], rootDir);
  return tracked.status !== 0 || untracked.trim() !== '';
}

function compare(baseRef, outDir, labels) {
  const rootDir = run('git', ['rev-parse', '--show-toplevel']).trim();
  // `yarn workspace` runs the script in `manifest/`, so a relative <dir> means the repo root
  const reportDir = outDir && path.resolve(rootDir, outDir);
  const sha = run('git', ['rev-parse', baseRef], rootDir).trim();
  const resolved = {
    base: labels.base ?? `\`${baseRef}\` (${sha.slice(0, 10)})`,
    head: labels.head ?? 'the working tree',
  };
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cem-api-'));
  const worktree = path.join(tmp, 'base');
  try {
    if (!inputsChanged(rootDir, sha)) {
      console.error(`[cem-api] no input of the manifests changed since ${baseRef} (${sha.slice(0, 10)})`);
      const empty = { diff: '', stats: { elements: 0, removed: 0, added: 0, changed: 0 } };
      return report(empty, empty, reportDir ?? path.join(tmp, 'report'), resolved);
    }
    run('git', ['worktree', 'add', '--detach', worktree, sha], rootDir);
    console.error(`[cem-api] base: installing and generating ${baseRef} (${sha.slice(0, 10)})`);
    run('yarn', ['install', '--frozen-lockfile', '--prefer-offline', '--silent'], worktree);
    snapshot(worktree, path.join(tmp, 'base-api'));
    console.error('[cem-api] head: generating the working tree');
    snapshot(rootDir, path.join(tmp, 'head-api'));
    return diff(
      path.join(tmp, 'base-api'),
      path.join(tmp, 'head-api'),
      reportDir ?? path.join(tmp, 'report'),
      resolved,
    );
  } finally {
    if (fs.existsSync(worktree)) {
      run('git', ['worktree', 'remove', '--force', worktree], rootDir);
    }
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

if (command === 'compare') {
  const labels = { base: option('base-label'), head: option('head-label') };
  process.stdout.write(compare(option('base') ?? 'origin/main', option('out'), labels));
} else {
  console.error(USAGE);
  process.exit(1);
}

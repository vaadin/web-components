#!/usr/bin/env node

/**
 * Compares the public API that `custom-elements.json` and the web-types files
 * describe between a base ref and the working tree.
 *
 * Usage:
 *   node manifest/scripts/cem-api.js compare [--base <ref>] [--out <dir>] [--base-label <text>] [--head-label <text>]
 *
 * Snapshots <ref> (default `origin/main`) in a temporary worktree with its own
 * `yarn install`, as `patches/` can change the analyzer, and the working tree.
 * Prints the PR comment, and with `--out` writes `cem-api.diff`, `comment.md`
 * and `status.json` to <dir>. The CEM API workflow runs the same command.
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

const [command, ...args] = process.argv.slice(2);
const option = (name) => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? undefined : args[index + 1];
};

const run = (cmd, cmdArgs, cwd) =>
  execFileSync(cmd, cmdArgs, {
    cwd,
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 1 << 28,
  });

// GENERATION

const CONFIG = 'manifest/custom-elements-manifest.config.js';

/**
 * @param {string} dir the checkout to generate the manifests in
 * @return {{ manifest: object, webTypes: object[] }}
 */
function generate(dir) {
  if (!fs.existsSync(path.join(dir, CONFIG))) {
    throw new Error(`${dir} has no ${CONFIG}, the base must include #13116`);
  }

  // Leftovers of another revision would end up in the snapshot
  fs.rmSync(path.join(dir, 'custom-elements.json'), { force: true });
  for (const pkg of fs.readdirSync(path.join(dir, 'packages'))) {
    for (const file of ['custom-elements.json', 'web-types.json', 'web-types.lit.json']) {
      fs.rmSync(path.join(dir, 'packages', pkg, file), { force: true });
    }
  }

  run(path.join(dir, 'node_modules/.bin/custom-elements-manifest'), ['analyze', '--config', CONFIG], dir);
  run('node', ['manifest/scripts/split-cem.js'], dir);
  run('node', ['scripts/buildWebtypes.js'], dir);

  const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'custom-elements.json'), 'utf-8'));
  const webTypes = [];
  for (const pkg of fs.readdirSync(path.join(dir, 'packages')).sort()) {
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

// DIFF

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

function diff(baseDir, headDir, outDir, labels) {
  const cem = diffFiles(path.join(baseDir, 'custom-elements.api'), path.join(headDir, 'custom-elements.api'));
  const webTypes = diffFiles(path.join(baseDir, 'web-types.api'), path.join(headDir, 'web-types.api'));
  const changes = Boolean(cem.diff || webTypes.diff);
  const comment = renderComment(cem, webTypes, labels);

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'cem-api.diff'), cem.raw + webTypes.raw);
  fs.writeFileSync(path.join(outDir, 'comment.md'), comment);
  fs.writeFileSync(
    path.join(outDir, 'status.json'),
    `${JSON.stringify({ changes, cem: cem.stats, webTypes: webTypes.stats })}\n`,
  );
  return comment;
}

// COMPARE

function compare(baseRef, outDir, labels) {
  const rootDir = run('git', ['rev-parse', '--show-toplevel']).trim();
  const sha = run('git', ['rev-parse', baseRef], rootDir).trim();
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cem-api-'));
  const worktree = path.join(tmp, 'base');
  run('git', ['worktree', 'add', '--detach', worktree, sha], rootDir);
  try {
    console.error(`[cem-api] base: installing and generating ${baseRef} (${sha.slice(0, 10)})`);
    run('yarn', ['install', '--frozen-lockfile', '--prefer-offline', '--silent'], worktree);
    snapshot(worktree, path.join(tmp, 'base-api'));
    console.error('[cem-api] head: generating the working tree');
    snapshot(rootDir, path.join(tmp, 'head-api'));
    return diff(path.join(tmp, 'base-api'), path.join(tmp, 'head-api'), outDir ?? path.join(tmp, 'report'), {
      base: labels.base ?? `\`${baseRef}\` (${sha.slice(0, 10)})`,
      head: labels.head ?? 'the working tree',
    });
  } finally {
    run('git', ['worktree', 'remove', '--force', worktree], rootDir);
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

// MAIN

if (command === 'compare') {
  const labels = { base: option('base-label'), head: option('head-label') };
  process.stdout.write(compare(option('base') ?? 'origin/main', option('out'), labels));
} else {
  console.error('Usage: node manifest/scripts/cem-api.js compare, see the header of the script');
  process.exit(1);
}

#!/usr/bin/env node

/**
 * Updates Playwright to the latest version on npm, or to the given version:
 * the `playwright` version in the root and React `package.json`, and
 * `yarn.lock`. The visual tests use the Playwright Docker image of the version
 * in the root `package.json`.
 *
 * Does nothing when the Docker image of the version is not published yet. The
 * image usually follows the npm release within an hour, but can take days.
 *
 * Writes `version` to $GITHUB_OUTPUT when the files were updated.
 *
 * Usage: node scripts/updatePlaywright.js [version]
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const PACKAGE_FILES = ['package.json', 'react/package.json'];

const getCurrentVersion = () => {
  const { resolutions } = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  return resolutions.playwright;
};

const getLatestVersion = async () => {
  const response = await fetch('https://registry.npmjs.org/playwright/latest');
  if (!response.ok) {
    throw new Error(`Failed to fetch the latest Playwright version: ${response.status}`);
  }
  return (await response.json()).version;
};

const isImagePublished = async (version) => {
  const response = await fetch(`https://mcr.microsoft.com/v2/playwright/manifests/v${version}-noble`, {
    method: 'HEAD',
    headers: {
      Accept: 'application/vnd.oci.image.index.v1+json, application/vnd.docker.distribution.manifest.list.v2+json',
    },
  });
  return response.ok;
};

const replaceInFile = (file, from, to) => {
  const content = fs.readFileSync(file, 'utf-8');
  if (!content.includes(from)) {
    throw new Error(`${from} not found in ${file}`);
  }
  fs.writeFileSync(file, content.replaceAll(from, to));
};

const main = async () => {
  const currentVersion = getCurrentVersion();
  const version = process.argv[2] || (await getLatestVersion());

  // The version ends up in URLs, files, branch names and the workflow outputs
  if (!/^\d+\.\d+\.\d+$/u.test(version)) {
    throw new Error('Invalid Playwright version, expected a release version like 1.2.3');
  }

  if (version === currentVersion) {
    console.log(`Playwright is up to date (${version}).`);
    return;
  }

  if (!(await isImagePublished(version))) {
    console.log(`Docker image for Playwright ${version} is not published yet, skipping.`);
    return;
  }

  console.log(`Updating Playwright from ${currentVersion} to ${version}.`);

  PACKAGE_FILES.forEach((file) => {
    replaceInFile(file, `"playwright": "${currentVersion}"`, `"playwright": "${version}"`);
  });

  // Updates the lockfile entries of the changed version ranges only
  execFileSync('yarn', ['install', '--ignore-scripts', '--no-progress', '--non-interactive'], { stdio: 'inherit' });

  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `version=${version}\n`);
  }
};

await main();

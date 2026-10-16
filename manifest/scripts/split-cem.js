#!/usr/bin/env node

/**
 * This script splits the root custom-elements.json manifest into
 * per-package custom-elements.json files.
 *
 * Run with: node manifest/scripts/split-cem.js
 */
import fs from 'node:fs';
import path from 'node:path';
import { packageDir, rootDir } from '../lib/cem-helpers.js';
import { splitManifest } from '../lib/split-paths.js';

const rootManifest = JSON.parse(fs.readFileSync(path.join(rootDir, 'custom-elements.json'), 'utf-8'));
const manifests = splitManifest(rootManifest);
console.log(`Found ${manifests.size} packages in root manifest`);

for (const [packageName, manifest] of manifests) {
  const outputPath = path.join(packageDir(packageName), 'custom-elements.json');
  fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Written: ${outputPath} (${manifest.modules.length} modules)`);
}

console.log('Done!');

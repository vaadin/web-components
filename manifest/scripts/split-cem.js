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
import {
  deepTransform,
  entryPointModule,
  extractPackageName,
  findEntryPoints,
  transformModulePath,
} from '../lib/split-paths.js';

// Read root manifest
const rootManifestPath = path.join(rootDir, 'custom-elements.json');
const rootManifest = JSON.parse(fs.readFileSync(rootManifestPath, 'utf-8'));

// Group modules by package
const packageModules = new Map();

for (const mod of rootManifest.modules) {
  const packageName = extractPackageName(mod.path);
  if (!packageName) {
    console.warn(`Skipping module with unexpected path: ${mod.path}`);
    continue;
  }

  if (!packageModules.has(packageName)) {
    packageModules.set(packageName, []);
  }
  packageModules.get(packageName).push(mod);
}

console.log(`Found ${packageModules.size} packages in root manifest`);

// Process each package
for (const [packageName, modules] of packageModules) {
  const transformedModules = modules.map((mod) => {
    const transformedMod = deepTransform(mod, packageName);
    transformedMod.path = transformModulePath(mod.path);
    return transformedMod;
  });

  // Only add an entry point if its source module exists in the manifest
  const entryPointModules = findEntryPoints(packageName)
    .filter((entry) => transformedModules.some((m) => m.path === entry.source))
    .map(entryPointModule);

  // Combine entry points (first) with transformed modules
  const allModules = [...entryPointModules, ...transformedModules];

  const packageManifest = {
    schemaVersion: '1.0.0',
    readme: '',
    modules: allModules,
  };

  const outputPath = path.join(packageDir(packageName), 'custom-elements.json');
  fs.writeFileSync(outputPath, `${JSON.stringify(packageManifest, null, 2)}\n`);
  console.log(`Written: ${outputPath} (${allModules.length} modules)`);
}

console.log('Done!');

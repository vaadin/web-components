#!/usr/bin/env node

/**
 * This script splits the root custom-elements.json manifest into
 * per-package custom-elements.json files.
 *
 * Run with: node scripts/split-cem.js
 */
import { globSync } from 'glob';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const packagesDir = path.join(rootDir, 'packages');

// Read root manifest
const rootManifestPath = path.join(rootDir, 'custom-elements.json');
const rootManifest = JSON.parse(fs.readFileSync(rootManifestPath, 'utf-8'));

/**
 * Extract package name from a module path.
 * @param {string} modulePath - e.g. "packages/button/src/vaadin-button.js"
 * @returns {string|null} - e.g. "button"
 */
function extractPackageName(modulePath) {
  const match = modulePath.match(/^packages\/([^/]+)\//u);
  return match ? match[1] : null;
}

/**
 * Transform a module reference from root manifest format to per-package format.
 * Handles both "module" and "package" references.
 *
 * @param {object} ref - Reference object with "module" or "package" property
 * @param {string} currentPackage - The package being processed (e.g. "button")
 * @returns {object} - Transformed reference
 */
function transformReference(ref, currentPackage) {
  if (!ref || typeof ref !== 'object') return ref;

  const transformed = { ...ref };

  if (transformed.module) {
    const modulePath = transformed.module;

    // Handle leading slash (same-package reference in root manifest)
    // e.g. "/packages/button/src/vaadin-button-mixin.js"
    if (modulePath.startsWith('/packages/')) {
      const withoutSlash = modulePath.slice(1); // Remove leading slash
      const refPackage = extractPackageName(withoutSlash);

      if (refPackage === currentPackage) {
        // Same package - convert to relative path
        // "/packages/button/src/foo.js" -> "src/foo.js"
        transformed.module = withoutSlash.replace(`packages/${currentPackage}/`, '');
      } else {
        // Different package - convert to npm package reference
        // "/packages/a11y-base/src/foo.js" -> "@vaadin/a11y-base/src/foo.js"
        delete transformed.module;
        transformed.package = `@vaadin/${withoutSlash.replace('packages/', '')}`;
      }
    }
    // Handle no leading slash (cross-package reference or self-reference)
    // e.g. "packages/a11y-base/src/disabled-mixin.js"
    else if (modulePath.startsWith('packages/')) {
      const refPackage = extractPackageName(modulePath);

      if (refPackage === currentPackage) {
        // Same package - convert to relative path
        transformed.module = modulePath.replace(`packages/${currentPackage}/`, '');
      } else {
        // Different package - convert to npm package reference
        delete transformed.module;
        transformed.package = `@vaadin/${modulePath.replace('packages/', '')}`;
      }
    }
    // Relative paths within the package stay as-is
  }

  // External packages stay as-is (e.g. "@open-wc/dedupe-mixin", "lit")
  return transformed;
}

/**
 * Recursively traverse an object and transform all module references.
 * @param {any} obj - Object to traverse
 * @param {string} currentPackage - The package being processed
 * @returns {any} - Transformed object
 */
function deepTransform(obj, currentPackage) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map((item) => deepTransform(item, currentPackage));
  }

  // First, check if the current object itself is a reference object
  // (e.g., a mixin entry like {name: "Foo", module: "/packages/..."})
  // and transform it before recursing into its properties
  const transformed = 'module' in obj ? transformReference(obj, currentPackage) : obj;

  const result = {};
  for (const [key, value] of Object.entries(transformed)) {
    if (typeof value === 'object' && value !== null) {
      result[key] = deepTransform(value, currentPackage);
    } else {
      result[key] = value;
    }
  }
  return result;
}

/**
 * Transform a module's path from root format to per-package format.
 * @param {string} modulePath - e.g. "packages/button/src/vaadin-button.js"
 * @param {string} currentPackage - e.g. "button"
 * @returns {string} - e.g. "src/vaadin-button.js"
 */
function transformModulePath(modulePath, currentPackage) {
  return modulePath.replace(`packages/${currentPackage}/`, '');
}

/**
 * Find entry point files for a package (vaadin-*.js in package root).
 * @param {string} packageName - e.g. "button"
 * @returns {string[]} - Array of entry point file names
 */
function findEntryPoints(packageName) {
  const packageDir = path.join(packagesDir, packageName);
  const pattern = path.join(packageDir, 'vaadin-*.js');
  const files = globSync(pattern);
  return files.map((f) => path.basename(f));
}

/**
 * Generate entry point module for the manifest.
 * @param {string} entryFile - e.g. "vaadin-button.js"
 * @returns {object} - Module object for the manifest
 */
function generateEntryPointModule(entryFile) {
  const srcFile = `src/${entryFile}`;
  return {
    kind: 'javascript-module',
    path: entryFile,
    declarations: [],
    exports: [
      {
        kind: 'js',
        name: '*',
        declaration: {
          name: '*',
          module: srcFile,
        },
      },
    ],
  };
}

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
  // Transform modules
  const transformedModules = modules.map((mod) => {
    // Transform the path
    const transformedPath = transformModulePath(mod.path, packageName);

    // Deep transform the rest of the module
    const transformedMod = deepTransform(mod, packageName);
    transformedMod.path = transformedPath;

    return transformedMod;
  });

  // Find and add entry point modules
  const entryPoints = findEntryPoints(packageName);
  const entryPointModules = [];

  for (const entryFile of entryPoints) {
    // Check if there's a corresponding src file in the modules
    const srcPath = `src/${entryFile}`;
    const hasSrcModule = transformedModules.some((m) => m.path === srcPath);

    if (hasSrcModule) {
      // Only add entry point if the src file exists in the manifest
      entryPointModules.push(generateEntryPointModule(entryFile));
    }
  }

  // Combine entry points (first) with transformed modules
  const allModules = [...entryPointModules, ...transformedModules];

  // Create the per-package manifest
  const packageManifest = {
    schemaVersion: '1.0.0',
    readme: '',
    modules: allModules,
  };

  // Write to package directory
  const outputPath = path.join(packagesDir, packageName, 'custom-elements.json');
  fs.writeFileSync(outputPath, `${JSON.stringify(packageManifest, null, 2)}\n`);
  console.log(`Written: ${outputPath} (${allModules.length} modules)`);
}

console.log('Done!');

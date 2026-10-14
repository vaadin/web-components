/**
 * Helpers for the scripts that read the per-package `custom-elements.json`
 * manifests written by `yarn release:cem`.
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const packagesDir = path.join(rootDir, 'packages');

// Define custom elements used only inside other components
export const INTERNAL_PACKAGES = new Set(['field-highlighter', 'input-container', 'overlay']);

// Code unit order, independent of locale
export const byName = (a, b) => {
  if (a === b) {
    return 0;
  }
  return a < b ? -1 : 1;
};

/**
 * Lists the directory names of the public packages under `packages/`, sorted.
 * @return {string[]}
 */
export function listPackages() {
  const pathToLerna = path.normalize('./node_modules/.bin/lerna');
  // Nx takes the topmost directory with `node_modules/nx` as the workspace
  // root, which is the wrong one for a worktree nested in another checkout
  const env = { ...process.env, NX_WORKSPACE_ROOT_PATH: rootDir };
  const output = execSync(`${pathToLerna} ls --json --loglevel silent`, { cwd: rootDir, env }); // NOSONAR
  return JSON.parse(output.toString())
    .filter((project) => path.dirname(project.location) === packagesDir)
    .map((project) => path.basename(project.location))
    .sort(byName);
}

/**
 * @param {string} dir
 * @return {object}
 */
export function readPackageJson(dir) {
  return JSON.parse(fs.readFileSync(path.join(packagesDir, dir, 'package.json'), 'utf-8'));
}

/**
 * @param {string} dir
 * @return {object | null} null when the package has no manifest
 */
export function readManifest(dir) {
  try {
    return JSON.parse(fs.readFileSync(path.join(packagesDir, dir, 'custom-elements.json'), 'utf-8'));
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

/**
 * @param {object} declaration
 * @return {boolean}
 */
export function isElement(declaration) {
  return declaration.kind === 'class' && !!declaration.customElement && !!declaration.tagName;
}

/**
 * @param {object} manifest
 * @return {object[]} the custom element declarations
 */
export function getElements(manifest) {
  return manifest.modules.flatMap((module) => (module.declarations || []).filter(isElement));
}

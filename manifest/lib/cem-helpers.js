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
export const labsDir = path.join(rootDir, 'labs');

// Define custom elements used only inside other components
export const INTERNAL_PACKAGES = new Set(['field-highlighter', 'input-container', 'overlay']);

/**
 * Compares two strings by UTF-16 code unit, like the default `Array.prototype.sort`.
 * The scripts use it wherever a generated file must come out byte-identical on
 * every machine, as `localeCompare` depends on the locale and the ICU version.
 */
export const byName = (a, b) => {
  if (a === b) {
    return 0;
  }
  return a < b ? -1 : 1;
};

const PRIMITIVE_TYPE = /^(string|number|boolean|null|undefined)(\s*\|\s*(string|number|boolean|null|undefined))*$/iu;

/**
 * Tells whether a type can be set from an HTML attribute: `string`, `number`,
 * `boolean`, `null`, `undefined`, or a union of them. Objects, arrays, functions
 * and renderers only have a property.
 * @param {string} text the `type.text` of a manifest item
 * @return {boolean}
 */
export const isPrimitiveType = (text) => PRIMITIVE_TYPE.test(text);

/**
 * Lists the directory names of the public packages under `packages/`, sorted,
 * plus `labs` when the labs package exists.
 * @return {string[]}
 */
export function listPackages() {
  const pathToLerna = path.normalize('./node_modules/.bin/lerna');
  // Nx takes the topmost directory with `node_modules/nx` as the workspace
  // root, which is the wrong one for a worktree nested in another checkout
  const env = { ...process.env, NX_WORKSPACE_ROOT_PATH: rootDir };
  const output = execSync(`${pathToLerna} ls --json --loglevel silent`, { cwd: rootDir, env }); // NOSONAR
  return JSON.parse(output.toString())
    .filter((project) => path.dirname(project.location) === packagesDir || project.location === labsDir)
    .map((project) => path.basename(project.location))
    .sort(byName);
}

/** @return {string[]} the names of the sub-directories, without stray files such as `.DS_Store` */
const subDirs = (dir) =>
  fs.existsSync(dir)
    ? fs
        .readdirSync(dir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
    : [];

/**
 * Lists the component directories under `packages/` and `labs/`. A labs
 * sub-directory counts when it has `src/`, so ignored screenshots left behind
 * after a graduation do not count.
 * @param {string} [root] the checkout to scan
 * @return {{ name: string, dir: string, pkg: 'packages' | 'labs' }[]} sorted by name
 */
export function listComponentDirs(root = rootDir) {
  const components = subDirs(path.join(root, 'packages')).map((name) => ({
    name,
    dir: path.join(root, 'packages', name),
    pkg: 'packages',
  }));
  const labs = path.join(root, 'labs');
  for (const name of subDirs(labs)) {
    const dir = path.join(labs, name);
    if (!fs.existsSync(path.join(dir, 'src'))) {
      continue;
    }
    const duplicate = components.find((component) => component.name === name);
    if (duplicate) {
      throw new Error(`Component "${name}" exists in both ${duplicate.dir} and ${dir}`);
    }
    components.push({ name, dir, pkg: 'labs' });
  }
  return components.sort((a, b) => byName(a.name, b.name));
}

/**
 * Lists the package directory names by scanning the file system, without lerna.
 * Unlike `listPackages()`, it works on the base worktree of `cem-api.js`, which
 * has no lerna run of its own.
 * @param {string} [root] the checkout to scan
 * @return {string[]} the `packages/*` directories plus `labs` when present, sorted
 */
export function listPackageDirs(root = rootDir) {
  const dirs = subDirs(path.join(root, 'packages'));
  if (fs.existsSync(path.join(root, 'labs', 'package.json'))) {
    dirs.push('labs');
  }
  return dirs.sort(byName);
}

/**
 * @param {string} name a package directory name, or `labs`
 * @param {string} [root] the checkout
 * @return {string} the absolute package directory
 */
export function packageDir(name, root = rootDir) {
  return name === 'labs' ? path.join(root, 'labs') : path.join(root, 'packages', name);
}

/**
 * @param {string} dir
 * @return {object}
 */
export function readPackageJson(dir) {
  return JSON.parse(fs.readFileSync(path.join(packageDir(dir), 'package.json'), 'utf-8'));
}

/**
 * @param {string} dir
 * @return {object | null} null when the package has no manifest
 */
export function readManifest(dir) {
  try {
    return JSON.parse(fs.readFileSync(path.join(packageDir(dir), 'custom-elements.json'), 'utf-8'));
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

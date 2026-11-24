/**
 * Functions of `split-cem.js`, which maps the module paths of the root
 * `custom-elements.json` to the packages under `packages/` and writes one
 * manifest per package.
 */
import fs from 'node:fs';
import { byName, packageDir, rootDir } from './cem-helpers.js';

const PACKAGE_PATH = /^packages\/([^/]+)\//u;

/**
 * @param {string} modulePath e.g. "packages/button/src/vaadin-button.js"
 * @return {string | null} e.g. "button"
 */
export function extractPackageName(modulePath) {
  const match = modulePath.match(PACKAGE_PATH);
  return match ? match[1] : null;
}

/**
 * @param {string} modulePath e.g. "packages/button/src/vaadin-button.js"
 * @return {string} the path inside the package, e.g. "src/vaadin-button.js"
 */
export function transformModulePath(modulePath) {
  return modulePath.replace(PACKAGE_PATH, '');
}

/**
 * Turns a "module" reference of the root manifest into a path relative to
 * `currentPackage`, or into a "package" reference to another package.
 * @param {object} ref an object with a "module" or "package" property
 * @param {string} currentPackage e.g. "button"
 * @return {object} a new object, or `ref` itself when it is not a reference to a package module
 */
export function transformReference(ref, currentPackage) {
  if (!ref || typeof ref !== 'object' || typeof ref.module !== 'string') {
    return ref;
  }

  // A leading slash marks a same-package reference in the root manifest
  const modulePath = ref.module.replace(/^\//u, '');
  const refPackage = extractPackageName(modulePath);
  if (!refPackage) {
    // Relative paths within the package stay as they are
    return ref;
  }

  const transformed = { ...ref };
  const innerPath = transformModulePath(modulePath);
  if (refPackage === currentPackage) {
    transformed.module = innerPath;
  } else {
    delete transformed.module;
    transformed.package = `@vaadin/${refPackage}/${innerPath}`;
  }
  return transformed;
}

/**
 * Transforms every module reference in an object tree.
 * @param {any} obj
 * @param {string} currentPackage
 * @return {any}
 */
export function deepTransform(obj, currentPackage) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => deepTransform(item, currentPackage));
  }

  // A reference object, such as a mixin entry, is transformed before its properties
  const transformed = transformReference(obj, currentPackage);
  return Object.fromEntries(
    Object.entries(transformed).map(([key, value]) => [key, deepTransform(value, currentPackage)]),
  );
}

/**
 * Lists the root entry points of a package, `vaadin-*.js`, and the source module
 * `src/<file>` that each one is expected to re-export. Sorted by name, so that
 * the output does not depend on the file system order.
 * @param {string} packageName e.g. "button"
 * @param {string} [root] the checkout
 * @return {{ path: string, source: string }[]}
 */
export function findEntryPoints(packageName, root = rootDir) {
  return fs
    .readdirSync(packageDir(packageName, root))
    .filter((file) => /^vaadin-.*\.js$/u.test(file))
    .sort(byName)
    .map((file) => ({ path: file, source: `src/${file}` }));
}

/**
 * @param {{ path: string, source: string }} entry
 * @return {object} the module of the entry point for the manifest
 */
export function entryPointModule({ path: entryFile, source }) {
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
          module: source,
        },
      },
    ],
  };
}

/**
 * Splits the root manifest into one manifest per package. Each one starts with
 * the entry point modules of the package whose source module is in the manifest.
 * @param {object} rootManifest the root `custom-elements.json`
 * @param {string} [root] the checkout
 * @return {Map<string, object>} the manifest by package directory name, in root manifest order
 */
export function splitManifest(rootManifest, root = rootDir) {
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

  const { schemaVersion, readme } = rootManifest;
  const manifests = new Map();
  for (const [packageName, modules] of packageModules) {
    const transformedModules = modules.map((mod) => ({
      ...deepTransform(mod, packageName),
      path: transformModulePath(mod.path),
    }));
    const entryPointModules = findEntryPoints(packageName, root)
      .filter((entry) => transformedModules.some((mod) => mod.path === entry.source))
      .map(entryPointModule);
    manifests.set(packageName, { schemaVersion, readme, modules: [...entryPointModules, ...transformedModules] });
  }
  return manifests;
}

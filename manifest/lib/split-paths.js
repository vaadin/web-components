/**
 * Functions of `split-cem.js`, which maps the module paths of the root
 * `custom-elements.json` to the packages under `packages/` and to `labs/`,
 * and writes one manifest per package.
 */
import fs from 'node:fs';
import path from 'node:path';
import { byName, packageDir, rootDir } from './cem-helpers.js';

const PACKAGE_PATH = /^(packages\/([^/]+)|labs)\//u;

/**
 * @param {string} modulePath e.g. "packages/button/src/vaadin-button.js" or "labs/sandbox/src/vaadin-sandbox.js"
 * @return {string | null} e.g. "button" or "labs"
 */
export function extractPackageName(modulePath) {
  const match = modulePath.match(PACKAGE_PATH);
  if (!match) {
    return null;
  }
  return match[2] ?? 'labs';
}

/**
 * @param {string} modulePath e.g. "packages/button/src/vaadin-button.js" or "labs/sandbox/src/vaadin-sandbox.js"
 * @return {string} the path inside the package, e.g. "src/vaadin-button.js" or "sandbox/src/vaadin-sandbox.js"
 */
export function transformModulePath(modulePath) {
  return modulePath.replace(PACKAGE_PATH, '');
}

/**
 * Turns a "module" reference of the root manifest into a path relative to
 * `currentPackage`, or into a "package" reference to another package.
 * @param {object} ref an object with a "module" or "package" property
 * @param {string} currentPackage e.g. "button" or "labs"
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
 * Reads the source module of a root re-export in `labs/`.
 * @param {string} content e.g. "export * from './sandbox/vaadin-sandbox.js';"
 * @return {string | null} e.g. "sandbox/src/vaadin-sandbox.js"
 */
export function labsEntrySource(content) {
  const match = content.match(/export \* from (['"])\.\/(?!src\/)([^/]+)\/(vaadin-[^/]+\.js)\1;/u);
  return match ? `${match[2]}/src/${match[3]}` : null;
}

/**
 * Lists the root entry points of a package, `vaadin-*.js`, and the source module
 * that each one is expected to re-export: `src/<file>` in a package, and the
 * `<name>/src/<file>` the file exports in `labs/`, whose inner entry files are
 * internal. Sorted by name, so that the output does not depend on the file
 * system order.
 * @param {string} packageName e.g. "button" or "labs"
 * @param {string} [root] the checkout
 * @return {{ path: string, source: string }[]}
 */
export function findEntryPoints(packageName, root = rootDir) {
  const dir = packageDir(packageName, root);
  return fs
    .readdirSync(dir)
    .filter((file) => /^vaadin-.*\.js$/u.test(file))
    .sort(byName)
    .map((file) => {
      if (packageName !== 'labs') {
        return { path: file, source: `src/${file}` };
      }
      const source = labsEntrySource(fs.readFileSync(path.join(dir, file), 'utf-8'));
      if (!source) {
        console.warn(`Skipping labs/${file}: expected export * from './<name>/vaadin-*.js'`);
      }
      return { path: file, source };
    })
    .filter((entry) => entry.source);
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

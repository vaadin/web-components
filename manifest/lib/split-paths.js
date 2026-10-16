/**
 * Path functions of `split-cem.js`, which maps the module paths of the root
 * `custom-elements.json` to the packages under `packages/` and to `labs/`.
 */
import { globSync } from 'glob';
import fs from 'node:fs';
import path from 'node:path';
import { packageDir } from './cem-helpers.js';

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
 * @return {object}
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
    return { ...ref };
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
  const transformed = 'module' in obj ? transformReference(obj, currentPackage) : obj;
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
 * Lists the root entry points of a package and the source module each one exports.
 * In `labs/` only the root re-exports count, the entry files of the components are internal.
 * @param {string} packageName e.g. "button" or "labs"
 * @param {string} [root] the checkout
 * @return {{ path: string, source: string }[]}
 */
export function findEntryPoints(packageName, root) {
  const dir = packageDir(packageName, root);
  return globSync('vaadin-*.js', { cwd: dir })
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

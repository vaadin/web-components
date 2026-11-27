/**
 * Functions of `split-cem.js`, which maps the module paths of the root
 * `custom-elements.json` to the packages under `packages/` and writes one
 * manifest per package.
 */
import type { JavaScriptModule, Package } from 'custom-elements-manifest';
import fs from 'node:fs';
import { byName, packageDir, rootDir } from './cem-helpers.ts';

/** A reference of the manifest, to a module of the package or to another package. */
export interface ModuleReference {
  name?: string;
  module?: string;
  package?: string;
}

/** A root entry point and the source module that it re-exports. */
export interface EntryPoint {
  path: string;
  source: string;
}

const PACKAGE_PATH = /^packages\/([^/]+)\//u;

/**
 * @param modulePath e.g. "packages/button/src/vaadin-button.js"
 * @return e.g. "button"
 */
export function extractPackageName(modulePath: string): string | null {
  const match = modulePath.match(PACKAGE_PATH);
  return match ? match[1] : null;
}

/**
 * @param modulePath e.g. "packages/button/src/vaadin-button.js"
 * @return the path inside the package, e.g. "src/vaadin-button.js"
 */
export function transformModulePath(modulePath: string): string {
  return modulePath.replace(PACKAGE_PATH, '');
}

function isModuleReference(ref: unknown): ref is ModuleReference & { module: string } {
  return !!ref && typeof ref === 'object' && typeof (ref as ModuleReference).module === 'string';
}

/**
 * Turns a "module" reference of the root manifest into a path relative to
 * `currentPackage`, or into a "package" reference to another package.
 * @param ref an object with a "module" or "package" property
 * @param currentPackage e.g. "button"
 * @return a new object, or `ref` itself when it is not a reference to a package module
 */
export function transformReference<T>(ref: T, currentPackage: string): T {
  if (!isModuleReference(ref)) {
    return ref;
  }

  // A leading slash marks a same-package reference in the root manifest
  const modulePath = ref.module.replace(/^\//u, '');
  const refPackage = extractPackageName(modulePath);
  if (!refPackage) {
    // Relative paths within the package stay as they are
    return ref;
  }

  const transformed: ModuleReference = { ...ref };
  const innerPath = transformModulePath(modulePath);
  if (refPackage === currentPackage) {
    transformed.module = innerPath;
  } else {
    delete transformed.module;
    transformed.package = `@vaadin/${refPackage}/${innerPath}`;
  }
  return transformed as T;
}

/**
 * Transforms every module reference in an object tree.
 */
export function deepTransform<T>(obj: T, currentPackage: string): T;
export function deepTransform(obj: unknown, currentPackage: string): unknown {
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
 * @param packageName e.g. "button"
 * @param root the checkout
 */
export function findEntryPoints(packageName: string, root = rootDir): EntryPoint[] {
  return fs
    .readdirSync(packageDir(packageName, root))
    .filter((file) => /^vaadin-.*\.js$/u.test(file))
    .sort(byName)
    .map((file) => ({ path: file, source: `src/${file}` }));
}

/**
 * @return the module of the entry point for the manifest
 */
export function entryPointModule({ path: entryFile, source }: EntryPoint): JavaScriptModule {
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
 * @param rootManifest the root `custom-elements.json`
 * @param root the checkout
 * @return the manifest by package directory name, in root manifest order
 */
export function splitManifest(rootManifest: Package, root = rootDir): Map<string, Package> {
  const packageModules = new Map<string, JavaScriptModule[]>();
  for (const mod of rootManifest.modules) {
    const packageName = extractPackageName(mod.path);
    if (!packageName) {
      console.warn(`Skipping module with unexpected path: ${mod.path}`);
      continue;
    }
    const modules = packageModules.get(packageName) ?? [];
    modules.push(mod);
    packageModules.set(packageName, modules);
  }

  const { schemaVersion, readme } = rootManifest;
  const manifests = new Map<string, Package>();
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

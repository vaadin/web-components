/**
 * Helpers for the scripts that read the per-package `custom-elements.json`
 * manifests written by `yarn release:cem`.
 */
import type {
  ClassDeclaration,
  ClassMethod,
  CustomElement,
  CustomElementField,
  Declaration,
  Package,
} from 'custom-elements-manifest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * A class declaration with the custom element fields, which schema 2.1.0 declares apart.
 * Its fields can have an `attribute` and `reflects`.
 */
export type ElementDeclaration = Omit<ClassDeclaration, 'members'> &
  CustomElement & {
    members?: Array<CustomElementField | ClassMethod>;
  };

/** The fields of a `package.json` that the scripts read. */
export interface PackageJson {
  name: string;
  version: string;
  [key: string]: unknown;
}

export const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const packagesDir = path.join(rootDir, 'packages');

// Define custom elements used only inside other components
export const INTERNAL_PACKAGES = new Set(['field-highlighter', 'input-container', 'overlay']);

/**
 * Compares two strings by UTF-16 code unit, like the default `Array.prototype.sort`.
 * The scripts use it wherever a generated file must come out byte-identical on
 * every machine, as `localeCompare` depends on the locale and the ICU version.
 */
export const byName = (a: string, b: string): number => {
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
 * @param text the `type.text` of a manifest item
 */
export const isPrimitiveType = (text: string): boolean => PRIMITIVE_TYPE.test(text);

/**
 * Lists the directory names of the public packages under `packages/`, sorted.
 */
export function listPackages(): string[] {
  const pathToLerna = path.normalize('./node_modules/.bin/lerna');
  // Nx takes the topmost directory with `node_modules/nx` as the workspace
  // root, which is the wrong one for a worktree nested in another checkout
  const env = { ...process.env, NX_WORKSPACE_ROOT_PATH: rootDir };
  const output = execSync(`${pathToLerna} ls --json --loglevel silent`, { cwd: rootDir, env }); // NOSONAR
  const projects: Array<{ location: string }> = JSON.parse(output.toString());
  return projects
    .filter((project) => path.dirname(project.location) === packagesDir)
    .map((project) => path.basename(project.location))
    .sort(byName);
}

/** @return the names of the sub-directories, without stray files such as `.DS_Store` */
const subDirs = (dir: string): string[] =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

/**
 * Lists the package directory names by scanning the file system, without lerna.
 * Unlike `listPackages()`, it works on any checkout, such as the base worktree
 * of `cem-api.ts`.
 * @param root the checkout to scan
 * @return the `packages/*` directories, sorted
 */
export function listPackageDirs(root = rootDir): string[] {
  return subDirs(path.join(root, 'packages')).sort(byName);
}

/**
 * @param name a package directory name
 * @param root the checkout
 * @return the absolute package directory
 */
export function packageDir(name: string, root = rootDir): string {
  return path.join(root, 'packages', name);
}

export function readPackageJson(dir: string): PackageJson {
  return JSON.parse(fs.readFileSync(path.join(packageDir(dir), 'package.json'), 'utf-8'));
}

/**
 * @return null when the package has no manifest
 */
export function readManifest(dir: string): Package | null {
  try {
    return JSON.parse(fs.readFileSync(path.join(packageDir(dir), 'custom-elements.json'), 'utf-8'));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

export function isElement(declaration: Declaration): declaration is ElementDeclaration {
  return (
    declaration.kind === 'class' &&
    'customElement' in declaration &&
    !!declaration.customElement &&
    !!declaration.tagName
  );
}

/**
 * @return the custom element declarations
 */
export function getElements(manifest: Package): ElementDeclaration[] {
  return manifest.modules.flatMap((module) => (module.declarations || []).filter(isElement));
}

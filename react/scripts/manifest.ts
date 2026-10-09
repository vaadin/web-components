import type {
  ClassDeclaration,
  CustomElement,
  Declaration,
  JavaScriptModule,
  Package,
} from 'custom-elements-manifest/schema';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { nodeModulesDir } from './utils/config.js';
import { internalPackages } from './utils/settings.js';

// Schema 1.0.0 declares `CustomElementDeclaration` without the `CustomElement` fields.
type ElementDeclaration = ClassDeclaration & CustomElement;

export type ElementData = Readonly<{
  /** The custom element tag name, `vaadin-button`. */
  tagName: string;
  /** The event names, sorted. */
  events: readonly string[];
  /** The bare specifier of the public entry module, `@vaadin/button/vaadin-button.js`. */
  modulePath: string;
  /**
   * True when the element documents a `theme` attribute that `ThemePropertyMixin` does not
   * provide, so the `theme` prop is not part of the element type. The manifest config records
   * the mixin as `inheritedFrom` of the attribute.
   */
  themed: boolean;
}>;

const collator = new Intl.Collator('en');

async function loadManifest(packageName: string): Promise<Package | undefined> {
  try {
    return JSON.parse(await readFile(resolve(nodeModulesDir, packageName, 'custom-elements.json'), 'utf8'));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return undefined;
    }
    throw error;
  }
}

function isElementDeclaration(declaration: Declaration): declaration is ElementDeclaration {
  return declaration.kind === 'class' && 'tagName' in declaration;
}

/**
 * Finds the public entry module of an element: the package root module that re-exports
 * the declaring module, `vaadin-button.js` for `src/vaadin-button.js`.
 */
function findEntryModule(
  modules: readonly JavaScriptModule[],
  declaringModule: string,
  tagName: string,
): string | undefined {
  const rootModules = modules.filter(
    ({ path, exports }) =>
      dirname(path) === '.' && exports?.some(({ declaration }) => declaration.module === declaringModule),
  );
  return (rootModules.find(({ path }) => path === `${tagName}.js`) ?? rootModules[0])?.path;
}

async function loadElements(packageName: string): Promise<ElementData[]> {
  const manifest = internalPackages.has(packageName) ? undefined : await loadManifest(packageName);
  if (!manifest) {
    return [];
  }

  const { modules } = manifest;
  return modules.flatMap(({ path, declarations = [] }) =>
    declarations.filter(isElementDeclaration).flatMap(({ tagName = '', events = [], attributes = [] }) => {
      const entryModule = findEntryModule(modules, path, tagName);
      // Elements without a public entry module, such as `vaadin-upload-file`, get no wrapper.
      if (!entryModule) {
        return [];
      }

      return {
        tagName,
        events: events.map(({ name }) => name).sort(collator.compare),
        modulePath: `${packageName}/${entryModule}`,
        themed: attributes.some(({ name, inheritedFrom }) => name === 'theme' && !inheritedFrom),
      };
    }),
  );
}

/**
 * Lists the custom elements of the given packages from their `custom-elements.json`.
 * Packages without a manifest are skipped.
 */
export async function loadPackageElements(packageNames: readonly string[]): Promise<ElementData[]> {
  return (await Promise.all(packageNames.map(loadElements))).flat();
}

import type {
  ClassDeclaration,
  CustomElement,
  Declaration,
  JavaScriptModule,
  Package,
  Reference,
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
   * True when the element has a `theme` attribute but neither it nor a superclass applies
   * `ThemableMixin`, so the `theme` prop is not part of the element type.
   */
  themed: boolean;
}>;

const collator = new Intl.Collator('en');
const themeMixins = new Set(['ThemableMixin', 'ThemePropertyMixin']);

const manifests = new Map<string, Promise<Package | undefined>>();

function loadManifest(packageName: string): Promise<Package | undefined> {
  let manifest = manifests.get(packageName);
  if (!manifest) {
    manifest = readFile(resolve(nodeModulesDir, packageName, 'custom-elements.json'), 'utf8').then(
      (contents) => JSON.parse(contents) as Package,
      (error: NodeJS.ErrnoException) => {
        if (error.code === 'ENOENT') {
          return undefined;
        }
        throw error;
      },
    );
    manifests.set(packageName, manifest);
  }
  return manifest;
}

function isElementDeclaration(declaration: Declaration): declaration is ElementDeclaration {
  return declaration.kind === 'class' && 'tagName' in declaration;
}

function findClass({ modules }: Package, name: string): ClassDeclaration | undefined {
  for (const { declarations = [] } of modules) {
    const declaration = declarations.find((candidate) => candidate.kind === 'class' && candidate.name === name);
    if (declaration) {
      return declaration as ClassDeclaration;
    }
  }
  return undefined;
}

/**
 * Resolves the superclass reference to its declaration. The analyzer puts the module specifier,
 * such as `@vaadin/text-field/src/vaadin-text-field.js`, in `package`.
 */
async function resolveSuperclass(manifest: Package, superclass: Reference): Promise<ClassDeclaration | undefined> {
  const { name, package: specifier } = superclass;
  if (!specifier) {
    return findClass(manifest, name);
  }
  if (!specifier.startsWith('@vaadin/')) {
    return undefined;
  }
  const superManifest = await loadManifest(specifier.split('/').slice(0, 2).join('/'));
  return superManifest && findClass(superManifest, name);
}

/** True when the class or one of its superclasses applies `ThemableMixin` or `ThemePropertyMixin`. */
async function isThemable(manifest: Package, declaration: ClassDeclaration): Promise<boolean> {
  if (declaration.mixins?.some(({ name }) => themeMixins.has(name))) {
    return true;
  }
  const superclass = declaration.superclass && (await resolveSuperclass(manifest, declaration.superclass));
  return superclass ? isThemable(manifest, superclass) : false;
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
  const elements = modules.flatMap(({ path, declarations = [] }) =>
    declarations.filter(isElementDeclaration).flatMap((declaration) => {
      const { tagName = '', events = [], attributes = [] } = declaration;
      const entryModule = findEntryModule(modules, path, tagName);
      // Elements without a public entry module, such as `vaadin-upload-file`, get no wrapper.
      if (!entryModule) {
        return [];
      }

      const hasThemeAttribute = attributes.some(({ name }) => name === 'theme');
      return {
        declaration,
        data: {
          tagName,
          events: events.map(({ name }) => name).sort(collator.compare),
          modulePath: `${packageName}/${entryModule}`,
          hasThemeAttribute,
        },
      };
    }),
  );

  return Promise.all(
    elements.map(async ({ declaration, data: { hasThemeAttribute, ...data } }) => ({
      ...data,
      themed: hasThemeAttribute && !(await isThemable(manifest, declaration)),
    })),
  );
}

/**
 * Lists the custom elements of the given packages from their `custom-elements.json`.
 * Packages without a manifest are skipped.
 */
export async function loadPackageElements(packageNames: readonly string[]): Promise<ElementData[]> {
  return (await Promise.all(packageNames.map(loadElements))).flat();
}

import * as themableMixinModule from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, posix, relative, resolve, sep } from 'node:path';
import { createContext, type Module as VmModule, SourceTextModule, SyntheticModule } from 'node:vm';
import { nodeModulesDir, packageDir, stylePackages } from './utils/config.js';

const themeNameRegex = /^@vaadin\/vaadin-(.+)-styles/;

function getJsPath(moduleId: string): string {
  const jsSpecifier = posix.join(...relative(nodeModulesDir, moduleId).split(sep));
  return jsSpecifier.replace(themeNameRegex, './$1/');
}

function toCamelCase(dashSeparated: string): string {
  return dashSeparated
    .split('-')
    .map((item) => item[0].toUpperCase() + item.substring(1))
    .join('');
}

function getCssPath(moduleId: string, name?: string): string {
  const jsPath = getJsPath(moduleId);
  const dirname = posix.dirname(jsPath);
  const cssName = toCamelCase(name || posix.basename(jsPath, '.js'));
  const suffix = cssName === 'Utility' || dirname.endsWith('/utilities') ? '.module' : '';

  return posix.join(dirname, `${cssName}${suffix}.css`);
}

function resolveSpecifier(specifier: string, moduleId: string) {
  const require = createRequire(moduleId);
  return require.resolve(specifier);
}

function storeItem<T>(storage: Map<string, readonly T[]>, moduleId: string, item: T) {
  const items = storage.get(moduleId) || [];
  const index = items.length;
  storage.set(moduleId, [...items, item]);
  return index;
}

const globalContents: Map<string, readonly string[]> = new Map();

const globalWindow = { __moduleId: '' };

const vmGlobal = {
  window: globalWindow,
  document: {
    createElement(localName: string) {
      const el = { localName };

      if (localName === 'template') {
        return {
          ...el,
          content: '',
          get innerHTML() {
            return this.content;
          },
          set innerHTML(value) {
            this.content = value;
          },
        };
      }

      return el;
    },
    head: {
      childNodes: [],
      appendChild(content: string) {
        // @ts-ignore
        storeItem(globalContents, globalWindow.__moduleId, content);
      },
      insertAdjacentElement(where: InsertPosition, el: { localName: string; id?: string; textContent: string }) {
        if (el.localName === 'style') {
          // @ts-ignore
          storeItem(globalContents, globalWindow.__moduleId, el.textContent);
        }
      },
    },
  },
};

const context = createContext(vmGlobal);

const shimModules: Map<string, VmModule> = new Map();

function shimModule(specifier: string, moduleNamespaceObject: object) {
  const moduleId = resolveSpecifier(specifier, import.meta.url);
  const module = new SyntheticModule(
    Object.keys(moduleNamespaceObject),
    function () {
      for (const [exportName, exportContent] of Object.entries(moduleNamespaceObject)) {
        this.setExport(exportName, exportContent);
      }
    },
    {
      identifier: moduleId,
      context,
    },
  );
  shimModules.set(moduleId, module);
  return module;
}

function unsafeCSS() {
  throw new Error('forbidden');
}

const cssLiterals: Map<string, readonly CSSResult[]> = new Map();

class CSSResult {
  public readonly index: number = 0;
  public readonly moduleId: string;
  public readonly strings: readonly string[];
  public readonly values: ReadonlyArray<CSSResult | number>;
  public name?: string;
  public hasGlobalReference: boolean = false;

  constructor(moduleId: string, strings: readonly string[], values: ReadonlyArray<CSSResult | number>) {
    this.moduleId = moduleId;
    this.strings = strings;
    this.values = values;
    this.index = storeItem(cssLiterals, this.moduleId, this);
  }

  toString(): string {
    return `@import url(css:${this.moduleId}?${this.index});`;
  }
}

type CSSResultGroup = CSSResult | readonly CSSResult[] | readonly CSSResultGroup[];

type CSSResultTransformer<R> = (cssResult: CSSResult) => R;

function transformCss<R>(css: CSSResultGroup, transformer: CSSResultTransformer<R>): readonly R[] {
  if (Array.isArray(css)) {
    return css.flatMap((item) => transformCss(item, transformer));
  } else if (css instanceof CSSResult) {
    return [transformer(css)];
  } else return [];
}

const registerStyles = '@vaadin/vaadin-themable-mixin/register-styles.js';
const registerStylesId = resolveSpecifier(registerStyles, import.meta.url);

function shimRegisterStyles(moduleId: string) {
  return shimModule(registerStyles, {
    css(strings: readonly string[], ...values: ReadonlyArray<CSSResult | number>) {
      return new CSSResult(moduleId, strings, values);
    },
    registerStyles() {},
    unsafeCSS,
    addGlobalThemeStyles(id: string, ...values: ReadonlyArray<CSSResultGroup>) {
      transformCss(values, (cssResult) => (cssResult.hasGlobalReference = true));
    },
  });
}

const themableMixin = '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
const themableMixinId = resolveSpecifier(themableMixin, import.meta.url);

function shimThemableMixin(moduleId: string) {
  return shimModule(themableMixin, {
    ...themableMixinModule,
    css(strings: readonly string[], ...values: ReadonlyArray<CSSResult | number>) {
      return new CSSResult(moduleId, strings, values);
    },
    registerStyles() {},
    unsafeCSS,
  });
}

const escapePattern = /\\/g;
function escape(str: string) {
  return str.replaceAll(escapePattern, '\\\\');
}

async function loadModule(moduleId: string): Promise<VmModule> {
  if (shimModules.has(moduleId)) {
    return shimModules.get(moduleId)!;
  }

  const source = await readFile(moduleId, { encoding: 'utf-8' });

  return new SourceTextModule(`window.__moduleId = '${escape(moduleId)}';\n${escape(source)}`, {
    identifier: moduleId,
    context,
    initializeImportMeta(meta) {
      meta.url = `file://${moduleId}`;
    },
  });
}

const moduleMap: Map<string, Promise<VmModule>> = new Map();
const moduleDependencies: Map<string, readonly string[]> = new Map();

async function linker(specifier: string, referencingModule: VmModule): Promise<VmModule> {
  const moduleId = resolveSpecifier(specifier, referencingModule.identifier);
  if (moduleId === registerStylesId) {
    return shimRegisterStyles(referencingModule.identifier);
  }

  if (moduleId === themableMixinId) {
    return shimThemableMixin(referencingModule.identifier);
  }

  storeItem(moduleDependencies, referencingModule.identifier, moduleId);

  if (moduleMap.has(moduleId)) {
    return moduleMap.get(moduleId)!;
  }

  const modulePromise = loadModule(moduleId);
  moduleMap.set(moduleId, modulePromise);
  const module = await modulePromise;
  return module;
}

// TODO: support icon sets defined with HTML
shimModule(`@vaadin/vaadin-lumo-styles/vaadin-iconset.js`, {});

async function parseStylePackage(packageName: string) {
  shimModule(`${packageName}/version.js`, {});

  const entryFile = `${packageName}/all-imports.js`;
  const moduleId = resolveSpecifier(entryFile, import.meta.url);
  const modulePromise = loadModule(moduleId);
  moduleMap.set(moduleId, modulePromise);
  const module = await modulePromise;
  await module.link(linker);
  await module.evaluate({
    timeout: 5 * 60 * 1000,
  });
}

// Parse css packages
await Promise.all(stylePackages.map(parseStylePackage));

function renderCssResult(cssPath: string, cssResult: CSSResult): string {
  const resultPath = getCssPath(cssResult.moduleId, cssResult.name);
  const cssContents: string[] = [];
  if (cssPath === resultPath) {
    cssContents.push(cssResult.strings[0]);
    for (let i = 0; i < cssResult.values.length; i++) {
      const value = cssResult.values[i];
      if (value instanceof CSSResult) {
        cssContents.push(renderCssResult(resultPath, value));
      } else if (typeof value === 'number') {
        cssContents.push(value.toString());
      }
      cssContents.push(cssResult.strings[i + 1]);
    }
  } else {
    cssContents.push(`@import url(./${posix.relative(posix.dirname(cssPath), resultPath)});\n`);
    emitCssFile(resultPath, cssResult);
  }
  return cssContents.join('\n').replace(':host', 'html');
}

function renderCss(cssPath: string, css: CSSResultGroup): string {
  return transformCss(css, (cssResult) => renderCssResult(cssPath, cssResult)).join('\n');
}

const output: Map<string, string> = new Map();

function emitCssFile(cssPath: string, css: CSSResultGroup) {
  if (output.has(cssPath)) {
    return;
  }

  const cssContents: string[] = ['/* Generated file, do not edit */\n'];
  cssContents.push(renderCss(cssPath, css));
  output.set(cssPath, cssContents.join('\n'));
}

// Assign export names to CSSResult
for (const [, modulePromise] of moduleMap) {
  const module = await modulePromise;
  for (const [name, value] of Object.entries(module.namespace)) {
    if (value instanceof CSSResult) {
      value.name = name;
    }
  }
}

// Process global styles
for (const [moduleId, contents] of globalContents) {
  for (const htmlContent of contents) {
    if (typeof htmlContent === 'string') {
      const styleContent = htmlContent.replaceAll(/<style.*>(.*)<\/style>/gis, '$1');
      const urlMatch = styleContent.match(/^@import url\(css:(.*)\?(.*)\);$/);
      if (urlMatch) {
        // Mark global CSSResult reference
        const moduleId = urlMatch[1] as string,
          index = Number(urlMatch[2] as string);
        const result = cssLiterals.get(moduleId)![index];
        result.hasGlobalReference = true;
      } else {
        // Add synthetic CSSResult from global style content string
        const result = new CSSResult(moduleId, [styleContent], []);
        result.hasGlobalReference = true;
        storeItem(cssLiterals, moduleId, result);
      }
    } else if (
      typeof htmlContent === 'object' &&
      (htmlContent as any).localName === 'link' &&
      (htmlContent as any).rel === 'stylesheet'
    ) {
      // Add synthentic CSSResult import from global <link rel="stylesheet">
      const url = (htmlContent as any).href as string;
      const result = new CSSResult(moduleId, [`@import url(${url});`], []);
      result.hasGlobalReference = true;
      storeItem(cssLiterals, moduleId, result);
    }
  }
}

// Emit .css files from CSSResult literals
for (const [moduleId, cssResults] of cssLiterals) {
  emitCssFile(getCssPath(moduleId), cssResults);
}

// Emit Theme.css entrypoint files from global references
for (const stylePackage of stylePackages) {
  const name = stylePackage.replace(themeNameRegex, '$1');
  const stylePackageDir = resolve(nodeModulesDir, stylePackage);
  const globalCssResults: Set<CSSResult> = new Set();

  for (const [moduleId, cssResults] of cssLiterals) {
    if (!moduleId.startsWith(stylePackageDir)) {
      continue;
    }

    const referencedCssResults = cssResults.filter((result) => result.hasGlobalReference);
    referencedCssResults.forEach((result) => globalCssResults.add(result));
  }

  emitCssFile(`./${toCamelCase(name)}.css`, Array.from(globalCssResults));
}

// Write files
const cssDir = resolve(packageDir, 'css');
for (const [cssPath, contents] of output) {
  const filePath = resolve(cssDir, cssPath);
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, contents, { encoding: 'utf-8' });
}

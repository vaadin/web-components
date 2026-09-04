/**
 * Generates Vue 3 type declarations (`packages/<name>/vue.d.ts`) from the
 * per-package Custom Elements Manifests produced by `yarn release:cem`.
 *
 * Each file augments Vue's `GlobalComponents` so that `vue-tsc` and Volar
 * type-check and autocomplete `<vaadin-*>` tags used directly in templates:
 *
 * - properties and attributes are typed by indexed access into the element
 *   class from the hand-written `.d.ts` (`TextField['value']`), so the
 *   declaration files stay the single source of truth for types;
 * - events become camelCase `on*` handler props, which is what Vue compiles
 *   `@value-changed` to, typed via the element's `*EventMap` when it exists;
 * - native HTML attributes and DOM event handlers are allowed through Vue's
 *   `HTMLAttributes`, so `@click`, `id`, `tabindex` etc. keep working under
 *   `strictTemplates`.
 *
 * Usage: `yarn release:cem && node scripts/generate-vue-types.js`
 */
import fs from 'node:fs';
import path from 'node:path';

const PACKAGES_DIR = path.resolve('./packages');
const OUTPUT_FILE = 'vue.d.ts';

// Keep in sync with scripts/buildWebtypes.js
const blacklistedPackages = [
  /^vaadin-/u,
  /^a11y-base/u,
  /^component-base/u,
  /^field-base/u,
  /^field-highlighter/u,
  /^icons/u,
  /^input-container/u,
  /^lit-renderer/u,
  /^overlay/u,
  /^aura/u,
];

function getRelevantPackages() {
  return fs
    .readdirSync(PACKAGES_DIR)
    .filter((name) => fs.existsSync(path.join(PACKAGES_DIR, name, 'package.json')))
    .filter((name) => !blacklistedPackages.some((pattern) => pattern.test(name)))
    .sort();
}

function loadManifest(packageName) {
  const manifestPath = path.join(PACKAGES_DIR, packageName, 'custom-elements.json');
  if (!fs.existsSync(manifestPath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

function getElements(manifest) {
  return manifest.modules.flatMap((module) =>
    (module.declarations || [])
      .filter((decl) => decl.kind === 'class' && decl.customElement && decl.tagName)
      .map((decl) => ({ ...decl, modulePath: module.path })),
  );
}

function toPascalCase(name) {
  return name.replace(/(^|-)(\w)/gu, (_, __, char) => char.toUpperCase());
}

function toCamelCase(name) {
  return name.replace(/-(\w)/gu, (_, char) => char.toUpperCase());
}

function toJsDoc(description, indent = '  ') {
  if (!description) {
    return '';
  }
  const lines = description
    .trim()
    .replace(/\*\//gu, '*\\/')
    .split('\n')
    .map((line) => `${indent} * ${line}`.trimEnd());
  return `${indent}/**\n${lines.join('\n')}\n${indent} */\n`;
}

function readDts(packageName, jsModulePath) {
  const dtsPath = path.join(PACKAGES_DIR, packageName, jsModulePath.replace(/\.js$/u, '.d.ts'));
  return fs.existsSync(dtsPath) ? fs.readFileSync(dtsPath, 'utf8') : '';
}

/**
 * Finds the `<Class>EventMap` interface for an element. It is declared either
 * in the element's own `.d.ts` or in a mixin `.d.ts` it imports from.
 * Generic maps without defaults (e.g. `GridEventMap<TItem>`) are instantiated
 * with `any`, since a template cannot pass type arguments.
 */
function resolveEventMap(packageName, element) {
  const mapName = `${element.name}EventMap`;
  const ownDts = readDts(packageName, element.modulePath);
  let declaringModule = element.modulePath;
  let text = ownDts;

  if (!new RegExp(`export interface ${mapName}\\b`, 'u').test(ownDts)) {
    const importMatch = ownDts.match(new RegExp(`import type \\{[^}]*\\b${mapName}\\b[^}]*\\} from '([^']+)'`, 'u'));
    if (!importMatch) {
      return null;
    }
    declaringModule = path.posix.join(path.posix.dirname(element.modulePath), importMatch[1]);
    text = readDts(packageName, declaringModule);
    if (!new RegExp(`export interface ${mapName}\\b`, 'u').test(text)) {
      return null;
    }
  }

  const genericsMatch = text.match(new RegExp(`export interface ${mapName}<([^>]*)>`, 'u'));
  let typeArgs = '';
  if (genericsMatch) {
    const params = genericsMatch[1].split(',');
    if (!params.every((param) => param.includes('='))) {
      typeArgs = `<${params.map(() => 'any').join(', ')}>`;
    }
  }

  return { name: mapName, module: declaringModule, typeArgs, text };
}

/**
 * Checks whether an event is typed in the resolved event map. Native events
 * without a dash (`change`, `input`) come from `HTMLElementEventMap`, which
 * every `*EventMap` extends. Custom events must be declared in the map's
 * module; otherwise the handler falls back to `CustomEvent`.
 */
function hasEventMapKey(eventMap, eventName) {
  if (!eventMap) {
    return false;
  }
  if (!eventName.includes('-')) {
    return true;
  }
  return eventMap.text.includes(`'${eventName}':`);
}

function isPublicWritableField(member) {
  return (
    member.kind === 'field' &&
    !member.static &&
    !member.readonly &&
    member.privacy !== 'private' &&
    member.privacy !== 'protected' &&
    !member.name.startsWith('_')
  );
}

function generateElementProps(element, eventMap) {
  const className = element.name;
  const fields = (element.members || []).filter(isPublicWritableField);
  const fieldNames = new Set(fields.map((field) => field.name));
  const lines = [];

  for (const field of fields) {
    lines.push(`${toJsDoc(field.description)}  ${field.name}?: ${className}['${field.name}'];`);
  }

  for (const attribute of element.attributes || []) {
    const fieldName = attribute.fieldName || toCamelCase(attribute.name);
    if (fieldNames.has(fieldName)) {
      if (attribute.name !== fieldName) {
        lines.push(`${toJsDoc(attribute.description)}  '${attribute.name}'?: ${className}['${fieldName}'];`);
      }
    } else if (!attribute.fieldName) {
      // Attribute-only entries without a backing property, such as `theme`
      lines.push(`${toJsDoc(attribute.description)}  ${attribute.name}?: string;`);
    }
  }

  for (const event of element.events || []) {
    if (!event.name) {
      continue;
    }
    const eventType = hasEventMapKey(eventMap, event.name)
      ? `${eventMap.name}${eventMap.typeArgs}['${event.name}']`
      : 'CustomEvent';
    lines.push(`${toJsDoc(event.description)}  on${toPascalCase(event.name)}?: (event: ${eventType}) => void;`);
  }

  return `type ${className}Props = {\n${lines.join('\n')}\n};\n`;
}

function generatePackageTypes(packageName, elements) {
  const imports = new Map();
  const addImport = (module, name) => {
    if (!imports.has(module)) {
      imports.set(module, new Set());
    }
    imports.get(module).add(name);
  };

  const propsBlocks = [];
  const componentEntries = [];

  for (const element of elements) {
    const eventMap = resolveEventMap(packageName, element);
    addImport(element.modulePath, element.name);
    if (eventMap) {
      addImport(eventMap.module, eventMap.name);
    }
    propsBlocks.push(generateElementProps(element, eventMap));
    componentEntries.push(
      `${toJsDoc(element.description, '    ')}    '${element.tagName}': DefineComponent<VaadinElementProps<${element.name}Props>>;`,
    );
  }

  const importLines = [...imports.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([module, names]) => `import type { ${[...names].sort().join(', ')} } from './${module}';`);

  return [
    `/**`,
    ` * Vue 3 type declarations for the custom elements in @vaadin/${packageName}.`,
    ` *`,
    ` * Generated by scripts/generate-vue-types.js, do not edit.`,
    ` *`,
    ` * Add this file to \`compilerOptions.types\` in your tsconfig.json and configure`,
    ` * \`compilerOptions.isCustomElement\` for the \`vaadin-\` prefix in your Vue build.`,
    ` */`,
    `import type { DefineComponent, HTMLAttributes } from 'vue';`,
    ...importLines,
    ``,
    `type VaadinElementProps<P> = P & Omit<HTMLAttributes, keyof P>;`,
    ``,
    ...propsBlocks,
    `declare module 'vue' {`,
    `  interface GlobalComponents {`,
    componentEntries.join('\n'),
    `  }`,
    `}`,
    ``,
  ].join('\n');
}

function main() {
  let generated = 0;
  for (const packageName of getRelevantPackages()) {
    const manifest = loadManifest(packageName);
    if (!manifest) {
      continue;
    }
    const elements = getElements(manifest);
    if (elements.length === 0) {
      continue;
    }
    const outputPath = path.join(PACKAGES_DIR, packageName, OUTPUT_FILE);
    fs.writeFileSync(outputPath, generatePackageTypes(packageName, elements));
    generated += 1;
  }
  console.log(`Generated ${OUTPUT_FILE} for ${generated} packages.`);
}

main();

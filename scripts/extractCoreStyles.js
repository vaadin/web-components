import * as acorn from 'acorn';
import * as walk from 'acorn-walk';
import { globSync } from 'glob';
import MagicString from 'magic-string';
import fs from 'node:fs';
import { stdin as input, stdout as output } from 'node:process';
import { createInterface } from 'node:readline/promises';

const pkg = process.argv[2];

const rl = createInterface({ input, output });

// - - - - - - - - - - - - - - - - - - //

function camelcase(str) {
  return str.replace('vaadin-', '').replace(/-([a-z])/gu, (g) => g[1].toUpperCase());
}

function getTaggedTemplateContent(node) {
  return node.quasi.quasis.map((quasi) => quasi.value.cooked.trim()).join('');
}

// function gatherImports(ast) {
//   const importMap = new Map();
//   walk.simple(ast, {
//     ImportDeclaration(node) {
//       node.specifiers.forEach((specifier) => {
//         const localName = specifier.local.name;
//         importMap.set(localName, node);
//       });
//     },
//   });
//   return importMap;
// }

function gatherComponents(ast) {
  // const importMap = gatherImports(ast);
  const components = new Map();

  walk.simple(ast, {
    ClassDeclaration(classNode) {
      const members = classNode.body.body;

      const styleGetter = members.find((member) => member.kind === 'get' && member.key.name === 'styles');

      if (styleGetter) {
        const cssTaggedNodes = new Set();

        walk.simple(styleGetter, {
          TaggedTemplateExpression(node) {
            if (node.tag.name === 'css') {
              cssTaggedNodes.add(node);
            }
          },
          // Identifier(node) {
          //   if (node.name !== 'css') {
          //     cssTaggedNodes.add({
          //       node: importMap.get(node.name),
          //       name: node.name,
          //       external: true,
          //     });
          //   }
          // },
        });

        const isGetter = members.find((member) => member.kind === 'get' && member.key.name === 'is');
        const componentName = isGetter.value.body.body[0].argument.value;
        components.set(componentName, { cssTaggedNodes });
      }
    },
  });

  return components;
}

function createCoreStylesJSFile(componentName, cssTaggedNodes) {
  const file = `packages/${pkg}/src/styles/${componentName}-core-styles.js`;
  const code = new MagicString(fs.existsSync(file) ? fs.readFileSync(file, 'utf-8') : '');

  if (code.toString().length === 0 && cssTaggedNodes.size === 0) {
    return;
  }

  if (!code.toString().includes(`${camelcase(componentName)}Styles`)) {
    code.append(`
      export const ${camelcase(componentName)}Styles = css\`
        ${[...cssTaggedNodes].map((node) => getTaggedTemplateContent(node)).join('\n\n')}
      \`;
    `);
  }

  if (!code.toString().includes(`import { css`)) {
    code.prepend(`import { css } from 'lit';\n`);
  } else {
    code.replace(/^.*import \{ css.*$/mu, `import { css } from 'lit';`);
  }

  fs.writeFileSync(file, code.toString(), 'utf-8');
}

function createCoreStylesTSFile(componentName, cssTaggedNodes) {
  if (cssTaggedNodes.size === 0) {
    return;
  }

  const file = `packages/${pkg}/src/styles/${componentName}-core-styles.d.ts`;
  const code = new MagicString(fs.existsSync(file) ? fs.readFileSync(file, 'utf-8') : '');

  const exportStatement = `export declare const ${camelcase(componentName)}Styles: CSSResult;\n`;
  if (code.toString().length === 0) {
    code.append(`import type { CSSResult } from 'lit';\n\n`);
    code.append(exportStatement);
  } else if (!code.toString().includes(`${camelcase(componentName)}Styles`)) {
    code.append(exportStatement);
  }

  fs.writeFileSync(file, code.toString(), 'utf-8');
}

function createBaseStylesJSFile(componentName) {
  const coreFile = `packages/${pkg}/src/styles/${componentName}-core-styles.js`;
  const baseFile = `packages/${pkg}/src/styles/${componentName}-base-styles.js`;
  if (!fs.existsSync(coreFile) || fs.existsSync(baseFile)) {
    return;
  }

  fs.copyFileSync(coreFile, baseFile);

  const code = new MagicString(fs.readFileSync(baseFile, 'utf-8'));
  const ast = acorn.parse(code.toString(), {
    ecmaVersion: 'latest',
    sourceType: 'module',
  });

  walk.simple(ast, {
    TaggedTemplateExpression(node) {
      if (node.tag.name === 'css') {
        code.overwrite(node.start, node.end, `css\`\``);
      }
    },
  });

  fs.writeFileSync(baseFile, code.toString(), 'utf-8');
}

function createBaseStylesTSFile(componentName) {
  const coreFile = `packages/${pkg}/src/styles/${componentName}-core-styles.d.ts`;
  const baseFile = `packages/${pkg}/src/styles/${componentName}-base-styles.d.ts`;
  if (!fs.existsSync(coreFile) || fs.existsSync(baseFile)) {
    return;
  }

  fs.copyFileSync(coreFile, baseFile);
}

function updateComponentFile(file, componentName, cssTaggedNodes) {
  const code = new MagicString(fs.readFileSync(file, 'utf-8'));

  code.replaceAll(`./${componentName}-styles.js`, `./styles/${componentName}-core-styles.js`);
  code.replaceAll(`./styles/${componentName}-styles.js`, `./styles/${componentName}-core-styles.js`);

  if (cssTaggedNodes.size > 0) {
    for (const node of cssTaggedNodes) {
      code.overwrite(node.start, node.end, `${camelcase(componentName)}Styles`);
    }

    const importStatement = `import { ${camelcase(componentName)}Styles } from './styles/${componentName}-core-styles.js';\n`;
    if (!code.toString().includes(importStatement)) {
      code.prepend(importStatement);
    }
  }

  fs.writeFileSync(file, code.toString(), 'utf-8');
}

function ensureStylesDirExists() {
  const stylesDir = `packages/${pkg}/src/styles`;
  if (!fs.existsSync(stylesDir)) {
    fs.mkdirSync(stylesDir);
  }
}

// - - - - - - - - - - - - - - - - - - //

for (const file of globSync(`packages/${pkg}/src/*-styles.js`)) {
  if (!/(core|base)-styles\.js$/u.test(file)) {
    ensureStylesDirExists();

    console.log(`Renaming ${file}`);
    fs.renameSync(file, file.replace('-styles.js', '-core-styles.js').replace('src/', 'src/styles/'));
  }
}

for (const file of globSync(`packages/${pkg}/src/*-styles.d.ts`)) {
  if (!/(core|base)-styles\.d\.ts$/u.test(file)) {
    ensureStylesDirExists();

    console.log(`Renaming ${file}`);
    fs.renameSync(file, file.replace('-styles.d.ts', '-core-styles.d.ts').replace('src/', 'src/styles/'));
  }
}

for (const file of globSync(`packages/${pkg}/src/**/*.js`)) {
  if (file.endsWith('-styles.js')) {
    continue;
  }

  const code = fs.readFileSync(file, 'utf-8').toString();
  if (!code.includes('static get styles()')) {
    continue;
  }

  const ast = acorn.parse(code, {
    ecmaVersion: 'latest',
    sourceType: 'module',
  });

  for (const [componentName, { cssTaggedNodes }] of gatherComponents(ast)) {
    console.log('Processing ', componentName);

    for (const node of cssTaggedNodes) {
      const answer = await rl.question(`${getTaggedTemplateContent(node)}\n\n(y/n): `);
      if (answer.toLowerCase() !== 'y') {
        cssTaggedNodes.delete(node);
      }
    }

    createCoreStylesJSFile(componentName, cssTaggedNodes);
    createCoreStylesTSFile(componentName, cssTaggedNodes);

    createBaseStylesJSFile(componentName);
    createBaseStylesTSFile(componentName);

    updateComponentFile(file, componentName, cssTaggedNodes);
  }
}

rl.close();

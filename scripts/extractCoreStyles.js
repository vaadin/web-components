import * as acorn from 'acorn';
import * as walk from 'acorn-walk';
import { globSync } from 'glob';
import MagicString from 'magic-string';
import fs from 'node:fs';

const pkg = process.argv[2];

// - - - - - - - - - - - - - - - - - - //

function camelcase(str) {
  return str.replace('vaadin-', '').replace(/-([a-z])/gu, (g) => g[1].toUpperCase());
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

function gatherCSSTaggedNodes(ast) {
  // const importMap = gatherImports(ast);
  const cssTaggedNodes = new Map();

  walk.simple(ast, {
    ClassDeclaration(classNode) {
      const members = classNode.body.body;

      const styleGetter = members.find((member) => member.kind === 'get' && member.key.name === 'styles');

      if (styleGetter) {
        const componentCSSTaggedNodes = new Set();

        walk.simple(styleGetter, {
          TaggedTemplateExpression(node) {
            if (node.tag.name === 'css') {
              componentCSSTaggedNodes.add(node);
            }
          },
          // Identifier(node) {
          //   if (node.name !== 'css') {
          //     componentCSSTaggedNodes.add({
          //       node: importMap.get(node.name),
          //       name: node.name,
          //       external: true,
          //     });
          //   }
          // },
        });

        const isGetter = members.find((member) => member.kind === 'get' && member.key.name === 'is');
        const componentName = isGetter.value.body.body[0].argument.value;
        cssTaggedNodes.set(componentName, componentCSSTaggedNodes);
      }
    },
  });

  return cssTaggedNodes;
}

function createCoreStylesJSFile(componentName, cssTaggedNodes) {
  if (cssTaggedNodes.size === 0) {
    return;
  }

  const file = `packages/${pkg}/src/${componentName}-core-styles.js`;
  const code = fs.existsSync(file) ? fs.readFileSync(file, 'utf-8') : '';

  console.log(`Processing ${file}...`);

  const s = new MagicString(code);

  const cssContent = [...cssTaggedNodes]
    .map((node) => node.quasi.quasis.map((quasi) => quasi.value.cooked.trim()))
    .join('\n\n');

  if (!code.includes(`${camelcase(componentName)}Styles`)) {
    s.append(`
      export const ${camelcase(componentName)}Styles = css\`
        ${cssContent}
      \`;
    `);
  }

  if (!code.includes(`import { css`)) {
    s.prepend(`import { css } from 'lit';\n`);
  } else {
    s.replace(/^.*import \{ css.*$/mu, `import { css } from 'lit';`);
  }

  fs.writeFileSync(file, s.toString(), 'utf-8');
}

function createCoreStylesTSFile(componentName, cssTaggedNodes) {
  if (cssTaggedNodes.size === 0) {
    return;
  }

  const file = `packages/${pkg}/src/${componentName}-core-styles.d.ts`;
  const code = new MagicString(fs.existsSync(file) ? fs.readFileSync(file, 'utf-8') : '');

  console.log(`Processing ${file}...`);

  const exportStatement = `export declare const ${camelcase(componentName)}Styles: CSSResult;\n`;
  if (code.toString().length === 0) {
    code.append(`import type { CSSResult } from 'lit';\n\n`);
    code.append(exportStatement);
  } else if (!code.toString().includes(`${camelcase(componentName)}Styles`)) {
    code.append(exportStatement);
  }

  fs.writeFileSync(file, code.toString(), 'utf-8');
}

function updateComponentFile(file, componentName, cssTaggedNodes) {
  const code = new MagicString(fs.readFileSync(file, 'utf-8'));

  code.replaceAll(`./${componentName}-styles.js`, `./${componentName}-core-styles.js`);

  for (const node of cssTaggedNodes) {
    code.overwrite(node.start, node.end, `${camelcase(componentName)}Styles`);
  }

  const importStatement = `import { ${camelcase(componentName)}Styles } from './${componentName}-core-styles.js';\n`;
  if (!code.toString().includes(importStatement)) {
    code.prepend(importStatement);
  }

  fs.writeFileSync(file, code.toString(), 'utf-8');
}

// - - - - - - - - - - - - - - - - - - //

for (const file of globSync(`packages/${pkg}/src/*-styles.js`)) {
  if (!/(core|base)-styles\.js$/u.test(file)) {
    fs.renameSync(file, file.replace('-styles.js', '-core-styles.js'));
  }
}

for (const file of globSync(`packages/${pkg}/src/*-styles.d.ts`)) {
  if (!/(core|base)-styles\.d\.ts$/u.test(file)) {
    fs.renameSync(file, file.replace('-styles.d.ts', '-core-styles.d.ts'));
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

  for (const [componentName, cssTaggedNodes] of gatherCSSTaggedNodes(ast)) {
    createCoreStylesJSFile(componentName, cssTaggedNodes);
    createCoreStylesTSFile(componentName, cssTaggedNodes);

    updateComponentFile(file, componentName, cssTaggedNodes);
  }
}

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

        if (componentCSSTaggedNodes.size > 0) {
          const isGetter = members.find((member) => member.kind === 'get' && member.key.name === 'is');
          const componentName = isGetter.value.body.body[0].argument.value;
          cssTaggedNodes.set(componentName, componentCSSTaggedNodes);
        }
      }
    },
  });

  return cssTaggedNodes;
}

function createCoreStylesJSFile(componentName, cssTaggedNodes) {
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

function createCoreStylesTSFile(componentName) {
  const file = `packages/${pkg}/src/${componentName}-core-styles.d.ts`;
  const code = fs.existsSync(file) ? fs.readFileSync(file, 'utf-8') : '';
  const s = new MagicString(code);

  console.log(`Processing ${file}...`);

  const exportStatement = `export declare const ${camelcase(componentName)}Styles: CSSResult;\n`;
  if (code.length === 0) {
    s.append(`import type { CSSResult } from 'lit';\n\n`);
    s.append(exportStatement);
  } else if (!code.includes(`${camelcase(componentName)}Styles`)) {
    s.append(exportStatement);
  }

  fs.writeFileSync(file, s.toString(), 'utf-8');
}

function updateComponentFile(file, componentName, cssTaggedNodes) {
  const code = fs.readFileSync(file, 'utf-8');
  const s = new MagicString(code);

  // Replace every extracted css tagged literal with our identifier.
  for (const node of cssTaggedNodes) {
    s.overwrite(node.start, node.end, `${camelcase(componentName)}Styles`);
  }

  // Prepend an import if there isn't one yet.
  const importStatement = `import { ${camelcase(componentName)}Styles } from './${componentName}-core-styles.js';\n`;
  if (!code.includes(importStatement)) {
    s.prepend(importStatement);
  }

  fs.writeFileSync(file, s.toString(), 'utf-8');
}

// - - - - - - - - - - - - - - - - - - //

for (const file of globSync(`packages/${pkg}/src/*-styles.js`)) {
  if (!/(core|base)-styles\.js$/u.test(file)) {
    fs.renameSync(file, file.replace('-styles.js', '-core-styles.js'));
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
    createCoreStylesTSFile(componentName);

    updateComponentFile(file, componentName, cssTaggedNodes);
  }
}

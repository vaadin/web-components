import * as acorn from 'acorn';
import * as walk from 'acorn-walk';
import { globSync } from 'glob';
import MagicString from 'magic-string';
import fs from 'node:fs';

const pkg = process.argv[2];

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

function gatherComponentStyles(ast) {
  // const importMap = gatherImports(ast);
  const stylesMap = new Map();

  walk.simple(ast, {
    ClassDeclaration(classNode) {
      const members = classNode.body.body;

      const styleGetter = members.find((member) => member.kind === 'get' && member.key.name === 'styles');
      if (styleGetter) {
        const styles = new Set();

        walk.simple(styleGetter, {
          TaggedTemplateExpression(node) {
            if (node.tag.name === 'css') {
              styles.add(node.quasi.quasis.map((q) => q.value.cooked).join(''));
            }
          },
          // Identifier(node) {
          //   if (node.name !== 'css') {
          //     styles.add({
          //       node: importMap.get(node.name),
          //       name: node.name,
          //       external: true,
          //     });
          //   }
          // },
        });

        if (styles.size > 0) {
          const isGetter = members.find((member) => member.kind === 'get' && member.key.name === 'is');

          const componentName = isGetter.value.body.body[0].argument.value;
          stylesMap.set(componentName, styles);
        }
      }
    },
  });

  return stylesMap;
}

function updateCoreStyles(componentName, styles) {
  const path = `packages/${pkg}/src/${componentName}-core-styles.js`;
  const code = fs.existsSync(path) ? fs.readFileSync(path, 'utf-8').toString() : '';
  const s = new MagicString(code);

  console.log(`Updating ${path}...`);

  const componentNameInCamelCase = componentName
    .replace('vaadin-', '')
    .replace(/-([a-z])/gu, (g) => g[1].toUpperCase());

  if (!code.includes(`${componentNameInCamelCase}Styles`)) {
    s.append(`
      export const ${componentNameInCamelCase}Styles = css\`
        ${[...styles].join('\n\n')}
      \`;
    `);
  }

  if (!code.includes(`import { css`)) {
    s.prepend(`import { css } from 'lit';\n`);
  } else {
    s.replace(/^.*import \{ css.*$/mu, `import { css } from 'lit';`);
  }

  fs.writeFileSync(path, s.toString(), 'utf-8');
}

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

  for (const [component, styles] of gatherComponentStyles(ast)) {
    updateCoreStyles(component, styles);
  }
}

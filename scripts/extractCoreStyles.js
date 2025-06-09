import * as acorn from 'acorn';
import * as walk from 'acorn-walk';
import * as astring from 'astring';
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

function getImports(ast) {
  const importMap = new Map();
  walk.simple(ast, {
    ImportDeclaration(node) {
      node.specifiers.forEach((specifier) => {
        const localName = specifier.local.name;
        importMap.set(localName, node);
      });
    },
  });
  return importMap;
}

function getComponents(ast, importMap) {
  const componentMap = new Map();

  walk.simple(ast, {
    ClassDeclaration(classNode) {
      const members = classNode.body.body;

      const styleGetter = members.find((member) => member.kind === 'get' && member.key.name === 'styles');
      const isGetter = members.find((member) => member.kind === 'get' && member.key.name === 'is');
      const componentName = isGetter.value.body.body[0].argument.value;

      if (styleGetter) {
        const styleGetterNodes = new Set();

        const styleGetterReturnStatement = styleGetter.value.body.body[0];

        walk.simple(styleGetterReturnStatement, {
          TaggedTemplateExpression(node) {
            if (node.tag.name === 'css') {
              styleGetterNodes.add({
                node,
              });
            }
          },
          Identifier(node) {
            if (node.name !== 'css') {
              styleGetterNodes.add({
                node,
                relatedImportNode: importMap.get(node.name),
              });
            }
          },
        });

        componentMap.set(componentName, { styleGetterNodes, styleGetterReturnStatement });
      }
    },
  });

  return componentMap;
}

// function updateCoreStylesJSFile(componentName, cssTaggedNodes) {
//   const file = `packages/${pkg}/src/styles/${componentName}-core-styles.js`;
//   const code = new MagicString(fs.existsSync(file) ? fs.readFileSync(file, 'utf-8') : '');

//   if (code.toString().length === 0 && cssTaggedNodes.size === 0) {
//     return;
//   }

//   if (!code.toString().includes(`${camelcase(componentName)}Styles`)) {
//     code.append(`
//       export const ${camelcase(componentName)}Styles = css\`
//         ${[...cssTaggedNodes].map((node) => getTaggedTemplateContent(node)).join('\n\n')}
//       \`;
//     `);
//   }

//   if (!code.toString().includes(`import { css`)) {
//     code.prepend(`import { css } from 'lit';\n`);
//   } else {
//     code.replace(/^.*import \{ css.*$/mu, `import { css } from 'lit';`);
//   }

//   fs.writeFileSync(file, code.toString(), 'utf-8');
// }

// function UpdateCoreStylesTSFile(componentName, cssTaggedNodes) {
//   if (cssTaggedNodes.size === 0) {
//     return;
//   }

//   const file = `packages/${pkg}/src/styles/${componentName}-core-styles.d.ts`;
//   const code = new MagicString(fs.existsSync(file) ? fs.readFileSync(file, 'utf-8') : '');

//   const exportStatement = `export declare const ${camelcase(componentName)}Styles: CSSResult;\n`;
//   if (code.toString().length === 0) {
//     code.append(`import type { CSSResult } from 'lit';\n\n`);
//     code.append(exportStatement);
//   } else if (!code.toString().includes(`${camelcase(componentName)}Styles`)) {
//     code.append(exportStatement);
//   }

//   fs.writeFileSync(file, code.toString(), 'utf-8');
// }

// function createBaseStylesJSFile(componentName) {
//   const coreFile = `packages/${pkg}/src/styles/${componentName}-core-styles.js`;
//   const baseFile = `packages/${pkg}/src/styles/${componentName}-base-styles.js`;
//   if (!fs.existsSync(coreFile) || fs.existsSync(baseFile)) {
//     return;
//   }

//   fs.copyFileSync(coreFile, baseFile);

//   const code = new MagicString(fs.readFileSync(baseFile, 'utf-8'));
//   const ast = acorn.parse(code.toString(), {
//     ecmaVersion: 'latest',
//     sourceType: 'module',
//   });

//   walk.simple(ast, {
//     TaggedTemplateExpression(node) {
//       if (node.tag.name === 'css') {
//         code.overwrite(node.start, node.end, `css\`\``);
//       }
//     },
//   });

//   fs.writeFileSync(baseFile, code.toString(), 'utf-8');
// }

// function createBaseStylesTSFile(componentName) {
//   const coreFile = `packages/${pkg}/src/styles/${componentName}-core-styles.d.ts`;
//   const baseFile = `packages/${pkg}/src/styles/${componentName}-base-styles.d.ts`;
//   if (!fs.existsSync(coreFile) || fs.existsSync(baseFile)) {
//     return;
//   }

//   fs.copyFileSync(coreFile, baseFile);
// }

function updateComponentStylesJSFile(componentName, { styleGetterNodes, styleGetterReturnStatement }) {
  const file = `packages/${pkg}/src/styles/${componentName}-styles.js`;
  const code = new MagicString(fs.existsSync(file) ? fs.readFileSync(file, 'utf-8') : '');

  if (styleGetterNodes.some(({ relatedImportNode }) => !relatedImportNode)) {
    if (!code.toString().includes(`import { css } from 'lit';`)) {
      code.prepend(`import { css } from 'lit';\n`);
    } else {
      code.replace(/^.*import \{ css.*$/mu, `import { css } from 'lit';`);
    }
  }

  for (const { node, relatedImportNode } of styleGetterNodes) {
    if (relatedImportNode) {
      const importStatement = astring.generate(relatedImportNode);
      if (!code.toString().includes(importStatement)) {
        code.prepend(`${importStatement}\n`);
      }
      continue;
    }

    if (!code.toString().includes(`const ${camelcase(componentName)} = `)) {
      code.append(`
        export const ${camelcase(componentName)} = css\`
          ${getTaggedTemplateContent(node)}
        \`;\n
      `);
    }
  }

  code.append(
    `export const ${camelcase(componentName)}Styles = ${astring.generate(styleGetterReturnStatement.argument)};\n`,
  );

  fs.writeFileSync(file, code.toString(), 'utf-8');

  // walk.simple(ast, {
  //   ExportNamedDeclaration(node) {
  //     if (node.declaration?.type === 'VariableDeclaration') {
  //       const exportExists = node.declaration.declarations.some(
  //         (decl) => decl.id.name === `${camelcase(componentName)}Styles`,
  //       );
  //       if (exportExists) {
  //         code.remove(node.start, node.end);
  //       }
  //     }
  //   },
  // });
}

function updateComponentStylesTSFile(componentName) {
  const file = `packages/${pkg}/src/styles/${componentName}-styles.d.ts`;
  const code = new MagicString(fs.existsSync(file) ? fs.readFileSync(file, 'utf-8') : '');

  if (!code.toString().includes('CSSResult')) {
    code.prepend(`import type { CSSResult } from 'lit';\n\n`);
  }

  if (!code.toString().includes(`const ${camelcase(componentName)}Styles`)) {
    code.append(`export declare const ${camelcase(componentName)}Styles: CSSResult;\n`);
  }

  fs.writeFileSync(file, code.toString(), 'utf-8');
}

function updateComponentFile(file, componentName, { styleGetterNodes, styleGetterReturnStatement }) {
  const code = new MagicString(fs.readFileSync(file, 'utf-8'));

  styleGetterNodes.forEach(({ relatedImportNode }) => {
    if (relatedImportNode) {
      code.remove(relatedImportNode.start, relatedImportNode.end);
    }
  });

  code.overwrite(
    styleGetterReturnStatement.start,
    styleGetterReturnStatement.end,
    `return ${camelcase(componentName)}Styles;`,
  );

  code.prepend(`import { ${camelcase(componentName)}Styles } from './styles/${componentName}-styles.js';\n`);

  fs.writeFileSync(file, code.toString(), 'utf-8');
}

// - - - - - - - - - - - - - - - - - - //

for (const file of globSync([`packages/${pkg}/src/*-styles.js`, `packages/${pkg}/src/*-styles.d.ts`])) {
  const stylesDir = `packages/${pkg}/src/styles`;
  if (!fs.existsSync(stylesDir)) {
    console.log(`Creating styles directory`);
    fs.mkdirSync(stylesDir);
  }

  console.log(`Moving ${file} to styles directory`);
  fs.renameSync(file, file.replace('src/', 'src/styles/'));
}

for (const file of globSync([`packages/${pkg}/src/**/*.js`, `!packages/${pkg}/src/**/*-styles.js`])) {
  const code = fs.readFileSync(file, 'utf-8').toString();
  if (!code.includes('static get styles()')) {
    continue;
  }

  const ast = acorn.parse(code, {
    ecmaVersion: 'latest',
    sourceType: 'module',
  });

  const importMap = getImports(ast);

  for (const [componentName, componentContext] of getComponents(ast, importMap)) {
    const { styleGetterReturnStatement } = componentContext;

    // if (
    //   styleGetterReturnStatement.argument[0].type === 'Identifier' &&
    //   styleGetterReturnStatement.argument[0].name === `${camelcase(componentName)}Styles`
    // ) {
    //   console.log(`Skipping ${componentName} as it already uses the styles variable`);
    // }

    const answer = await rl.question(
      `\n\n${code.slice(styleGetterReturnStatement.start, styleGetterReturnStatement.end)}\n\n(y/n): `,
    );
    if (answer.toLowerCase() !== 'y') {
      // console.log(`Skipping ${componentName}`);
      continue;
    }

    updateComponentFile(file, componentName, componentContext);
    updateComponentStylesJSFile(componentName, componentContext);
    updateComponentStylesTSFile(componentName, componentContext);

    // UpdateCoreStylesTSFile(componentName, componentContext);

    // createBaseStylesJSFile(componentName);
    // createBaseStylesTSFile(componentName);
  }
}

rl.close();

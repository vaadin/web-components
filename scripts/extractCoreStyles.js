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

function camelcase(str) {
  return str.replace('vaadin-', '').replace(/-([a-z])/gu, (g) => g[1].toUpperCase());
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

      if (!styleGetter || !isGetter) {
        return;
      }

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

      const componentName = isGetter.value.body.body[0].argument.value;
      componentMap.set(componentName, { styleGetterNodes, styleGetterReturnStatement });
    },
  });

  return componentMap;
}

function updateComponentStylesJSFile(componentName, { styleGetterNodes, styleGetterReturnStatement }) {
  const file = `packages/${pkg}/src/styles/${componentName}-styles.js`;
  const code = new MagicString(fs.existsSync(file) ? fs.readFileSync(file, 'utf-8') : '');

  for (const { node, relatedImportNode } of styleGetterNodes) {
    if (node.type === 'TaggedTemplateExpression') {
      const variableStatement = `const ${camelcase(componentName)} = ${astring.generate(node)};`;
      if (!`${code}`.includes(variableStatement)) {
        code.append(`\n${variableStatement}\n`);
      }
    }

    if (node.type === 'Identifier') {
      const importStatement = astring.generate(relatedImportNode);
      if (!`${code}`.includes(importStatement)) {
        code.prepend(`\n${importStatement}\n`);
      }
    }
  }

  {
    const importStatement = `import { css } from 'lit';\n`;
    const hasTaggedTemplateExpression = [...styleGetterNodes].some(
      ({ node }) => node.type === 'TaggedTemplateExpression',
    );
    if (!`${code}`.includes(importStatement) && hasTaggedTemplateExpression) {
      code.prepend(importStatement);
    }
  }

  {
    const exportStatement = `export const ${camelcase(componentName)}Styles = ${astring.generate(styleGetterReturnStatement.argument)};`;
    if (!`${code}`.includes(exportStatement)) {
      code.append(`\n${exportStatement}\n`);
    }
  }

  fs.writeFileSync(file, code.toString(), 'utf-8');
}

function updateComponentStylesTSFile(componentName) {
  const file = `packages/${pkg}/src/styles/${componentName}-styles.d.ts`;
  const code = new MagicString(fs.existsSync(file) ? fs.readFileSync(file, 'utf-8') : '');

  {
    const importStatement = `import { css, CSSResult } from 'lit';`;
    if (!`${code}`.includes(importStatement)) {
      code.prepend(`${importStatement}\n\n`);
    }
  }

  {
    const exportStatement = `export const ${camelcase(componentName)}Styles: CSSResult;`;
    if (!`${code}`.includes(exportStatement)) {
      code.append(`\n${exportStatement}\n`);
    }
  }

  fs.writeFileSync(file, `${code}`, 'utf-8');
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

  fs.writeFileSync(file, `${code}`, 'utf-8');
}

function updateComponentStyleImports(file, componentName) {
  let code = fs.readFileSync(file, 'utf-8').toString();
  code = code.replace(`./${componentName}-styles.js`, `./styles/${componentName}-styles.js`);
  fs.writeFileSync(file, code, 'utf-8');
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

    const answer = await rl.question(
      `\n\n${code.slice(styleGetterReturnStatement.start, styleGetterReturnStatement.end)}\n\n(y/n): `,
    );
    if (answer.toLowerCase() === 'y') {
      updateComponentStylesJSFile(componentName, componentContext);
      updateComponentStylesTSFile(componentName, componentContext);
      updateComponentFile(file, componentName, componentContext);
    }

    updateComponentStyleImports(file, componentName);
  }
}

rl.close();

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
    if (node.type === 'TaggedTemplateExpression' && styleGetterNodes.size > 1) {
      if (!new RegExp(`\\W*${camelcase(componentName)}\\W*`, 'u').test(code)) {
        code.append(`\nconst ${camelcase(componentName)} = ${astring.generate(node)};\n`);
      }
    }

    if (node.type === 'Identifier') {
      if (!new RegExp(`\\W*${node.name}\\W*`, 'u').test(code)) {
        code.prepend(`\n${astring.generate(relatedImportNode)}\n`);
      }
    }
  }

  if (`${code}`.includes('import { css }')) {
    code.replace(/^.*import \{ css \}.*$/mu, `import { css } from 'lit';`);
  } else {
    const hasTaggedTemplateExpression = [...styleGetterNodes].some(
      ({ node }) => node.type === 'TaggedTemplateExpression',
    );
    if (hasTaggedTemplateExpression) {
      code.prepend(`import { css } from 'lit';\n`);
    }
  }

  const exportStatement = `export const ${camelcase(componentName)}Styles = ${astring.generate(styleGetterReturnStatement.argument)};`;
  if (!`${code}`.includes(exportStatement)) {
    code.append(`\n${exportStatement}\n`);
  }

  fs.writeFileSync(file, `${code}`, 'utf-8');
}

function updateComponentStylesTSFile(componentName) {
  const file = `packages/${pkg}/src/styles/${componentName}-styles.d.ts`;
  const code = new MagicString(fs.existsSync(file) ? fs.readFileSync(file, 'utf-8') : '');

  {
    const importStatement = `import type { CSSResult } from 'lit';\n`;
    if (`${code}`.includes('import type { CSSResult }')) {
      code.replace(/^.*import type \{ CSSResult \}.*$/mu, importStatement);
    } else {
      code.prepend(`${importStatement}\n\n`);
    }
  }

  if (`${code}`.includes(`export const ${camelcase(componentName)}Styles`)) {
    code.replace(
      new RegExp(`^.*export const ${camelcase(componentName)}Styles.*$`, 'mu'),
      `export const ${camelcase(componentName)}Styles: CSSResult;`,
    );
  } else {
    code.append(`\nexport const ${camelcase(componentName)}Styles: CSSResult;\n`);
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

  code.replace(`./${componentName}-styles.js`, `./styles/${componentName}-styles.js`);

  fs.writeFileSync(file, `${code}`, 'utf-8');
}

// - - - - - - - - - - - - - - - - - - //

const stylesDir = `packages/${pkg}/src/styles`;
if (!fs.existsSync(stylesDir)) {
  console.log(`Creating styles directory`);
  fs.mkdirSync(stylesDir);
}

for (const file of globSync([`packages/${pkg}/src/*-styles.js`, `packages/${pkg}/src/*-styles.d.ts`])) {
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
    if (answer.toLowerCase() !== 'y') {
      continue;
    }

    updateComponentStylesJSFile(componentName, componentContext);
    updateComponentStylesTSFile(componentName, componentContext);
    updateComponentFile(file, componentName, componentContext);
  }
}

rl.close();

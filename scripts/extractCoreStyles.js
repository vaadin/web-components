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

function read(file) {
  const content = fs.existsSync(file) ? fs.readFileSync(file, 'utf-8') : '';
  return {
    code: new MagicString(content),
    ast: acorn.parse(content, {
      ecmaVersion: 'latest',
      sourceType: 'module',
    }),
  };
}

function write(file, code) {
  fs.writeFileSync(file, code.toString(), 'utf-8');
}

function getImports(ast) {
  const importMap = new Map();
  walk.simple(ast, {
    ImportDeclaration(node) {
      node.specifiers.forEach((specifier) => {
        importMap.set(specifier.local.name, node);
      });
    },
  });
  return importMap;
}

function getExports(ast) {
  const exportMap = new Map();
  walk.simple(ast, {
    ExportNamedDeclaration(node) {
      node.declaration.declarations.forEach((declaration) => {
        exportMap.set(declaration.id.name, { node, declaration });
      });
    },
  });
  return exportMap;
}

function getVariables(ast) {
  const variableMap = new Map();
  walk.simple(ast, {
    VariableDeclaration(node) {
      node.declarations.forEach((declaration) => {
        variableMap.set(declaration.id.name, declaration);
      });
    },
  });
  return variableMap;
}

function getComponents(ast) {
  const importMap = getImports(ast);
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
            styleGetterNodes.add({ node });
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
        Super(node) {
          styleGetterNodes.add({ node });
        },
      });

      const componentName = isGetter.value.body.body[0].argument.value;
      componentMap.set(componentName, {
        styleGetterNodes,
        styleGetterReturnType: styleGetterReturnStatement.argument.type,
        styleGetterReturnStatement,
      });
    },
  });

  return componentMap;
}

function updateComponentStylesJSFile(
  file,
  componentName,
  { styleGetterNodes, styleGetterReturnStatement, styleGetterReturnType },
) {
  const { code, ast } = read(file);
  const importMap = getImports(ast);
  const exportMap = getExports(ast);
  const variableMap = getVariables(ast);

  for (const { node, relatedImportNode } of styleGetterNodes) {
    if (node.type === 'Identifier' && node.name !== camelcase(componentName) && !importMap.has(node.name)) {
      code.prepend(`\n${astring.generate(relatedImportNode)}\n`);
    }
  }

  if (importMap.has('css')) {
    const importStatement = importMap.get('css');
    code.overwrite(importStatement.source.start, importStatement.source.end, `'lit'`);
  } else {
    code.prepend(`import { css } from 'lit';\n`);
  }

  const exportValue = new MagicString(
    astring.generate(styleGetterReturnStatement.argument).replace('super.styles', ''),
  );

  if (styleGetterReturnType === 'ArrayExpression') {
    if (exportMap.has(`${camelcase(componentName)}Styles`)) {
      const { declaration } = exportMap.get(`${camelcase(componentName)}Styles`);

      if (declaration.init.type !== styleGetterReturnType) {
        code.overwrite(declaration.id.start, declaration.id.end, camelcase(componentName));
      }
    }

    if (!variableMap.has(camelcase(componentName))) {
      for (const { node } of styleGetterNodes) {
        if (node.type === 'TaggedTemplateExpression') {
          code.append(`\nconst ${camelcase(componentName)} = ${astring.generate(node)};\n`);
        }
      }
    }

    walk.simple(acorn.parseExpressionAt(exportValue.toString()), {
      TaggedTemplateExpression(node) {
        if (node.tag.name === 'css') {
          exportValue.overwrite(node.start, node.end, `${camelcase(componentName)}`);
        }
      },
    });
  }

  code.append(`\nexport const ${camelcase(componentName)}Styles = ${exportValue}\n`);

  write(file, code);
}

function updateComponentStylesTSFile(file, componentName) {
  const { code, ast } = read(file);
  const importMap = getImports(ast);
  const exportMap = getExports(ast);

  if (importMap.has('CSSResult')) {
    const importStatement = importMap.get('CSSResult');
    code.remove(importStatement.start, importStatement.end);
  }

  code.prepend(`import type { CSSResult } from 'lit';\n`);

  if (exportMap.has(`${camelcase(componentName)}Styles`)) {
    const { node } = exportMap.get(`${camelcase(componentName)}Styles`);
    code.remove(node.start, node.end);
  }

  code.append(`\nexport const ${camelcase(componentName)}Styles: CSSResult;\n`);

  write(file, code);
}

function updateComponentFile(
  file,
  componentName,
  { styleGetterNodes, styleGetterReturnStatement, styleGetterReturnType },
) {
  const { code } = read(file);

  styleGetterNodes.forEach(({ relatedImportNode }) => {
    if (relatedImportNode) {
      code.remove(relatedImportNode.start, relatedImportNode.end);
    }
  });

  if (styleGetterReturnType === 'ArrayExpression' && [...styleGetterNodes].some(({ node }) => node.type === 'Super')) {
    code.overwrite(
      styleGetterReturnStatement.start,
      styleGetterReturnStatement.end,
      `return [super.styles, ${camelcase(componentName)}Styles];`,
    );
  } else {
    code.overwrite(
      styleGetterReturnStatement.start,
      styleGetterReturnStatement.end,
      `return ${camelcase(componentName)}Styles;`,
    );
  }

  code.prepend(`import { ${camelcase(componentName)}Styles } from './styles/${componentName}-styles.js';\n`);

  code.replace(`./${componentName}-styles.js`, `./styles/${componentName}-styles.js`);

  write(file, code);
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
  const { code, ast } = read(file);

  for (const [componentName, componentContext] of getComponents(ast)) {
    const { styleGetterReturnStatement } = componentContext;

    const answer = await rl.question(
      `\n\n${code.slice(styleGetterReturnStatement.start, styleGetterReturnStatement.end)}\n\n(y/n): `,
    );
    if (answer.toLowerCase() !== 'y') {
      continue;
    }

    updateComponentStylesJSFile(
      `packages/${pkg}/src/styles/${componentName}-styles.js`,
      componentName,
      componentContext,
    );
    updateComponentStylesTSFile(
      `packages/${pkg}/src/styles/${componentName}-styles.d.ts`,
      componentName,
      componentContext,
    );
    updateComponentFile(file, componentName, componentContext);
  }
}

rl.close();

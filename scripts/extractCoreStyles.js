import { walk } from 'estree-walker';
import { globSync } from 'glob';
import MagicString from 'magic-string';
import fs from 'node:fs';
import { stdin as input, stdout as output } from 'node:process';
import { createInterface } from 'node:readline/promises';
import oxc from 'oxc-parser';

const pkg = process.argv[2];
const rl = createInterface({ input, output });

function read(file) {
  const content = fs.existsSync(file) ? fs.readFileSync(file, 'utf-8') : '';
  const result = oxc.parseSync(file, content);

  const importMap = new Map();
  result.module.staticImports.forEach((staticImport) => {
    staticImport.entries.forEach(({ importName }) => {
      importMap.set(importName.name, staticImport);
    });
  });

  const exportMap = new Map();
  result.module.staticExports.forEach((staticExport) => {
    staticExport.entries.forEach(({ exportName }) => {
      exportMap.set(exportName.name, staticExport);
    });
  });

  const variableMap = new Map();
  walk(result.program, {
    enter(node) {
      if (node.type === 'VariableDeclarator') {
        variableMap.set(node.id.name, node);
      }
    },
  });

  return {
    code: new MagicString(content),
    ast: result.program,
    module: result.module,
    importMap,
    exportMap,
    variableMap,
  };
}

function write(file, code) {
  fs.writeFileSync(file, code.toString(), 'utf-8');
}

/** @param {{ ast: import('oxc-parser').Node, modules: import('oxc-parser').EcmaScriptModule}} options */
function getComponents({ ast, code, importMap, exportMap, module }) {
  const components = [];

  walk(ast, {
    enter(classNode) {
      if (classNode.type !== 'ClassDeclaration') {
        return;
      }

      const members = classNode.body.body;

      /** @type {import('oxc-parser').MethodDefinition} */
      const styleGetter = members.find((member) => member.kind === 'get' && member.key.name === 'styles');

      /** @type {import('oxc-parser').MethodDefinition} */
      const isGetter = members.find((member) => member.kind === 'get' && member.key.name === 'is');

      if (!styleGetter || !isGetter) {
        return;
      }

      const styleGetterNodes = [];

      /** @type {import('oxc-parser').ReturnStatement} */
      const styleGetterReturnStatement = styleGetter.value.body.body[0];
      walk(styleGetterReturnStatement, {
        enter(node) {
          if (node.type === 'TaggedTemplateExpression' && node.tag.name === 'css') {
            styleGetterNodes.push(node);
          }

          if (node.type === 'Identifier' && node.name !== 'css') {
            styleGetterNodes.push(node);
          }

          if (node.type === 'Super') {
            styleGetterNodes.push(node);
          }
        },
      });

      const tagName = isGetter.value.body.body[0].argument.value;
      const className = classNode.id.name;
      components.push({
        code,
        ast,
        module,
        importMap,
        exportMap,
        tagName,
        className,
        classNameCamelCase: className.replace(/^\w/u, (c) => c.toLowerCase()),
        styleGetterNodes,
        styleGetterReturnType: styleGetterReturnStatement.argument.type,
        styleGetterReturnBody: styleGetterReturnStatement.argument,
        styleGetterReturnStatement,
      });
    },
  });

  return components;
}

function updateComponentStylesJSFile(file, component) {
  const componentName = component.classNameCamelCase;

  const { code, importMap, variableMap } = read(file);

  for (const styleGetterNode of component.styleGetterNodes) {
    if (styleGetterNode.type !== 'Identifier' || styleGetterNode.name === `${componentName}Styles`) {
      continue;
    }

    if (importMap.has(styleGetterNode.name)) {
      continue;
    }

    const stylesImport = component.importMap.get(styleGetterNode.name);
    if (stylesImport) {
      code.prepend(`\n${component.code.slice(stylesImport.start, stylesImport.end)}\n`);
    }
  }

  const cssImport = importMap.get('css');
  if (cssImport) {
    code.update(cssImport.moduleRequest.start, cssImport.moduleRequest.end, `'lit'`);
  } else {
    code.prepend(`import { css } from 'lit';\n`);
  }

  const stylesExportValue = component.code
    .snip(component.styleGetterReturnBody.start, component.styleGetterReturnBody.end)
    .replace('super.styles');

  if (component.styleGetterReturnType === 'ArrayExpression') {
    if (variableMap.has(`${componentName}Styles`)) {
      const declaration = variableMap.get(`${componentName}Styles`);
      if (declaration.init.type === 'TaggedTemplateExpression') {
        code.update(declaration.id.start, declaration.id.end, componentName);
      }
    }

    const cssTemplate = component.styleGetterNodes.find(({ node }) => node.type === 'TaggedTemplateExpression');
    if (cssTemplate) {
      code.append(`\nconst ${componentName} = ${component.code.slice(cssTemplate.start, cssTemplate.end)};\n`);

      walk(oxc.parseSync(stylesExportValue), {
        enter(node) {
          if (node.type === 'TaggedTemplateExpression') {
            stylesExportValue.update(node.start, node.end, `${componentName}`);
          }
        },
      });
    }
  }

  if (
    component.styleGetterReturnBody.type !== 'Identifier' ||
    component.styleGetterReturnBody.name !== `${componentName}Styles`
  ) {
    code.append(`\nexport const ${componentName}Styles = ${stylesExportValue}\n`);
  }

  write(file, code);
}

function updateComponentStylesTSFile(file, component) {
  const { classNameCamelCase } = component;
  const { code, importMap, exportMap } = read(file);

  const cssResultImportStatement = `import type { CSSResult } from 'lit';\n`;
  const cssResultTypeImport = importMap.get('CSSResult');
  if (cssResultTypeImport) {
    code.update(cssResultTypeImport.start, cssResultTypeImport.end, cssResultImportStatement);
  } else {
    code.prepend(`${cssResultImportStatement}\n`);
  }

  const stylesExportStatement = `export const ${classNameCamelCase}Styles: CSSResult;\n`;
  const stylesExport = exportMap.get(`${classNameCamelCase}Styles`);
  if (stylesExport) {
    code.update(stylesExport.start, stylesExport.end, stylesExportStatement);
  } else {
    code.append(`\n${stylesExportStatement}\n`);
  }

  write(file, code);
}

function updateComponentCode({
  code,
  tagName,
  importMap,
  styleGetterNodes,
  styleGetterReturnStatement,
  classNameCamelCase,
}) {
  for (const styleGetterNode of styleGetterNodes) {
    if (styleGetterNode.type !== 'Identifier' || styleGetterNode.name === `${classNameCamelCase}Styles`) {
      continue;
    }

    const stylesImport = importMap.get(styleGetterNode.name);
    if (stylesImport) {
      code.remove(stylesImport.start, stylesImport.end);
    }
  }

  const stylesImport = importMap.get(`${classNameCamelCase}Styles`);
  if (stylesImport) {
    code.update(stylesImport.moduleRequest.start, stylesImport.moduleRequest.end, `'./styles/${tagName}-styles.js'`);
  } else {
    code.prepend(`import { ${classNameCamelCase}Styles } from './styles/${tagName}-styles.js';\n`);
  }

  code.update(
    styleGetterReturnStatement.start,
    styleGetterReturnStatement.end,
    styleGetterNodes.some(({ type }) => type === 'Super')
      ? `return [super.styles, ${classNameCamelCase}Styles];`
      : `return ${classNameCamelCase}Styles;`,
  );

  return code;
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
  const result = read(file);

  for (const component of getComponents(result)) {
    const { styleGetterReturnStatement, tagName } = component;

    const answer = await rl.question(
      `\n\n${result.code.slice(styleGetterReturnStatement.start, styleGetterReturnStatement.end)}\n\n(y/n): `,
    );
    if (answer.toLowerCase() !== 'y') {
      continue;
    }

    updateComponentStylesJSFile(`packages/${pkg}/src/styles/${tagName}-styles.js`, component);
    updateComponentStylesTSFile(`packages/${pkg}/src/styles/${tagName}-styles.d.ts`, component);

    updateComponentCode(component);
  }

  write(file, result.code);
}

rl.close();

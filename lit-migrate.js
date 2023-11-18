// Run with git restore packages/ && git clean -fd && node lit-migrate.js
const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const generator = require('@babel/generator').default;
const { execSync } = require('child_process');

const license = `/**
* @license
* Copyright (c) 2017 - 2024 Vaadin Ltd.
* This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
*/`;

// Iterate all folders under "packages"
const packages = fs.readdirSync('packages');

const filteredPackages = packages.filter((folder) => {
  if (!fs.existsSync(`packages/${folder}/src`)) {
    return false;
  }

  const files = fs.readdirSync(`packages/${folder}/src`);

  if (files.some((file) => file.startsWith('vaadin-lit'))) {
    return false;
  }

  if (!files.some((file) => file.startsWith('vaadin-'))) {
    return false;
  }

  return true;
});

console.log('unmigrated packages', filteredPackages);

// Enable to migrate just one package
// filteredPackages.length = 0;
// filteredPackages[0] = 'tabsheet';

filteredPackages.forEach((folder) => {
  const packagePath = `packages/${folder}`;

  // First, the test files
  const testFiles = fs.readdirSync(`${packagePath}/test`);
  testFiles.forEach((file) => {
    if (file.endsWith('test.js') && !file.endsWith('-polymer.test.js') && !file.endsWith('-lit.test.js')) {
      // Remove all imports with '/vaadin-' in them
      const testFile = `${packagePath}/test/${file}`;
      const content = fs.readFileSync(testFile, 'utf8');
      const vaadinImports = content.match(/import.*\/vaadin-.*;/gu);
      // Remove all lines including an import with '/vaadin-'
      const newContent = content.replace(/import.*\/vaadin-.*;\n/gu, '');

      // Rename the file from foo.test.js to foo.common.js
      const newTestFile = testFile.replace('.test.js', '.common.js');
      fs.writeFileSync(newTestFile, newContent, 'utf8');
      fs.unlinkSync(testFile);

      // Write a file foo-polymer.test.js with the vaadin imports and then import foo.common.js
      const polymerTestFile = testFile.replace('.test.js', '-polymer.test.js');
      const polymerTestFileContent =
        `${vaadinImports.join('\n')}\n` + `import './${file.replace('.test.js', '.common.js')}';\n`;
      fs.writeFileSync(polymerTestFile, polymerTestFileContent, 'utf8');

      // Write a file foo-lit.test.js with the vaadin imports but with 'vaadin-' replaced with 'vaadin-lit-', and then import foo.common.js
      const litTestFile = testFile.replace('.test.js', '-lit.test.js');
      const litTestFileContent = `${vaadinImports
        .map((vaadinImport) => vaadinImport.replace(/vaadin-/gu, 'vaadin-lit-'))
        .join('\n')}\nimport './${file.replace('.test.js', '.common.js')}';\n`;
      fs.writeFileSync(litTestFile, litTestFileContent, 'utf8');
    }
  });

  // Then, the src js files
  const srcFiles = fs.readdirSync(`${packagePath}/src`);
  srcFiles.forEach((file) => {
    if (file.endsWith('.js') && !file.endsWith('-styles.js') && !file.endsWith('-mixin.js')) {
      const rootLevelMixins = ['ElementMixin', 'ThemableMixin', 'ControllerMixin'];

      // Create a mixin file with the same name, but with -mixin.js suffix
      const mixinFile = `${packagePath}/src/${file.replace('.js', '-mixin.js')}`;

      const fileContent = fs.readFileSync(`${packagePath}/src/${file}`, 'utf8');
      // The mixin file should contain the content of the original file, but with the following changes:
      let ast = parser.parse(fileContent, {
        sourceType: 'module',
      });

      // Remove all imports with '/vaadin-' in them
      traverse(ast, {
        ImportDeclaration(path) {
          if (
            path.node.source.value.includes('/vaadin-') ||
            path.node.source.value.includes('/polymer-element') ||
            path.node.source.value.includes('/define.js') ||
            path.node.source.value.includes('/element-mixin.js')
          ) {
            path.remove();
          }
        },
      });

      // Remove defineCustomElement call
      traverse(ast, {
        CallExpression(path) {
          if (path.node.callee.type === 'Identifier' && path.node.callee.name === 'defineCustomElement') {
            path.remove();
          }
        },
      });

      // Remove "export { Foo };" at the end
      traverse(ast, {
        ExportNamedDeclaration(path) {
          if (path.node.source === null) {
            path.remove();
          }
        },
      });

      // Remove the static get template() from the class
      traverse(ast, {
        ClassMethod(path) {
          if (path.node.key.name === 'template' || path.node.key.name === 'is') {
            path.remove();
          }
        },
      });

      // Remove calls to registerStyles
      traverse(ast, {
        CallExpression(path) {
          if (path.node.callee.type === 'Identifier' && path.node.callee.name === 'registerStyles') {
            path.remove();
          }
        },
      });

      // Obtain all the mixins that the class extends. For example "class VirtualList extends ElementMixin(ControllerMixin(ThemableMixin(PolymerElement)))"
      // should return ["ElementMixin", "ControllerMixin", "ThemableMixin"]
      const mixins = [];
      traverse(ast, {
        ClassDeclaration(path) {
          if (path.node.superClass) {
            let superClass = path.node.superClass;
            while (superClass.type === 'CallExpression') {
              mixins.push(superClass.callee.name);
              superClass = superClass.arguments[0];
            }
          }
        },
      });

      const superClassMixins = mixins.filter((mixin) => !rootLevelMixins.includes(mixin));

      // Turn the class into a mixin.
      // For example:
      // "class VirtualList extends ElementMixin(ControllerMixin(ThemableMixin(PolymerElement))) { ... }"
      // Expected result:
      // "export const VirtualListMixin = (superclass) => class extends ControllerMixin(superclass) { ... }"
      // Only the mixins from the "mixins" array are wrapped around the superclass, the rest are ignored.
      let mixinName;
      traverse(ast, {
        ClassDeclaration(path) {
          if (path.node.superClass) {
            const superClass = superClassMixins.reduce((acc, mixin) => {
              return t.callExpression(t.identifier(mixin), [acc]);
            }, t.identifier(`superClass`));

            mixinName = `${path.node.id.name}Mixin`;

            path.replaceWith(
              t.exportNamedDeclaration(
                t.variableDeclaration('const', [
                  t.variableDeclarator(
                    t.identifier(mixinName),
                    t.arrowFunctionExpression(
                      [t.identifier('superClass')],
                      t.classExpression(null, superClass, path.node.body),
                    ),
                  ),
                ]),
              ),
            );
          }
        },
      });

      let modifiedCode = generator(ast).code;

      // Remove mixin jsdoc
      const importJsDocRegex = /(import(?:.|\n)*?;)\s*\/\*\*([\s\S]*?)\*\//gu;
      modifiedCode = modifiedCode.replace(importJsDocRegex, '$1');

      // Add the updated mixin jsdoc
      const mixinJsDoc = `
      /**
       * @polymerMixin
       ${superClassMixins.map((mixin) => ` * @mixes ${mixin}`).join('\n')}
      */`;
      modifiedCode = modifiedCode.replace('export const', `${mixinJsDoc}\nexport const`);

      // Write the mixin file
      fs.writeFileSync(mixinFile, modifiedCode, 'utf8');

      // Write a d.ts file for the mixin file
      const mixinDtsFile = mixinFile.replace('.js', '.d.ts');
      const mixinDtsFileContent = '// Implement manually\n';
      fs.writeFileSync(mixinDtsFile, mixinDtsFileContent, 'utf8');

      // Run eslint on the mixin file
      try {
        execSync(`npx eslint --fix ${mixinFile}`, { stdio: 'inherit' });
      } catch (e) {
        console.log(`eslint failed for ${mixinFile}`);
      }

      // Modify the original file to extend the mixin

      ast = parser.parse(fileContent, {
        sourceType: 'module',
      });

      // Add the mixin import. Use the "mixinName" variable from above.
      traverse(ast, {
        Program(path) {
          path.node.body.unshift(
            t.importDeclaration(
              [t.importSpecifier(t.identifier(mixinName), t.identifier(mixinName))],
              t.stringLiteral(`./${file.replace('.js', '-mixin.js')}`),
            ),
          );
        },
      });

      const mixinsToExtend = [...mixins.filter((mixin) => rootLevelMixins.includes(mixin)), mixinName];
      // Make the class extend the mixin
      traverse(ast, {
        ClassDeclaration(path) {
          if (path.node.superClass) {
            const superClass = mixinsToExtend.reduce((acc, mixin) => {
              return t.callExpression(t.identifier(mixin), [acc]);
            }, t.identifier(`PolymerElement`));

            path.node.superClass = superClass;
          }
        },
      });

      // Remove everything, including comments, from the class except the "static get is()" and "static get template()" methods
      traverse(ast, {
        ClassDeclaration(path) {
          if (path.node.superClass) {
            path.traverse({
              ClassMethod(path) {
                if (path.node.key.name !== 'is' && path.node.key.name !== 'template') {
                  // Remove the method documenation
                  path.node.leadingComments = null;
                  // Remove the method
                  path.remove();
                }
              },
            });
          }
        },
      });

      traverse(ast, {
        ImportDeclaration(path) {
          // Remove the import if it's not used in the body

          const importName = path.node.specifiers[0]?.local.name;
          if (importName) {
            let code = generator(ast).code;
            superClassMixins.forEach((mixin) => {
              code = code.replace(new RegExp(`\\* @mixes ${mixin}\\n`, 'ug'), '');
            });
            const lastImportIndex = code.lastIndexOf('import ');
            const lastImportEndIndex = lastImportIndex + code.substring(lastImportIndex).indexOf(';');

            const isImportUsed = code.substring(lastImportEndIndex).includes(importName);

            if (!isImportUsed) {
              path.remove();
            }
          }
        },
      });

      let modifiedFileContent = generator(ast).code;

      // Remove all lines with "@mixes MixinName"
      superClassMixins.forEach((mixin) => {
        modifiedFileContent = modifiedFileContent.replace(new RegExp(`\\* @mixes ${mixin}\\n`, 'ug'), '');
      });

      // Add "@mixes MixinName" to the class jsdoc
      modifiedFileContent = modifiedFileContent.replace(
        /\* @extends HTMLElement\n/gu,
        `* @extends HTMLElement\n * @mixes ${mixinName}\n`,
      );

      // Write the modified file
      fs.writeFileSync(`${packagePath}/src/${file}`, modifiedFileContent, 'utf8');

      // Run eslint on the modified file
      try {
        execSync(`npx eslint --fix ${packagePath}/src/${file}`, { stdio: 'inherit' });
      } catch (e) {
        console.log(`eslint failed for ${packagePath}/src/${file}`);
      }

      // Create a lit file with the same name, but with vaadin-lit- prefix
      const litFile = `${packagePath}/src/${file.replace('vaadin-', 'vaadin-lit-')}`;

      let litFileContent = fs.readFileSync(`${packagePath}/src/${file}`, 'utf8');

      // Replace the class JSdoc
      litFileContent = litFileContent.replace(
        importJsDocRegex,
        `$1\n\n/**
      * LitElement based version of \`<${file.replace('.js', '')}>\` web component.
      *
      * ## Disclaimer
      *
      * This component is an experiment and not yet a part of Vaadin platform.
      * There is no ETA regarding specific Vaadin version where it'll land.
      * Feel free to try this code in your apps as per Apache 2.0 license.
      */`,
      );

      // Replace "(PolymerElement)" with "PolylitMixin(LitElement)"
      litFileContent = litFileContent.replace(/\(PolymerElement\)/gu, '(PolylitMixin(LitElement))');

      // Replace line including "static get template()" with "render() {"
      litFileContent = litFileContent.replace('static get template()', 'render()');

      // replace line containting '@polymer/polymer/polymer-element.js' with "import { html, LitElement } from 'lit';"
      litFileContent = litFileContent.replace(
        /import.*\/polymer-element.js';/gu,
        "import { html, LitElement } from 'lit';",
      );

      // Add import for PolyLitMixin
      litFileContent = `import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';\n${litFileContent}`;

      // Write the lit file
      fs.writeFileSync(litFile, litFileContent, 'utf8');

      // Run eslint on the lit file
      try {
        execSync(`npx eslint --fix ${litFile}`, { stdio: 'inherit' });
      } catch (e) {
        console.log(`eslint failed for ${litFile}`);
      }

      // Write a d.ts file for the lit file
      const litDtsFile = litFile.replace('.js', '.d.ts');
      const litDtsFileContent = `${license}\nexport * from './${file}';\n`;

      fs.writeFileSync(litDtsFile, litDtsFileContent, 'utf8');
    }
  });

  // Then, the js files under themes/lumo
  const lumoDir = `${packagePath}/theme/lumo`;
  const lumoFiles = fs.readdirSync(lumoDir);

  lumoFiles.forEach((file) => {
    if (file.endsWith('.js') && !file.endsWith('-styles.js')) {
      let content = fs.readFileSync(`${lumoDir}/${file}`, 'utf8');

      // Replace '../../src/vaadin-' with '../../src/vaadin-lit-'
      content = content.replace(/\/src\/vaadin-/gu, '/src/vaadin-lit-');

      // Write the modified file with vaadin-lit- prefix
      const litFile = `${lumoDir}/${file.replace('vaadin-', 'vaadin-lit-')}`;
      fs.writeFileSync(litFile, content, 'utf8');
    }
  });

  // Then, the js files under themes/material
  const materialDir = `${packagePath}/theme/material`;
  const materialFiles = fs.readdirSync(materialDir);

  materialFiles.forEach((file) => {
    if (file.endsWith('.js') && !file.endsWith('-styles.js')) {
      let content = fs.readFileSync(`${materialDir}/${file}`, 'utf8');

      // Replace '/src/vaadin-' with '../../src/vaadin-lit-'
      content = content.replace(/\/src\/vaadin-/gu, '/src/vaadin-lit-');

      // Write the modified file with vaadin-lit- prefix
      const litFile = `${materialDir}/${file.replace('vaadin-', 'vaadin-lit-')}`;
      fs.writeFileSync(litFile, content, 'utf8');
    }
  });

  // Then, the root level js files
  const rootLevelFiles = fs.readdirSync(packagePath);

  rootLevelFiles.forEach((file) => {
    if (file.endsWith('.js') && file !== 'lit.js') {
      let content = fs.readFileSync(`${packagePath}/${file}`, 'utf8');

      // Replace 'vaadin-' with 'vaadin-lit-'
      content = content.replace(/vaadin-/gu, 'vaadin-lit-');

      // Write the modified file with vaadin-lit- prefix
      const litFile = `${packagePath}/${file.replace('vaadin-', 'vaadin-lit-')}`;
      fs.writeFileSync(litFile, content, 'utf8');

      // Write a d.ts file for the lit file
      const litDtsFile = litFile.replace('.js', '.d.ts');
      const litDtsFileContent = `export * from './${file}';\n`;

      fs.writeFileSync(litDtsFile, litDtsFileContent, 'utf8');
    }
  });
});

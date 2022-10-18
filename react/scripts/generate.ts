import { resolve } from 'node:path';
import * as fsPromises from 'node:fs/promises';
import ts from 'typescript';
import { HtmlData } from 'web-component-analyzer/lib/esm/transformers/json/custom-elements-json-data';
import { buildDir, generatedSourceDir, nodeModulesDir } from './config.js';
import { tagNameToClassName, writeGeneratedTypeScriptFile } from './utils.js';

const descriptionFiles = await fsPromises.readdir(buildDir);

// Ensure components dir exists
const generatedComponentsDir = resolve(generatedSourceDir, 'components');
await fsPromises.mkdir(generatedComponentsDir, {recursive: true});

function parsePathToSegments(path: string): string[] {
  const nodeModulesSegment = 'node_modules';
  const segments = path.split('/');
  return segments.slice(segments.indexOf(nodeModulesSegment) + 1);
}

function getImportSpecifier(tagName: string, path: string) {
  // All packages of Vaadin components are scoped with '@vaadin' 
  const [ scope, packageUnscoped, ...sourceSegments ] = parsePathToSegments(path || '');
  const packageName = `${scope}/${packageUnscoped}`;
  const sourceSegmentsUnprefixed = sourceSegments[0] === 'src' ? sourceSegments.slice(1) : sourceSegments;
  const sourcePathUnprefixed = sourceSegmentsUnprefixed.join('/');
  return `${packageName}/${tagName}.js`;
}

function importReact(): [idReact: ts.Identifier, declImportReact: ts.ImportDeclaration] {
  const idReact = ts.factory.createIdentifier('React');
  return [
    idReact,
    ts.factory.createImportDeclaration(
      undefined,
      ts.factory.createImportClause(
        false,
        idReact,
        undefined,
      ),
      ts.factory.createStringLiteral('react', true)
    )
  ];
}

function importCreateComponent(): [idCreateComponent: ts.Identifier, declImportCreateComponent: ts.ImportDeclaration] {
  const idCreateComponent = ts.factory.createIdentifier('createComponent');
  return [
    idCreateComponent,
    ts.factory.createImportDeclaration(
      undefined,
      ts.factory.createImportClause(
        false,
        undefined,
        ts.factory.createNamedImports([
          ts.factory.createImportSpecifier(false, undefined, idCreateComponent)
        ])
      ),
      ts.factory.createStringLiteral('@lit-labs/react', true)
    )
  ];
}

function importElementNamespace(className: string, specifier: string): [idElementNamespace: ts.Identifier, declImportElementNamespace: ts.ImportDeclaration] {
  const idElementNamespace = ts.factory.createIdentifier(`${className}Module`);
  return [
    idElementNamespace,
    ts.factory.createImportDeclaration(
      undefined,
      ts.factory.createImportClause(
        false,
        undefined,
        ts.factory.createNamespaceImport(idElementNamespace),
      ),
      ts.factory.createStringLiteral(specifier, true)
    )
  ];
}

const indexStatements: ts.Statement[] = [];

for (const descriptionFile of descriptionFiles) {
  const htmlData = JSON.parse(
    await fsPromises.readFile(resolve(buildDir, descriptionFile), {encoding: 'utf-8'})
  ) as HtmlData;

  const tag = (htmlData.tags || []).find(tag => tag.path?.endsWith('.js'));
  if (!tag) {
    continue;
  }

  const importSpecifier = getImportSpecifier(tag.name, tag.path!);
  const jsEntrypoint = resolve(nodeModulesDir, importSpecifier);
  try {
    await fsPromises.access(jsEntrypoint);
  } catch (e) {
    console.log(`Skipping <${tag.name}>,\n  entrypoint not found: '${importSpecifier}'\n`);
    continue;
  }

  const className = tagNameToClassName(tag.name);
  const [idReact, declImportReact] = importReact();
  const [idCreateComponent, declImportCreateComponent] = importCreateComponent();
  const [idElementNamespace, declImportElementNamespace] = importElementNamespace(className, importSpecifier);

  const idClass = ts.factory.createIdentifier(className);
  const exprClass = ts.factory.createPropertyAccessExpression(idElementNamespace, className);

  const exprCallCreateComponent = ts.factory.createCallExpression(
    idCreateComponent,
    undefined,
    [
      idReact,
      ts.factory.createStringLiteral(tag.name, true),
      exprClass,
      ts.factory.createObjectLiteralExpression([

      ])
    ]
  );

  const declExportConstClass = ts.factory.createVariableStatement(
    ts.factory.createModifiersFromModifierFlags(ts.ModifierFlags.Export),
    ts.factory.createVariableDeclarationList([
      ts.factory.createVariableDeclaration(idClass, undefined, undefined, exprCallCreateComponent),
    ], ts.NodeFlags.Const)
  );

  const exportTypes = ts.factory.createExportDeclaration(
    undefined,
    false,
    ts.factory.createNamedExports([
      ts.factory.createExportSpecifier(false, undefined, idElementNamespace)
    ])
  );

  const statements: readonly ts.Statement[] = [
    declImportReact,
    declImportCreateComponent,
    declImportElementNamespace,
    declExportConstClass,
    exportTypes
  ];

  const filePath = resolve(generatedComponentsDir, `${tag.name}.ts`);
  await writeGeneratedTypeScriptFile(filePath, statements);

  const specifier = `./components/${tag.name}.js`;
  indexStatements.push(
    ts.factory.createExportDeclaration(
      undefined,
      false,
      undefined,
      ts.factory.createStringLiteral(specifier, true)
    )
  );
}

const indexPath = resolve(generatedSourceDir, 'index.ts');
await writeGeneratedTypeScriptFile(indexPath, indexStatements);

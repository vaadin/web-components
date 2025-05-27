import * as ts from 'typescript';

function findPropertyAccessForMember(node: ts.Node, memberName: string): ts.PropertyAccessExpression | undefined {
  if (ts.isPropertyAccessExpression(node) && node.name.text === memberName) {
    return node;
  }
  let found: ts.PropertyAccessExpression | undefined;
  ts.forEachChild(node, (child) => {
    if (!found) {
      found = findPropertyAccessForMember(child, memberName);
    }
  });
  return found;
}

type RelatedTypeDeclaration = ts.ClassDeclaration | ts.InterfaceDeclaration | ts.TypeAliasDeclaration;

interface RelatedTypeInfo {
  name: string;
  declarationText: string;
}

export class TypeContext {
  private program: ts.Program;
  private sourceFile: ts.SourceFile;
  private checker: ts.TypeChecker;
  private relatedTypes = new Map<string, RelatedTypeInfo>();
  private elementSchema: any;

  constructor(elementSchema: any) {
    this.elementSchema = elementSchema;

    const modulePath = `./${elementSchema.path}`;
    const className = elementSchema.name;
    const configPath = ts.findConfigFile('./', ts.sys.fileExists, 'tsconfig.json');
    if (!configPath) throw new Error('tsconfig.json not found');

    const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
    const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, './');

    const accessExpressions: string[] = [];

    elementSchema.properties.forEach((property: any) => {
      accessExpressions.push(`({} as ${className}).${property.name}`);
    });
    elementSchema.methods.forEach((method: any) => {
      accessExpressions.push(`({} as ${className}).${method.name}`);
    });
    elementSchema.staticMethods.forEach((method: any) => {
      accessExpressions.push(`${className}.${method.name}`);
    });

    const compilerHost = ts.createCompilerHost({});
    const originalGetSourceFile = compilerHost.getSourceFile;
    compilerHost.getSourceFile = (fileName: any, languageVersion: any) => {
      if (fileName === 'test.ts') {
        return ts.createSourceFile(
          fileName,
          `
        import { ${className} } from '${modulePath}';
        ${accessExpressions.join(';\n')}
        `,
          languageVersion,
          true,
          ts.ScriptKind.TS,
        );
      }
      // For all other files, delegate to the original method to load from disk
      return originalGetSourceFile.call(compilerHost, fileName, languageVersion);
    };
    this.program = ts.createProgram({
      rootNames: ['test.ts'],
      options: parsed.options,
      host: compilerHost,
    });

    const sourceFile = this.program.getSourceFile('test.ts');
    if (!sourceFile) {
      throw new Error(`Source file 'test.ts' not found in the program.`);
    }
    this.sourceFile = sourceFile;
    this.checker = this.program.getTypeChecker();
  }

  getMemberType(memberName: string): string {
    const accessExpression = findPropertyAccessForMember(this.sourceFile, memberName);
    if (!accessExpression) {
      throw new Error(`Property access for member '${memberName}' not found.`);
    }
    const type = this.checker.getTypeAtLocation(accessExpression);
    return this.checker.typeToString(type);
  }

  private findDeclaration(typeName: string): RelatedTypeDeclaration | undefined {
    // Only consider declaration files in monorepo packages
    const relatedSourceFiles = this.program
      .getSourceFiles()
      .filter((file) => file.fileName.includes(`/packages/`))
      .filter((file) => file.isDeclarationFile);

    for (const sourceFile of relatedSourceFiles) {
      for (const statement of sourceFile.statements) {
        // Check for exported class
        if (
          ts.isClassDeclaration(statement) &&
          statement.name &&
          statement.name.text === typeName &&
          statement.modifiers &&
          statement.modifiers.some((mod) => mod.kind === ts.SyntaxKind.ExportKeyword)
        ) {
          return statement;
        }
        // Check for exported interface
        if (
          ts.isInterfaceDeclaration(statement) &&
          statement.name.text === typeName &&
          statement.modifiers &&
          statement.modifiers.some((mod) => mod.kind === ts.SyntaxKind.ExportKeyword)
        ) {
          return statement;
        }
        // Check for exported type alias
        if (
          ts.isTypeAliasDeclaration(statement) &&
          statement.name.text === typeName &&
          statement.modifiers &&
          statement.modifiers.some((mod) => mod.kind === ts.SyntaxKind.ExportKeyword)
        ) {
          return statement;
        }
      }
    }
    return undefined;
  }

  findRelatedTypes(typeString: string): RelatedTypeInfo[] {
    // Naive approach to extract possible type names from the type string
    const typeNames = typeString
      .replace(/[^a-zA-Z0-9_]/gu, ' ')
      .split(' ')
      .map((type) => type.trim())
      .filter((type) => !!type);

    // Filter out some basic types, as well as mixins
    const basicTypes = new Set([
      'string',
      'number',
      'boolean',
      'void',
      'any',
      'unknown',
      'null',
      'undefined',
      'object',
      'Array',
      'Promise',
      'Function',
      'Date',
      'RegExp',
    ]);
    const customTypeNames = typeNames
      .filter((type) => !basicTypes.has(type))
      .filter((type) => !type.endsWith('Mixin') && !type.endsWith('MixinClass'));

    // Skip types already found
    const unknownTypeNames = customTypeNames.filter((type) => !this.relatedTypes.has(type));
    const foundTypeInfos = unknownTypeNames
      .map((name) => this.findDeclaration(name))
      .filter((declaration) => !!declaration);

    // Store found results as related types
    foundTypeInfos.forEach((declaration) => {
      if (!this.relatedTypes.has(declaration.name!.text)) {
        const sourceFile = declaration.getSourceFile();
        const text = sourceFile.text.substring(declaration.pos, declaration.end);
        const relatedType: RelatedTypeInfo = {
          name: declaration.name!.text,
          declarationText: text,
        };
        this.relatedTypes.set(declaration.name!.text, relatedType);

        // Scan the declaration for nested type usages
        this.findRelatedTypes(text);
      }
    });

    return Array.from(this.relatedTypes.values().filter((type) => typeNames.includes(type.name)));
  }

  findEventType(eventName: string): RelatedTypeInfo | undefined {
    // kebab-case to upper camel case conversion
    let typeName = eventName
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
    typeName = `${this.elementSchema.name}${typeName}Event`;

    return this.findRelatedTypes(typeName)[0];
  }

  getRelatedTypes(): RelatedTypeInfo[] {
    return Array.from(this.relatedTypes.values());
  }
}

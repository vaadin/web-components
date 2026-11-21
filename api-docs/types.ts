import { globSync } from 'node:fs';
import { join, resolve } from 'node:path';
import * as ts from 'typescript';

// Repository root, which holds tsconfig.json and the module paths of the manifest
const ROOT_DIR = resolve(import.meta.dirname, '..');

export interface ManifestTypeReference {
  name: string;
  module?: string;
  package?: string;
  start?: number;
}

export interface ManifestType {
  text: string;
  references?: ManifestTypeReference[];
}

export interface ManifestMember {
  kind: string;
  name: string;
  type?: ManifestType;
  parameters?: Array<{ name: string; optional?: boolean; rest?: boolean; type?: ManifestType }>;
  return?: { type?: ManifestType };
}

export interface ManifestEvent {
  name: string;
  type?: ManifestType;
}

type RelatedTypeDeclaration = ts.ClassDeclaration | ts.InterfaceDeclaration | ts.TypeAliasDeclaration;

interface RelatedTypeInfo {
  name: string;
  declarationText: string;
}

const programs = new Map<string, ts.Program>();

/** Compiles the declaration files of the packages once, to read the referenced declarations and resolve their names. */
function getProgram(rootDir: string): ts.Program {
  let program = programs.get(rootDir);
  if (!program) {
    const configPath = ts.findConfigFile(rootDir, ts.sys.fileExists, 'tsconfig.json');
    if (!configPath) throw new Error('tsconfig.json not found');
    const { config } = ts.readConfigFile(configPath, ts.sys.readFile);
    const { options } = ts.parseJsonConfigFileContent(config, ts.sys, rootDir);
    const rootNames = globSync('packages/*/src/**/*.d.ts', { cwd: rootDir }).map((file) => join(rootDir, file));
    program = ts.createProgram({ rootNames, options });
    programs.set(rootDir, program);
  }
  return program;
}

function isRelatedDeclaration(node: ts.Node): node is RelatedTypeDeclaration {
  if (!(ts.isClassDeclaration(node) || ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node))) {
    return false;
  }
  const { fileName } = node.getSourceFile();
  return (
    !!node.name &&
    !/Mixin(Class)?$/u.test(node.name.text) &&
    !!node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword) &&
    fileName.includes('/packages/') &&
    !fileName.includes('/node_modules/')
  );
}

/** Reads the types of an element from the manifest, and the declarations of the types they reference. */
export class TypeContext {
  private program: ts.Program;
  private checker: ts.TypeChecker;
  private rootDir: string;
  private relatedTypes = new Map<string, RelatedTypeInfo>();
  private relatedDeclarations = new Map<string, RelatedTypeDeclaration>();

  constructor({ rootDir = ROOT_DIR }: { rootDir?: string } = {}) {
    this.rootDir = rootDir;
    this.program = getProgram(rootDir);
    this.checker = this.program.getTypeChecker();
  }

  /** Returns the type of a field, or the signature of a method. */
  getMemberType(member: ManifestMember): string {
    if (member.kind !== 'method') {
      return member.type?.text ?? 'any';
    }
    const parameters = (member.parameters ?? []).map(
      (p) => `${p.rest ? '...' : ''}${p.name}${p.optional ? '?' : ''}: ${p.type?.text ?? 'any'}`,
    );
    return `(${parameters.join(', ')}) => ${member.return?.type?.text ?? 'void'}`;
  }

  /** Returns the declarations of the types that a type references, and keeps the types they reference as related. */
  findRelatedTypes(type: ManifestType | undefined): RelatedTypeInfo[] {
    const names = new Set<string>();
    return (type?.references ?? []).flatMap((reference) => {
      const info = this.addReference(reference);
      return info && !names.has(info.name) && names.add(info.name) ? [info] : [];
    });
  }

  /** Returns the declaration of the type of an event, such as `ComboBoxValueChangedEvent`. */
  findEventType(event: ManifestEvent): RelatedTypeInfo | undefined {
    const reference = event.type?.references?.find((r) => r.start === 0);
    return reference && this.addReference(reference);
  }

  getRelatedTypes(): RelatedTypeInfo[] {
    return Array.from(this.relatedTypes.values());
  }

  private addReference(reference: ManifestTypeReference): RelatedTypeInfo | undefined {
    // A manifest per package names the modules of other packages with a package path
    const modulePath = reference.module ?? reference.package?.replace(/^@vaadin\/([^/]+)\//u, 'packages/$1/');
    const sourceFile = modulePath
      ? this.program.getSourceFile(join(this.rootDir, modulePath.replace(/\.js$/u, '.d.ts')))
      : undefined;
    const declaration = sourceFile?.statements.find(
      (statement): statement is RelatedTypeDeclaration =>
        isRelatedDeclaration(statement) && statement.name?.text === reference.name,
    );
    return declaration && this.addDeclaration(declaration);
  }

  /**
   * Keeps a declaration as related. When another declaration has the same name, as with
   * `import { UploadFile as UploadManagerFile }`, the local name of the import names it.
   */
  private addDeclaration(declaration: RelatedTypeDeclaration, localName?: string): RelatedTypeInfo {
    let name = declaration.name!.text;
    const known = this.relatedDeclarations.get(name);
    if (known && known !== declaration && localName && localName !== name) {
      name = localName;
    }
    if (this.relatedDeclarations.has(name)) {
      return this.relatedTypes.get(name)!;
    }
    const sourceFile = declaration.getSourceFile();
    const info = { name, declarationText: sourceFile.text.substring(declaration.pos, declaration.end) };
    this.relatedTypes.set(name, info);
    this.relatedDeclarations.set(name, declaration);
    this.forEachTypeName(declaration, (typeName) => {
      let symbol = this.checker.getSymbolAtLocation(typeName);
      if (symbol && symbol.flags & ts.SymbolFlags.Alias) {
        symbol = this.checker.getAliasedSymbol(symbol);
      }
      const nested = symbol?.declarations?.find(isRelatedDeclaration);
      if (nested) {
        this.addDeclaration(nested, typeName.getText());
      }
    });
    return info;
  }

  /** Calls back with the names of the types that a declaration uses, including the ones it extends. */
  private forEachTypeName(node: ts.Node, callback: (typeName: ts.Node) => void): void {
    if (ts.isTypeReferenceNode(node)) {
      callback(node.typeName);
    } else if (ts.isExpressionWithTypeArguments(node)) {
      callback(node.expression);
    }
    ts.forEachChild(node, (child) => this.forEachTypeName(child, callback));
  }
}

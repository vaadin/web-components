import { exec } from 'node:child_process';
import * as fsPromises from 'node:fs/promises';
import { promisify } from 'node:util';
import ts from 'typescript';

export const execPromisified = promisify(exec);

const GENERATED_FILE_BANNER = `// Generated file, do not edit\n\n`;

const printer = ts.createPrinter({});

export function tagNameToClassName(tagName: string) {
  const parts = tagName.split('-');
  if (parts[0] === 'vaadin') {
    parts.shift();
  }

  // CamelCase join
  return parts.map(part => part.slice(0, 1).toUpperCase() + part.slice(1)).join('');
}

export async function writeGeneratedTypeScriptFile(filePath: string, statements: readonly ts.Statement[]) {
  const sourceFile = ts.factory.createSourceFile(
    statements,
    ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
    ts.NodeFlags.None
  );
  const source = GENERATED_FILE_BANNER + printer.printFile(sourceFile);
  await fsPromises.writeFile(filePath, source, {encoding: 'utf-8'});
}

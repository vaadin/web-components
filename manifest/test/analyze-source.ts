import type { JavaScriptModule } from 'custom-elements-manifest';
import { createRequire } from 'node:module';
import type * as TypeScript from 'typescript';
import type { Plugin } from '../lib/plugin-types.ts';

// The plugins get the TypeScript instance of the analyzer, which bundles its own version
const analyzerPackage = createRequire(import.meta.url).resolve('@custom-elements-manifest/analyzer/package.json');
const ts: typeof TypeScript = createRequire(analyzerPackage)('typescript');

/**
 * Runs the `analyzePhase` of a plugin over every node of a source, like the analyzer does.
 * @param source the JavaScript source of a module
 * @param moduleDoc the declarations the analyzer created for the module
 * @return the module doc
 */
export function analyzeSource<T extends object>(plugin: Plugin, source: string, moduleDoc: T): T {
  const sourceFile = ts.createSourceFile('module.js', source, ts.ScriptTarget.ES2015, true);
  const visit = (node: TypeScript.Node): void => {
    plugin.analyzePhase!({ ts, node, moduleDoc: moduleDoc as Partial<JavaScriptModule> });
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return moduleDoc;
}

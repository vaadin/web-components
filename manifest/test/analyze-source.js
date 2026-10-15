import { createRequire } from 'node:module';

// The plugins get the TypeScript instance of the analyzer, which bundles its own version
const analyzerPackage = createRequire(import.meta.url).resolve('@custom-elements-manifest/analyzer/package.json');
const ts = createRequire(analyzerPackage)('typescript');

/**
 * Runs the `analyzePhase` of a plugin over every node of a source, like the analyzer does.
 * @param {object} plugin
 * @param {string} source the JavaScript source of a module
 * @param {object} moduleDoc the declarations the analyzer created for the module
 * @return {object} the module doc
 */
export function analyzeSource(plugin, source, moduleDoc) {
  const sourceFile = ts.createSourceFile('module.js', source, ts.ScriptTarget.ES2015, true);
  const visit = (node) => {
    plugin.analyzePhase({ ts, node, moduleDoc });
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return moduleDoc;
}

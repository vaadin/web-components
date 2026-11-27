import { isStaticMember } from '@custom-elements-manifest/analyzer/src/utils/ast-helpers.js';
import { extractMixinNodes } from '@custom-elements-manifest/analyzer/src/utils/mixins.js';
import type { ClassField } from 'custom-elements-manifest';
import type { PropertyName } from 'typescript';
import type { Plugin } from '../lib/plugin-types.ts';

/** The text of an identifier or a literal name, undefined for a computed one. */
const nameText = (name: PropertyName | undefined): string | undefined =>
  name && 'text' in name ? name.text : undefined;

/**
 * CEM analyzer plugin that marks the fields declared with `readOnly: true` in
 * `static get properties()` as `readonly`. The config drops their attributes,
 * as the setter ignores attribute changes, and the web-types generator leaves
 * them out of the Lit property bindings.
 */
export function readonlyPlugin(): Plugin {
  return {
    name: 'vaadin-readonly',

    analyzePhase({ ts, node, moduleDoc }) {
      const mixinNodes = extractMixinNodes(node);
      const classNode = mixinNodes ? mixinNodes.mixinClass : ts.isClassDeclaration(node) ? node : undefined;
      if (!classNode) return;

      // Find `static get properties()` method
      for (const member of classNode.members || []) {
        if (!ts.isGetAccessorDeclaration(member) || !isStaticMember(member) || nameText(member.name) !== 'properties') {
          continue;
        }

        // Find the return statement's object literal
        const returnStmt = member.body?.statements?.find(ts.isReturnStatement);
        const returnObj = returnStmt?.expression;
        if (!returnObj || !ts.isObjectLiteralExpression(returnObj)) continue;

        for (const prop of returnObj.properties) {
          if (!ts.isPropertyAssignment(prop)) continue;
          const propName = nameText(prop.name);
          if (!propName) continue;

          // Check if the property config object has `readOnly: true`
          const configObj = prop.initializer;
          if (!ts.isObjectLiteralExpression(configObj)) continue;

          const hasReadOnly = configObj.properties.some(
            (p) =>
              ts.isPropertyAssignment(p) &&
              nameText(p.name) === 'readOnly' &&
              p.initializer?.kind === ts.SyntaxKind.TrueKeyword,
          );
          if (!hasReadOnly) continue;

          // Find the matching member in moduleDoc declarations and mark it readonly
          for (const declaration of moduleDoc.declarations || []) {
            const members = 'members' in declaration ? declaration.members : undefined;
            const cemMember = members?.find((m) => m.name === propName);
            if (cemMember) {
              (cemMember as ClassField).readonly = true;
            }
          }
        }
      }
    },
  };
}

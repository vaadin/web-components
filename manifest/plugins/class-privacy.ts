import type { Privacy } from 'custom-elements-manifest';
import type { JSDoc } from 'typescript';
import type { Plugin } from '../lib/plugin-types.ts';

/**
 * CEM analyzer plugin that sets the `privacy` of a class declaration from its
 * `@private` or `@protected` JSDoc tag. The analyzer only does that for
 * members, and the config drops the private and protected classes.
 */
export function classPrivacyPlugin(): Plugin {
  return {
    name: 'vaadin-class-privacy',

    analyzePhase({ ts, node, moduleDoc }) {
      if (!ts.isClassDeclaration(node) || !node.name) return;

      // The analyzer reads the JSDoc of a node from this internal field too
      const jsDoc: JSDoc[] = (node as { jsDoc?: JSDoc[] }).jsDoc || [];
      const tag = jsDoc
        .flatMap((doc) => doc.tags || [])
        .find((t) => t.tagName?.text === 'private' || t.tagName?.text === 'protected');

      if (!tag) return;

      const className = node.name.text;
      const decl = moduleDoc.declarations?.find((d) => d.name === className);
      if (decl) {
        (decl as { privacy?: Privacy }).privacy = tag.tagName.text as Privacy;
      }
    },
  };
}

import { findMember, propertyConfigs } from '../lib/property-configs.js';

/**
 * CEM analyzer plugin that marks the fields declared with `readOnly: true` in
 * `static get properties()` as `readonly`. The config drops their attributes,
 * as the setter ignores attribute changes, and the web-types generator leaves
 * them out of the Lit property bindings.
 */
export function readonlyPlugin() {
  return {
    name: 'vaadin-readonly',

    analyzePhase({ ts, node, moduleDoc }) {
      for (const { name, options } of propertyConfigs(ts, node)) {
        if (options.get('readOnly')?.kind === ts.SyntaxKind.TrueKeyword) {
          const member = findMember(moduleDoc, name);
          if (member) {
            member.readonly = true;
          }
        }
      }
    },
  };
}

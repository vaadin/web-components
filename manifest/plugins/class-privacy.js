/**
 * CEM analyzer plugin that sets the `privacy` of a class declaration from its
 * `@private` or `@protected` JSDoc tag. The analyzer only does that for
 * members, and the config drops the private and protected classes.
 */
export function classPrivacyPlugin() {
  return {
    name: 'vaadin-class-privacy',

    analyzePhase({ ts, node, moduleDoc }) {
      if (!ts.isClassDeclaration(node) || !node.name) return;

      const tag = (node.jsDoc || [])
        .flatMap((doc) => doc.tags || [])
        .find((t) => t.tagName?.text === 'private' || t.tagName?.text === 'protected');

      if (!tag) return;

      const decl = moduleDoc.declarations?.find((d) => d.name === node.name.text);
      if (decl) {
        decl.privacy = tag.tagName.text;
      }
    },
  };
}

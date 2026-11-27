// Internal helpers of the analyzer that the plugins import, which it ships without types

declare module '@custom-elements-manifest/analyzer/src/utils/ast-helpers.js' {
  import type { ClassElement } from 'typescript';

  export function isStaticMember(member: ClassElement): boolean;
}

declare module '@custom-elements-manifest/analyzer/src/utils/mixins.js' {
  import type { ClassExpression, Node } from 'typescript';

  export function extractMixinNodes(node: Node): { mixinFunction: Node; mixinClass: ClassExpression } | false;
}

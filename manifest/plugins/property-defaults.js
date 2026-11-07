import { findAttribute, findMember, propertyConfigs } from '../lib/property-configs.js';

/**
 * CEM analyzer plugin that records the `value` of a property config in
 * `static get properties()` as the `default` of the field and of its attribute,
 * as the analyzer only reads class field initializers. A literal is recorded as written, a
 * factory such as `() => []` by its result. Identifiers and constructor calls
 * are left out, as their value is not known from the source.
 */
export function propertyDefaultsPlugin() {
  return {
    name: 'vaadin-property-defaults',

    analyzePhase({ ts, node, moduleDoc }) {
      const isLiteral = (expression) =>
        ts.isLiteralExpression(expression) ||
        ts.isArrayLiteralExpression(expression) ||
        ts.isObjectLiteralExpression(expression) ||
        [ts.SyntaxKind.TrueKeyword, ts.SyntaxKind.FalseKeyword, ts.SyntaxKind.NullKeyword].includes(expression.kind);

      for (const { name, options } of propertyConfigs(ts, node)) {
        let value = options.get('value');
        if (value && ts.isArrowFunction(value) && !ts.isBlock(value.body)) {
          value = ts.isParenthesizedExpression(value.body) ? value.body.expression : value.body;
        }
        if (!value || !isLiteral(value)) {
          continue;
        }
        const member = findMember(moduleDoc, name);
        if (member && member.default === undefined) {
          member.default = value.getText();
          const attribute = findAttribute(moduleDoc, name);
          if (attribute && attribute.default === undefined) {
            attribute.default = member.default;
          }
        }
      }
    },
  };
}

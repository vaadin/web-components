/* eslint-env node */

module.exports = {
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: {
      description: 'Require _requestValidation() instead of direct validate() calls to respect manual validation mode',
    },
    schema: [],
  },
  create(context) {
    return {
      MemberExpression(node) {
        if (
          node.object.type === 'ThisExpression' &&
          node.property.type === 'Identifier' &&
          node.property.name === 'validate'
        ) {
          context.report({
            node,
            message: `Don't call validate() directly - it bypasses manual validation mode. Use _requestValidation() instead`,
            fix: (fixer) => {
              return fixer.replaceText(node.property, '_requestValidation');
            },
          });
        }
      },
    };
  },
};

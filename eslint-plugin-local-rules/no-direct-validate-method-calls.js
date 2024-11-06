/* eslint-env node */

module.exports = {
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: {
      description: 'Disallow calling `this.validate()` directly to prevent bypassing manual validation mode',
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
            message:
              'The `validate` method must not be called directly because it ignores manual validation mode. Use `_requestValidation` instead.',
            fix: (fixer) => {
              return fixer.replaceText(node.property, '_requestValidation');
            },
          });
        }
      },
    };
  },
};

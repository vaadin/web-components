/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure files have Vaadin license header',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          licenseHeader: {
            type: 'string',
            description: 'The license header to be used in the file',
          },
        },
      },
    ],
  },
  create(context) {
    const { sourceCode, options } = context;
    const [{ licenseHeader }] = options;

    return {
      Program(node) {
        const firstComment = sourceCode.getAllComments()[0];
        const firstCommentText = sourceCode.getText(firstComment);

        if (!firstComment || !firstCommentText.includes('@license')) {
          context.report({
            loc: {},
            message: 'Missing license header',
            fix(fixer) {
              let text = `${licenseHeader.trim()}\n`;
              if (node.body[0].type !== 'ImportDeclaration') {
                text += '\n';
              }
              return fixer.insertTextBeforeRange([0, 0], text);
            },
          });
          return;
        }

        if (!firstCommentText.includes('Vaadin Ltd')) {
          return;
        }

        if (!firstCommentText.includes(`- ${new Date().getFullYear()}`)) {
          context.report({
            node: firstComment,
            message: 'License header year is not up to date',
            fix(fixer) {
              return fixer.replaceText(firstComment, licenseHeader.trim());
            },
          });
        }
      },
    };
  },
};

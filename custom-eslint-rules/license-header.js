const LICENSE_HEADER = `
/**
 * @license
 * Copyright (c) 2000 - ${new Date().getFullYear()} Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
`.trim();

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure files have Vaadin license header',
    },
    fixable: 'code',
  },
  create(context) {
    const { sourceCode } = context;

    return {
      Program() {
        const firstComment = sourceCode.getAllComments()[0];
        const firstCommentText = sourceCode.getText(firstComment);

        if (!firstComment || !firstCommentText.includes('@license')) {
          context.report({
            message: 'Missing license header',
            loc: {},
            fix(fixer) {
              return fixer.insertTextBeforeRange([0, 0], `${LICENSE_HEADER}\n`);
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
              return fixer.replaceText(firstComment, LICENSE_HEADER);
            },
          });
        }
      },
    };
  },
};

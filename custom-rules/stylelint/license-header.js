import stylelint from 'stylelint';

const licenseHeader = `
/**
 * @license
 * Copyright (c) 2000 - ${new Date().getFullYear()} Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
`.trim();

const {
  createPlugin,
  utils: { report },
} = stylelint;

const ruleName = 'custom-rules/license-header';

const ruleFunction = () => {
  return (root, result) => {
    const firstNode = root.nodes[0];
    if (firstNode.type !== 'comment' || !firstNode.text.includes('@license')) {
      report({
        result,
        ruleName,
        node: firstNode,
        start: {
          line: 1,
          column: 1,
        },
        end: {
          line: 1,
          column: 1,
        },
        message: 'Missing license header',
        fix: () => {
          root.prepend(licenseHeader);
          root.nodes[1].raws.before = '\n';
        },
      });
      return;
    }

    if (!firstNode.text.includes('Vaadin Ltd')) {
      return;
    }

    if (!firstNode.text.includes(`- ${new Date().getFullYear()}`)) {
      report({
        result,
        ruleName,
        node: firstNode,
        message: 'License header year is not up to date',
        fix: () => firstNode.replaceWith(licenseHeader),
      });
    }
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.meta = { fixable: true };

export default createPlugin(ruleName, ruleFunction);

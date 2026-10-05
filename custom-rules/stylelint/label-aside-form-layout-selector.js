import stylelint from 'stylelint';

const {
  createPlugin,
  utils: { report },
} = stylelint;

const ruleName = 'custom-rules/label-aside-form-layout-selector';

const THEME_ATTRIBUTE = /\[theme~=(['"]?)label-aside\1\]/u;
const FORM_LAYOUT_ATTRIBUTE = '[data-form-layout-has-labels-aside]';

const messages = {
  expected: () =>
    `Expected a selector matching "[theme~='label-aside']" to also match "[data-form-layout-has-labels-aside]"`,
};

const ruleFunction = () => {
  return (root, result) => {
    root.walkRules((rule) => {
      rule.selectors.forEach((selector) => {
        if (THEME_ATTRIBUTE.test(selector) && !selector.includes(FORM_LAYOUT_ATTRIBUTE)) {
          report({
            result,
            ruleName,
            message: messages.expected(),
            node: rule,
            word: selector,
          });
        }
      });
    });
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;

export default createPlugin(ruleName, ruleFunction);

import { expand, isShorthand } from 'css-shorthand-properties';
import stylelint from 'stylelint';

const {
  createPlugin,
  utils: { report },
} = stylelint;

const ruleName = 'custom-linter-rules/no-shorthand-with-unresolved-longhand';

const messages = {
  rejected: (shorthand, longhand) =>
    `Avoid using shorthand property "${shorthand}" together with longhand "${longhand}" that contains a CSS variable (var(...))`,
};

const ruleFunction = () => {
  return (root, result) => {
    root.walkRules((rule) => {
      const forbiddenLonghandProps = new Map();

      rule.walkDecls((decl) => {
        const { prop, value } = decl;

        if (isShorthand(prop)) {
          if (value.includes('var(')) {
            expand(prop).forEach((longhand) => forbiddenLonghandProps.set(longhand, prop));
          }
          return;
        }

        if (forbiddenLonghandProps.has(prop)) {
          report({
            result,
            ruleName,
            message: messages.rejected(prop, forbiddenLonghandProps.get(prop)),
            node: decl,
            word: decl.prop,
          });
        }
      });
    });
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;

export default createPlugin(ruleName, ruleFunction);

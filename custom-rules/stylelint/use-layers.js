import stylelint from 'stylelint';

const {
  createPlugin,
  utils: { report },
} = stylelint;

const ruleName = 'custom-rules/use-layers';

const messages = {
  missingLayer: 'Expected rule to be within a layer',
  layerNameMismatch: (name, pattern) => `Expected layer name '${name}' to match pattern '${pattern}'.`,
};

function getParentLayerName(rule) {
  let parent = rule.parent;
  while (parent) {
    if (parent.type === 'atrule' && parent.name === 'layer') {
      return parent.params.trim();
    }
    parent = parent.parent;
  }
  return null;
}

const ruleFunction = (layerNamePattern) => {
  return (root, result) => {
    root.walkRules((rule) => {
      const parentLayerName = getParentLayerName(rule);
      if (parentLayerName === null) {
        return report({
          ruleName,
          result,
          node: rule,
          message: messages.missingLayer,
        });
      }

      if (layerNamePattern && !new RegExp(layerNamePattern, 'u').test(parentLayerName)) {
        return report({
          ruleName,
          result,
          node: rule,
          message: messages.layerNameMismatch(parentLayerName, layerNamePattern),
        });
      }
    });
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;

export default createPlugin(ruleName, ruleFunction);

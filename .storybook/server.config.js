const { storybookPlugin } = require('@web/dev-server-storybook');

module.exports = {
  nodeResolve: true,
  open: true,
  plugins: [storybookPlugin({ type: 'web-components' })]
};

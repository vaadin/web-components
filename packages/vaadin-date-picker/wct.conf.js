'use strict';

module.exports = {
  registerHooks: function(context) {
    if (process.env.SAUCE_BROWSERS) {
      context.options.plugins.sauce.browsers = JSON.parse(process.env.SAUCE_BROWSERS);
    }
  }
};

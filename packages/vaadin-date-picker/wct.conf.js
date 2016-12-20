'use strict';

var args = require('yargs').argv;

module.exports = {
  extraScripts: args.dom === 'shadow' ? ['test/enable-shadow-dom.js'] : [],
  registerHooks: function(context) {
    if (process.env.SAUCE_BROWSERS) {
      context.options.plugins.sauce.browsers = JSON.parse(process.env.SAUCE_BROWSERS);
    }
  }
};

module.exports = {
  registerHooks: function(context) {
    context.options.plugins.sauce.browsers = [
      // - So much random timeouts in CI but working in local
      // 'OS X 10.11/iphone@10.2',
      // 'OS X 10.11/ipad@10.2',

      'Windows 10/internet explorer@11',
      'Windows 10/chrome@58',
      'Windows 10/firefox@53',
      'Windows 10/microsoftedge@14',
      'OS X 10.11/safari@10.0'
    ];
  },

  plugins: {
    'random-output': true
  }
};

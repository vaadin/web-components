
module.exports = {
  registerHooks: function(context) {

    context.options.plugins.sauce.browserss = [
      'Windows 10/chrome@54',
      'Windows 10/firefox@50',
      'Windows 10/microsoftedge@14',
      'OS X 10.11/safari@10.0',
      'OSX 10.11/iphone@10.0',
      'OSX 10.11/ipad@10.0'
    ];

  }
};

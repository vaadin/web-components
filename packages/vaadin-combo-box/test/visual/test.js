gemini.suite('vaadin-combo-box', function(rootSuite) {
  function wait(actions, find) {
    actions.wait(5000);
  }

  function goToAboutBlank(actions, find) {
    // Firefox stops responding on socket after a test, workaround:
    return actions.executeJS(function(window) {
      window.location.href = 'about:blank'; // just go away, please!
    });
  }

  rootSuite
    .before(wait)
    .after(goToAboutBlank);

  gemini.suite('default-tests', function(suite) {
    suite
      .setUrl('default.html')
      .setCaptureElements('#default-tests')
      .capture('default');
  });

  gemini.suite('icons', function(suite) {
    suite
      .setUrl('icons.html')
      .setCaptureElements('#icons-tests')
      .capture('default');
  });

  gemini.suite('dropdown', function(suite) {
    suite
      .setUrl('dropdown.html')
      .setCaptureElements('#dropdown-tests')
      .capture('default', function(actions) {
        actions.executeJS(function(window) {
          window.document.querySelector('#plain').open();
        });
      })
      .capture('template', function(actions) {
        actions.executeJS(function(window) {
          window.document.querySelector('#template').open();
        });
      });
  });

});

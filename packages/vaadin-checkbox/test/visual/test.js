gemini.suite('vaadin-checkbox', function(rootSuite) {
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
  // Lumo theme
  gemini.suite('default-tests', function(suite) {
    suite
      .setUrl('default.html')
      .setCaptureElements('#default-tests')
      .capture('default')
      .capture('focus-ring', function(actions) {
        actions.executeJS(function(window) {
          window.document.querySelector('vaadin-checkbox').setAttribute('focus-ring', '');
        });
      })
      .capture('checked', function(actions) {
        actions.executeJS(function(window) {
          window.document.querySelector('vaadin-checkbox').checked = true;
        });
      });
  });

  gemini.suite('group-tests', (suite) => {
    suite
      .setUrl('default.html')
      .setCaptureElements('#group-tests')
      .capture('default');
  });

  gemini.suite('validation-tests', function(suite) {
    suite
      .setUrl('default.html')
      .setCaptureElements('#validation-tests')
      .capture('error');
  });

  // Material theme
  gemini.suite('material-default-tests', function(suite) {
    suite
      .setUrl('material.html')
      .setCaptureElements('#default-tests')
      .capture('default')
      .capture('focus-ring', function(actions) {
        actions.executeJS(function(window) {
          window.document.querySelector('vaadin-checkbox').setAttribute('focus-ring', '');
        });
      })
      .capture('checked', function(actions) {
        actions.executeJS(function(window) {
          window.document.querySelector('vaadin-checkbox').checked = true;
        });
      });
  });

  gemini.suite('material-group-tests', (suite) => {
    suite
      .setUrl('material.html')
      .setCaptureElements('#group-tests')
      .capture('default');
  });

  gemini.suite('material-validation-tests', function(suite) {
    suite
      .setUrl('material.html')
      .setCaptureElements('#validation-tests')
      .capture('error');
  });

});

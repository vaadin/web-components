gemini.suite('vaadin-time-picker', function(rootSuite) {
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

  gemini.suite('dropdown', function(suite) {
    suite
      .setUrl('dropdown.html')
      .setCaptureElements('body')
      .capture('default', function(actions) {
        actions.executeJS(function(window) {
          window.closeTimePickers();
          window.document.querySelector('#plain').__dropdownElement.opened = true;
        });
      })
      .capture('selected-value', function(actions) {
        actions.executeJS(function(window) {
          window.closeTimePickers();
          window.document.querySelector('#selected-value').__dropdownElement.opened = true;
        });
      })
      .capture('step', function(actions) {
        actions.executeJS(function(window) {
          window.closeTimePickers();
          window.document.querySelector('#step').__dropdownElement.opened = true;
        });
      });
  });

});

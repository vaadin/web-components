gemini.suite('vaadin-crud', function(rootSuite) {
  function wait(actions, find) {
    return actions
      .waitForJSCondition(function(window) {
        return !!(window.WebComponents && window.WebComponents.ready);
      }, 15000);
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

  ['lumo', 'material'].forEach(theme => {
    gemini.suite(`default-tests-${theme}`, function(suite) {
      suite
        .setUrl(`/default.html?theme=${theme}`)
        .setCaptureElements('body')
        .capture('vaadin-crud');
    });

    gemini.suite(`editor-bottom-tests-${theme}`, function(suite) {
      suite
        .setUrl(`/editor-bottom.html?theme=${theme}`)
        .setCaptureElements('vaadin-crud')
        .capture('vaadin-crud');
    });

    gemini.suite(`editor-aside-tests-${theme}`, function(suite) {
      suite
        .setUrl(`/editor-aside.html?theme=${theme}`)
        .setCaptureElements('vaadin-crud')
        .capture('vaadin-crud');
    });
  });

});

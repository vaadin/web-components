gemini.suite('vaadin-grid-pro', function(rootSuite) {
  function wait(actions, find) {
    return actions
      .waitForJSCondition(function(window) {
        return window.webComponentsAreReady;
      }, 80000);
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
    gemini.suite(`edit-column-boolean-tests-${theme}`, function(suite) {
      suite
        .setUrl(`/edit-column-boolean.html?theme=${theme}`)
        .setCaptureElements('#edit-column-boolean')
        .capture(`vaadin-grid-pro`);
    });

    gemini.suite(`edit-column-select-tests-${theme}`, function(suite) {
      suite
        .setUrl(`/edit-column-select.html?theme=${theme}`)
        .setCaptureElements('#edit-column-select')
        .capture(`vaadin-grid-pro`);
    });

    gemini.suite(`edit-column-text-tests-${theme}`, function(suite) {
      suite
        .setUrl(`/edit-column-text.html?theme=${theme}`)
        .setCaptureElements('#edit-column-text')
        .capture(`vaadin-grid-pro`);
    });
  });

});

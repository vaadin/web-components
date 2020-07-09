gemini.suite('vaadin-avatar', function(rootSuite) {
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

  ['lumo', 'material'].forEach(theme => {
    gemini.suite(`default-tests-${theme}`, function(suite) {
      suite
        .setUrl(`/default.html?theme=${theme}`)
        .setCaptureElements('#default-tests')
        .capture(`vaadin-avatar`);
    });

    gemini.suite(`border-tests-${theme}`, function(suite) {
      suite
        .setUrl(`/border.html?theme=${theme}`)
        .setCaptureElements('#border-tests')
        .capture(`vaadin-avatar`);
    });

    gemini.suite(`group-tests-${theme}`, function(suite) {
      suite
        .setUrl(`/group.html?theme=${theme}`)
        .setCaptureElements('#group-tests')
        .capture('default')
        .capture('rtl', actions => {
          actions.executeJS(function(window) {
            window.document.documentElement.setAttribute('dir', 'rtl');
          });
        });
    });

    gemini.suite(`group-border-tests-${theme}`, function(suite) {
      suite
        .setUrl(`/group-border.html?theme=${theme}`)
        .setCaptureElements('#group-tests')
        .capture(`vaadin-avatar-group`);
    });

    gemini.suite(`scaled-tests-${theme}`, function(suite) {
      suite
        .setUrl(`/scaled.html?theme=${theme}`)
        .setCaptureElements('#scaled-tests')
        .capture(`vaadin-avatar`);
    });

    gemini.suite(`group-overlay-tests-${theme}`, function(suite) {
      suite
        .setUrl(`group-overlay.html?theme=${theme}`)
        .setCaptureElements(`#group-tests`)
        .capture('default')
        .capture('opened', function(actions) {
          actions.executeJS(function(window) {
            window.openOverlay();
          });
        })
        .capture('rtl', actions => {
          actions.executeJS(function(window) {
            window.document.documentElement.setAttribute('dir', 'rtl');
          });
        });
    });
  });

  ['light', 'dark'].forEach(variant => {
    gemini.suite(`lumo-${variant}`, function(suite) {
      suite
        .setUrl(`/lumo.html?variant=${variant}`)
        .setCaptureElements('#default-tests')
        .capture(`vaadin-avatar`);
    });

    gemini.suite(`lumo-group-${variant}`, function(suite) {
      suite
        .setUrl(`/lumo-group.html?variant=${variant}`)
        .setCaptureElements('#group-tests')
        .capture('default')
        .capture('rtl', actions => {
          actions.executeJS(function(window) {
            window.document.documentElement.setAttribute('dir', 'rtl');
          });
        });
    });

  });
});

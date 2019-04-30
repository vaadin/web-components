gemini.suite('vaadin-menu-bar', function(rootSuite) {
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
    gemini.suite(`${theme}-default-tests`, function(suite) {
      suite
        .setUrl(`default.html?theme=${theme}`)
        .setCaptureElements('#default-tests')
        .capture('default', function(actions) {
          actions.executeJS(function(window) {
            window.openSubMenu();
          });
        });
    });

    gemini.suite(`${theme}-focused-tests`, function(suite) {
      suite
        .setUrl(`focused.html?theme=${theme}`)
        .setCaptureElements('#focused-tests')
        .capture('focused');
    });

    gemini.suite(`${theme}-icons-tests`, function(suite) {
      suite
        .setUrl(`icons.html?theme=${theme}`)
        .setCaptureElements('#icons-tests')
        .capture('icons', function(actions) {
          actions.executeJS(function(window) {
            window.openSubMenu();
          });
        });
    });

    if (theme === 'material') {
      ['outlined', 'contained', 'text'].forEach(variant => {
        gemini.suite(`${theme}-${variant}-tests`, function(suite) {
          suite
            .setUrl(`theme.html?theme=${theme}&variant=${variant}`)
            .setCaptureElements(`#theme-tests`)
            .capture(`${variant}`, function(actions) {
              actions.executeJS(function(window) {
                window.openSubMenu();
              });
            });
        });
      });
    }

    if (theme === 'lumo') {
      ['primary', 'secondary', 'tertiary', 'tertiary-inline', 'small'].forEach(variant => {
        gemini.suite(`${theme}-${variant}-tests`, function(suite) {
          suite
            .setUrl(`theme.html?theme=${theme}&variant=${variant}`)
            .setCaptureElements(`#theme-tests`)
            .capture(`${variant}`, function(actions) {
              actions.executeJS(function(window) {
                window.openSubMenu();
              });
            });
        });
      });
    }
  });

});

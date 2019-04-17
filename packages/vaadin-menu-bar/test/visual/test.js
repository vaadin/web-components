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
    gemini.suite(`default-tests-${theme}`, function(suite) {
      suite
        .setUrl(`default.html?theme=${theme}`)
        .setCaptureElements('#default-tests')
        .capture('default', function(actions) {
          actions.executeJS(function(window) {
            window.openSubMenu();
          });
        });
    });

    gemini.suite(`component-tests-${theme}`, function(suite) {
      suite
        .setUrl(`component.html?theme=${theme}`)
        .setCaptureElements('#component-tests')
        .capture('component', function(actions) {
          actions.executeJS(function(window) {
            window.openSubMenu();
          });
        });
    });


    gemini.suite(`overflow-tests-${theme}`, function(suite) {
      suite
        .setUrl(`overflow.html?theme=${theme}`)
        .setCaptureElements('#overflow-tests')
        .capture('overflow', function(actions) {
          actions.executeJS(function(window) {
            window.openSubMenu();
          });
        });
    });

    if (theme === 'material') {
      gemini.suite(`${theme}-outlined-tests`, function(suite) {
        suite
          .setUrl(`${theme}-outlined.html?theme=${theme}`)
          .setCaptureElements(`#${theme}-outlined-tests`)
          .capture('outlined', function(actions) {
            actions.executeJS(function(window) {
              window.openSubMenu();
            });
          });
      });

      gemini.suite(`${theme}-contained-tests`, function(suite) {
        suite
          .setUrl(`${theme}-contained.html?theme=${theme}`)
          .setCaptureElements(`#${theme}-contained-tests`)
          .capture('contained', function(actions) {
            actions.executeJS(function(window) {
              window.openSubMenu();
            });
          });
      });
    }
  });

});

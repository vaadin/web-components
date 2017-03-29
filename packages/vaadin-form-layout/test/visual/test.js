gemini.suite('vaadin-form-layout', (rootSuite) => {

  var demos = [
    {name: 'index', snippets: ['basic', 'paper-input']}
  ];

  demos.forEach(function(demo) {

    gemini.suite(demo.name, (demoSuite) => {

      demo.snippets.forEach((snippet, snippetIndex) => {
        gemini.suite(snippet, (snippetSuite) => {
          snippetSuite
            .setUrl('/../../demo/' + demo.name + '.html')
            .setCaptureElements('demo-snippet:nth-of-type(' + (snippetIndex + 1) + ') vaadin-form-layout')
            .capture('default', {}, (actions, find) => {
              actions.wait(3000);
            });
        });
      });

    });

  });

});

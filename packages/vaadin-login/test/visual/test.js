describe('vaadin-login', () => {
  const locator = 'vaadin-login-overlay-wrapper';

  const screens = [
    { name: 'desktop', width: 1600, height: 1000 },
    { name: 'medium', width: 1000, height: 600 },
    { name: 'small-portrait', width: 500, height: 1000 }
  ];

  screens.forEach(({ name, width, height }) => {
    ['lumo', 'material'].forEach((theme) => {
      ['ltr', 'rtl'].forEach((dir) => {
        it(`${theme}-login-${name}-${dir}`, function () {
          return this.browser
            .setViewportSize({ width, height })
            .url(`default.html?theme=${theme}&dir=${dir}`)
            .waitForVisible(locator, 15000)
            .assertView(`${theme}-login-${name}-${dir}`, locator);
        });
      });
    });
  });
});

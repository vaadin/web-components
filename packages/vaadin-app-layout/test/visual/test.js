describe('vaadin-app-layout', () => {
  const locator = 'vaadin-app-layout[data-ready]';

  ['lumo', 'lumo-dark', 'material'].forEach((theme) => {
    it(`${theme}-drawer`, function () {
      return this.browser
        .url(`drawer.html?theme=${theme}`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-drawer-ltr`, locator)
        .execute(() => {
          document.documentElement.setAttribute('dir', 'rtl');
        })
        .assertView(`${theme}-drawer-rtl`, locator);
    });

    it(`${theme}-primary-drawer`, function () {
      return this.browser
        .url(`primary-drawer.html?theme=${theme}`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-primary-drawer-ltr`, locator)
        .execute(() => {
          document.documentElement.setAttribute('dir', 'rtl');
        })
        .assertView(`${theme}-primary-drawer-rtl`, locator);
    });

    it(`${theme}-tabs`, function () {
      return this.browser
        .url(`tabs.html?theme=${theme}`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-tabs`, locator);
    });
  });
});

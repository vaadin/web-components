describe('vaadin-avatar', () => {
  const locator = '#tests[data-ready]';

  ['lumo', 'material'].forEach((theme) => {
    it(`${theme}-avatar`, function () {
      return this.browser
        .url(`default.html?theme=${theme}`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-avatar`, locator);
    });

    it(`${theme}-colors`, function () {
      return this.browser
        .url(`colors.html?theme=${theme}`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-colors`, locator);
    });

    it(`${theme}-group`, function () {
      return this.browser
        .url(`group.html?theme=${theme}`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-group-ltr`, locator)
        .execute(() => {
          window.document.documentElement.setAttribute('dir', 'rtl');
        })
        .assertView(`${theme}-group-rtl`, locator);
    });

    it(`${theme}-scaled`, function () {
      return this.browser
        .url(`scaled.html?theme=${theme}`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-scaled`, locator);
    });

    it(`${theme}-group-overlay`, function () {
      return this.browser
        .url(`group-overlay.html?theme=${theme}`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-overlay-default`, locator)
        .execute(() => {
          window.openOverlay();
        })
        .assertView(`${theme}-overlay-opened-ltr`, locator)
        .execute(() => {
          window.document.documentElement.setAttribute('dir', 'rtl');
        })
        .assertView(`${theme}-overlay-opened-rtl`, locator);
    });
  });

  ['lumo', 'lumo-dark', 'material'].forEach((theme) => {
    it(`${theme}-group-colors`, function () {
      return this.browser
        .url(`group-colors.html?theme=${theme}`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-group-colors`, locator);
    });
  });

  ['light', 'dark'].forEach((variant) => {
    it(`lumo-${variant}-avatar`, function () {
      return this.browser
        .url(`lumo.html?variant=${variant}`)
        .waitForVisible(locator, 15000)
        .assertView(`lumo-${variant}-avatar`, locator);
    });

    it(`lumo-${variant}-group`, function () {
      return this.browser
        .url(`lumo-group.html?variant=${variant}`)
        .waitForVisible(locator, 15000)
        .assertView(`lumo-${variant}-group`, locator);
    });
  });
});

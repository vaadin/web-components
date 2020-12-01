describe('vaadin-text-field', () => {
  const locator = '#tests[data-ready]';

  ['lumo', 'material'].forEach((theme) => {
    it(`text-field-1-${theme}`, function () {
      return this.browser
        .url(`vaadin-text-field/text-field-1.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-text-field-1`, locator);
    });

    it(`text-field-2-${theme}`, function () {
      return this.browser
        .url(`vaadin-text-field/text-field-2.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-text-field-2`, locator);
    });

    it(`text-field-3-${theme}`, function () {
      return this.browser
        .url(`vaadin-text-field/text-field-3.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-text-field-3`, locator);
    });

    it(`text-field-clear-button-${theme}`, function () {
      return this.browser
        .url(`vaadin-text-field/text-field-clear-button.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-text-field-clear-button`, locator);
    });

    it(`text-field-rtl-${theme}`, function () {
      return this.browser
        .url(`vaadin-text-field/text-field-rtl.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-text-field-rtl`, locator);
    });

    it(`text-field-slotted-${theme}`, function () {
      return this.browser
        .url(`vaadin-text-field/text-field-slotted.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-text-field-slotted`, locator);
    });

    it(`text-field-styling-${theme}`, function () {
      return this.browser
        .url(`vaadin-text-field/text-field-styling.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-text-field-styling`, locator);
    });

    it(`text-area-1-${theme}`, function () {
      return this.browser
        .url(`vaadin-text-area/text-area-1.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-text-area-1`, locator);
    });

    it(`text-area-2-${theme}`, function () {
      return this.browser
        .url(`vaadin-text-area/text-area-2.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-text-area-2`, locator);
    });

    it(`text-area-3-${theme}`, function () {
      return this.browser
        .url(`vaadin-text-area/text-area-3.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-text-area-3`, locator);
    });

    it(`text-area-clear-button-${theme}`, function () {
      return this.browser
        .url(`vaadin-text-area/text-area-clear-button.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-text-area-clear-button`, locator);
    });

    it(`text-area-rtl-${theme}`, function () {
      return this.browser
        .url(`vaadin-text-area/text-area-rtl.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-text-area-rtl`, locator);
    });

    it(`text-area-slotted-${theme}`, function () {
      return this.browser
        .url(`vaadin-text-area/text-area-slotted.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-text-area-slotted`, locator);
    });

    it(`text-area-styling-${theme}`, function () {
      return this.browser
        .url(`vaadin-text-area/text-area-styling.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-text-area-styling`, locator);
    });

    it(`password-field-${theme}`, function () {
      return this.browser
        .url(`vaadin-password-field/password-field.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-password-field`, locator);
    });

    it(`password-field-clear-button-${theme}`, function () {
      return this.browser
        .url(`vaadin-password-field/password-field-clear-button.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-password-field-clear-button`, locator);
    });

    it(`password-field-rtl-${theme}`, function () {
      return this.browser
        .url(`vaadin-password-field/password-field-rtl.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-password-field-rtl`, locator);
    });

    it(`password-field-slotted-${theme}`, function () {
      return this.browser
        .url(`vaadin-password-field/password-field-slotted.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-password-field-slotted`, locator);
    });

    it(`number-field-${theme}`, function () {
      return this.browser
        .url(`vaadin-number-field/number-field.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-number-field`, locator);
    });

    it(`number-field-rtl-${theme}`, function () {
      return this.browser
        .url(`vaadin-number-field/number-field-rtl.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-number-field-rtl`, locator);
    });
  });
});

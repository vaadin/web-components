describe('vaadin-checkbox', () => {
  const locator = '#tests[data-ready]';

  ['lumo', 'material'].forEach((theme) => {
    ['ltr', 'rtl'].forEach((dir) => {
      it(`checkbox-${theme}-${dir}`, function () {
        return this.browser
          .url(`checkbox.html?theme=${theme}&dir=${dir}`)
          .waitForVisible(locator, 10000)
          .assertView(`${theme}-checkbox-${dir}`, locator);
      });

      it(`checkbox-group-${theme}-${dir}`, function () {
        return this.browser
          .url(`wrapping.html?theme=${theme}&dir=${dir}`)
          .waitForVisible(locator, 10000)
          .assertView(`${theme}-checkbox-group-wrapping-${dir}`, locator);
      });
    });

    it(`checkbox-group-${theme}`, function () {
      return this.browser
        .url(`group.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-checkbox-group-default`, locator)
        .execute(() => {
          const group = window.document.querySelector('vaadin-checkbox-group');
          group.setAttribute('theme', 'vertical');
        })
        .assertView(`${theme}-checkbox-group-vertical`, locator)
        .execute(() => {
          const group = window.document.querySelector('vaadin-checkbox-group');
          group.removeAttribute('theme');
          group.disabled = true;
        })
        .assertView(`${theme}-checkbox-group-disabled`, locator)
        .execute(() => {
          const group = window.document.querySelector('vaadin-checkbox-group');
          group.disabled = false;
          group.setAttribute('focused', '');
          group.firstElementChild.setAttribute('focus-ring', '');
        })
        .assertView(`${theme}-checkbox-group-focused`, locator)
        .execute(() => {
          const group = window.document.querySelector('vaadin-checkbox-group');
          group.removeAttribute('focused');
          group.firstElementChild.removeAttribute('focus-ring');
          group.helperText = 'Helper text';
        })
        .assertView(`${theme}-checkbox-group-helper`, locator)
        .execute(() => {
          const group = window.document.querySelector('vaadin-checkbox-group');
          group.helperText = null;
          group.required = true;
          group.errorMessage = 'Please choose a number';
          group.validate();
        })
        .assertView(`${theme}-checkbox-group-invalid`, locator)
        .execute(() => {
          window.document.documentElement.setAttribute('dir', 'rtl');
        })
        .assertView(`${theme}-checkbox-group-invalid-rtl`, locator)
        .execute(() => {
          window.document.documentElement.removeAttribute('dir');
          const group = window.document.querySelector('vaadin-checkbox-group');
          group.helperText = 'Helper text';
        })
        .assertView(`${theme}-checkbox-group-invalid-helper`, locator);
    });

    if (theme === 'lumo') {
      it(`checkbox-group-theme-${theme}`, function () {
        return this.browser
          .url(`group.html?theme=${theme}`)
          .waitForVisible(locator, 10000)
          .execute(() => {
            const group = window.document.querySelector('vaadin-checkbox-group');
            group.helperText = 'Helper text';
            group.setAttribute('theme', 'helper-above-field');
          })
          .assertView(`${theme}-checkbox-group-helper-above`, locator);
      });
    }
  });
});

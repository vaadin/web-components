import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/material/vaadin-email-field.js';

describe('email-field', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-email-field></vaadin-email-field>', div);
  });

  it('placeholder', async () => {
    element.placeholder = 'Placeholder';
    await visualDiff(div, `${import.meta.url}_placeholder`);
  });

  it('value', async () => {
    element.value = 'serguey.kulikov@gmail.com';
    await visualDiff(div, `${import.meta.url}_value`);
  });

  describe('RTL', () => {
    before(() => {
      document.documentElement.setAttribute('dir', 'rtl');
    });

    after(() => {
      document.documentElement.removeAttribute('dir');
    });

    it('RTL value', async () => {
      element.value = 'serguey.kulikov@gmail.com';
      await visualDiff(div, `${import.meta.url}_rtl-value`);
    });

    it('RTL placeholder', async () => {
      element.placeholder = 'Placeholder';
      await visualDiff(div, `${import.meta.url}_rtl-placeholder`);
    });
  });
});

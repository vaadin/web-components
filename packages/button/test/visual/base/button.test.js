import { resetMouse, sendKeys, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, mousedown } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/icon/src/vaadin-icon.js';
import '@vaadin/icons/vaadin-iconset.js';
import '../../../src/vaadin-button.js';

describe('button', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-button>Button</vaadin-button>', div);
  });

  afterEach(async () => {
    await resetMouse();
  });

  ['basic', 'primary', 'tertiary'].forEach((variant) => {
    describe(variant, () => {
      beforeEach(() => {
        if (variant !== 'basic') {
          element.setAttribute('theme', variant);
        }
      });

      it('default', async () => {
        await visualDiff(div, `${variant}-default`);
      });

      it('active', async () => {
        mousedown(element);
        await visualDiff(div, `${variant}-active`);
      });

      it('hover', async () => {
        await sendMouseToElement({ type: 'move', element });
        await visualDiff(div, `${variant}-hover`);
      });

      it('focus-ring', async () => {
        await sendKeys({ press: 'Tab' });
        await visualDiff(div, `${variant}-focus-ring`);
      });

      it('disabled', async () => {
        element.disabled = true;
        await visualDiff(div, `${variant}-disabled`);
      });
    });
  });

  describe('icon', () => {
    const PREFIX_ICON = '<vaadin-icon icon="vaadin:reply" slot="prefix"></vaadin-icon>';
    const SUFFIX_ICON = '<vaadin-icon icon="vaadin:reply" slot="suffix"></vaadin-icon>';

    it('before text', async () => {
      element.insertAdjacentHTML('afterbegin', PREFIX_ICON);
      await visualDiff(div, 'icon-before-text');
    });

    it('after text', async () => {
      element.insertAdjacentHTML('beforeend', SUFFIX_ICON);
      await visualDiff(div, 'icon-after-text');
    });

    it('without text', async () => {
      element.textContent = '';
      element.insertAdjacentHTML('afterbegin', PREFIX_ICON);
      await visualDiff(div, 'icon-without-text');
    });
  });
});

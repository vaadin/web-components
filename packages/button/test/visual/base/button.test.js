import { resetMouse, sendKeys, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, mousedown } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
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
});

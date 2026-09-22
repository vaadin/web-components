import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../not-animated-styles.css';
import '../../../src/vaadin-radio-button.js';

describe('radio-button', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-radio-button label="Radio button"></vaadin-radio-button>', div);
  });

  describe('states', () => {
    it('basic', async () => {
      await visualDiff(div, 'state-basic');
    });

    it('checked', async () => {
      element.checked = true;
      await visualDiff(div, 'state-checked');
    });

    it('empty', async () => {
      element.label = null;
      await visualDiff(div, 'state-empty');
    });

    it('multi-line', async () => {
      element.label = 'Long label that wraps into multiple lines';
      element.style.maxWidth = '150px';
      await visualDiff(div, 'state-multi-line');
    });

    describe('disabled', () => {
      beforeEach(() => {
        element.disabled = true;
      });

      it('basic', async () => {
        await visualDiff(div, 'state-disabled');
      });

      it('checked', async () => {
        element.checked = true;
        await visualDiff(div, 'state-disabled-checked');
      });
    });

    describe('focus', () => {
      it('keyboard focus', async () => {
        await sendKeys({ press: 'Tab' });
        await visualDiff(div, 'state-focus');
      });

      it('checked focus', async () => {
        element.checked = true;
        await sendKeys({ press: 'Tab' });
        await visualDiff(div, 'state-focus-checked');
      });
    });
  });

  describe('form layout labels aside', () => {
    beforeEach(() => {
      element.setAttribute('data-form-layout-has-labels-aside', '');
      element.style.setProperty('--vaadin-form-layout-label-width', '8em');
      element.style.setProperty('--vaadin-form-layout-label-spacing', '1em');
    });

    it('default', async () => {
      await visualDiff(div, 'form-layout-labels-aside');
    });
  });
});

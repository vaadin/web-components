import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../common.js';
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
});

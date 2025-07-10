import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../src/vaadin-message-input.js';

describe('message-input', () => {
  let div, element;

  ['ltr', 'rtl'].forEach((dir) => {
    describe(dir, () => {
      before(() => {
        document.documentElement.setAttribute('dir', dir);
      });

      after(() => {
        document.documentElement.removeAttribute('dir');
      });

      describe('basic', () => {
        beforeEach(() => {
          div = document.createElement('div');
          div.style.padding = '10px';
          element = fixtureSync('<vaadin-message-input></vaadin-message-input>', div);
        });

        it('basic', async () => {
          await visualDiff(div, `${dir}-basic`);
        });

        it('value', async () => {
          element.value = 'Hello';
          await visualDiff(div, `${dir}-value`);
        });

        it('disabled', async () => {
          element.disabled = true;
          await visualDiff(div, `${dir}-disabled`);
        });

        it('focused', async () => {
          await sendKeys({ press: 'Tab' });
          await visualDiff(div, `${dir}-focused`);
        });

        it('button focused', async () => {
          await sendKeys({ press: 'Tab' });
          await sendKeys({ press: 'Tab' });
          await visualDiff(div, `${dir}-button-focused`);
        });

        it('icon-button variant', async () => {
          element.setAttribute('theme', 'icon-button');
          await visualDiff(div, `${dir}-icon-button`);
        });
      });
    });
  });
});

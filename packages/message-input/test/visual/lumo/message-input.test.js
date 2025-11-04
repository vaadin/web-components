import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/message-input.css';
import '../../../vaadin-message-input.js';

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
      });
    });
  });
});

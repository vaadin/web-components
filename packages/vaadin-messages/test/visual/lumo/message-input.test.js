import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/lumo/vaadin-message-input.js';

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
          await visualDiff(div, `${import.meta.url}_${dir}-basic`);
        });

        it('value', async () => {
          element.value = 'Hello';
          await visualDiff(div, `${import.meta.url}_${dir}-value`);
        });

        it('disabled', async () => {
          element.disabled = true;
          await visualDiff(div, `${import.meta.url}_${dir}-disabled`);
        });
      });
    });
  });
});

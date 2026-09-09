import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '@vaadin/button';
import '@vaadin/icon';
import '@vaadin/icons';
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

        it('icon-button', async () => {
          element.setAttribute('theme', 'icon-button');
          await visualDiff(div, `${dir}-icon-button`);
        });

        it('custom button', async () => {
          const customButton = document.createElement('vaadin-button');
          customButton.slot = 'button';
          customButton.setAttribute('theme', 'icon primary');
          customButton.innerHTML = '<vaadin-icon icon="vaadin:arrow-up"></vaadin-icon>';
          element.querySelector('[slot="button"]').replaceWith(customButton);
          element.value = 'Hello';
          await visualDiff(div, `${dir}-custom-button`);
        });

        it('slots', async () => {
          element.value = 'Hello';
          element.insertAdjacentHTML(
            'afterbegin',
            `
              <div slot="header">Header</div>
              <span slot="prefix">Prefix</span>
              <div slot="footer">Footer</div>
            `,
          );
          await visualDiff(div, `${dir}-slots`);
        });
      });
    });
  });
});

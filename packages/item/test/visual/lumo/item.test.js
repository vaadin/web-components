import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/item.css';
import '../../../vaadin-item.js';

describe('item', () => {
  let div, element;

  function setIconVisible(container) {
    container.style.setProperty('--_lumo-item-selected-icon-display', 'block');
  }

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    element = fixtureSync('<vaadin-item>Basic item</vaadin-item>', div);
  });

  ['ltr', 'rtl'].forEach((dir) => {
    describe(dir, () => {
      before(() => {
        document.documentElement.setAttribute('dir', dir);
      });

      after(() => {
        document.documentElement.removeAttribute('dir');
      });

      it('basic', async () => {
        await visualDiff(div, `${dir}-basic`);
      });

      it('checkmark', async () => {
        setIconVisible(div);
        await visualDiff(div, `${dir}-checkmark`);
      });

      it('selected', async () => {
        setIconVisible(div);
        element.setAttribute('selected', '');
        await visualDiff(div, `${dir}-selected`);
      });

      it('multi line', async () => {
        const second = document.createElement('div');
        second.textContent = 'Second line';
        element.appendChild(second);
        await visualDiff(div, `${dir}-multi-line`);
      });
    });
  });
});

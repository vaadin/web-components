import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/material/vaadin-item.js';

describe('item', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.setProperty('--_material-item-selected-icon-display', 'block');
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

      it('focusable', async () => {
        element.setAttribute('tabindex', '0');
        await visualDiff(div, `${dir}-focusable`);
      });

      it('selected', async () => {
        element.setAttribute('tabindex', '0');
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

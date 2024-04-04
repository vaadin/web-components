import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/icon/vaadin-icon.js';
import '@vaadin/vaadin-lumo-styles/vaadin-iconset.js';
import '../../../theme/material/vaadin-input-container.js';

describe('input-container', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-input-container><input></vaadin-input-container>', div);
  });

  ['empty', 'non-empty'].forEach((initialState) => {
    describe(initialState, () => {
      beforeEach(() => {
        if (initialState === 'non-empty') {
          element.querySelector('input').value = 'Some text';
        }
      });

      it('basic', async () => {
        await visualDiff(div, `${initialState}-basic`);
      });

      it('disabled', async () => {
        element.disabled = true;
        await visualDiff(div, `${initialState}-disabled`);
      });

      it('invalid', async () => {
        element.invalid = true;
        await visualDiff(div, `${initialState}-invalid`);
      });
    });
  });

  it('prefix icon', async () => {
    const icon = document.createElement('vaadin-icon');
    icon.setAttribute('slot', 'prefix');
    icon.icon = 'lumo:user';
    element.appendChild(icon);
    await visualDiff(div, 'prefix-icon');
  });

  it('suffix icon', async () => {
    const icon = document.createElement('vaadin-icon');
    icon.setAttribute('slot', 'suffix');
    icon.icon = 'lumo:user';
    element.appendChild(icon);
    await visualDiff(div, 'suffix-icon');
  });
});

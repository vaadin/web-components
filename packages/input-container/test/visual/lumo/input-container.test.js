import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/props.css';
import '@vaadin/vaadin-lumo-styles/global.css';
import '@vaadin/vaadin-lumo-styles/components/input-container.css';
import '@vaadin/icon';
import '@vaadin/vaadin-lumo-styles/vaadin-iconset.js';
import '../../../vaadin-input-container.js';

describe('input-container', () => {
  let div, element, input;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.width = 'fit-content';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-input-container><input></vaadin-input-container>', div);
    input = element.querySelector('input');
  });

  ['empty', 'non-empty'].forEach((initialState) => {
    describe(initialState, () => {
      beforeEach(() => {
        if (initialState === 'non-empty') {
          input.value = 'Some text';
        }
      });

      it('basic', async () => {
        await visualDiff(div, `${initialState}-basic`);
      });

      it('disabled', async () => {
        element.disabled = true;
        await visualDiff(div, `${initialState}-disabled`);
      });

      it('styled disabled', async () => {
        div.style.setProperty('--vaadin-input-field-disabled-background', 'black');
        div.style.setProperty('--vaadin-input-field-disabled-value-color', 'white');

        element.disabled = true;
        await visualDiff(div, `${initialState}-styled-disabled`);
      });

      it('readonly', async () => {
        element.readonly = true;
        await visualDiff(div, `${initialState}-readonly`);
      });

      it('invalid', async () => {
        element.invalid = true;
        await visualDiff(div, `${initialState}-invalid`);
      });

      it('readonly invalid', async () => {
        element.readonly = true;
        element.invalid = true;
        await visualDiff(div, `${initialState}-readonly-invalid`);
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

  it('custom font', async () => {
    div.style.color = 'red';
    div.style.fontSize = '40px';
    div.style.fontFamily = 'monospace';
    input.value = 'Some text';
    await visualDiff(div, 'custom-font');
  });

  ['ltr', 'rtl'].forEach((dir) => {
    describe(dir, () => {
      before(() => {
        document.documentElement.setAttribute('dir', dir);
      });

      after(() => {
        document.documentElement.removeAttribute('dir');
      });

      it('align-left', async () => {
        input.value = 'Some text';
        element.setAttribute('theme', 'align-left');
        await visualDiff(div, `${dir}-align-left`);
      });

      it('align-center', async () => {
        input.value = 'Some text';
        element.setAttribute('theme', 'align-center');
        await visualDiff(div, `${dir}-align-center`);
      });

      it('align-right', async () => {
        input.value = 'Some text';
        element.setAttribute('theme', 'align-right');
        await visualDiff(div, `${dir}-align-right`);
      });
    });
  });
});

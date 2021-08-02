import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-icon/vaadin-icon.js';
import '@vaadin/vaadin-lumo-styles/vaadin-iconset.js';
import '../../../theme/lumo/vaadin-input-container.js';

describe('input-container', () => {
  let div, element, input;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-input-container><input></vaadin-input-container>', div);
    input = element.querySelector('input');
  });

  it('basic', async () => {
    await visualDiff(div, `${import.meta.url}_basic`);
  });

  it('disabled', async () => {
    element.disabled = true;
    await visualDiff(div, `${import.meta.url}_disabled`);
  });

  it('readonly', async () => {
    element.readonly = true;
    await visualDiff(div, `${import.meta.url}_readonly`);
  });

  it('invalid', async () => {
    element.invalid = true;
    await visualDiff(div, `${import.meta.url}_invalid`);
  });

  it('prefix icon', async () => {
    const icon = document.createElement('vaadin-icon');
    icon.setAttribute('slot', 'prefix');
    icon.icon = 'lumo:user';
    element.appendChild(icon);
    await visualDiff(div, `${import.meta.url}_prefix-icon`);
  });

  it('suffix icon', async () => {
    const icon = document.createElement('vaadin-icon');
    icon.setAttribute('slot', 'suffix');
    icon.icon = 'lumo:user';
    element.appendChild(icon);
    await visualDiff(div, `${import.meta.url}_suffix-icon`);
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
        await visualDiff(div, `${import.meta.url}_${dir}-align-left`);
      });

      it('align-center', async () => {
        input.value = 'Some text';
        element.setAttribute('theme', 'align-center');
        await visualDiff(div, `${import.meta.url}_${dir}-align-center`);
      });

      it('align-right', async () => {
        input.value = 'Some text';
        element.setAttribute('theme', 'align-right');
        await visualDiff(div, `${import.meta.url}_${dir}-align-right`);
      });
    });
  });
});

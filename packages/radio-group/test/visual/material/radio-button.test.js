import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/material/vaadin-radio-button.js';

describe('radio-button', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-radio-button>Radio button</vaadin-radio-button>', div);
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });

  it('focus-ring', async () => {
    element.setAttribute('focus-ring', '');
    await visualDiff(div, 'focus-ring');
  });

  it('disabled', async () => {
    element.disabled = true;
    await visualDiff(div, 'disabled');
  });

  it('checked', async () => {
    element.checked = true;
    await visualDiff(div, 'checked');
  });

  it('disabled checked', async () => {
    element.disabled = true;
    element.checked = true;
    await visualDiff(div, 'disabled-checked');
  });

  it('empty', async () => {
    element.textContent = '';
    await visualDiff(div, 'empty');
  });

  it('RTL', async () => {
    document.documentElement.setAttribute('dir', 'rtl');
    await visualDiff(div, 'rtl');
  });
});

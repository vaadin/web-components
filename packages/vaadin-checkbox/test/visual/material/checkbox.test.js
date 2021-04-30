import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/material/vaadin-checkbox.js';

describe('checkbox', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-checkbox>Checkbox</vaadin-checkbox>', div);
  });

  it('basic', async () => {
    await visualDiff(div, `${import.meta.url}_basic`);
  });

  it('focus-ring', async () => {
    element.setAttribute('focus-ring', '');
    await visualDiff(div, `${import.meta.url}_focus-ring`);
  });

  it('disabled', async () => {
    element.disabled = true;
    await visualDiff(div, `${import.meta.url}_disabled`);
  });

  it('checked', async () => {
    element.checked = true;
    await visualDiff(div, `${import.meta.url}_checked`);
  });

  it('indeterminate', async () => {
    element.indeterminate = true;
    await visualDiff(div, `${import.meta.url}_indeterminate`);
  });

  it('disabled checked', async () => {
    element.disabled = true;
    element.checked = true;
    await visualDiff(div, `${import.meta.url}_disabled-checked`);
  });

  it('disabled indeterminate', async () => {
    element.disabled = true;
    element.indeterminate = true;
    await visualDiff(div, `${import.meta.url}_disabled-indeterminate`);
  });

  it('empty', async () => {
    element.textContent = '';
    await visualDiff(div, `${import.meta.url}_empty`);
  });

  it('RTL', async () => {
    document.documentElement.setAttribute('dir', 'rtl');
    await visualDiff(div, `${import.meta.url}_rtl`);
  });
});

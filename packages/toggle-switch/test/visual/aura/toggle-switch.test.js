import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../common.js';
import '../../../vaadin-toggle-switch.js';

describe('toggle-switch', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-toggle-switch label="Toggle"></vaadin-toggle-switch>', div);
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });

  it('checked', async () => {
    element.checked = true;
    await visualDiff(div, 'checked');
  });

  it('disabled', async () => {
    element.disabled = true;
    await visualDiff(div, 'disabled');
  });

  it('disabled checked', async () => {
    element.disabled = true;
    element.checked = true;
    await visualDiff(div, 'disabled-checked');
  });

  it('readonly', async () => {
    element.readonly = true;
    await visualDiff(div, 'readonly');
  });

  it('readonly checked', async () => {
    element.readonly = true;
    element.checked = true;
    await visualDiff(div, 'readonly-checked');
  });
});

import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../common.js';
import '../../../src/vaadin-login-overlay.js';

describe('login-overlay', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.height = '100%';
    element = fixtureSync('<vaadin-login-overlay></vaadin-login-overlay>', div);
  });

  it('basic', async () => {
    element.opened = true;
    await visualDiff(div, 'basic');
  });

  it('error', async () => {
    element.error = true;
    element.opened = true;
    await visualDiff(div, 'error');
  });

  it('additional field', async () => {
    const field = document.createElement('vaadin-text-field');
    field.setAttribute('slot', 'custom-form-area');
    field.label = 'One-time code';
    element.appendChild(field);
    element.opened = true;
    await visualDiff(div, 'additional-field');
  });

  it('footer', async () => {
    const footer = document.createElement('div');
    footer.setAttribute('slot', 'footer');
    footer.style.textAlign = 'center';
    footer.textContent = 'Never tell your password to anyone';
    element.appendChild(footer);
    element.opened = true;
    await visualDiff(div, 'footer');
  });
});

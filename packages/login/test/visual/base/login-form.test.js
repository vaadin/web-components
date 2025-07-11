import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../common.js';
import '../../../src/vaadin-login-form.js';

describe('login-form', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-login-form></vaadin-login-form>', div);
  });

  it('basic', async () => {
    element.opened = true;
    await visualDiff(div, 'basic');
  });

  it('error', async () => {
    element.error = true;
    await visualDiff(div, 'error');
  });
});

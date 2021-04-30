import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/material/vaadin-login-overlay.js';

describe('login-overlay', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.height = '100%';
    element = fixtureSync('<vaadin-login-overlay opened></vaadin-login-overlay>', div);
  });

  it('basic', async () => {
    await visualDiff(div, `${import.meta.url}_basic`);
  });

  it('error', async () => {
    element.error = true;
    await visualDiff(div, `${import.meta.url}_error`);
  });
});

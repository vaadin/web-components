import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/lumo/vaadin-login-overlay.js';

describe('login-overlay', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.height = '100%';
    element = fixtureSync('<vaadin-login-overlay opened></vaadin-login-overlay>', div);
  });

  it('basic', async () => {
    await visualDiff(div, 'login-overlay:basic');
  });

  it('error', async () => {
    element.error = true;
    await visualDiff(div, 'login-overlay:error');
  });
});

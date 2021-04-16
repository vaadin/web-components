import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '../../../theme/lumo/vaadin-login-overlay.js';

/* hide caret */
registerStyles(
  'vaadin-text-field',
  css`
    ::slotted(input) {
      font-size: 0 !important;
    }
  `
);

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

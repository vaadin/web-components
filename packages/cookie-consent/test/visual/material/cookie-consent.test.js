import { executeServerCommand } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/material/vaadin-cookie-consent.js';

describe('cookie-consent', () => {
  let element;

  before(async () => {
    await executeServerCommand('set-window-height', { height: 610 });
  });

  beforeEach(() => {
    element = fixtureSync('<vaadin-cookie-consent></vaadin-cookie-consent>');
  });

  it('basic', async () => {
    element._show();
    await visualDiff(document.body, 'basic');
  });
});

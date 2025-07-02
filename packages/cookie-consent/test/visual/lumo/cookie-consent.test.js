import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../vaadin-cookie-consent.js';

describe('cookie-consent', () => {
  let element;

  beforeEach(() => {
    element = fixtureSync('<vaadin-cookie-consent></vaadin-cookie-consent>');
  });

  it('basic', async () => {
    element._show();
    await visualDiff(document.body, 'basic');
  });
});

import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-login-form.js';

describe('vaadin-login-form', () => {
  let form;

  // Ignore generated attributes to prevent failures
  // when running snapshot tests in a different order
  const SNAPSHOT_CONFIG = {
    ignoreAttributes: ['id', 'aria-describedby', 'aria-labelledby', 'for']
  };

  beforeEach(() => {
    form = fixtureSync('<vaadin-login-form></vaadin-login-form>');
  });

  it('default', async () => {
    await expect(form).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
  });
});

import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-login-overlay.js';

describe('vaadin-login-overlay', () => {
  let overlay;

  beforeEach(() => {
    overlay = fixtureSync('<vaadin-login-overlay></vaadin-login-overlay>');
  });

  it('default', async () => {
    await expect(overlay).shadowDom.to.equalSnapshot();
  });

  it('theme', async () => {
    overlay.setAttribute('theme', 'small');
    await expect(overlay).shadowDom.to.equalSnapshot();
  });
});

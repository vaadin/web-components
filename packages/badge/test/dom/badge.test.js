import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '../../src/vaadin-badge.js';

describe('vaadin-badge', () => {
  let badge;

  beforeEach(() => {
    badge = fixtureSync('<vaadin-badge></vaadin-badge>');
  });

  it('default', async () => {
    await expect(badge).shadowDom.to.equalSnapshot();
  });

  it('with text', async () => {
    badge.textContent = 'New';
    await nextUpdate(badge);
    await expect(badge).shadowDom.to.equalSnapshot();
  });

  it('empty', async () => {
    await expect(badge).shadowDom.to.equalSnapshot();
  });
});

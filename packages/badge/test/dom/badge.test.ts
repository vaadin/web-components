import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '../../src/vaadin-badge.js';
import type { Badge } from '../../src/vaadin-badge.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.badgeComponent = true;

describe('vaadin-badge', () => {
  let badge: Badge;

  beforeEach(async () => {
    badge = fixtureSync('<vaadin-badge></vaadin-badge>');
    await nextUpdate(badge);
  });

  describe('host', () => {
    it('default', async () => {
      await expect(badge).dom.to.equalSnapshot();
    });

    it('content', async () => {
      badge.textContent = 'Content';
      await nextUpdate(badge);
      await expect(badge).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(badge).shadowDom.to.equalSnapshot();
    });
  });
});

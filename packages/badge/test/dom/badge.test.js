import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../../vaadin-badge.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

((window.Vaadin ||= {}).featureFlags ||= {}).badgeComponent = true;

describe('vaadin-badge', () => {
  let badge;

  beforeEach(async () => {
    resetUniqueId();
    badge = fixtureSync(`
      <vaadin-badge>Hello</vaadin-badge>
    `);

    await nextFrame();
  });

  describe('host', () => {
    it('default', async () => {
      await expect(badge).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(badge).shadowDom.to.equalSnapshot();
    });
  });
});

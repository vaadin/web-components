import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../vaadin-details.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

describe('vaadin-details', () => {
  let details;

  beforeEach(() => {
    resetUniqueId();
    details = fixtureSync(`
      <vaadin-details>
        <vaadin-details-summary slot="summary">Summary</vaadin-details-summary>
        <div>Content</div>
      </vaadin-details>
    `);
  });

  describe('host', () => {
    it('default', async () => {
      await expect(details).dom.to.equalSnapshot();
    });

    it('opened', async () => {
      details.opened = true;
      await expect(details).dom.to.equalSnapshot();
    });

    it('disabled', async () => {
      details.disabled = true;
      await expect(details).dom.to.equalSnapshot();
    });

    it('theme', async () => {
      details.setAttribute('theme', 'filled');
      await expect(details).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(details).shadowDom.to.equalSnapshot();
    });

    it('opened', async () => {
      details.opened = true;
      await expect(details).shadowDom.to.equalSnapshot();
    });
  });
});

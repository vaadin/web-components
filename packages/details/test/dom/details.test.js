import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../vaadin-details.js';

describe('vaadin-crud', () => {
  let details;

  beforeEach(() => {
    details = fixtureSync(`
      <vaadin-details>
        <vaadin-details-heading slot="summary">Summary</vaadin-details-heading>
        <div>
          <input>
        </div>
      </vaadin-details>
    `);
  });

  describe('host', () => {
    it('default', async () => {
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

import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../vaadin-master-detail-layout.js';
import './helpers/master-content.js';
import './helpers/detail-content.js';

describe('View transitions', () => {
  let layout;

  beforeEach(async () => {
    layout = fixtureSync(`
      <vaadin-master-detail-layout>
        <master-content></master-content>
      </vaadin-master-detail-layout>
    `);
    await nextRender();
  });

  describe('setDetails', () => {
    it('should update details slot', async () => {
      // Add details
      const detail = document.createElement('detail-content');
      await layout.setDetail(detail);

      const result = layout.querySelector('[slot="detail"]');
      expect(result).to.equal(detail);

      // Replace details
      const newDetail = document.createElement('detail-content');
      await layout.setDetail(newDetail);

      const newResult = layout.querySelector('[slot="detail"]');
      expect(newResult).to.equal(newDetail);
      expect(result.isConnected).to.be.false;

      // Remove details
      await layout.setDetail(null);

      const emptyResult = layout.querySelector('[slot="detail"]');
      expect(emptyResult).to.be.null;
      expect(newResult.isConnected).to.be.false;
    });
  });
});

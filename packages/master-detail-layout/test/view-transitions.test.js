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

  ['supported', 'unsupported'].forEach((support) => {
    describe(support, () => {
      if (support === 'unsupported') {
        let originalStartViewTransition;
        before(() => {
          originalStartViewTransition = document.startViewTransition;
          document.startViewTransition = undefined;
        });

        after(() => {
          document.startViewTransition = originalStartViewTransition;
        });
      }

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

  describe('transition types', () => {
    let originalStartViewTransition;
    let resolveTransition;

    before(() => {
      originalStartViewTransition = document.startViewTransition;
      document.startViewTransition = (callback) => {
        callback();
        return {
          finished: new Promise((resolve) => {
            resolveTransition = resolve;
          }),
        };
      };
    });

    after(() => {
      document.startViewTransition = originalStartViewTransition;
    });

    it('should use the correct transition type', async () => {
      // "add" transition
      const addDetail = document.createElement('detail-content');
      const addPromise = layout.setDetail(addDetail);

      expect(layout.getAttribute('transition')).to.equal('add');

      resolveTransition();
      await addPromise;
      expect(layout.hasAttribute('transition')).to.be.false;

      // "replace" transition
      const replaceDetail = document.createElement('detail-content');
      const replacePromise = layout.setDetail(replaceDetail);

      expect(layout.getAttribute('transition')).to.equal('replace');

      resolveTransition();
      await replacePromise;
      expect(layout.hasAttribute('transition')).to.be.false;

      // "remove" transition
      const removePromise = layout.setDetail(null);

      expect(layout.getAttribute('transition')).to.equal('remove');

      resolveTransition();
      await removePromise;
      expect(layout.hasAttribute('transition')).to.be.false;
    });
  });
});

import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-master-detail-layout.js';
import './helpers/master-content.js';
import './helpers/detail-content.js';

window.Vaadin ||= {};
window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.masterDetailLayoutComponent = true;

describe('View transitions', () => {
  const originalStartViewTransition = document.startViewTransition;

  let layout;
  let startViewTransitionSpy;

  beforeEach(() => {
    startViewTransitionSpy = sinon.spy();
    document.startViewTransition = (callback) => {
      startViewTransitionSpy();
      return {
        // Timeout to simulate the browser not calling the update callback immediately
        finished: aTimeout(0).then(callback),
      };
    };
  });

  after(() => {
    document.startViewTransition = originalStartViewTransition;
  });

  beforeEach(async () => {
    layout = fixtureSync(`
      <vaadin-master-detail-layout>
        <master-content></master-content>
      </vaadin-master-detail-layout>
    `);
    await nextRender();
  });

  describe('setDetail', () => {
    ['supported', 'unsupported'].forEach((support) => {
      it(`should update details slot if view transitions are ${support}`, async () => {
        if (support === 'unsupported') {
          document.startViewTransition = null;
        }

        // Add details
        const detail = document.createElement('detail-content');
        await layout._setDetail(detail);
        await aTimeout(0);

        const result = layout.querySelector('[slot="detail"]');
        expect(result).to.equal(detail);

        // Replace details
        const newDetail = document.createElement('detail-content');
        await layout._setDetail(newDetail);
        await aTimeout(0);

        const newResult = layout.querySelector('[slot="detail"]');
        expect(newResult).to.equal(newDetail);
        expect(result.isConnected).to.be.false;

        // Remove details
        await layout._setDetail(null);
        await aTimeout(0);

        const emptyResult = layout.querySelector('[slot="detail"]');
        expect(emptyResult).to.be.null;
        expect(newResult.isConnected).to.be.false;
      });
    });

    it('should not start a transition if detail element did not change', async () => {
      // Add initial detail
      const detail = document.createElement('detail-content');
      await layout._setDetail(detail);
      await aTimeout(0);

      expect(startViewTransitionSpy.calledOnce).to.be.true;

      // Try to set the same detail again
      startViewTransitionSpy.resetHistory();
      await layout._setDetail(detail);
      await aTimeout(0);

      expect(startViewTransitionSpy.called).to.be.false;

      // Remove the detail
      startViewTransitionSpy.resetHistory();
      await layout._setDetail(null);
      await aTimeout(0);

      expect(startViewTransitionSpy.calledOnce).to.be.true;

      // Remove the detail again
      startViewTransitionSpy.resetHistory();
      await layout._setDetail(null);
      await aTimeout(0);

      expect(startViewTransitionSpy.called).to.be.false;
    });

    it('should use the correct transition type', async () => {
      // "add" transition
      const addDetail = document.createElement('detail-content');
      const addPromise = layout._setDetail(addDetail);

      expect(layout.getAttribute('transition')).to.equal('add');

      await addPromise;
      await aTimeout(0);
      expect(layout.hasAttribute('transition')).to.be.false;

      // "replace" transition
      const replaceDetail = document.createElement('detail-content');
      const replacePromise = layout._setDetail(replaceDetail);

      expect(layout.getAttribute('transition')).to.equal('replace');

      await replacePromise;
      await aTimeout(0);
      expect(layout.hasAttribute('transition')).to.be.false;

      // "remove" transition
      const removePromise = layout._setDetail(null);

      expect(layout.getAttribute('transition')).to.equal('remove');

      await removePromise;
      await aTimeout(0);
      expect(layout.hasAttribute('transition')).to.be.false;
    });

    it('should not start view transition when skipTransition is set to true', async () => {
      const detail = document.createElement('detail-content');
      await layout._setDetail(detail, true);
      await aTimeout(0);

      expect(startViewTransitionSpy.called).to.be.false;
      const result = layout.querySelector('[slot="detail"]');
      expect(result).to.equal(detail);
    });

    it('should not start view transition when noAnimation is set to true', async () => {
      layout.noAnimation = true;

      const detail = document.createElement('detail-content');
      await layout._setDetail(detail);
      await aTimeout(0);

      expect(startViewTransitionSpy.called).to.be.false;
      const result = layout.querySelector('[slot="detail"]');
      expect(result).to.equal(detail);

      layout.noAnimation = false;

      await layout._setDetail(null);
      await aTimeout(0);

      expect(startViewTransitionSpy.calledOnce).to.be.true;
    });
  });

  describe('manual transition', () => {
    let runUpdateCallback;
    let updateCallbackResolved;
    let finishedPromise;
    let detectLayoutModeSpy;

    beforeEach(() => {
      startViewTransitionSpy = sinon.spy();
      detectLayoutModeSpy = sinon.spy(layout, '__detectLayoutMode');
      document.startViewTransition = (callback) => {
        updateCallbackResolved = false;
        startViewTransitionSpy();
        runUpdateCallback = () => {
          callback().then(() => {
            updateCallbackResolved = true;
          });
        };
        finishedPromise = Promise.resolve();

        return {
          finished: finishedPromise,
        };
      };
    });

    afterEach(() => {
      detectLayoutModeSpy.restore();
    });

    it('should allow starting manual transitions', async () => {
      const updateCallback = sinon.spy();

      // Start transition
      const result = layout._startTransition('manual', updateCallback);
      expect(result).to.equal(finishedPromise);
      expect(layout.getAttribute('transition')).to.equal('manual');
      expect(startViewTransitionSpy.calledOnce).to.be.true;
      expect(updateCallback.notCalled).to.be.true;

      // Run update callback
      runUpdateCallback();
      expect(layout.getAttribute('transition')).to.equal('manual');
      expect(startViewTransitionSpy.calledOnce).to.be.true;
      expect(updateCallback.calledOnce).to.be.true;
      expect(updateCallbackResolved).to.be.false;

      // Finish transition
      layout._finishTransition();
      expect(detectLayoutModeSpy.calledOnce).to.be.true;
      await aTimeout(0);
      expect(updateCallbackResolved).to.be.true;
      expect(layout.hasAttribute('transition')).to.be.false;
    });
  });
});

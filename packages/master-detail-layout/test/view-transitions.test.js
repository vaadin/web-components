import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-master-detail-layout.js';
import './helpers/master-content.js';
import './helpers/detail-content.js';

describe('View transitions', () => {
  const originalStartViewTransition = document.startViewTransition;

  let layout;
  let startViewTransitionSpy;

  beforeEach(() => {
    startViewTransitionSpy = sinon.spy();
    document.startViewTransition = (callback) => {
      callback();
      startViewTransitionSpy();
      return {
        finished: Promise.resolve(),
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

  ['supported', 'unsupported'].forEach((support) => {
    it(`should update details slot if view transitions are ${support}`, async () => {
      if (support === 'unsupported') {
        document.startViewTransition = null;
      }

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

  it('should not start a transition if detail element did not change', async () => {
    // Add initial detail
    const detail = document.createElement('detail-content');
    await layout.setDetail(detail);

    expect(startViewTransitionSpy.calledOnce).to.be.true;

    // Try to set the same detail again
    startViewTransitionSpy.resetHistory();
    await layout.setDetail(detail);

    expect(startViewTransitionSpy.called).to.be.false;

    // Remove the detail
    startViewTransitionSpy.resetHistory();
    await layout.setDetail(null);

    expect(startViewTransitionSpy.calledOnce).to.be.true;

    // Remove the detail again
    startViewTransitionSpy.resetHistory();
    await layout.setDetail(null);

    expect(startViewTransitionSpy.called).to.be.false;
  });

  describe('transition types', () => {
    let resolveTransition;

    beforeEach(() => {
      document.startViewTransition = (callback) => {
        callback();
        return {
          finished: new Promise((resolve) => {
            resolveTransition = resolve;
          }),
        };
      };
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

  describe('initial rendering', () => {
    beforeEach(() => {
      layout = document.createElement('vaadin-master-detail-layout');
    });

    afterEach(() => {
      layout.remove();
    });

    it('should not use view transition during initial rendering', async () => {
      document.body.appendChild(layout);

      const detail = document.createElement('detail-content');
      await layout.setDetail(detail);

      expect(startViewTransitionSpy.called).to.be.false;

      // Wait for initial render to complete.
      await layout.updateComplete;

      await layout.setDetail(null);

      expect(startViewTransitionSpy.calledOnce).to.be.true;
    });
  });
});

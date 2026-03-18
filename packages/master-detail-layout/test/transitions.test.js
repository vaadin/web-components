import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-master-detail-layout.js';
import './helpers/master-content.js';
import './helpers/detail-content.js';

window.Vaadin ||= {};
window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.masterDetailLayoutComponent = true;

describe('Transitions', () => {
  let layout;

  beforeEach(async () => {
    layout = fixtureSync(`
      <vaadin-master-detail-layout>
        <master-content></master-content>
      </vaadin-master-detail-layout>
    `);
    await nextRender();
  });

  describe('setDetail', () => {
    it('should update details slot', async () => {
      // Add details
      const detail = document.createElement('detail-content');
      await layout._setDetail(detail);

      const result = layout.querySelector('[slot="detail"]');
      expect(result).to.equal(detail);

      // Replace details
      const newDetail = document.createElement('detail-content');
      await layout._setDetail(newDetail);

      const newResult = layout.querySelector('[slot="detail"]');
      expect(newResult).to.equal(newDetail);
      expect(result.isConnected).to.be.false;

      // Remove details
      await layout._setDetail(null);

      const emptyResult = layout.querySelector('[slot="detail"]');
      expect(emptyResult).to.be.null;
      expect(newResult.isConnected).to.be.false;
    });

    it('should not start a transition if detail element did not change', async () => {
      const spy = sinon.spy(layout, 'setAttribute');

      // Add initial detail
      const detail = document.createElement('detail-content');
      await layout._setDetail(detail);

      expect(spy.calledWith('transition', 'add')).to.be.true;
      spy.resetHistory();

      // Try to set the same detail again
      await layout._setDetail(detail);

      expect(spy.calledWith('transition', sinon.match.any)).to.be.false;

      // Remove the detail
      spy.resetHistory();
      await layout._setDetail(null);

      expect(spy.calledWith('transition', 'remove')).to.be.true;
      spy.resetHistory();

      // Remove the detail again
      await layout._setDetail(null);

      expect(spy.calledWith('transition', sinon.match.any)).to.be.false;
    });

    it('should use the correct transition type', async () => {
      // "add" transition
      const addDetail = document.createElement('detail-content');
      const addPromise = layout._setDetail(addDetail);

      expect(layout.getAttribute('transition')).to.equal('add');

      await addPromise;
      expect(layout.hasAttribute('transition')).to.be.false;

      // "replace" transition
      const replaceDetail = document.createElement('detail-content');
      const replacePromise = layout._setDetail(replaceDetail);

      expect(layout.getAttribute('transition')).to.equal('replace');

      await replacePromise;
      expect(layout.hasAttribute('transition')).to.be.false;

      // "remove" transition
      const removePromise = layout._setDetail(null);

      expect(layout.getAttribute('transition')).to.equal('remove');

      await removePromise;
      expect(layout.hasAttribute('transition')).to.be.false;
    });

    it('should not animate when skipTransition is set to true', async () => {
      const detail = document.createElement('detail-content');
      await layout._setDetail(detail, true);

      expect(layout.hasAttribute('transition')).to.be.false;
      const result = layout.querySelector('[slot="detail"]');
      expect(result).to.equal(detail);
    });

    it('should not animate when noAnimation is set to true', async () => {
      layout.noAnimation = true;

      const detail = document.createElement('detail-content');
      await layout._setDetail(detail);

      expect(layout.hasAttribute('transition')).to.be.false;
      const result = layout.querySelector('[slot="detail"]');
      expect(result).to.equal(detail);
    });

    it('should reflect noAnimation to attribute', async () => {
      expect(layout.hasAttribute('no-animation')).to.be.false;
      layout.noAnimation = true;
      await nextRender();
      expect(layout.hasAttribute('no-animation')).to.be.true;
    });
  });

  describe('manual transition', () => {
    it('should allow starting manual transitions', async () => {
      const updateCallback = sinon.spy();

      // Start transition — callback is called immediately for non-remove types
      const result = layout._startTransition('manual', updateCallback);
      expect(result).to.be.instanceOf(Promise);
      expect(layout.getAttribute('transition')).to.equal('manual');
      expect(updateCallback.calledOnce).to.be.true;

      // No CSS transition in test → fallback resolves via rAF
      await result;
      expect(layout.hasAttribute('transition')).to.be.false;
    });

    it('should allow starting remove transitions', async () => {
      const updateCallback = sinon.spy();

      // Start remove transition — callback should NOT be called yet
      const result = layout._startTransition('remove', updateCallback);
      expect(result).to.be.instanceOf(Promise);
      expect(layout.getAttribute('transition')).to.equal('remove');
      expect(updateCallback.called).to.be.false;

      // No CSS transition in test → fallback resolves, then callback fires
      await result;
      expect(updateCallback.calledOnce).to.be.true;
      expect(layout.hasAttribute('transition')).to.be.false;
    });

    it('should skip transition when noAnimation is set', async () => {
      layout.noAnimation = true;

      const updateCallback = sinon.spy();
      const result = layout._startTransition('add', updateCallback);

      expect(result).to.be.instanceOf(Promise);
      expect(updateCallback.calledOnce).to.be.true;

      await result;
      expect(layout.hasAttribute('transition')).to.be.false;
    });

    it('should resolve previous transition when interrupted', async () => {
      const callback1 = sinon.spy();
      const callback2 = sinon.spy();

      const result1 = layout._startTransition('add', callback1);
      expect(callback1.calledOnce).to.be.true;

      // Start a new transition before the first one finishes
      const result2 = layout._startTransition('remove', callback2);

      // First promise should resolve immediately
      await result1;
      expect(layout.getAttribute('transition')).to.equal('remove');

      await result2;
      expect(callback2.calledOnce).to.be.true;
    });
  });

  describe('replace transition', () => {
    it('should move old content to outgoing container during replace', async () => {
      // Add initial detail
      const detail = document.createElement('detail-content');
      await layout._setDetail(detail);

      // Replace with new detail
      const newDetail = document.createElement('detail-content');
      const replacePromise = layout._setDetail(newDetail);

      // During replace, old content should be in the outgoing container
      const outgoing = layout.shadowRoot.querySelector('#detail-outgoing');
      expect(outgoing.hasAttribute('hidden')).to.be.false;
      expect(outgoing.contains(detail)).to.be.true;

      // New content should be in the slot
      expect(layout.querySelector('[slot="detail"]')).to.equal(newDetail);

      // Wait for transition to complete
      await replacePromise;

      // After transition, outgoing should be cleared
      expect(outgoing.hasAttribute('hidden')).to.be.true;
      expect(outgoing.children.length).to.equal(0);
    });
  });
});

import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-master-detail-layout.js';
import './helpers/master-content.js';
import './helpers/detail-content.js';
import { nextFrames, onceResized } from './helpers.js';

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
    layout.style.setProperty('--_transition-duration', '10ms');
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
      expect(layout.hasAttribute('transition')).to.be.false;

      expect(updateCallback.calledOnce).to.be.true;
      await result;
      expect(layout.hasAttribute('transition')).to.be.false;
    });

    // Reproduces how the React component handles transitions: it reassigns
    // the outgoing detail's slot so that React can handle the removal.
    it('should not remove outgoing detail when it is reassigned to different slot', async () => {
      const detail = document.createElement('detail-content');
      await layout._setDetail(detail);

      await layout._startTransition('replace', () => {
        const outgoing = layout.querySelector('[slot="detail-outgoing"]');
        expect(outgoing).to.equal(detail);
        outgoing.slot = 'detail-hidden';
      });

      // The element should still be in the DOM since its slot was changed
      expect(detail.isConnected).to.be.true;
      expect(detail.slot).to.equal('detail-hidden');
    });

    it('should resolve previous transition when interrupted', async () => {
      const callback1 = sinon.spy();
      const callback2 = sinon.spy();

      const result1 = layout._startTransition('add', callback1);
      expect(callback1.calledOnce).to.be.true;

      // Start a new transition before the first one finishes
      const result2 = layout._startTransition('remove', callback2);

      // Both promises should resolve
      await result1;
      await result2;
      expect(callback2.calledOnce).to.be.true;
      expect(layout.hasAttribute('transition')).to.be.false;
    });
  });

  describe('animation interruption', () => {
    // These tests enable real animations that can be captured mid-flight.
    const DURATION = 200;

    beforeEach(async () => {
      layout.masterSize = '300px';
      layout.detailSize = '300px';
      layout.style.width = '500px';
      layout.style.setProperty('--_transition-duration', `${DURATION}ms`);
      layout.style.setProperty('--_transition-offset', '200px');
      layout.style.setProperty('--_transition-easing', 'linear');
      await onceResized(layout);
    });

    it('should start remove transition from interrupted add position', async () => {
      // Add detail
      layout._setDetail(document.createElement('detail-content'));
      await nextFrames(8);
      const detailTranslate = parseFloat(getComputedStyle(layout.$.detail).translate);
      expect(detailTranslate).to.be.greaterThan(0).and.lessThan(200);

      // Interrupt with removing detail
      layout._setDetail(null);
      await nextFrames(2);
      const detailTranslateAfter = parseFloat(getComputedStyle(layout.$.detail).translate);
      expect(detailTranslateAfter).to.be.greaterThan(detailTranslate).and.lessThan(200);
    });

    it('should start add transition from interrupted remove position', async () => {
      layout._setDetail(document.createElement('detail-content'), false);

      // Remove detail
      layout._setDetail(null);
      await nextFrames(8);
      const detailTranslate = parseFloat(getComputedStyle(layout.$.detail).translate);
      expect(detailTranslate).to.be.greaterThan(0).and.lessThan(200);

      // Interrupt with adding detail
      layout._setDetail(document.createElement('detail-content'));
      await nextFrames(2);
      const detailTranslateAfter = parseFloat(getComputedStyle(layout.$.detail).translate);
      expect(detailTranslateAfter).to.be.greaterThan(0).and.lessThan(detailTranslate);
    });

    it('should position outgoing element at interrupted add position during replace', async () => {
      // Add detail
      layout._setDetail(document.createElement('detail-content'));
      await nextFrames(8);
      const detailTranslate = parseFloat(getComputedStyle(layout.$.detail).translate);
      expect(detailTranslate).to.be.greaterThan(0).and.lessThan(200);

      // Interrupt with replacing detail
      layout._setDetail(document.createElement('detail-content'));
      await nextFrames(2);

      const detailTranslateAfter = parseFloat(getComputedStyle(layout.$.detail).translate);
      expect(detailTranslateAfter).to.be.greaterThan(0).and.lessThan(detailTranslate);

      const detailOutgoingTranslateAfter = parseFloat(getComputedStyle(layout.$.detailOutgoing).translate);
      expect(detailOutgoingTranslateAfter).to.be.greaterThan(detailTranslate).and.lessThan(200);
    });

    it('should complete transition immediately when no animation is running', async () => {
      // No prior animation — interruptedTranslate should be null, defaults apply
      const callback = sinon.spy();
      const promise = layout._startTransition('add', callback);
      expect(callback.calledOnce).to.be.true;
      await promise;
      expect(layout.hasAttribute('transition')).to.be.false;
    });

    it('should complete all transitions during rapid interruptions', async () => {
      const cb1 = () => layout.setAttribute('has-detail', '');
      const cb2 = sinon.spy();
      const cb3 = () => layout.setAttribute('has-detail', '');

      // Rapid sequence: add → remove → add
      const p1 = layout._startTransition('add', cb1);
      await nextFrames();

      const p2 = layout._startTransition('remove', cb2);
      await nextFrames();

      const p3 = layout._startTransition('add', cb3);

      // All promises should resolve without errors
      await p1;
      await p2;
      await p3;

      // Final state should be clean
      expect(layout.hasAttribute('transition')).to.be.false;
    });
  });

  describe('detail placeholder', () => {
    let placeholder;

    beforeEach(async () => {
      layout.masterSize = '300px';
      layout.detailSize = '300px';
      layout.style.width = '800px';
      placeholder = document.createElement('div');
      placeholder.setAttribute('slot', 'detail-placeholder');
      layout.appendChild(placeholder);
      await onceResized(layout);
    });

    it('should use replace transition when adding detail', async () => {
      const detail = document.createElement('detail-content');
      const promise = layout._setDetail(detail);

      expect(layout.getAttribute('transition')).to.equal('replace');

      await promise;
      expect(layout.hasAttribute('transition')).to.be.false;
    });

    it('should use replace transition when removing detail', async () => {
      const detail = document.createElement('detail-content');
      await layout._setDetail(detail);

      const promise = layout._setDetail(null);

      expect(layout.getAttribute('transition')).to.equal('replace');

      await promise;
      expect(layout.hasAttribute('transition')).to.be.false;
    });

    it('should use add transition when adding detail in overlay mode', async () => {
      layout.style.width = '200px';
      await onceResized(layout);

      const detail = document.createElement('detail-content');
      const promise = layout._setDetail(detail);

      expect(layout.getAttribute('transition')).to.equal('add');

      await promise;
      expect(layout.hasAttribute('transition')).to.be.false;
    });

    it('should use remove transition when removing detail in overlay mode', async () => {
      const detail = document.createElement('detail-content');
      await layout._setDetail(detail);

      layout.style.width = '200px';
      await onceResized(layout);

      const promise = layout._setDetail(null);

      expect(layout.getAttribute('transition')).to.equal('remove');

      await promise;
      expect(layout.hasAttribute('transition')).to.be.false;
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

      // During replace, old content should be in the outgoing slot
      const detailOutgoing = layout.shadowRoot.querySelector('#detailOutgoing');
      expect(detailOutgoing.checkVisibility()).to.be.true;
      expect(detail.getAttribute('slot')).to.equal('detail-outgoing');

      // New content should be in the detail slot
      expect(layout.querySelector('[slot="detail"]')).to.equal(newDetail);

      // Wait for transition to complete
      await replacePromise;

      // After transition, outgoing should be cleared and old element removed
      expect(detailOutgoing.checkVisibility()).to.be.false;
      expect(layout.querySelector('[slot="detail-outgoing"]')).to.be.null;
    });

    it('should not remove new outgoing detail when replace interrupts replace', async () => {
      const detail1 = document.createElement('detail-content');
      await layout._setDetail(detail1);

      const detail2 = document.createElement('detail-content');
      // Start first replace but don't await
      layout._setDetail(detail2);
      await aTimeout(0);

      const detail3 = document.createElement('detail-content');
      // Interrupt with second replace — detail2 becomes the new outgoing
      layout._setDetail(detail3);
      await aTimeout(0);

      expect(layout.contains(detail1)).to.be.false;
      expect(layout.querySelector('[slot="detail-outgoing"]')).to.equal(detail2);
    });

    it('should preserve outgoing width when replacing with a differently sized detail', async () => {
      let detailContent;

      detailContent = document.createElement('detail-content');
      detailContent.style.width = '200px';
      await layout._setDetail(detailContent);
      await onceResized(layout);

      detailContent = document.createElement('detail-content');
      detailContent.style.width = '400px';
      const replacePromise = layout._setDetail(detailContent);
      await onceResized(layout);
      expect(layout.$.detailOutgoing.style.width).to.equal('201px'); // 1px border
      await replacePromise;

      detailContent = document.createElement('detail-content');
      detailContent.style.width = '200px';
      layout._setDetail(detailContent);
      await onceResized(layout);
      expect(layout.$.detailOutgoing.style.width).to.equal('401px'); // 1px border
    });

    it('should preserve outgoing width when replace interrupts replace', async () => {
      let detailContent;

      detailContent = document.createElement('detail-content');
      detailContent.style.width = '200px';
      await layout._setDetail(detailContent);
      await onceResized(layout);

      detailContent = document.createElement('detail-content');
      detailContent.style.width = '400px';
      // Start replace transition but don't await — interrupt with another replace
      layout._setDetail(detailContent);
      await onceResized(layout);
      expect(layout.$.detailOutgoing.style.width).to.equal('201px'); // 1px border

      detailContent = document.createElement('detail-content');
      detailContent.style.width = '200px';
      layout._setDetail(detailContent);
      await onceResized(layout);
      expect(layout.$.detailOutgoing.style.width).to.equal('401px'); // 1px border
    });

    it('should adjust detail size after replacing with a differently sized detail', async () => {
      let detailContent;

      detailContent = document.createElement('detail-content');
      detailContent.style.width = '200px';
      await layout._setDetail(detailContent);
      expect(layout.$.detail.offsetWidth).to.be.equal(201); // 1px border

      detailContent = document.createElement('detail-content');
      detailContent.style.width = '400px';
      await layout._setDetail(detailContent);
      expect(layout.$.detail.offsetWidth).to.be.equal(401); // 1px border

      detailContent = document.createElement('detail-content');
      detailContent.style.width = '200px';
      await layout._setDetail(detailContent);
      expect(layout.$.detail.offsetWidth).to.be.equal(201); // 1px border
    });
  });
});

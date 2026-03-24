import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
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

      // Both promises should resolve
      await result1;
      await result2;
      expect(callback2.calledOnce).to.be.true;
      expect(layout.hasAttribute('transition')).to.be.false;
    });
  });

  describe('animation interruption', () => {
    // These tests enable real animations that can be captured mid-flight.
    const DURATION = 400;

    beforeEach(() => {
      layout.style.setProperty('--_transition-duration', `${DURATION}ms`);
      layout.style.setProperty('--_detail-offscreen', '200px');
      layout.style.setProperty('--_transition-easing', 'linear');
    });

    it('should start remove animation from current position when interrupting add', async () => {
      const detail = layout.shadowRoot.querySelector('#detail');
      const addCallback = () => {
        layout.setAttribute('has-detail', '');
      };

      // Start add transition (slides in: 200px → none)
      const addPromise = layout._startTransition('add', addCallback);

      // Wait a bit for the animation to progress
      await nextFrames(2);

      // The detail should be mid-animation, not at either endpoint
      const midTranslate = getComputedStyle(detail).translate;
      // It should be somewhere between 0px and 200px (not yet at 'none')
      const midValue = parseFloat(midTranslate);
      expect(midValue).to.be.greaterThan(0);
      expect(midValue).to.be.lessThan(200);

      // Interrupt with remove — should start from the captured mid-position
      const removeCallback = sinon.spy();
      const removePromise = layout._startTransition('remove', removeCallback);

      // Verify the animation starts from near the interrupted position,
      // not from 'none' (0) or the full offscreen (200px)
      await nextFrames();
      const afterInterruptTranslate = getComputedStyle(detail).translate;
      const afterInterruptValue = parseFloat(afterInterruptTranslate);
      // Should be near the mid-point, not at 0 (which would mean it jumped to fully visible)
      expect(afterInterruptValue).to.be.greaterThan(0);

      await addPromise;
      await removePromise;
    });

    it('should start add animation from current position when interrupting remove', async () => {
      const detail = layout.shadowRoot.querySelector('#detail');
      layout.setAttribute('has-detail', '');

      // Start remove transition (slides out: none → 200px)
      const removeCallback = sinon.spy();
      const removePromise = layout._startTransition('remove', removeCallback);

      // Wait for animation to progress
      await nextFrames(2);

      // The detail should be mid-animation
      const midTranslate = getComputedStyle(detail).translate;
      const midValue = parseFloat(midTranslate);
      expect(midValue).to.be.greaterThan(0);
      expect(midValue).to.be.lessThan(200);

      // Interrupt with add — should start from the captured mid-position
      const addCallback = sinon.spy();
      const addPromise = layout._startTransition('add', addCallback);

      // Verify the animation starts from near the interrupted position
      await nextFrames();
      const afterInterruptTranslate = getComputedStyle(detail).translate;
      const afterInterruptValue = parseFloat(afterInterruptTranslate);
      // Should be near the mid-point, not at 200px (full offscreen)
      expect(afterInterruptValue).to.be.lessThan(200);

      await removePromise;
      await addPromise;
    });

    it('should apply interrupted position to outgoing element during replace', async () => {
      const detail = layout.shadowRoot.querySelector('#detail');
      const outgoing = layout.shadowRoot.querySelector('#outgoing');

      const addCallback = () => {
        layout.setAttribute('has-detail', '');
      };

      // Start add transition (slides in: 200px → none)
      const addPromise = layout._startTransition('add', addCallback);

      // Wait for animation to progress
      await nextFrames(2);

      // Capture mid-point
      const midTranslate = getComputedStyle(detail).translate;
      const midValue = parseFloat(midTranslate);
      expect(midValue).to.be.greaterThan(0);

      // Set overlay so replace uses slide (not cross-fade)
      layout.setAttribute('overlay', '');

      // Interrupt with replace — outgoing should start from captured position
      const replaceCallback = sinon.spy();
      layout._startTransition('replace', replaceCallback);

      // Verify the outgoing animation was created with the interrupted
      // position as its starting keyframe (check keyframes directly rather
      // than getComputedStyle, which returns 'none' on hidden elements).
      const outgoingAnims = outgoing.getAnimations();
      expect(outgoingAnims).to.have.length(1);
      const startTranslate = parseFloat(outgoingAnims[0].effect.getKeyframes()[0].translate);
      expect(startTranslate).to.be.greaterThan(0);
      expect(startTranslate).to.be.lessThan(200);

      await addPromise;
    });

    it('should handle interruption when no animation is running', async () => {
      // No prior animation — interruptedTranslate should be null, defaults apply
      const callback = sinon.spy();
      const promise = layout._startTransition('add', callback);
      expect(callback.calledOnce).to.be.true;
      await promise;
      expect(layout.hasAttribute('transition')).to.be.false;
    });

    it('should handle multiple rapid interruptions', async () => {
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
      const outgoing = layout.shadowRoot.querySelector('#outgoing');
      expect(outgoing.hasAttribute('hidden')).to.be.false;
      expect(detail.getAttribute('slot')).to.equal('detail-outgoing');

      // New content should be in the detail slot
      expect(layout.querySelector('[slot="detail"]')).to.equal(newDetail);

      // Wait for transition to complete
      await replacePromise;

      // After transition, outgoing should be cleared and old element removed
      expect(outgoing.hasAttribute('hidden')).to.be.true;
      expect(layout.querySelector('[slot="detail-outgoing"]')).to.be.null;
    });
  });
});

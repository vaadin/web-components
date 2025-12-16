import { expect } from '@vaadin/chai-plugins';
import {
  aTimeout,
  escKeyDown,
  fixtureSync,
  focusin,
  focusout,
  keyboardEventFor,
  mousedown,
  nextFrame,
  nextRender,
  nextUpdate,
  tabKeyDown,
} from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../src/vaadin-tooltip.js';
import '@vaadin/overlay/vaadin-overlay.js';
import { html, render } from 'lit';
import { mouseenter, mouseleave, waitForIntersectionObserver } from './helpers.js';

describe('vaadin-tooltip', () => {
  const Tooltip = customElements.get('vaadin-tooltip');

  before(() => {
    Tooltip.setDefaultFocusDelay(0);
    Tooltip.setDefaultHoverDelay(0);
    Tooltip.setDefaultHideDelay(0);
  });

  let tooltip, overlay, srLabel;

  beforeEach(async () => {
    tooltip = fixtureSync('<vaadin-tooltip></vaadin-tooltip>');
    await nextRender();
    overlay = tooltip.shadowRoot.querySelector('vaadin-tooltip-overlay');
    srLabel = tooltip.querySelector('[slot="sr-label"]');
  });

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      tagName = tooltip.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });

  describe('overlay', () => {
    it('should set owner property on the overlay', () => {
      expect(overlay.owner).to.be.equal(tooltip);
    });

    it('should not have tabindex on the overlay part', () => {
      expect(overlay.$.overlay.hasAttribute('tabindex')).to.be.false;
    });

    it('should propagate theme attribute to overlay', async () => {
      tooltip.setAttribute('theme', 'foo');
      await nextUpdate(tooltip);
      expect(overlay.getAttribute('theme')).to.equal('foo');
    });
  });

  describe('text', () => {
    it('should use text property as overlay text content', async () => {
      tooltip.text = 'Foo';
      await nextUpdate(tooltip);
      expect(overlay.textContent.trim()).to.equal('Foo');
    });

    it('should use text property as screen reader label content', async () => {
      tooltip.text = 'Foo';
      await nextUpdate(tooltip);
      expect(srLabel.textContent.trim()).to.equal('Foo');
    });

    it('should clear overlay content when text is set to null', async () => {
      tooltip.text = 'Foo';
      await nextUpdate(tooltip);

      tooltip.text = null;
      await nextUpdate(tooltip);
      expect(overlay.textContent.trim()).to.equal('');
    });

    it('should set hidden on the overlay when text is cleared', async () => {
      tooltip.text = 'Foo';
      await nextUpdate(tooltip);
      expect(overlay.hasAttribute('hidden')).to.be.false;

      tooltip.text = null;
      await nextUpdate(tooltip);
      expect(overlay.hasAttribute('hidden')).to.be.true;
    });

    it('should fire content-changed event when text changes', async () => {
      const spy = sinon.spy();
      tooltip.addEventListener('content-changed', spy);

      tooltip.text = 'Foo';
      await nextUpdate(tooltip);
      expect(spy.calledOnce).to.be.true;
      expect(spy.firstCall.args[0].detail).to.deep.equal({ content: 'Foo' });

      spy.resetHistory();

      tooltip.text = null;
      await nextUpdate(tooltip);
      expect(spy.calledOnce).to.be.true;
      expect(spy.firstCall.args[0].detail).to.deep.equal({ content: '' });
    });
  });

  describe('generator', () => {
    it('should use generator property to generate text content', async () => {
      tooltip.generator = () => 'Foo';
      await nextUpdate(tooltip);
      expect(overlay.textContent.trim()).to.equal('Foo');
    });

    it('should set screen reader label content using generator', async () => {
      tooltip.generator = () => 'Foo';
      await nextUpdate(tooltip);
      expect(srLabel.textContent.trim()).to.equal('Foo');
    });

    it('should override text property when generator is set', async () => {
      tooltip.text = 'Foo';
      await nextUpdate(tooltip);

      tooltip.generator = () => 'Bar';
      await nextUpdate(tooltip);
      expect(overlay.textContent.trim()).to.equal('Bar');
    });

    it('should use context property in generator when provided', async () => {
      tooltip.context = { text: 'Foo' };
      tooltip.generator = (context) => context.text;
      await nextUpdate(tooltip);
      expect(overlay.textContent.trim()).to.equal('Foo');
    });

    it('should update text content when context property changes', async () => {
      tooltip.context = { text: 'Foo' };
      tooltip.generator = (context) => context.text;
      await nextUpdate(tooltip);

      tooltip.context = { text: 'Bar' };
      await nextUpdate(tooltip);
      expect(overlay.textContent.trim()).to.equal('Bar');
    });

    it('should set hidden on the overlay when generator clears text', async () => {
      tooltip.generator = () => 'Bar';
      await nextUpdate(tooltip);
      expect(overlay.hasAttribute('hidden')).to.be.false;

      tooltip.generator = () => '';
      await nextUpdate(tooltip);
      expect(overlay.hasAttribute('hidden')).to.be.true;
    });

    it('should fire content-changed event when generator changes', async () => {
      const spy = sinon.spy();
      tooltip.addEventListener('content-changed', spy);

      tooltip.generator = () => 'Foo';
      await nextUpdate(tooltip);
      expect(spy.calledOnce).to.be.true;
      expect(spy.firstCall.args[0].detail).to.deep.equal({ content: 'Foo' });

      spy.resetHistory();

      tooltip.generator = () => '';
      await nextUpdate(tooltip);
      expect(spy.calledOnce).to.be.true;
      expect(spy.firstCall.args[0].detail).to.deep.equal({ content: '' });
    });

    it('should fire content-changed event when context changes', async () => {
      const spy = sinon.spy();
      tooltip.addEventListener('content-changed', spy);

      tooltip.generator = (context) => context.text;
      spy.resetHistory();

      tooltip.context = { text: 'Foo' };
      await nextUpdate(tooltip);
      expect(spy.calledOnce).to.be.true;
      expect(spy.firstCall.args[0].detail).to.deep.equal({ content: 'Foo' });

      spy.resetHistory();

      tooltip.context = { text: 'Bar' };
      await nextUpdate(tooltip);
      expect(spy.calledOnce).to.be.true;
      expect(spy.firstCall.args[0].detail).to.deep.equal({ content: 'Bar' });
    });
  });

  describe('target', () => {
    let target;

    beforeEach(() => {
      target = document.createElement('div');
      target.textContent = 'Target';
      document.body.appendChild(target);
    });

    afterEach(() => {
      document.body.removeChild(target);
    });

    it('should set target as overlay positionTarget', async () => {
      tooltip.target = target;
      await nextUpdate(tooltip);
      expect(overlay.positionTarget).to.eql(target);
    });

    it('should set aria-describedby on the target element', async () => {
      tooltip.target = target;
      await nextUpdate(tooltip);
      expect(target.getAttribute('aria-describedby')).to.equal(srLabel.id);
    });

    it('should retain existing aria-describedby attribute', async () => {
      target.setAttribute('aria-describedby', 'foo');
      tooltip.target = target;
      await nextUpdate(tooltip);

      expect(target.getAttribute('aria-describedby')).to.contain('foo');
      expect(target.getAttribute('aria-describedby')).to.contain(srLabel.id);
    });

    it('should restore aria-describedby when clearing target', async () => {
      target.setAttribute('aria-describedby', 'foo');
      tooltip.target = target;
      await nextUpdate(tooltip);

      tooltip.target = null;
      await nextUpdate(tooltip);
      expect(target.getAttribute('aria-describedby')).to.equal('foo');
    });
  });

  describe('ariaTarget', () => {
    let target, ariaTarget;

    beforeEach(() => {
      target = document.createElement('div');
      target.textContent = 'Target';
      document.body.appendChild(target);

      ariaTarget = document.createElement('input');
      target.appendChild(ariaTarget);
    });

    afterEach(() => {
      document.body.removeChild(target);
    });

    it('should set aria-describedby on the ariaTarget element', async () => {
      tooltip.target = target;
      tooltip.ariaTarget = ariaTarget;
      await nextUpdate(tooltip);

      expect(ariaTarget.getAttribute('aria-describedby')).to.equal(srLabel.id);
    });

    it('should remove aria-describedby when the ariaTarget is cleared', async () => {
      tooltip.target = target;
      tooltip.ariaTarget = ariaTarget;
      await nextUpdate(tooltip);

      tooltip.ariaTarget = null;
      await nextUpdate(tooltip);

      expect(ariaTarget.hasAttribute('aria-describedby')).to.be.false;
      expect(target.getAttribute('aria-describedby')).to.equal(srLabel.id);
    });

    it('should set aria-describedby when providing multiple elements', async () => {
      const ariaTarget2 = document.createElement('button');
      target.appendChild(ariaTarget2);

      tooltip.target = target;
      tooltip.ariaTarget = [ariaTarget, ariaTarget2];
      await nextUpdate(tooltip);

      expect(ariaTarget.getAttribute('aria-describedby')).to.equal(srLabel.id);
      expect(ariaTarget2.getAttribute('aria-describedby')).to.equal(srLabel.id);
    });

    it('should clear aria-describedby when providing empty array', async () => {
      const ariaTarget2 = document.createElement('button');
      target.appendChild(ariaTarget2);

      tooltip.target = target;
      tooltip.ariaTarget = [ariaTarget, ariaTarget2];
      await nextUpdate(tooltip);

      tooltip.ariaTarget = [];
      await nextUpdate(tooltip);

      expect(ariaTarget.hasAttribute('aria-describedby')).to.be.false;
      expect(ariaTarget2.hasAttribute('aria-describedby')).to.be.false;
      expect(target.getAttribute('aria-describedby')).to.equal(srLabel.id);
    });
  });

  describe('for', () => {
    let target;

    beforeEach(() => {
      target = document.createElement('div');
      target.textContent = 'Target';
      document.body.appendChild(target);
    });

    afterEach(() => {
      document.body.removeChild(target);
    });

    describe('element found', () => {
      it('should use for attribute to link target using ID', async () => {
        target.setAttribute('id', 'foo');
        tooltip.for = 'foo';
        await nextFrame();
        expect(tooltip.target).to.eql(target);
      });

      it('should still target correct element after sorting the items differently', async () => {
        const container = fixtureSync('<div></div>');
        function renderTooltips(items) {
          render(
            html`
              ${items.map(
                (item) => html`
                  <vaadin-tooltip for="${item}"></vaadin-tooltip>
                  <div id=${item}></div>
                `,
              )}
            `,
            container,
          );
        }

        renderTooltips(['bar', 'foo']);
        renderTooltips(['foo']);

        await nextFrame();
        expect(container.querySelector('vaadin-tooltip[for="foo"]').target).to.equal(container.querySelector('#foo'));
      });
    });

    describe('element not found', () => {
      beforeEach(() => {
        sinon.stub(console, 'warn');
      });

      afterEach(() => {
        console.warn.restore();
      });

      it('should warn when element with given ID is not found', async () => {
        tooltip.for = 'bar';
        await nextFrame();
        expect(console.warn.called).to.be.true;
      });

      it('should keep the target when providing incorrect for', async () => {
        tooltip.target = target;
        tooltip.for = 'bar';
        await nextFrame();
        expect(tooltip.target).to.eql(target);
      });
    });
  });

  describe('auto open', () => {
    let target;

    beforeEach(async () => {
      target = fixtureSync('<div tabindex="0"></div>');
      tooltip.target = target;
      tooltip.text = 'Test';
      await nextUpdate(tooltip);
    });

    it('should open overlay on target keyboard focus', () => {
      tabKeyDown(target);
      target.focus();
      expect(overlay.opened).to.be.true;
    });

    it('should not open overlay on target mouse focus', () => {
      mousedown(target);
      target.focus();
      expect(overlay.opened).to.be.false;
    });

    it('should not open overlay on keyboard focus when tooltip has no text content', async () => {
      tooltip.text = null;
      await nextUpdate(tooltip);

      tabKeyDown(target);
      target.focus();
      expect(overlay.opened).to.be.false;
    });

    it('should close overlay on target focusout', () => {
      tabKeyDown(target);
      target.focus();
      focusout(target);
      expect(overlay.opened).to.be.false;
    });

    it('should open overlay on target mouseenter', () => {
      mouseenter(target);
      expect(overlay.opened).to.be.true;
    });

    it('should not open overlay on mouseenter when tooltip has no text content', async () => {
      tooltip.text = null;
      await nextUpdate(tooltip);

      mouseenter(target);
      expect(overlay.opened).to.be.false;
    });

    it('should close overlay on target mouseleave', () => {
      mouseenter(target);
      mouseleave(target);
      expect(overlay.opened).to.be.false;
    });

    it('should not close overlay on mouseleave from target to overlay', () => {
      mouseenter(target);
      mouseleave(target, overlay);
      expect(overlay.opened).to.be.true;
    });

    it('should not close overlay on mouseleave from overlay to target', () => {
      mouseenter(target);
      mouseleave(target, overlay);

      mouseenter(overlay);
      mouseleave(overlay, target);
      expect(overlay.opened).to.be.true;
    });

    it('should close overlay on mouseleave from overlay to outside', () => {
      mouseenter(target);
      mouseleave(target, overlay);

      mouseenter(overlay);
      mouseleave(overlay);
      expect(overlay.opened).to.be.false;
    });

    it('should close overlay on target mousedown', () => {
      mouseenter(target);
      mousedown(target);
      expect(overlay.opened).to.be.false;
    });

    it('should re-open overlay on subsequent mouseenter', () => {
      mouseenter(target);
      mousedown(target);

      mouseleave(target);
      mouseenter(target);
      expect(overlay.opened).to.be.true;
    });

    it('should not close overlay on mouseleave when target has focus', () => {
      mouseenter(target);
      tabKeyDown(target);
      target.focus();

      mouseleave(target);
      expect(overlay.opened).to.be.true;
    });

    it('should not close overlay on focusout when target has hover', () => {
      tabKeyDown(target);
      target.focus();
      mouseenter(target);

      focusout(target);
      expect(overlay.opened).to.be.true;
    });

    it('should close overlay on document Esc keydown', () => {
      mouseenter(target);
      escKeyDown(document.body);
      expect(overlay.opened).to.be.false;
    });

    it('should call stopPropagation for Esc keydown', () => {
      mouseenter(target);
      const event = keyboardEventFor('keydown', 27, [], 'Escape');
      const spy = sinon.spy(event, 'stopPropagation');
      target.dispatchEvent(event);
      expect(spy.calledOnce).to.be.true;
    });

    it('should not call stopPropagation for Esc keydown if tooltip is empty', async () => {
      tooltip.text = null;
      await nextUpdate(tooltip);

      mouseenter(target);
      const event = keyboardEventFor('keydown', 27, [], 'Escape');
      const spy = sinon.spy(event, 'stopPropagation');
      target.dispatchEvent(event);
      expect(spy.called).to.be.false;
    });

    it('should not call stopPropagation when not opened', () => {
      mouseenter(target);
      mouseleave(target);
      const event = keyboardEventFor('keydown', 27, [], 'Escape');
      const spy = sinon.spy(event, 'stopPropagation');
      target.dispatchEvent(event);
      expect(spy.called).to.be.false;
    });

    it('should close both opened tooltips on Esc keydown', async () => {
      tabKeyDown(target);
      target.focus();

      const tooltip2 = fixtureSync('<vaadin-tooltip></vaadin-tooltip>');
      tooltip2.target = target;
      await nextRender();
      const overlay2 = tooltip2.shadowRoot.querySelector('vaadin-tooltip-overlay');

      mouseenter(target);

      escKeyDown(document.body);
      expect(overlay.opened).to.be.false;
      expect(overlay2.opened).to.be.false;
    });

    it('should not open overlay on mouseenter when target is reset', async () => {
      mouseenter(target);
      mouseleave(target);

      tooltip.target = null;
      await nextUpdate(tooltip);

      mouseenter(target);
      expect(overlay.opened).to.be.false;
    });

    it('should not close overlay on mouseleave when target is reset', async () => {
      mouseenter(target);

      tooltip.target = null;
      await nextUpdate(tooltip);

      mouseleave(target);
      expect(overlay.opened).to.be.true;
    });

    it('should not open overlay on keyboard focus when target is reset', async () => {
      mouseenter(target);
      mouseleave(target);

      tooltip.target = null;
      await nextUpdate(tooltip);

      tabKeyDown(target);
      target.focus();
      expect(overlay.opened).to.be.false;
    });

    it('should not close overlay on mousedown when target is reset', async () => {
      mouseenter(target);

      tooltip.target = null;
      await nextUpdate(tooltip);

      mousedown(target);
      expect(overlay.opened).to.be.true;
    });

    it('should not close overlay on focusout when target is reset', async () => {
      tabKeyDown(target);
      target.focus();

      tooltip.target = null;
      await nextUpdate(tooltip);

      focusout(target);
      expect(overlay.opened).to.be.true;
    });

    it('should not open a closed overlay on mouseenter if already hovering on target', () => {
      mouseenter(target);
      mousedown(target);
      mouseenter(target);
      expect(overlay.opened).to.be.false;
    });

    it('should not close overlay on moving focus within the target element', () => {
      const input = document.createElement('input');
      target.appendChild(input);

      tabKeyDown(target);
      target.focus();

      focusout(target, input);

      expect(overlay.opened).to.be.true;
    });

    it('should not re-open overlay on moving focus within the target after mousedown', () => {
      const input = document.createElement('input');
      target.appendChild(input);

      tabKeyDown(target);
      target.focus();

      mousedown(target);

      tabKeyDown(target);
      focusout(target, input);
      focusin(input, target);

      expect(overlay.opened).to.be.false;
    });

    it('should not re-open overlay on moving focus within the target after Esc', () => {
      const input = document.createElement('input');
      target.appendChild(input);

      tabKeyDown(target);
      target.focus();

      escKeyDown(target);

      tabKeyDown(target);
      focusout(target, input);
      focusin(input, target);

      expect(overlay.opened).to.be.false;
    });

    it('should close overlay when another overlay opens', async () => {
      tabKeyDown(target);
      target.focus();
      await nextUpdate(tooltip);

      expect(overlay.opened).to.be.true;

      const otherOverlay = fixtureSync('<vaadin-overlay></vaadin-overlay>');
      otherOverlay.opened = true;
      await nextRender();

      expect(overlay.opened).to.be.false;
    });
  });

  describe('inside a scrollable container', () => {
    let container, target;

    beforeEach(async () => {
      container = fixtureSync(`
        <div style="width: 400px; height: 400px; overflow: scroll; border: 1px solid black;">
          <div style="margin: 600px 0; height: 50px; border: solid 1px red;" tabindex="0"></div>
        </div>
      `);
      target = container.querySelector('div');
      tooltip.target = target;
      tooltip.text = 'Test';
      await nextFrame();
    });

    beforeEach(async () => {
      container.scrollTop = 220;
      await waitForIntersectionObserver();
    });

    it('should open overlay when focused target is partially visible and hide otherwise', async () => {
      // Partially visible
      tabKeyDown(target);
      target.focus();
      await nextUpdate(tooltip);
      expect(overlay.opened).to.be.true;

      // Fully visible
      target.scrollIntoView({ block: 'center' });
      await waitForIntersectionObserver();
      expect(overlay.opened).to.be.true;

      // Fully hidden
      container.scrollTop = 0;
      await waitForIntersectionObserver();
      expect(overlay.opened).to.be.false;
    });

    it('should open overlay when hovered target is fully visible and hide otherwise', async () => {
      // Partially visible
      mouseenter(target);
      await nextUpdate(tooltip);
      expect(overlay.opened).to.be.true;

      // Fully visible
      target.scrollIntoView({ block: 'center' });
      await waitForIntersectionObserver();
      expect(overlay.opened).to.be.true;

      // Fully hidden
      container.scrollTop = 0;
      await waitForIntersectionObserver();
      expect(overlay.opened).to.be.false;
    });
  });

  describe('shouldShow', () => {
    let target;

    beforeEach(async () => {
      target = fixtureSync('<input>');
      tooltip.target = target;
      tooltip.text = 'Test';
      await nextUpdate(tooltip);
    });

    it('should pass tooltip target as a first parameter to shouldShow on mouseenter', async () => {
      const spy = sinon.spy();
      tooltip.shouldShow = spy;
      await nextUpdate(tooltip);

      mouseenter(target);
      expect(spy.firstCall.args[0]).to.equal(target);
    });

    it('should pass tooltip context as a second parameter to shouldShow on mouseenter', async () => {
      const context = { foo: 'bar ' };
      tooltip.context = context;
      await nextUpdate(tooltip);

      const spy = sinon.spy();
      tooltip.shouldShow = spy;
      await nextUpdate(tooltip);

      mouseenter(target);

      expect(spy.firstCall.args[1]).to.equal(context);
    });

    it('should pass tooltip target as a first parameter to shouldShow on keyboard focus', async () => {
      const spy = sinon.spy();
      tooltip.shouldShow = spy;
      await nextUpdate(tooltip);

      tabKeyDown(target);
      target.focus();

      expect(spy.firstCall.args[0]).to.equal(target);
    });

    it('should pass tooltip context as a second parameter to shouldShow on keyboard focus', async () => {
      const context = { foo: 'bar ' };
      tooltip.context = context;
      await nextUpdate(tooltip);

      const spy = sinon.spy();
      tooltip.shouldShow = spy;
      await nextUpdate(tooltip);

      tabKeyDown(target);
      target.focus();

      expect(spy.firstCall.args[1]).to.equal(context);
    });

    it('should not open overlay on mouseenter when shouldShow returns false', async () => {
      tooltip.shouldShow = (target) => !target.readOnly;
      await nextUpdate(tooltip);
      target.readOnly = true;

      mouseenter(target);

      expect(overlay.opened).to.be.not.ok;
    });

    it('should not open overlay on keyboard focus when shouldShow returns false', async () => {
      tooltip.shouldShow = (target) => !target.readOnly;
      await nextUpdate(tooltip);
      target.readOnly = true;

      tabKeyDown(target);
      target.focus();

      expect(overlay.opened).to.be.not.ok;
    });

    it('should open overlay on mouseenter when shouldShow returns true', async () => {
      tooltip.shouldShow = (target) => target.readOnly;
      await nextUpdate(tooltip);

      target.readOnly = true;

      mouseenter(target);

      expect(overlay.opened).to.be.true;
    });

    it('should open overlay on keyboard focus when shouldShow returns true', async () => {
      tooltip.shouldShow = (target) => target.readOnly;
      await nextUpdate(tooltip);

      target.readOnly = true;

      tabKeyDown(target);
      target.focus();

      expect(overlay.opened).to.be.true;
    });

    it('should open overlay on mouseenter when shouldShow is set to null', async () => {
      tooltip.shouldShow = null;
      await nextUpdate(tooltip);

      mouseenter(target);

      expect(overlay.opened).to.be.true;
    });

    it('should not open overlay on keyboard focus when shouldShow is set to null', async () => {
      tooltip.shouldShow = null;
      await nextUpdate(tooltip);

      tabKeyDown(target);
      target.focus();

      expect(overlay.opened).to.be.true;
    });
  });

  describe('manual', () => {
    let target;

    beforeEach(async () => {
      target = fixtureSync('<input>');
      tooltip.target = target;
      tooltip.manual = true;
      await nextUpdate(tooltip);
    });

    it('should not open overlay on target keyboard focus', () => {
      tabKeyDown(target);
      target.focus();
      expect(overlay.opened).to.be.false;
    });

    it('should not open overlay on target mouseenter', () => {
      mouseenter(target);
      expect(overlay.opened).to.be.false;
    });

    it('should open overlay when opened is set to true', () => {
      tooltip.opened = true;
      expect(overlay.opened).to.be.true;
    });

    it('should not close overlay on target focusout', () => {
      tooltip.opened = true;
      target.focus();
      focusout(target);
      expect(overlay.opened).to.be.true;
    });

    it('should not close overlay on target mouseleave', () => {
      tooltip.opened = true;
      mouseenter(target);
      mouseleave(target);
      expect(overlay.opened).to.be.true;
    });

    it('should not close overlay on target mousedown', () => {
      tooltip.opened = true;
      mousedown(target);
      expect(overlay.opened).to.be.true;
    });

    it('should not close overlay on overlay mouseleave', () => {
      tooltip.opened = true;
      mouseleave(overlay);
      expect(overlay.opened).to.be.true;
    });

    it('should not re-open overlay on overlay mouseenter', async () => {
      // Open tooltip
      tooltip.opened = true;
      expect(overlay.opened).to.be.true;

      // Hide tooltip with a delay, while simulating pointer moving into the overlay
      tooltip.hideDelay = 1;
      tooltip._stateController.close(false);
      mouseenter(overlay);
      await aTimeout(2);

      // Should still close the overlay, as it was closed manually
      expect(overlay.opened).to.be.false;
    });

    it('should close overlay when opened is set to false', () => {
      tooltip.opened = true;

      tooltip.opened = false;
      expect(overlay.opened).to.be.false;
    });

    it('should close overlay when disconnected', () => {
      tooltip.opened = true;

      tooltip.remove();
      expect(overlay.opened).to.be.false;
    });

    it('should re-open overlay when reconnected', () => {
      tooltip.opened = true;

      tooltip.remove();
      document.body.append(tooltip);
      expect(overlay.opened).to.be.true;
    });

    it('should remain open when moved to another container', () => {
      tooltip.opened = true;

      document.body.append(tooltip);
      expect(overlay.opened).to.be.true;
    });

    it('should not close overlay when another overlay opens', async () => {
      tooltip.opened = true;
      expect(overlay.opened).to.be.true;

      const otherOverlay = fixtureSync('<vaadin-overlay></vaadin-overlay>');
      otherOverlay.opened = true;
      await nextRender();

      expect(overlay.opened).to.be.true;
    });
  });

  describe('moving target', () => {
    let container, target;

    beforeEach(async () => {
      container = fixtureSync(`
        <div>
          <div id="first">First</div>
          <div id="second">Second</div>
        </div>
      `);
      target = container.querySelector('#second');
      tooltip.target = target;
      tooltip.text = 'Test';
      await nextFrame();
    });

    it('should still open overlay when target element was moved', async () => {
      const firstElement = container.querySelector('#first');
      firstElement.before(target);
      await waitForIntersectionObserver();
      mouseenter(target);
      await nextUpdate(tooltip);
      expect(overlay.opened).to.be.true;
    });
  });
});

describe('manual opened', () => {
  let tooltip, overlay;

  beforeEach(async () => {
    tooltip = fixtureSync('<vaadin-tooltip text="Test" manual opened></vaadin-tooltip>');
    await nextRender();
    overlay = tooltip._overlayElement;
  });

  afterEach(() => {
    tooltip.opened = false;
  });

  it('should set owner on the overlay element', () => {
    expect(overlay.owner).to.equal(tooltip);
  });
});

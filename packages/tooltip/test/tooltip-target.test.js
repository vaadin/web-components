import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { html, render } from 'lit';
import { Tooltip } from '../src/vaadin-tooltip.js';
import { mouseenter, waitForIntersectionObserver } from './helpers.js';

describe('tooltip target', () => {
  before(() => {
    Tooltip.setDefaultFocusDelay(0);
    Tooltip.setDefaultHoverDelay(0);
    Tooltip.setDefaultHideDelay(0);
  });

  let tooltip, overlay, contentNode;

  beforeEach(async () => {
    tooltip = fixtureSync('<vaadin-tooltip></vaadin-tooltip>');
    await nextRender();
    overlay = tooltip.shadowRoot.querySelector('vaadin-tooltip-overlay');
    contentNode = tooltip.querySelector('[slot="overlay"]');
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
      expect(target.getAttribute('aria-describedby')).to.equal(contentNode.id);
    });

    it('should retain existing aria-describedby attribute', async () => {
      target.setAttribute('aria-describedby', 'foo');
      tooltip.target = target;
      await nextUpdate(tooltip);

      expect(target.getAttribute('aria-describedby')).to.contain('foo');
      expect(target.getAttribute('aria-describedby')).to.contain(contentNode.id);
    });

    it('should restore aria-describedby when clearing target', async () => {
      target.setAttribute('aria-describedby', 'foo');
      tooltip.target = target;
      await nextUpdate(tooltip);

      tooltip.target = null;
      await nextUpdate(tooltip);
      expect(target.getAttribute('aria-describedby')).to.equal('foo');
    });

    it('should remove aria-describedby when the tooltip is detached', async () => {
      tooltip.target = target;
      await nextUpdate(tooltip);

      tooltip.remove();

      expect(target.hasAttribute('aria-describedby')).to.be.false;
    });

    it('should restore aria-describedby when the tooltip is reattached', async () => {
      tooltip.target = target;
      await nextUpdate(tooltip);

      const parent = tooltip.parentElement;
      tooltip.remove();
      parent.appendChild(tooltip);

      expect(target.getAttribute('aria-describedby')).to.equal(contentNode.id);
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

      expect(ariaTarget.getAttribute('aria-describedby')).to.equal(contentNode.id);
    });

    it('should remove aria-describedby and set it on the target when ariaTarget is set to undefined', async () => {
      tooltip.target = target;
      tooltip.ariaTarget = ariaTarget;
      await nextUpdate(tooltip);

      tooltip.ariaTarget = undefined;
      await nextUpdate(tooltip);

      expect(ariaTarget.hasAttribute('aria-describedby')).to.be.false;
      expect(target.getAttribute('aria-describedby')).to.equal(contentNode.id);
    });

    it('should remove aria-describedby and not set it on the target when ariaTarget is set to null', async () => {
      tooltip.target = target;
      tooltip.ariaTarget = ariaTarget;
      await nextUpdate(tooltip);

      tooltip.ariaTarget = null;
      await nextUpdate(tooltip);

      expect(ariaTarget.hasAttribute('aria-describedby')).to.be.false;
      expect(target.hasAttribute('aria-describedby')).to.be.false;
    });

    it('should set aria-describedby when providing multiple elements', async () => {
      const ariaTarget2 = document.createElement('button');
      target.appendChild(ariaTarget2);

      tooltip.target = target;
      tooltip.ariaTarget = [ariaTarget, ariaTarget2];
      await nextUpdate(tooltip);

      expect(ariaTarget.getAttribute('aria-describedby')).to.equal(contentNode.id);
      expect(ariaTarget2.getAttribute('aria-describedby')).to.equal(contentNode.id);
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
      expect(target.getAttribute('aria-describedby')).to.equal(contentNode.id);
    });
  });

  describe('ariaLinkMode', () => {
    let target;

    beforeEach(() => {
      target = document.createElement('div');
      target.textContent = 'Target';
      document.body.appendChild(target);
    });

    afterEach(() => {
      document.body.removeChild(target);
    });

    it('should be set to aria-describedby by default', () => {
      expect(tooltip.ariaLinkMode).to.equal('aria-describedby');
    });

    it('should apply aria-labelledby when set before the target', async () => {
      tooltip.ariaLinkMode = 'aria-labelledby';
      tooltip.target = target;
      await nextUpdate(tooltip);

      expect(target.getAttribute('aria-labelledby')).to.equal(contentNode.id);
      expect(target.hasAttribute('aria-describedby')).to.be.false;
    });

    it('should not set any ARIA attribute when set to none before the target', async () => {
      tooltip.ariaLinkMode = 'none';
      tooltip.target = target;
      await nextUpdate(tooltip);

      expect(target.hasAttribute('aria-describedby')).to.be.false;
      expect(target.hasAttribute('aria-labelledby')).to.be.false;
    });

    it('should update ARIA attributes when set to aria-labelledby', async () => {
      tooltip.target = target;
      await nextUpdate(tooltip);

      tooltip.ariaLinkMode = 'aria-labelledby';
      await nextUpdate(tooltip);

      expect(target.hasAttribute('aria-describedby')).to.be.false;
      expect(target.getAttribute('aria-labelledby')).to.equal(contentNode.id);
    });

    it('should remove ARIA attribute when set to none', async () => {
      tooltip.target = target;
      await nextUpdate(tooltip);

      tooltip.ariaLinkMode = 'none';
      await nextUpdate(tooltip);

      expect(target.hasAttribute('aria-describedby')).to.be.false;
      expect(target.hasAttribute('aria-labelledby')).to.be.false;
    });

    it('should restore attribute when setting from none back to describedby', async () => {
      tooltip.ariaLinkMode = 'none';
      tooltip.target = target;
      await nextUpdate(tooltip);

      tooltip.ariaLinkMode = 'aria-describedby';
      await nextUpdate(tooltip);

      expect(target.getAttribute('aria-describedby')).to.equal(contentNode.id);
    });

    it('should update attribute for all target elements when using ariaTarget array', async () => {
      const ariaTarget = document.createElement('input');
      const ariaTarget2 = document.createElement('button');

      target.append(ariaTarget, ariaTarget2);

      tooltip.target = target;
      tooltip.ariaTarget = [ariaTarget, ariaTarget2];
      await nextUpdate(tooltip);

      expect(ariaTarget.getAttribute('aria-describedby')).to.equal(contentNode.id);
      expect(ariaTarget2.getAttribute('aria-describedby')).to.equal(contentNode.id);

      tooltip.ariaLinkMode = 'aria-labelledby';
      await nextUpdate(tooltip);

      expect(ariaTarget.hasAttribute('aria-describedby')).to.be.false;
      expect(ariaTarget2.hasAttribute('aria-describedby')).to.be.false;
      expect(ariaTarget.getAttribute('aria-labelledby')).to.equal(contentNode.id);
      expect(ariaTarget2.getAttribute('aria-labelledby')).to.equal(contentNode.id);
    });

    it('should preserve a pre-existing ARIA attribute value when changing mode', async () => {
      target.setAttribute('aria-describedby', 'foo');
      tooltip.target = target;
      await nextUpdate(tooltip);
      expect(target.getAttribute('aria-describedby')).to.contain('foo');
      expect(target.getAttribute('aria-describedby')).to.contain(contentNode.id);

      tooltip.ariaLinkMode = 'aria-labelledby';
      await nextUpdate(tooltip);

      expect(target.getAttribute('aria-describedby')).to.equal('foo');
      expect(target.getAttribute('aria-labelledby')).to.equal(contentNode.id);
    });
  });

  describe('ariaTarget in a shadow root', () => {
    let host, target;

    beforeEach(() => {
      host = fixtureSync('<div></div>');
      host.attachShadow({ mode: 'open' });

      target = document.createElement('input');
      host.shadowRoot.appendChild(target);
    });

    it('should link the target using ariaDescribedByElements', async () => {
      tooltip.target = target;
      await nextUpdate(tooltip);

      expect(target.ariaDescribedByElements).to.eql([contentNode]);
    });

    it('should remove the element reference when clearing target', async () => {
      tooltip.target = target;
      await nextUpdate(tooltip);

      tooltip.target = null;
      await nextUpdate(tooltip);

      expect(target.ariaDescribedByElements).to.be.null;
    });

    it('should use ariaLabelledByElements when ariaLinkMode is set to aria-labelledby', async () => {
      tooltip.ariaLinkMode = 'aria-labelledby';
      tooltip.target = target;
      await nextUpdate(tooltip);

      expect(target.ariaLabelledByElements).to.eql([contentNode]);
      expect(target.ariaDescribedByElements).to.be.null;
    });

    it('should update element references when ariaLinkMode changes', async () => {
      tooltip.target = target;
      await nextUpdate(tooltip);

      tooltip.ariaLinkMode = 'aria-labelledby';
      await nextUpdate(tooltip);

      expect(target.ariaDescribedByElements).to.be.null;
      expect(target.ariaLabelledByElements).to.eql([contentNode]);
    });

    it('should not set element references when ariaLinkMode is none', async () => {
      tooltip.ariaLinkMode = 'none';
      tooltip.target = target;
      await nextUpdate(tooltip);

      expect(target.ariaDescribedByElements).to.be.null;
      expect(target.ariaLabelledByElements).to.be.null;
    });

    it('should remove element references when ariaLinkMode is set to none', async () => {
      tooltip.target = target;
      await nextUpdate(tooltip);

      tooltip.ariaLinkMode = 'none';
      await nextUpdate(tooltip);

      expect(target.ariaDescribedByElements).to.be.null;
    });

    it('should remove element references when the tooltip is detached', async () => {
      tooltip.target = target;
      await nextUpdate(tooltip);

      tooltip.remove();

      expect(target.ariaDescribedByElements).to.be.null;
    });

    it('should restore element references when the tooltip is reattached', async () => {
      tooltip.target = target;
      await nextUpdate(tooltip);

      const parent = tooltip.parentElement;
      tooltip.remove();
      parent.appendChild(tooltip);

      expect(target.ariaDescribedByElements).to.eql([contentNode]);
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
                  <div id="${item}"></div>
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

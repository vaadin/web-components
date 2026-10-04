import { expect } from '@vaadin/chai-plugins';
import { fire, fixtureSync, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import { Tooltip } from '../src/vaadin-tooltip.js';

describe('offset', () => {
  let tooltip, target, overlay;

  before(() => {
    Tooltip.setDefaultFocusDelay(0);
    Tooltip.setDefaultHoverDelay(0);
    Tooltip.setDefaultHideDelay(0);
  });

  beforeEach(async () => {
    tooltip = fixtureSync('<vaadin-tooltip text="tooltip"></vaadin-tooltip>');
    await nextRender();
    target = fixtureSync('<div style="width: 100px; height: 100px; margin: 100px; outline: 1px solid red;"></div>');
    tooltip.target = target;
    await nextRender();
    overlay = tooltip.shadowRoot.querySelector('vaadin-tooltip-overlay');
  });

  async function open() {
    fire(target, 'mouseenter');
    await oneEvent(overlay, 'vaadin-overlay-open');
  }

  ['top', 'bottom'].forEach((position) => {
    it(`should flip from ${position} when the tooltip fits but its offset does not`, async () => {
      tooltip.position = position;
      tooltip.style.setProperty('--vaadin-tooltip-offset-top', '10px');
      tooltip.style.setProperty('--vaadin-tooltip-offset-bottom', '10px');
      Object.assign(target.style, { position: 'fixed', margin: '0', top: '200px', left: '200px' });
      await nextUpdate(tooltip);
      await open();
      const height = overlay.$.overlay.offsetHeight;
      const margin = parseFloat(getComputedStyle(overlay)[position]);
      const available = height + margin + 5;
      target.style.top = position === 'top' ? `${available}px` : 'auto';
      target.style.bottom = position === 'bottom' ? `${available}px` : 'auto';
      overlay._updatePosition();
      await nextRender();
      expect(overlay.hasAttribute(position === 'top' ? 'top-aligned' : 'bottom-aligned')).to.be.true;
      expect(overlay.$.content.scrollHeight).to.be.at.most(overlay.$.content.clientHeight);
    });
  });

  ['start', 'end'].forEach((position) => {
    ['ltr', 'rtl'].forEach((dir) => {
      describe(`${position} ${dir} offset fit`, () => {
        before(() => document.documentElement.setAttribute('dir', dir));
        after(() => document.documentElement.removeAttribute('dir'));
        it('should include the offset when flipping horizontally', async () => {
          tooltip.position = position;
          tooltip.style.setProperty('--vaadin-tooltip-offset-start', '10px');
          tooltip.style.setProperty('--vaadin-tooltip-offset-end', '10px');
          Object.assign(target.style, { position: 'fixed', margin: '0', top: '200px', left: '200px' });
          await nextUpdate(tooltip);
          await open();
          const side = (position === 'start') === (dir === 'ltr') ? 'left' : 'right';
          const available = overlay.$.overlay.offsetWidth + parseFloat(getComputedStyle(overlay)[side]) + 5;
          target.style.left = side === 'left' ? `${available}px` : 'auto';
          target.style.right = side === 'right' ? `${available}px` : 'auto';
          overlay._updatePosition();
          await nextRender();
          expect(overlay.hasAttribute(position === 'start' ? 'start-aligned' : 'end-aligned')).to.be.true;
          expect(overlay.$.content.scrollWidth).to.be.at.most(overlay.$.content.clientWidth);
        });
      });
    });
  });

  it('should keep the same side across repeated updates with asymmetric offsets', async () => {
    tooltip.position = 'bottom';
    tooltip.style.setProperty('--vaadin-tooltip-offset-top', '30px');
    tooltip.style.setProperty('--vaadin-tooltip-offset-bottom', '10px');
    Object.assign(target.style, { position: 'fixed', margin: '0', top: '200px', left: '200px' });
    await nextUpdate(tooltip);
    await open();
    const available = overlay.$.overlay.offsetHeight + parseFloat(getComputedStyle(overlay).bottom) + 15;
    target.style.top = 'auto';
    target.style.bottom = `${available}px`;
    for (let i = 0; i < 5; i++) {
      overlay._updatePosition();
      await nextRender();
      expect(overlay.hasAttribute('bottom-aligned')).to.be.true;
      expect(overlay.$.content.scrollHeight).to.be.at.most(overlay.$.content.clientHeight);
    }
  });

  ['top-start', 'top', 'top-end'].forEach((position) => {
    describe(`${position} offset`, () => {
      beforeEach(async () => {
        tooltip.position = position;
        await nextUpdate(tooltip);
        tooltip.style.setProperty('--vaadin-tooltip-offset-bottom', '10px');
        tooltip.style.setProperty('--vaadin-tooltip-offset-top', '10px');
      });

      it(`should use "--vaadin-tooltip-offset-bottom" for ${position} position by default (above target)`, async () => {
        await open();
        expect(getComputedStyle(overlay.$.overlay).marginBottom).to.equal('10px');
        expect(getComputedStyle(overlay.$.overlay).marginTop).to.equal('0px');
      });

      it(`should use "--vaadin-tooltip-offset-top" for ${position} position when flipped (below target)`, async () => {
        target.style.marginTop = 0;
        await open();
        expect(getComputedStyle(overlay.$.overlay).marginTop).to.equal('10px');
        expect(getComputedStyle(overlay.$.overlay).marginBottom).to.equal('0px');
      });
    });
  });

  ['bottom-start', 'bottom', 'bottom-end'].forEach((position) => {
    describe(`${position} offset`, () => {
      beforeEach(async () => {
        tooltip.position = position;
        await nextUpdate(tooltip);
        tooltip.style.setProperty('--vaadin-tooltip-offset-bottom', '10px');
        tooltip.style.setProperty('--vaadin-tooltip-offset-top', '10px');
      });

      it(`should use "--vaadin-tooltip-offset-top" for ${position} position by default (below target)`, async () => {
        await open();
        expect(getComputedStyle(overlay.$.overlay).marginTop).to.equal('10px');
        expect(getComputedStyle(overlay.$.overlay).marginBottom).to.equal('0px');
      });

      it(`should use "--vaadin-tooltip-offset-bottom" for ${position} position when flipped (above target)`, async () => {
        target.style.position = 'absolute';
        target.style.bottom = 0;
        target.style.marginBottom = 0;
        await open();
        expect(getComputedStyle(overlay.$.overlay).marginBottom).to.equal('10px');
        expect(getComputedStyle(overlay.$.overlay).marginTop).to.equal('0px');
      });
    });
  });

  ['start-top', 'start', 'start-bottom'].forEach((position) => {
    describe(`${position} offset`, () => {
      beforeEach(async () => {
        tooltip.position = position;
        await nextUpdate(tooltip);
        tooltip.style.setProperty('--vaadin-tooltip-offset-end', '10px');
        tooltip.style.setProperty('--vaadin-tooltip-offset-start', '10px');
      });

      it(`should use "--vaadin-tooltip-offset-end" for ${position} position by default (before target)`, async () => {
        await open();
        expect(getComputedStyle(overlay.$.overlay).marginInlineEnd).to.equal('10px');
        expect(getComputedStyle(overlay.$.overlay).marginInlineStart).to.equal('0px');
      });

      it(`should use "--vaadin-tooltip-offset-start" for ${position} position when flipped (after target)`, async () => {
        target.style.marginInlineStart = 0;
        await open();
        expect(getComputedStyle(overlay.$.overlay).marginInlineStart).to.equal('10px');
        expect(getComputedStyle(overlay.$.overlay).marginInlineEnd).to.equal('0px');
      });
    });
  });

  ['end-top', 'end', 'end-bottom'].forEach((position) => {
    describe(`${position} offset`, () => {
      beforeEach(async () => {
        tooltip.position = position;
        await nextUpdate(tooltip);
        tooltip.style.setProperty('--vaadin-tooltip-offset-start', '10px');
        tooltip.style.setProperty('--vaadin-tooltip-offset-end', '10px');
      });

      it(`should use "--vaadin-tooltip-offset-start" for ${position} position by default (after target)`, async () => {
        await open();
        expect(getComputedStyle(overlay.$.overlay).marginInlineStart).to.equal('10px');
        expect(getComputedStyle(overlay.$.overlay).marginInlineEnd).to.equal('0px');
      });

      it(`should use "--vaadin-tooltip-offset-end" for ${position} position when flipped (before target)`, async () => {
        target.style.position = 'absolute';
        target.style.right = 0;
        target.style.marginInlineEnd = 0;
        await open();
        expect(getComputedStyle(overlay.$.overlay).marginInlineEnd).to.equal('10px');
        expect(getComputedStyle(overlay.$.overlay).marginInlineStart).to.equal('0px');
      });
    });
  });
});

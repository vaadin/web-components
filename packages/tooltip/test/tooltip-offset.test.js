import { expect } from '@esm-bundle/chai';
import { fire, fixtureSync, oneEvent } from '@vaadin/testing-helpers';
import { Tooltip } from '../src/vaadin-tooltip.js';

describe('offset', () => {
  let tooltip, target, overlay;

  before(() => {
    Tooltip.setDefaultFocusDelay(0);
    Tooltip.setDefaultHoverDelay(0);
    Tooltip.setDefaultHideDelay(0);
  });

  beforeEach(() => {
    tooltip = fixtureSync('<vaadin-tooltip text="tooltip"></vaadin-tooltip>');
    target = fixtureSync('<div style="width: 100px; height: 100px; margin: 100px; outline: 1px solid red;"></div>');
    tooltip.target = target;
    overlay = tooltip.shadowRoot.querySelector('vaadin-tooltip-overlay');
  });

  async function open() {
    fire(target, 'mouseenter');
    await oneEvent(overlay, 'vaadin-overlay-open');
  }

  ['top-start', 'top', 'top-end'].forEach((position) => {
    describe(`${position} offset`, () => {
      beforeEach(() => {
        tooltip.position = position;
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
      beforeEach(() => {
        tooltip.position = position;
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
      beforeEach(() => {
        tooltip.position = position;
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
      beforeEach(() => {
        tooltip.position = position;
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

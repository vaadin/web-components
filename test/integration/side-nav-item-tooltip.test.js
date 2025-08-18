import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import './not-animated-styles.js';
import '@vaadin/side-nav/src/vaadin-side-nav.js';
import { Tooltip } from '@vaadin/tooltip/src/vaadin-tooltip.js';
import { mouseenter, mouseleave } from '@vaadin/tooltip/test/helpers.js';

describe('side-nav-item with tooltip', () => {
  let sideNav, tooltip, tooltipOverlay, items, itemWithTooltip, labelForItemWithChildren;

  before(() => {
    Tooltip.setDefaultFocusDelay(0);
    Tooltip.setDefaultHoverDelay(0);
    Tooltip.setDefaultHideDelay(0);
  });

  describe('default', () => {
    beforeEach(async () => {
      sideNav = fixtureSync(`
        <vaadin-side-nav>
          <vaadin-side-nav-item path="/foo"><span>Foo</span></vaadin-side-nav-item>
          <vaadin-side-nav-item path="/bar">
            <span id="label-for-item-with-children">Bar</span>
            <vaadin-tooltip slot="tooltip" text="Simple tooltip for side nav item"></vaadin-tooltip>
            <vaadin-side-nav-item path="/bar/baz" slot="children"><span>Baz</span></vaadin-side-nav-item>
            <vaadin-side-nav-item path="/bar/qux" slot="children"><span>Qux</span></vaadin-side-nav-item>
          </vaadin-side-nav-item>
        </vaadin-side-nav>
      `);

      await nextRender();
      items = [...sideNav.querySelectorAll('vaadin-side-nav-item')];
      itemWithTooltip = items[1];
      tooltip = itemWithTooltip.querySelector('vaadin-tooltip');
      tooltipOverlay = tooltip.shadowRoot.querySelector('vaadin-tooltip-overlay');
      labelForItemWithChildren = itemWithTooltip.querySelector('#label-for-item-with-children');
    });

    it('should set tooltip target', () => {
      expect(tooltip.target).to.equal(itemWithTooltip.$.content);
    });

    it('should set tooltip ariaTarget', () => {
      expect(tooltip.ariaTarget).to.equal(labelForItemWithChildren);
    });

    it('label has aria-describedby matching tooltip', () => {
      const describedBy = labelForItemWithChildren.getAttribute('aria-describedby');
      expect(describedBy).to.be.not.null;
      const tooltipTextWrapper = sideNav.querySelector(`#${describedBy}`);
      expect(tooltipTextWrapper).to.be.not.null;
      expect(tooltipTextWrapper.innerText).to.eq('Simple tooltip for side nav item');
    });

    it('should or should not show tooltip', () => {
      mouseenter(itemWithTooltip.$.content);
      expect(tooltipOverlay.opened).to.be.true;
      mouseleave(itemWithTooltip.$.content);
      expect(tooltipOverlay.opened).to.be.false;
    });

    it('tooltip text matches template defined', () => {
      mouseenter(itemWithTooltip.$.content);
      expect(tooltip.textContent).to.equal('Simple tooltip for side nav item');
    });

    it('should not show tooltip on child side nav item mouseenter when open', async () => {
      mouseenter(itemWithTooltip);
      itemWithTooltip.click();
      await nextRender();
      mouseenter(items[2].$.content);
      await nextRender();
      expect(tooltipOverlay.opened).to.be.not.ok;
    });
  });
});

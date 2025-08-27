import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import './not-animated-styles.js';
import '@vaadin/side-nav/src/vaadin-side-nav-item.js';
import { Tooltip } from '@vaadin/tooltip/src/vaadin-tooltip.js';
import { mouseenter, mouseleave } from '@vaadin/tooltip/test/helpers.js';

describe('side-nav-item with tooltip', () => {
  let item, tooltip, tooltipOverlay, srOnly;

  before(() => {
    Tooltip.setDefaultFocusDelay(0);
    Tooltip.setDefaultHoverDelay(0);
    Tooltip.setDefaultHideDelay(0);
  });

  beforeEach(async () => {
    item = fixtureSync(`
      <vaadin-side-nav-item path="/parent">
        Parent
        <vaadin-tooltip slot="tooltip" text="Tooltip text"></vaadin-tooltip>
        <vaadin-side-nav-item path="/parent/child" slot="children">Child</vaadin-side-nav-item>
      </vaadin-side-nav-item>
    `);
    await nextRender();
    tooltip = item.querySelector('vaadin-tooltip');
    tooltipOverlay = tooltip.shadowRoot.querySelector('vaadin-tooltip-overlay');
    srOnly = item.shadowRoot.querySelector('.sr-only');
  });

  it('should set tooltip target to the item content part', () => {
    expect(tooltip.target).to.equal(item.$.content);
  });

  it('should set tooltip ariaTarget to null', () => {
    expect(tooltip.ariaTarget).to.be.null;
  });

  it('should set aria-hidden: none on the tooltip', () => {
    expect(tooltip.getAttribute('aria-hidden')).to.equal('true');
  });

  it('should toggle tooltip on item content mouseenter', () => {
    mouseenter(item.$.content);
    expect(tooltipOverlay.opened).to.be.true;

    mouseleave(item.$.content);
    expect(tooltipOverlay.opened).to.be.false;
  });

  it('should not show tooltip on child item mouseenter', async () => {
    item.click();
    const child = item.querySelector('vaadin-side-nav-item');
    mouseenter(child.$.content);
    await nextRender();
    expect(tooltipOverlay.opened).to.be.not.ok;
  });

  it('should use tooltip text for the sr-only element text content', async () => {
    expect(srOnly.textContent).to.equal(tooltip.text);

    tooltip.text = 'Other text';
    await nextRender();

    expect(srOnly.textContent).to.equal('Other text');
  });

  it('should use tooltip generator for the sr-only element text content', async () => {
    expect(srOnly.textContent).to.equal(tooltip.text);

    tooltip.generator = () => 'Other text';
    await nextRender();

    expect(srOnly.textContent).to.equal('Other text');
  });

  it('should clear the sr-only element content when tooltip is removed', async () => {
    tooltip.remove();
    await nextRender();

    expect(srOnly.textContent).to.equal('');
  });
});

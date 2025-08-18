import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import './not-animated-styles.js';
import '@vaadin/side-nav/src/vaadin-side-nav-item.js';
import { Tooltip } from '@vaadin/tooltip/src/vaadin-tooltip.js';
import { mouseenter, mouseleave } from '@vaadin/tooltip/test/helpers.js';

describe('side-nav-item with tooltip', () => {
  let item, content, tooltip, tooltipOverlay;

  before(() => {
    Tooltip.setDefaultFocusDelay(0);
    Tooltip.setDefaultHoverDelay(0);
    Tooltip.setDefaultHideDelay(0);
  });

  beforeEach(async () => {
    item = fixtureSync(`
      <vaadin-side-nav-item path="/parent">
        <span id="parent-content">Parent</span>
        <vaadin-tooltip slot="tooltip" text="Tooltip text"></vaadin-tooltip>
        <vaadin-side-nav-item path="/parent/child" slot="children"><span>Child</span></vaadin-side-nav-item>
      </vaadin-side-nav-item>
    `);
    await nextRender();
    tooltip = item.querySelector('vaadin-tooltip');
    tooltipOverlay = tooltip.shadowRoot.querySelector('vaadin-tooltip-overlay');
    content = item.querySelector('#parent-content');
  });

  it('should set tooltip target to the item content part', () => {
    expect(tooltip.target).to.equal(item.$.content);
  });

  it('should set tooltip ariaTarget to the slotted content', () => {
    expect(tooltip.ariaTarget).to.equal(content);
  });

  it('should set tooltip ariaTarget on the item when content is removed', async () => {
    content.remove();
    await nextRender();
    expect(tooltip.ariaTarget).to.equal(item);
  });

  it('should set tooltip ariaTarget on the item when content is added', async () => {
    content.remove();
    await nextRender();

    const newContent = document.createElement('span');
    newContent.textContent = 'New parent';
    item.appendChild(newContent);
    await nextRender();

    expect(tooltip.ariaTarget).to.equal(newContent);
  });

  it('should set aria-describedby on the slotted content', () => {
    const label = tooltip.querySelector('[role="tooltip"]');
    expect(content.getAttribute('aria-describedby')).to.equal(label.id);
  });

  it('should toggle tooltip on item content mouseenter', () => {
    mouseenter(item.$.content);
    expect(tooltipOverlay.opened).to.be.true;

    mouseleave(item.$.content);
    expect(tooltipOverlay.opened).to.be.false;
  });

  it('should not show tooltip on child item mouseenter when open', async () => {
    item.click();
    const child = item.querySelector('vaadin-side-nav-item');
    mouseenter(child.$.content);
    await nextRender();
    expect(tooltipOverlay.opened).to.be.not.ok;
  });
});

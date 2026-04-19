import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-breadcrumb.js';
import type { Breadcrumb } from '../src/vaadin-breadcrumb.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.breadcrumbComponent = true;

describe('vaadin-breadcrumb overflow', () => {
  let wrapper: HTMLDivElement;
  let breadcrumb: Breadcrumb;

  beforeEach(async () => {
    wrapper = fixtureSync(`
      <div style="width: 200px;">
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/a">Category A</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/a/b">Sub Category</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/a/b/c">Product Group</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      </div>
    `);
    breadcrumb = wrapper.querySelector('vaadin-breadcrumb')!;
    await nextRender();
    await aTimeout(0);
  });

  it('should show all items and no overflow button when all items fit', async () => {
    // Make container wide enough for all items
    wrapper.style.width = '2000px';
    breadcrumb.dispatchEvent(new Event('resize'));
    await nextRender();
    await aTimeout(0);

    const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item');
    for (const item of items) {
      expect(item.style.visibility).to.not.equal('hidden');
    }

    const overflowButton = breadcrumb.querySelector('[data-overflow]');
    expect(overflowButton).to.be.null;
  });

  it('should show an ellipsis overflow button when items overflow', () => {
    const overflowButton = breadcrumb.querySelector('[data-overflow]');
    expect(overflowButton).to.be.ok;
    expect(overflowButton!.textContent).to.equal('\u2026');
  });

  it('should collapse the item at index 1 first (closest to root)', () => {
    const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item');
    // Index 1 should be the first to be collapsed
    expect(items[1].style.visibility).to.equal('hidden');
  });

  it('should keep the root item (index 0) visible while intermediate items are collapsed', () => {
    const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item');
    // Check if any intermediate is collapsed
    const hasCollapsedIntermediate = Array.from(items).some(
      (item, i) => i > 0 && i < items.length - 1 && item.style.visibility === 'hidden',
    );
    expect(hasCollapsedIntermediate).to.be.true;

    // If not all intermediates are collapsed, root should be visible
    const allIntermediatesCollapsed = Array.from(items).every(
      (item, i) => i === 0 || i === items.length - 1 || item.style.visibility === 'hidden',
    );

    if (!allIntermediatesCollapsed) {
      expect(items[0].style.visibility).to.not.equal('hidden');
    }
  });

  it('should never collapse the last item (current page)', () => {
    const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item');
    const lastItem = items[items.length - 1];
    expect(lastItem.style.visibility).to.not.equal('hidden');
  });

  it('should collapse root when all intermediates are collapsed and still overflows', async () => {
    // Make very narrow to force all collapses including root
    wrapper.style.width = '80px';
    breadcrumb.dispatchEvent(new Event('resize'));
    await nextRender();
    await aTimeout(0);

    const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item');

    // All intermediates should be collapsed
    for (let i = 1; i < items.length - 1; i++) {
      expect(items[i].style.visibility).to.equal('hidden');
    }

    // Root should also be collapsed
    expect(items[0].style.visibility).to.equal('hidden');

    // Last item (current page) should still be visible
    expect(items[items.length - 1].style.visibility).to.not.equal('hidden');
  });

  it('should position the overflow button after the last visible item that precedes the collapsed range', () => {
    const overflowButton = breadcrumb.querySelector('[data-overflow]') as HTMLElement;
    expect(overflowButton).to.be.ok;

    const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item');

    // Root (index 0) should be visible, and the overflow button should follow it
    // since index 1 is the first to collapse
    expect(items[0].style.visibility).to.not.equal('hidden');
    expect(overflowButton.previousElementSibling === items[0]).to.be.true;
  });

  it('should restore collapsed items and hide overflow button when container expands', async () => {
    // Verify overflow is currently active
    expect(breadcrumb.querySelector('[data-overflow]')).to.be.ok;

    // Expand container to fit all items
    wrapper.style.width = '2000px';
    breadcrumb.dispatchEvent(new Event('resize'));
    await nextRender();
    await aTimeout(0);

    const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item');
    for (const item of items) {
      expect(item.style.visibility).to.not.equal('hidden');
    }

    const overflowButton = breadcrumb.querySelector('[data-overflow]');
    expect(overflowButton).to.be.null;
  });

  it('should have aria-haspopup="true" on the overflow button', () => {
    const overflowButton = breadcrumb.querySelector('[data-overflow]');
    expect(overflowButton).to.be.ok;
    expect(overflowButton!.getAttribute('aria-haspopup')).to.equal('true');
  });

  it('should set aria-label on overflow button matching i18n.moreItems', () => {
    const overflowButton = breadcrumb.querySelector('[data-overflow]');
    expect(overflowButton).to.be.ok;
    expect(overflowButton!.getAttribute('aria-label')).to.equal('Show collapsed items');
  });

  it('should update aria-label when i18n is changed', async () => {
    (breadcrumb as any).i18n = { moreItems: 'Vis skjulte elementer' };
    await nextRender();
    await aTimeout(0);

    // Need to trigger overflow again since the button may have been recreated
    wrapper.style.width = '200px';
    breadcrumb.dispatchEvent(new Event('resize'));
    await nextRender();
    await aTimeout(0);

    const overflowButton = breadcrumb.querySelector('[data-overflow]');
    expect(overflowButton).to.be.ok;
    expect(overflowButton!.getAttribute('aria-label')).to.equal('Vis skjulte elementer');
  });
});

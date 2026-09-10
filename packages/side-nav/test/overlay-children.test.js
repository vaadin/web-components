import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-side-nav.js';

describe('overlay children', () => {
  let sideNav, items;

  beforeEach(async () => {
    sideNav = fixtureSync(`
      <vaadin-side-nav overlay-children>
        <vaadin-side-nav-item path="/dashboard">Dashboard</vaadin-side-nav-item>
        <vaadin-side-nav-item path="/data">
          Data
          <vaadin-side-nav-item path="/data/grid" slot="children">Grid</vaadin-side-nav-item>
          <vaadin-side-nav-item path="/data/crud" slot="children">CRUD</vaadin-side-nav-item>
        </vaadin-side-nav-item>
      </vaadin-side-nav>
    `);
    await nextRender();
    items = [...sideNav.querySelectorAll(':scope > vaadin-side-nav-item')];
  });

  const flyout = (item) => item.shadowRoot.querySelector('vaadin-side-nav-overlay');
  const list = (item) => item.shadowRoot.querySelector('[part="children"]');

  describe('rendering', () => {
    it('should propagate overlayChildren to top-level items only', () => {
      expect(items.every((item) => item.overlayChildren)).to.be.true;
      expect(items[1]._items.some((item) => item.overlayChildren)).to.be.false;
    });

    it('should render the child list inside the flyout', () => {
      expect(flyout(items[1])).to.exist;
      expect(list(items[1]).parentNode).to.equal(flyout(items[1]));
    });

    it('should render the child list inline when overlayChildren is disabled', async () => {
      sideNav.overlayChildren = false;
      await nextRender();
      expect(flyout(items[1])).to.not.exist;
      expect(list(items[1]).parentNode).to.equal(items[1].shadowRoot);
    });

    it('should keep child items in the light DOM of their parent item', () => {
      expect(items[1]._items).to.have.lengthOf(2);
      expect(items[1]._items[0].closest('vaadin-side-nav')).to.equal(sideNav);
    });

    it('should not open the flyout for an item without children', async () => {
      items[0].expanded = true;
      await nextUpdate(items[0]);
      expect(flyout(items[0]).opened).to.be.false;
    });
  });

  describe('opening', () => {
    it('should toggle the flyout with the expanded property', async () => {
      items[1].expanded = true;
      await nextUpdate(items[1]);
      expect(flyout(items[1]).opened).to.be.true;

      items[1].expanded = false;
      await nextUpdate(items[1]);
      expect(flyout(items[1]).opened).to.be.false;
    });

    it('should reset expanded when the flyout closes itself', async () => {
      items[1].expanded = true;
      await nextUpdate(items[1]);

      flyout(items[1]).close();
      await nextUpdate(items[1]);
      expect(items[1].expanded).to.be.false;
    });

    it('should position the flyout against the item content', () => {
      expect(flyout(items[1]).positionTarget).to.equal(items[1].$.content);
    });

    it('should open the flyout on the toggle button click', async () => {
      items[1]._button.click();
      await nextUpdate(items[1]);
      expect(flyout(items[1]).opened).to.be.true;
    });
  });

  describe('hover', () => {
    let clock, canHover;

    beforeEach(() => {
      clock = sinon.useFakeTimers({ shouldClearNativeTimers: true });
      // Force the hover-capable branch regardless of the test runner's device
      canHover = sinon.stub(window, 'matchMedia').returns({ matches: true });
    });

    afterEach(() => {
      clock.restore();
      canHover.restore();
    });

    it('should open the flyout after the pointer rests on the item', async () => {
      items[1].dispatchEvent(new PointerEvent('pointerenter'));
      expect(items[1].expanded).to.be.false;

      await clock.tickAsync(100);
      expect(items[1].expanded).to.be.true;
    });

    it('should not open the flyout when the pointer only passes over the item', async () => {
      items[1].dispatchEvent(new PointerEvent('pointerenter'));
      await clock.tickAsync(50);
      items[1].dispatchEvent(new PointerEvent('pointerleave'));

      await clock.tickAsync(100);
      expect(items[1].expanded).to.be.false;
    });

    it('should close the flyout after the pointer leaves the item', async () => {
      items[1].dispatchEvent(new PointerEvent('pointerenter'));
      await clock.tickAsync(100);

      items[1].dispatchEvent(new PointerEvent('pointerleave'));
      await clock.tickAsync(300);
      expect(items[1].expanded).to.be.false;
    });

    it('should keep the flyout open when the pointer returns within the grace period', async () => {
      items[1].dispatchEvent(new PointerEvent('pointerenter'));
      await clock.tickAsync(100);

      items[1].dispatchEvent(new PointerEvent('pointerleave'));
      await clock.tickAsync(100);
      items[1].dispatchEvent(new PointerEvent('pointerenter'));
      await clock.tickAsync(300);
      expect(items[1].expanded).to.be.true;
    });

    it('should not open the flyout of a disabled item', async () => {
      items[1].disabled = true;
      items[1].dispatchEvent(new PointerEvent('pointerenter'));
      await clock.tickAsync(100);
      expect(items[1].expanded).to.be.false;
    });
  });

  describe('click without hover', () => {
    let canHover;

    beforeEach(() => {
      canHover = sinon.stub(window, 'matchMedia').returns({ matches: false });
    });

    afterEach(() => {
      canHover.restore();
    });

    it('should open the flyout instead of navigating', async () => {
      const stub = sinon.stub(items[1].$.link, 'click');
      items[1].$.content.click();
      await nextUpdate(items[1]);

      expect(items[1].expanded).to.be.true;
      expect(stub).to.not.be.called;
    });

    it('should navigate when the item has no children', () => {
      const stub = sinon.stub(items[0].$.link, 'click');
      items[0].$.content.click();
      expect(stub).to.be.calledOnce;
    });
  });

  describe('current item', () => {
    beforeEach(async () => {
      history.pushState({}, '', '/data/grid');
      window.dispatchEvent(new CustomEvent('side-nav-location-changed'));
      await nextRender();
    });

    afterEach(() => {
      history.pushState({}, '', '/');
      window.dispatchEvent(new CustomEvent('side-nav-location-changed'));
    });

    it('should not open the flyout that holds the current item', () => {
      expect(items[1].expanded).to.be.false;
      expect(flyout(items[1]).opened).to.be.false;
    });

    it('should mark the ancestor item with has-current-child', () => {
      expect(items[1].hasAttribute('has-current-child')).to.be.true;
      expect(items[0].hasAttribute('has-current-child')).to.be.false;
    });

    it('should clear has-current-child when navigating away', async () => {
      history.pushState({}, '', '/dashboard');
      window.dispatchEvent(new CustomEvent('side-nav-location-changed'));
      await nextRender();
      expect(items[1].hasAttribute('has-current-child')).to.be.false;
    });
  });

  describe('accessibility', () => {
    it('should reference the child list from the toggle button', () => {
      const controls = items[1]._button.getAttribute('aria-controls');
      expect(items[1].shadowRoot.getElementById(controls)).to.equal(list(items[1]));
    });

    it('should keep the child items in document order for tab navigation', async () => {
      items[1].expanded = true;
      await oneEvent(flyout(items[1]), 'vaadin-overlay-open');

      const position = items[1].compareDocumentPosition(items[1]._items[0]);
      expect(position & Node.DOCUMENT_POSITION_CONTAINED_BY).to.be.above(0);
    });
  });
});

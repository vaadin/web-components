import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-side-nav.js';
import { getTabbableElements } from '@vaadin/a11y-base/src/focus-utils.js';

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

    it('should lay the child list out in place when overlayChildren is disabled', async () => {
      sideNav.overlayChildren = false;
      await nextRender();
      // The flyout element stays in the tree so that the children slot is never
      // replaced, but it must not generate any box of its own
      expect(flyout(items[1]).opened).to.be.false;
      expect(getComputedStyle(flyout(items[1])).display).to.equal('contents');
    });

    it('should keep tracking child items after toggling overlayChildren', async () => {
      sideNav.overlayChildren = false;
      await nextRender();
      sideNav.overlayChildren = true;
      await nextRender();

      const item = fixtureSync('<vaadin-side-nav-item slot="children" path="/data/new">New</vaadin-side-nav-item>');
      items[1].appendChild(item);
      await nextRender();

      expect(items[1]._items).to.have.lengthOf(3);
      expect(items[1].hasAttribute('has-children')).to.be.true;
    });

    it('should open the flyout of an item built before it was attached', async () => {
      const nav = fixtureSync('<vaadin-side-nav overlay-children></vaadin-side-nav>');
      const item = document.createElement('vaadin-side-nav-item');
      const child = document.createElement('vaadin-side-nav-item');
      child.setAttribute('slot', 'children');
      child.setAttribute('path', '/built/child');
      item.appendChild(child);
      nav.appendChild(item);
      await nextRender();

      item.expanded = true;
      await nextUpdate(item);
      expect(flyout(item).opened).to.be.true;
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

    it('should not render a toggle button, the item itself is the trigger', () => {
      expect(items[1]._button).to.not.exist;
    });

    it('should mark the item whose flyout is open', async () => {
      const closed = getComputedStyle(items[1].$.content).backgroundColor;
      items[1].expanded = true;
      await nextUpdate(items[1]);
      const open = getComputedStyle(items[1].$.content).backgroundColor;

      expect(open).to.not.equal(closed);
    });

    it('should not mark the item when its children render inline', async () => {
      sideNav.overlayChildren = false;
      await nextRender();
      const closed = getComputedStyle(items[1].$.content).backgroundColor;
      items[1].expanded = true;
      await nextUpdate(items[1]);

      expect(getComputedStyle(items[1].$.content).backgroundColor).to.equal(closed);
    });

    it('should still show an indicator that the item has child items', () => {
      const indicator = items[1].shadowRoot.querySelector('[part="toggle-button"]');
      expect(indicator).to.exist;
      expect(getComputedStyle(indicator).display).to.not.equal('none');
    });

    it('should show the indicator on a nested item with its own flyout', async () => {
      const nested = items[1]._items[0];
      nested.overlayChildren = true;
      const child = fixtureSync('<vaadin-side-nav-item slot="children" path="/deep">Deep</vaadin-side-nav-item>');
      nested.appendChild(child);
      await nextRender();

      const indicator = nested.shadowRoot.querySelector('[part="toggle-button"]');
      expect(indicator).to.exist;
      expect(getComputedStyle(indicator).display).to.not.equal('none');
    });

    it('should not make the indicator focusable', () => {
      const indicator = items[1].shadowRoot.querySelector('[part="toggle-button"]');
      expect(indicator.tabIndex).to.be.below(0);
      expect(getTabbableElements(items[1])).to.have.lengthOf(1);
    });

    it('should render the toggle button when overlayChildren is disabled', async () => {
      sideNav.overlayChildren = false;
      await nextRender();
      expect(items[1]._button).to.exist;
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

    it('should not expand an item that has no child items', async () => {
      const spy = sinon.spy();
      items[0].addEventListener('expanded-changed', spy);
      items[0].dispatchEvent(new PointerEvent('pointerenter'));
      await clock.tickAsync(100);

      expect(items[0].expanded).to.be.false;
      expect(spy).to.not.be.called;
    });

    it('should use the hoverDelay and hideDelay properties', async () => {
      items[1].hoverDelay = 250;
      items[1].hideDelay = 50;

      items[1].dispatchEvent(new PointerEvent('pointerenter'));
      await clock.tickAsync(100);
      expect(items[1].expanded).to.be.false;
      await clock.tickAsync(150);
      expect(items[1].expanded).to.be.true;

      items[1].dispatchEvent(new PointerEvent('pointerleave'));
      await clock.tickAsync(50);
      expect(items[1].expanded).to.be.false;
    });

    it('should not close a flyout that contains focus', async () => {
      items[1].dispatchEvent(new PointerEvent('pointerenter'));
      await clock.tickAsync(100);

      items[1]._items[0].shadowRoot.querySelector('a').focus();
      items[1].dispatchEvent(new PointerEvent('pointerleave'));
      await clock.tickAsync(300);

      expect(items[1].expanded).to.be.true;
    });
  });

  describe('one flyout at a time', () => {
    let clock, canHover, sibling;

    beforeEach(async () => {
      sibling = fixtureSync(`
        <vaadin-side-nav-item path="/reports">
          Reports
          <vaadin-side-nav-item path="/reports/daily" slot="children">Daily</vaadin-side-nav-item>
        </vaadin-side-nav-item>
      `);
      sideNav.appendChild(sibling);
      await nextRender();
      clock = sinon.useFakeTimers({ shouldClearNativeTimers: true });
      canHover = sinon.stub(window, 'matchMedia').returns({ matches: true });
    });

    afterEach(() => {
      clock.restore();
      canHover.restore();
    });

    it('should close the sibling flyout when another one opens', async () => {
      items[1].expanded = true;
      await clock.tickAsync(0);
      sibling.expanded = true;
      await clock.tickAsync(0);

      expect(items[1].expanded).to.be.false;
      expect(sibling.expanded).to.be.true;
    });

    it('should switch without a delay while a flyout in the group is open', async () => {
      items[1].dispatchEvent(new PointerEvent('pointerenter'));
      await clock.tickAsync(100);
      expect(items[1].expanded).to.be.true;

      items[1].dispatchEvent(new PointerEvent('pointerleave'));
      sibling.dispatchEvent(new PointerEvent('pointerenter'));
      await clock.tickAsync(0);

      expect(sibling.expanded).to.be.true;
      expect(items[1].expanded).to.be.false;
    });
  });

  describe('closing on navigation', () => {
    let blockNavigation;

    beforeEach(async () => {
      blockNavigation = (event) => event.preventDefault();
      document.addEventListener('click', blockNavigation);
      items[1].expanded = true;
      await nextUpdate(items[1]);
    });

    afterEach(() => {
      document.removeEventListener('click', blockNavigation);
    });

    const clickChildLink = (modifiers = {}) => {
      const anchor = items[1]._items[0].shadowRoot.querySelector('a');
      anchor.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, cancelable: true, ...modifiers }));
    };

    it('should close the flyout when a child item is activated', async () => {
      clickChildLink();
      await nextUpdate(items[1]);
      expect(items[1].expanded).to.be.false;
    });

    it('should keep the flyout open for a click that stays on the page', async () => {
      clickChildLink({ metaKey: true });
      await nextUpdate(items[1]);
      expect(items[1].expanded).to.be.true;
    });
  });

  describe('parent link in the flyout', () => {
    const parentLink = (item) => item.shadowRoot.querySelector('[part="parent-link"]');

    it('should repeat the item page as the first entry of its flyout', () => {
      const link = parentLink(items[1]);
      expect(link).to.exist;
      expect(link.getAttribute('href')).to.equal('/data');
      expect(link.textContent.trim()).to.equal('Data');
    });

    it('should place the parent link before the child items', () => {
      const first = list(items[1]).firstElementChild;
      expect(first.getAttribute('part')).to.equal('parent-link-item');
    });

    it('should not repeat the page for an item that has no path', async () => {
      const group = fixtureSync(`
        <vaadin-side-nav-item>
          Reports
          <vaadin-side-nav-item path="/reports/daily" slot="children">Daily</vaadin-side-nav-item>
        </vaadin-side-nav-item>
      `);
      sideNav.appendChild(group);
      await nextRender();
      expect(parentLink(group)).to.not.exist;
    });

    it('should not repeat the page for an item that has no children', () => {
      expect(parentLink(items[0])).to.not.exist;
    });

    it('should mark the parent link as current when the item is current', async () => {
      history.pushState({}, '', '/data');
      window.dispatchEvent(new CustomEvent('side-nav-location-changed'));
      await nextRender();
      expect(parentLink(items[1]).getAttribute('aria-current')).to.equal('page');

      history.pushState({}, '', '/');
      window.dispatchEvent(new CustomEvent('side-nav-location-changed'));
    });

    it('should carry the page on a separate control from the trigger', () => {
      // On touch, tapping the item opens the flyout instead of navigating, so
      // the page has to be reachable from a control that is not the trigger
      const link = parentLink(items[1]);
      expect(link).to.not.equal(items[1].shadowRoot.getElementById('link'));
      expect(link.getAttribute('href')).to.equal(items[1].path);
    });

    // Visibility is driven by `@media (hover: hover)`, which the test runner
    // cannot emulate; covered manually and in the Playwright walkthrough.
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

  describe('keyboard', () => {
    let group;

    const trigger = (item) => item.shadowRoot.getElementById('link');
    const deepActive = () => {
      let el = document.activeElement;
      while (el && el.shadowRoot && el.shadowRoot.activeElement) {
        el = el.shadowRoot.activeElement;
      }
      return el;
    };

    beforeEach(async () => {
      // A pathless parent, the case that had no focusable element at all
      group = fixtureSync(`
        <vaadin-side-nav-item>
          Reports
          <vaadin-side-nav-item path="/reports/daily" slot="children">Daily</vaadin-side-nav-item>
          <vaadin-side-nav-item path="/reports/weekly" slot="children">Weekly</vaadin-side-nav-item>
        </vaadin-side-nav-item>
      `);
      sideNav.appendChild(group);
      await nextRender();
    });

    it('should make every enabled item focusable', () => {
      [items[0], items[1], group].forEach((item) => {
        expect(getTabbableElements(item)).to.have.lengthOf(1);
      });
    });

    it('should not make a disabled item focusable', async () => {
      group.disabled = true;
      await nextUpdate(group);
      expect(getTabbableElements(group)).to.be.empty;
    });

    it('should open the flyout and focus its first item on arrow key', async () => {
      trigger(group).focus();
      await sendKeys({ press: 'ArrowRight' });
      await nextRender();

      expect(group.expanded).to.be.true;
      expect(deepActive()).to.equal(trigger(group._items[0]));
    });

    it('should close the flyout and restore focus on the opposite arrow key', async () => {
      trigger(group).focus();
      await sendKeys({ press: 'ArrowRight' });
      await nextRender();
      await sendKeys({ press: 'ArrowLeft' });
      await nextRender();

      expect(group.expanded).to.be.false;
      expect(deepActive()).to.equal(trigger(group));
    });

    it('should mirror the arrow keys in RTL', async () => {
      document.documentElement.setAttribute('dir', 'rtl');
      await nextRender();
      trigger(group).focus();
      await sendKeys({ press: 'ArrowLeft' });
      await nextRender();

      expect(group.expanded).to.be.true;
      document.documentElement.removeAttribute('dir');
    });

    it('should toggle a pathless trigger with Enter', async () => {
      trigger(group).focus();
      await sendKeys({ press: 'Enter' });
      await nextRender();
      expect(group.expanded).to.be.true;
    });

    it('should not toggle the flyout with Enter when the item has a path', async () => {
      trigger(items[1]).focus();
      await sendKeys({ press: 'ArrowRight' });
      await nextRender();
      expect(items[1].expanded).to.be.true;
    });

    it('should not open the flyout merely by focusing the item', async () => {
      trigger(group).focus();
      await nextRender();
      expect(group.expanded).to.be.false;
    });

    it('should close the flyout and restore focus on Escape', async () => {
      trigger(group).focus();
      await sendKeys({ press: 'ArrowRight' });
      await nextRender();
      await sendKeys({ press: 'Escape' });
      await nextRender();

      expect(group.expanded).to.be.false;
      expect(deepActive()).to.equal(trigger(group));
    });

    it('should move focus from the last child item to the next item', async () => {
      trigger(group).focus();
      await sendKeys({ press: 'ArrowRight' });
      await nextRender();
      // first child -> second child -> out of the flyout
      await sendKeys({ press: 'Tab' });
      expect(deepActive()).to.equal(trigger(group._items[1]));

      await sendKeys({ press: 'Tab' });
      await nextRender();
      expect(deepActive()).to.not.equal(trigger(group._items[1]));
    });

    it('should close the flyout once focus leaves it', async () => {
      trigger(group).focus();
      await sendKeys({ press: 'ArrowRight' });
      await nextRender();
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Tab' });
      await nextRender();

      expect(group.expanded).to.be.false;
    });
  });

  describe('accessibility', () => {
    const trigger = (item) => item.shadowRoot.getElementById('link');

    it('should reference the child list from the trigger', () => {
      const controls = trigger(items[1]).getAttribute('aria-controls');
      expect(items[1].shadowRoot.getElementById(controls)).to.equal(list(items[1]));
    });

    it('should expose the disclosure state on the trigger', async () => {
      expect(trigger(items[1]).getAttribute('aria-haspopup')).to.equal('true');
      expect(trigger(items[1]).getAttribute('aria-expanded')).to.equal('false');

      items[1].expanded = true;
      await nextUpdate(items[1]);
      expect(trigger(items[1]).getAttribute('aria-expanded')).to.equal('true');
    });

    it('should not mark an item without children as a popup trigger', () => {
      expect(trigger(items[0]).hasAttribute('aria-haspopup')).to.be.false;
      expect(trigger(items[0]).hasAttribute('aria-expanded')).to.be.false;
    });

    it('should keep the child items in document order for tab navigation', async () => {
      items[1].expanded = true;
      await oneEvent(flyout(items[1]), 'vaadin-overlay-open');

      const position = items[1].compareDocumentPosition(items[1]._items[0]);
      expect(position & Node.DOCUMENT_POSITION_CONTAINED_BY).to.be.above(0);
    });
  });
});

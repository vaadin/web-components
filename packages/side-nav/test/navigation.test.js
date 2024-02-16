import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-side-nav-item.js';
import { SideNav } from '../vaadin-side-nav.js';

describe('navigation', () => {
  let sideNav, items;

  function navigate(url) {
    history.pushState({}, '', url);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  beforeEach(async () => {
    sideNav = fixtureSync(`
      <vaadin-side-nav>
        <vaadin-side-nav-item path="/1">1</vaadin-side-nav-item>
        <vaadin-side-nav-item path="/2">
          2
          <vaadin-side-nav-item slot="children" path="/21">21</vaadin-side-nav-item>
          <vaadin-side-nav-item slot="children" path="/22">22</vaadin-side-nav-item>
        </vaadin-side-nav-item>
      </vaadin-side-nav>
    `);
    items = sideNav.querySelectorAll('vaadin-side-nav-item');
    await nextRender();
  });

  it('should update current attribute on items when navigating', async () => {
    navigate('1');
    await nextRender();

    expect(items[0].hasAttribute('current')).to.be.true;
    expect(items[1].hasAttribute('current')).to.be.false;
    expect(items[2].hasAttribute('current')).to.be.false;

    navigate('2');
    await nextRender();

    expect(items[0].hasAttribute('current')).to.be.false;
    expect(items[1].hasAttribute('current')).to.be.true;
    expect(items[2].hasAttribute('current')).to.be.false;

    navigate('21');
    await nextRender();

    expect(items[0].hasAttribute('current')).to.be.false;
    expect(items[1].hasAttribute('current')).to.be.false;
    expect(items[2].hasAttribute('current')).to.be.true;
  });

  it('should not set expanded attribute on the current leaf item', async () => {
    navigate('1');
    await nextRender();
    expect(items[0].hasAttribute('expanded')).to.be.false;
  });

  it('should set expanded attribute on the current item with children', async () => {
    navigate('2');
    await nextRender();
    expect(items[1].hasAttribute('expanded')).to.be.true;
  });

  it('should update current attribute on location change', async () => {
    history.pushState({}, '', '1');
    sideNav.location = '1';

    await nextRender();

    expect(items[0].hasAttribute('current')).to.be.true;
    expect(items[1].hasAttribute('current')).to.be.false;
    expect(items[2].hasAttribute('current')).to.be.false;
  });
});

describe('custom item click actions', () => {
  let sideNav, sideNavItem;
  let clickListener;

  function clickItemLink(item, props = {}) {
    const itemLink = item.shadowRoot.querySelector('a');
    itemLink.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, cancelable: true, ...props }));
  }

  beforeEach(async () => {
    sideNav = fixtureSync(`
      <vaadin-side-nav>
        <span slot="label">Main menu</span>
        <vaadin-side-nav-item path="/foobar">Item</vaadin-side-nav-item>
      </vaadin-side-nav>
    `);

    clickListener = sinon.spy();
    sideNav.addEventListener('click', clickListener);

    sideNav.onNavigate = sinon.spy();

    await nextRender();
    sideNavItem = sideNav.querySelector('vaadin-side-nav-item');
  });

  it('should cancel the click event', () => {
    clickItemLink(sideNavItem);
    expect(clickListener.calledOnce).to.be.true;
    const clickEvent = clickListener.firstCall.firstArg;
    expect(clickEvent.defaultPrevented).to.be.true;
  });

  it('should not cancel the click event on meta key + click', () => {
    clickItemLink(sideNavItem, { metaKey: true });
    const clickEvent = clickListener.firstCall.firstArg;
    expect(clickEvent.defaultPrevented).to.be.false;
  });

  it('should not cancel the click event on shift key + click', () => {
    clickItemLink(sideNavItem, { shiftKey: true });
    const clickEvent = clickListener.firstCall.firstArg;
    expect(clickEvent.defaultPrevented).to.be.false;
  });

  it('should not cancel the click event for external link', async () => {
    sideNavItem.path = 'https://vaadin.com';
    await nextRender();
    clickItemLink(sideNavItem);
    const clickEvent = clickListener.firstCall.firstArg;
    expect(clickEvent.defaultPrevented).to.be.false;
  });

  it('should not cancel the click event if callback is not defined', () => {
    sideNav.onNavigate = undefined;
    clickItemLink(sideNavItem);
    const clickEvent = clickListener.firstCall.firstArg;
    expect(clickEvent.defaultPrevented).to.be.false;
  });

  it('should not cancel the click event if callback returns false', () => {
    sideNav.onNavigate = () => false;
    clickItemLink(sideNavItem);
    const clickEvent = clickListener.firstCall.firstArg;
    expect(clickEvent.defaultPrevented).to.be.false;
  });

  it('should not cancel the click event if target is _blank', () => {
    sideNavItem.target = '_blank';
    clickItemLink(sideNavItem);
    const clickEvent = clickListener.firstCall.firstArg;
    expect(clickEvent.defaultPrevented).to.be.false;
  });

  it('should pass correct properties to the callback', () => {
    clickItemLink(sideNavItem);
    const clickEvent = clickListener.firstCall.firstArg;

    expect(sideNav.onNavigate.calledOnce).to.be.true;
    const callbackArguments = sideNav.onNavigate.firstCall.args;
    expect(callbackArguments).to.eql([
      {
        path: '/foobar',
        target: undefined,
        current: false,
        expanded: false,
        pathAliases: [],
        originalEvent: clickEvent,
      },
    ]);
  });

  it('should not throw on label click', () => {
    expect(() => sideNav.shadowRoot.querySelector('[part="label"]').click()).to.not.throw();
  });
});

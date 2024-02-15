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

  it('should update current attribute with dispatchLocationChangedEvent', async () => {
    history.pushState({}, '', '1');
    SideNav.dispatchLocationChangedEvent();

    await nextRender();

    expect(items[0].hasAttribute('current')).to.be.true;
    expect(items[1].hasAttribute('current')).to.be.false;
    expect(items[2].hasAttribute('current')).to.be.false;
  });
});

describe('custom item click actions', () => {
  let sideNav, item, itemLink;
  let clickListener;

  beforeEach(async () => {
    const currentURL = location.href;
    sideNav = fixtureSync(`
      <vaadin-side-nav>
        <span slot="label">Main menu</span>
        <vaadin-side-nav-item path="/foobar">Item</vaadin-side-nav-item>
      </vaadin-side-nav>
    `);

    clickListener = sinon.spy();
    sideNav.addEventListener('click', (e) => {
      clickListener({
        defaultPreventedByComponent: e.defaultPrevented,
        clickEvent: e,
      });

      // Prevent the tests from navigating away
      e.preventDefault();
    });

    sideNav.onNavigate = sinon.spy();

    await nextRender();
    item = sideNav.querySelector('vaadin-side-nav-item');
    itemLink = item.shadowRoot.querySelector('a');
  });

  it('should cancel the click event', () => {
    itemLink.click();
    expect(clickListener.calledOnce).to.be.true;
    const { defaultPreventedByComponent } = clickListener.firstCall.firstArg;
    expect(defaultPreventedByComponent).to.be.true;
  });

  it('should not cancel the click event on meta key + click', () => {
    itemLink.dispatchEvent(new MouseEvent('click', { metaKey: true, bubbles: true, composed: true, cancelable: true }));
    const { defaultPreventedByComponent } = clickListener.firstCall.firstArg;
    expect(defaultPreventedByComponent).to.be.false;
  });

  it('should not cancel the click event on shift key + click', () => {
    itemLink.dispatchEvent(
      new MouseEvent('click', { shiftKey: true, bubbles: true, composed: true, cancelable: true }),
    );
    const { defaultPreventedByComponent } = clickListener.firstCall.firstArg;
    expect(defaultPreventedByComponent).to.be.false;
  });

  it('should not cancel the click event for external link', async () => {
    item.path = 'https://vaadin.com';
    await nextRender();
    itemLink.click();
    const { defaultPreventedByComponent } = clickListener.firstCall.firstArg;
    expect(defaultPreventedByComponent).to.be.false;
  });

  it('should not cancel the click event if callback is not defined', () => {
    sideNav.onNavigate = undefined;
    itemLink.click();
    const { defaultPreventedByComponent } = clickListener.firstCall.firstArg;
    expect(defaultPreventedByComponent).to.be.false;
  });

  it('should not cancel the click event if callback returns false', () => {
    sideNav.onNavigate = () => false;
    itemLink.click();
    const { defaultPreventedByComponent } = clickListener.firstCall.firstArg;
    expect(defaultPreventedByComponent).to.be.false;
  });

  it('should not cancel the click event if target is _blank', () => {
    item.target = '_blank';
    itemLink.click();
    const { defaultPreventedByComponent } = clickListener.firstCall.firstArg;
    expect(defaultPreventedByComponent).to.be.false;
  });

  it('should pass correct properties to the callback', () => {
    itemLink.click();
    const { clickEvent } = clickListener.firstCall.firstArg;

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

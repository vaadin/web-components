import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-side-nav-item.js';
import '../src/vaadin-side-nav.js';

describe('navigation callback', () => {
  let sideNav, sideNavItem;

  function clickItemLink(item, props = {}) {
    const itemLink = item.shadowRoot.querySelector('a');
    const event = new MouseEvent('click', { bubbles: true, composed: true, cancelable: true, ...props });
    itemLink.dispatchEvent(event);
    return event;
  }

  beforeEach(async () => {
    sideNav = fixtureSync(`
      <vaadin-side-nav>
        <a slot="label" href="/home">Home</a>

        <vaadin-side-nav-item path="/foo">
          foo
          <vaadin-side-nav-item slot="children" path="/bar">bar</vaadin-side-nav-item>
        </vaadin-side-nav-item>
      </vaadin-side-nav>
    `);

    sideNav.addEventListener('click', (e) => {
      const { defaultPrevented } = e;
      // Prevent the tests from navigating away
      e.preventDefault();
      // Restore the defaultPrevented property
      Object.defineProperty(e, 'defaultPrevented', { value: defaultPrevented });
    });

    sideNav.onNavigate = sinon.spy();

    await nextRender();
    sideNavItem = sideNav.querySelector('vaadin-side-nav-item');
  });

  it('should cancel the click event', () => {
    const clickEvent = clickItemLink(sideNavItem);
    expect(clickEvent.defaultPrevented).to.be.true;
  });

  it('should not cancel the click event on meta key + click', () => {
    const clickEvent = clickItemLink(sideNavItem, { metaKey: true });
    expect(clickEvent.defaultPrevented).to.be.false;
  });

  it('should not cancel the click event on shift key + click', () => {
    const clickEvent = clickItemLink(sideNavItem, { shiftKey: true });
    expect(clickEvent.defaultPrevented).to.be.false;
  });

  it('should not cancel the click event for external link', async () => {
    sideNavItem.path = 'https://vaadin.com';
    await nextRender();
    const clickEvent = clickItemLink(sideNavItem);
    expect(clickEvent.defaultPrevented).to.be.false;
  });

  it('should not cancel the click event when using router-ignore', async () => {
    sideNavItem.routerIgnore = true;
    await nextRender();
    const clickEvent = clickItemLink(sideNavItem);
    expect(clickEvent.defaultPrevented).to.be.false;
  });

  it('should not cancel the click event if callback is not defined', () => {
    sideNav.onNavigate = undefined;
    const clickEvent = clickItemLink(sideNavItem);
    expect(clickEvent.defaultPrevented).to.be.false;
  });

  it('should not cancel the click event if callback returns false', () => {
    sideNav.onNavigate = () => false;
    const clickEvent = clickItemLink(sideNavItem);
    expect(clickEvent.defaultPrevented).to.be.false;
  });

  it('should not cancel the click event if target is _blank', () => {
    sideNavItem.target = '_blank';
    const clickEvent = clickItemLink(sideNavItem);
    expect(clickEvent.defaultPrevented).to.be.false;
  });

  it('should not cancel label click event', () => {
    const event = new MouseEvent('click', { bubbles: true, composed: true, cancelable: true });
    const label = sideNav.querySelector('[slot="label"]');
    expect(() => label.dispatchEvent(event)).to.not.throw();
    expect(event.defaultPrevented).to.be.false;
  });

  it('should not cancel toggle click event', () => {
    const event = new MouseEvent('click', { bubbles: true, composed: true, cancelable: true });
    const toggle = sideNavItem.shadowRoot.querySelector('button');
    expect(() => toggle.dispatchEvent(event)).to.not.throw();
    expect(event.defaultPrevented).to.be.false;
  });

  it('should not cancel item click event', () => {
    const event = new MouseEvent('click', { bubbles: true, composed: true, cancelable: true });
    expect(() => sideNavItem.dispatchEvent(event)).to.not.throw();
    expect(event.defaultPrevented).to.be.false;
  });

  it('should pass correct properties to the callback', () => {
    const clickEvent = clickItemLink(sideNavItem);

    expect(sideNav.onNavigate.calledOnce).to.be.true;
    const callbackArguments = sideNav.onNavigate.firstCall.args;
    expect(callbackArguments).to.eql([
      {
        path: '/foo',
        target: undefined,
        current: false,
        expanded: false,
        pathAliases: [],
        originalEvent: clickEvent,
      },
    ]);
  });
});

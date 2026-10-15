import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-side-nav-item.js';
import '../src/vaadin-side-nav.js';

describe('navigation', () => {
  let sideNav, items;

  function navigateWithPopstateEvent(url) {
    history.pushState({}, '', url);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  function navigateWithVaadinNavigatedEvent(url) {
    history.pushState({}, '', url);
    window.dispatchEvent(new CustomEvent('vaadin-navigated'));
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

  it('should update current attribute on items when navigating with popstate event', async () => {
    navigateWithPopstateEvent('1');
    await nextRender();

    expect(items[0].hasAttribute('current')).to.be.true;
    expect(items[1].hasAttribute('current')).to.be.false;
    expect(items[2].hasAttribute('current')).to.be.false;

    navigateWithPopstateEvent('2');
    await nextRender();

    expect(items[0].hasAttribute('current')).to.be.false;
    expect(items[1].hasAttribute('current')).to.be.true;
    expect(items[2].hasAttribute('current')).to.be.false;

    navigateWithPopstateEvent('21');
    await nextRender();

    expect(items[0].hasAttribute('current')).to.be.false;
    expect(items[1].hasAttribute('current')).to.be.false;
    expect(items[2].hasAttribute('current')).to.be.true;
  });

  it('should update current attribute on items when navigating with vaadin-navigate event', async () => {
    navigateWithVaadinNavigatedEvent('1');
    await nextRender();

    expect(items[0].hasAttribute('current')).to.be.true;
    expect(items[1].hasAttribute('current')).to.be.false;
    expect(items[2].hasAttribute('current')).to.be.false;

    navigateWithVaadinNavigatedEvent('2');
    await nextRender();

    expect(items[0].hasAttribute('current')).to.be.false;
    expect(items[1].hasAttribute('current')).to.be.true;
    expect(items[2].hasAttribute('current')).to.be.false;

    navigateWithVaadinNavigatedEvent('21');
    await nextRender();

    expect(items[0].hasAttribute('current')).to.be.false;
    expect(items[1].hasAttribute('current')).to.be.false;
    expect(items[2].hasAttribute('current')).to.be.true;
  });

  it('should not set expanded attribute on the current leaf item', async () => {
    navigateWithPopstateEvent('1');
    await nextRender();
    expect(items[0].hasAttribute('expanded')).to.be.false;
  });

  it('should set expanded attribute on the current item with children', async () => {
    navigateWithPopstateEvent('2');
    await nextRender();
    expect(items[1].hasAttribute('expanded')).to.be.true;
  });

  it('should update current attribute on location change', async () => {
    expect(items[0].hasAttribute('current')).to.be.false;

    history.pushState({}, '', '1');
    sideNav.location = '1';

    await nextRender();
    expect(items[0].hasAttribute('current')).to.be.true;
  });
});

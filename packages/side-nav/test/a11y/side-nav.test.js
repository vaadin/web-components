import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../../src/vaadin-side-nav.js';

describe('vaadin-side-nav', () => {
  let sideNav;

  beforeEach(async () => {
    sideNav = fixtureSync(`
      <vaadin-side-nav>
        <span slot="label">Main menu</span>
        <vaadin-side-nav-item path="/inbox">Inbox</vaadin-side-nav-item>
        <vaadin-side-nav-item path="/sent">Sent</vaadin-side-nav-item>
      </vaadin-side-nav>
    `);
    await nextRender();
  });

  it('default', async () => {
    await expect(sideNav).to.equalA11yTreeSnapshot();
    await expect(sideNav).to.be.accessible();
  });

  it('collapsible', async () => {
    sideNav.collapsible = true;
    await nextRender();
    await expect(sideNav).to.equalA11yTreeSnapshot();
    await expect(sideNav).to.be.accessible();
  });

  it('collapsed', async () => {
    sideNav.collapsible = true;
    sideNav.collapsed = true;
    await nextRender();
    await expect(sideNav).to.equalA11yTreeSnapshot();
    await expect(sideNav).to.be.accessible();
  });

  it('no label', async () => {
    sideNav.querySelector('[slot="label"]').remove();
    await nextRender();
    await expect(sideNav).to.equalA11yTreeSnapshot();
    await expect(sideNav).to.be.accessible();
  });

  it('current item', async () => {
    sideNav = fixtureSync(`
      <vaadin-side-nav>
        <span slot="label">Main menu</span>
        <vaadin-side-nav-item path="${window.location.pathname}">Home</vaadin-side-nav-item>
        <vaadin-side-nav-item path="/sent">Sent</vaadin-side-nav-item>
      </vaadin-side-nav>
    `);
    await nextRender();
    // The accessibility tree from CDP has no `aria-current` state, so check the property.
    expect(sideNav.querySelector('vaadin-side-nav-item').current).to.be.true;
    await expect(sideNav).to.equalA11yTreeSnapshot();
    await expect(sideNav).to.be.accessible();
  });

  it('disabled item', async () => {
    sideNav.querySelector('vaadin-side-nav-item').disabled = true;
    await nextRender();
    await expect(sideNav).to.equalA11yTreeSnapshot();
    await expect(sideNav).to.be.accessible();
  });

  it('item without path', async () => {
    sideNav.querySelector('vaadin-side-nav-item').removeAttribute('path');
    await nextRender();
    await expect(sideNav).to.equalA11yTreeSnapshot();
    await expect(sideNav).to.be.accessible();
  });

  it('prefix and suffix', async () => {
    sideNav.querySelector('vaadin-side-nav-item').innerHTML = `
      <span slot="prefix" aria-hidden="true">✉</span>
      Inbox
      <span slot="suffix">12</span>
    `;
    await nextRender();
    await expect(sideNav).to.equalA11yTreeSnapshot();
    await expect(sideNav).to.be.accessible();
  });

  describe('nested items', () => {
    let parent;

    beforeEach(async () => {
      parent = fixtureSync(`
        <vaadin-side-nav>
          <span slot="label">Main menu</span>
          <vaadin-side-nav-item path="/messages">
            Messages
            <vaadin-side-nav-item slot="children" path="/inbox">Inbox</vaadin-side-nav-item>
            <vaadin-side-nav-item slot="children" path="/sent">Sent</vaadin-side-nav-item>
          </vaadin-side-nav-item>
        </vaadin-side-nav>
      `);
      await nextRender();
    });

    it('collapsed', async () => {
      await expect(parent).to.equalA11yTreeSnapshot();
      await expect(parent).to.be.accessible();
    });

    it('expanded', async () => {
      parent.querySelector('vaadin-side-nav-item').expanded = true;
      await nextRender();
      await expect(parent).to.equalA11yTreeSnapshot();
      await expect(parent).to.be.accessible();
    });

    it('parent without path', async () => {
      const item = parent.querySelector('vaadin-side-nav-item');
      item.removeAttribute('path');
      item.expanded = true;
      await nextRender();
      await expect(parent).to.equalA11yTreeSnapshot();
      await expect(parent).to.be.accessible();
    });
  });
});

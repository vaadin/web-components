import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import '../../src/vaadin-side-nav.js';

describe('vaadin-side-nav', () => {
  let sideNav;

  beforeEach(async () => {
    sideNav = fixtureSync(
      `
        <vaadin-side-nav>
          <span slot="label">Main menu</span>
          <vaadin-side-nav-item>Item 1</vaadin-side-nav-item>
          <vaadin-side-nav-item>Item 2</vaadin-side-nav-item>
        </vaadin-side-nav>
            `,
    );
    await nextFrame();
  });

  describe('host', () => {
    it('default', async () => {
      await expect(sideNav).dom.to.equalSnapshot();
    });

    it('collapsible', async () => {
      sideNav.collapsible = true;
      await nextRender();
      await expect(sideNav).dom.to.equalSnapshot();
    });

    it('collapsed', async () => {
      sideNav.collapsible = true;
      sideNav.collapsed = true;
      await nextRender();
      await expect(sideNav).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(sideNav).shadowDom.to.equalSnapshot();
    });

    it('collapsible', async () => {
      sideNav.collapsible = true;
      await nextRender();
      await expect(sideNav).shadowDom.to.equalSnapshot();
    });

    it('collapsed', async () => {
      sideNav.collapsible = true;
      sideNav.collapsed = true;
      await nextRender();
      await expect(sideNav).shadowDom.to.equalSnapshot();
    });
  });
});

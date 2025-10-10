import { expect } from '@vaadin/chai-plugins';
import { setViewport } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../../src/vaadin-app-layout.js';
import '../../vaadin-drawer-toggle.js';

describe('vaadin-app-layout', () => {
  let layout;

  describe('host', () => {
    beforeEach(() => {
      layout = fixtureSync('<vaadin-app-layout></vaadin-app-layout>');
    });

    it('default', async () => {
      await expect(layout).dom.to.equalSnapshot();
    });

    it('with drawer', async () => {
      const drawer = document.createElement('div');
      drawer.setAttribute('slot', 'drawer');
      drawer.textContent = 'Drawer Content';
      layout.appendChild(drawer);
      await nextRender();
      await expect(layout).dom.to.equalSnapshot();
    });

    it('with navbar', async () => {
      const navbar = document.createElement('div');
      navbar.setAttribute('slot', 'navbar');
      navbar.textContent = 'Navbar Content';
      layout.appendChild(navbar);
      await nextRender();
      await expect(layout).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    beforeEach(async () => {
      layout = fixtureSync(`
        <vaadin-app-layout>
          <vaadin-drawer-toggle id="toggle" slot="navbar">
            Drawer Toggle
          </vaadin-drawer-toggle>
          <section slot="drawer">
            Drawer Content
          </section>
          <main>Page Content</main>
        </vaadin-app-layout>
      `);
      await nextRender();
    });

    describe('desktop layout', () => {
      before(async () => {
        await setViewport({ width: 1000, height: 1000 });
      });

      it('default', async () => {
        await expect(layout).shadowDom.to.equalSnapshot();
      });

      it('drawer closed', async () => {
        layout.drawerOpened = false;
        await expect(layout).shadowDom.to.equalSnapshot();
      });
    });

    describe('mobile layout', () => {
      before(async () => {
        await setViewport({ width: 500, height: 500 });
      });

      it('default', async () => {
        await expect(layout).shadowDom.to.equalSnapshot();
      });

      it('drawer opened', async () => {
        layout.drawerOpened = true;
        await expect(layout).shadowDom.to.equalSnapshot();
      });
    });
  });
});

import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { setViewport } from '@web/test-runner-commands';
import '../../src/vaadin-app-layout.js';
import '../../vaadin-drawer-toggle.js';

describe('vaadin-app-layout', () => {
  let layout;

  async function fixtureLayout() {
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
  }

  describe('desktop layout', () => {
    before(async () => {
      await setViewport({ width: 1000, height: 1000 });
    });

    beforeEach(async () => {
      await fixtureLayout();
    });

    describe('shadow', () => {
      it('default', async () => {
        await expect(layout).shadowDom.to.equalSnapshot();
      });

      it('drawer closed', async () => {
        layout.drawerOpened = false;
        await expect(layout).shadowDom.to.equalSnapshot();
      });
    });
  });

  describe('mobile layout', () => {
    before(async () => {
      await setViewport({ width: 500, height: 500 });
    });

    beforeEach(async () => {
      await fixtureLayout();
    });

    describe('shadow', () => {
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

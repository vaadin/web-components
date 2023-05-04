import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import '../../enable.js';
import '../../src/vaadin-side-nav-item.js';
import '@vaadin/icon';
import '@vaadin/icons';

describe('vaadin-side-nav-item', () => {
  let sideNavItem;

  beforeEach(async () => {
    sideNavItem = fixtureSync(
      `
        <vaadin-side-nav-item>
          <vaadin-icon icon="vaadin:chart" slot="prefix"></vaadin-icon>
          Item
          <span theme="badge primary" slot="suffix">2</span>
          <vaadin-side-nav-item slot="children">Child item 1</vaadin-side-nav-item>
          <vaadin-side-nav-item slot="children">Child item 2</vaadin-side-nav-item>
        </vaadin-side-nav-item>
            `,
    );
    await nextFrame();
  });

  describe('item', () => {
    it('default', async () => {
      await expect(sideNavItem).dom.to.equalSnapshot();
    });

    it('expanded', async () => {
      sideNavItem.expanded = true;
      await nextRender(sideNavItem);
      await expect(sideNavItem).dom.to.equalSnapshot();
    });

    it('active', async () => {
      const activeItem = fixtureSync('<vaadin-side-nav-item path=""></vaadin-side-nav-item>');
      await nextRender(activeItem);
      await expect(activeItem).dom.to.equalSnapshot();
    });

    it('with path', async () => {
      sideNavItem.path = 'path';
      await nextRender(sideNavItem);
      await expect(sideNavItem).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(sideNavItem).shadowDom.to.equalSnapshot();
    });

    it('expanded', async () => {
      sideNavItem.expanded = true;
      await nextRender(sideNavItem);
      await expect(sideNavItem).shadowDom.to.equalSnapshot();
    });

    it('active', async () => {
      const activeItem = fixtureSync('<vaadin-side-nav-item path=""></vaadin-side-nav-item>');
      await nextRender(activeItem);
      await expect(activeItem).shadowDom.to.equalSnapshot();
    });

    it('path', async () => {
      sideNavItem.path = 'path';
      await nextRender(sideNavItem);
      await expect(sideNavItem).shadowDom.to.equalSnapshot();
    });
  });
});

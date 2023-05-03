import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../../src/vaadin-side-nav.js';

describe('vaadin-side-nav', () => {
  let sideNav;

  beforeEach(async () => {
    sideNav = fixtureSync(`
      <vaadin-side-nav>
        <span slot="label">Main menu</span>
        <span>Item 1</span>
        <span>Item 2</span>
      </vaadin-side-nav>
    `);
    await nextRender();
  });

  describe('host', () => {
    it('default', async () => {
      await expect(sideNav).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(sideNav).shadowDom.to.equalSnapshot();
    });
  });
});

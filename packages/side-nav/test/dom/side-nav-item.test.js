import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../../src/vaadin-side-nav-item.js';
import '@vaadin/icon';
import '@vaadin/icons';

describe('vaadin-side-nav-item', () => {
  let sideNavItem, documentBaseURI;

  beforeEach(() => {
    documentBaseURI = sinon.stub(document, 'baseURI').value('http://localhost/');
  });

  afterEach(() => {
    documentBaseURI.restore();
  });

  beforeEach(async () => {
    sideNavItem = fixtureSync(
      `
        <vaadin-side-nav-item>
          <vaadin-icon icon="vaadin:chart" slot="prefix"></vaadin-icon>
          <span>Item</span>
          <span theme="badge primary" slot="suffix">2</span>
          <vaadin-side-nav-item slot="children"><span>Child item 1</span></vaadin-side-nav-item>
          <vaadin-side-nav-item slot="children"><span>Child item 2</span></vaadin-side-nav-item>
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
      await nextRender();
      await expect(sideNavItem).dom.to.equalSnapshot();
    });

    it('disabled', async () => {
      sideNavItem.disabled = true;
      await nextRender();
      await expect(sideNavItem).dom.to.equalSnapshot();
    });

    it('current', async () => {
      sideNavItem.path = '';
      await nextRender();
      await expect(sideNavItem).dom.to.equalSnapshot();
    });

    it('path', async () => {
      sideNavItem.path = 'path';
      await nextRender();
      await expect(sideNavItem).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(sideNavItem).shadowDom.to.equalSnapshot();
    });

    it('expanded', async () => {
      sideNavItem.expanded = true;
      await nextRender();
      await expect(sideNavItem).shadowDom.to.equalSnapshot();
    });

    it('current', async () => {
      sideNavItem.path = '';
      await nextRender();
      await expect(sideNavItem).shadowDom.to.equalSnapshot();
    });

    it('path', async () => {
      sideNavItem.path = 'path';
      await nextRender();
      await expect(sideNavItem).shadowDom.to.equalSnapshot();
    });

    it('null path', async () => {
      sideNavItem.path = null;
      await nextRender();
      await expect(sideNavItem).shadowDom.to.equalSnapshot();
    });

    it('i18n', async () => {
      sideNavItem.i18n = { toggle: 'Toggle children' };
      await nextRender();
      await expect(sideNavItem).shadowDom.to.equalSnapshot();
    });
  });
});

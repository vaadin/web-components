import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '../../src/vaadin-breadcrumbs-item.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.breadcrumbsComponent = true;

describe('vaadin-breadcrumbs-item', () => {
  let item;

  beforeEach(async () => {
    item = fixtureSync('<vaadin-breadcrumbs-item></vaadin-breadcrumbs-item>');
    await nextRender();
  });

  describe('host', () => {
    it('default', async () => {
      await expect(item).dom.to.equalSnapshot();
    });

    it('prefix', async () => {
      const prefix = document.createElement('span');
      prefix.setAttribute('slot', 'prefix');
      prefix.textContent = 'icon';
      item.appendChild(prefix);
      await nextRender();
      await expect(item).dom.to.equalSnapshot();
    });

    it('prefix path', async () => {
      item.path = '/foo';
      const prefix = document.createElement('span');
      prefix.setAttribute('slot', 'prefix');
      prefix.textContent = 'icon';
      item.appendChild(prefix);
      await nextRender();
      await expect(item).dom.to.equalSnapshot();
    });

    it('disabled', async () => {
      item.disabled = true;
      await nextUpdate(item);
      await expect(item).dom.to.equalSnapshot();
    });

    it('focused', async () => {
      item.path = '/foo';
      await nextUpdate(item);
      item.focus({ focusVisible: false });
      await expect(item).dom.to.equalSnapshot();
    });

    it('focus-ring', async () => {
      item.path = '/foo';
      await nextUpdate(item);
      await sendKeys({ press: 'Tab' });
      await expect(item).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(item).shadowDom.to.equalSnapshot();
    });

    it('path', async () => {
      item.path = '/foo';
      await nextUpdate(item);
      await expect(item).shadowDom.to.equalSnapshot();
    });

    it('current', async () => {
      item._setCurrent(true);
      await nextUpdate(item);
      await expect(item).shadowDom.to.equalSnapshot();
    });

    it('current path', async () => {
      item.path = '/foo';
      item._setCurrent(true);
      await nextUpdate(item);
      await expect(item).shadowDom.to.equalSnapshot();
    });

    it('disabled path', async () => {
      item.path = '/foo';
      item.disabled = true;
      await nextUpdate(item);
      await expect(item).shadowDom.to.equalSnapshot();
    });
  });
});

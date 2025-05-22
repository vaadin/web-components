import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { ComboBox } from '@vaadin/combo-box/src/vaadin-combo-box.js';
import { ContextMenu } from '@vaadin/context-menu/src/vaadin-context-menu.js';
import { MenuBar } from '@vaadin/menu-bar/src/vaadin-menu-bar.js';

[
  { tagName: ComboBox.is },
  { tagName: ContextMenu.is },
  {
    tagName: MenuBar.is,
    callback: (el) => {
      el.items = [{ text: 'Item' }];
    },
  },
].forEach(({ tagName, callback }) => {
  describe(`${tagName} re-layout`, () => {
    let wrapper;

    beforeEach(() => {
      wrapper = fixtureSync('<div></div>');
    });

    function renderChildren() {
      if (wrapper.children.length) {
        [...wrapper.children].forEach((child) => child.remove());
      }

      wrapper.appendChild(document.createElement(tagName));
      if (callback) {
        callback(wrapper.firstElementChild);
      }

      for (let i = 0; i < 100; i++) {
        const btn = document.createElement('button');
        btn.textContent = `Button ${i}`;
        wrapper.appendChild(btn);
        wrapper.appendChild(document.createElement('br'));
      }
    }

    it(`should not reset scroll to top when creating a ${tagName}`, async () => {
      renderChildren();
      await nextRender();

      document.documentElement.scrollTop = 1000;

      renderChildren();
      await nextRender();

      expect(document.documentElement.scrollTop).to.equal(1000);
    });
  });
});

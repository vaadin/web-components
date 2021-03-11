import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { click, enter, fire, fixtureSync, isIOS, nextRender, oneEvent } from '@vaadin/testing-helpers';
import '@vaadin/vaadin-list-box/vaadin-list-box.js';
import '@vaadin/vaadin-item/vaadin-item.js';
import './not-animated-styles.js';
import '../vaadin-context-menu.js';

describe('selection', () => {
  let menu;

  beforeEach(() => {
    menu = fixtureSync(`
      <vaadin-context-menu>
        <template>
          <vaadin-list-box id="menu">
            <vaadin-item>item1</vaadin-item>
            <vaadin-item>item2</vaadin-item>
            <vaadin-item>item3</vaadin-item>
          </vaadin-list-box>
        </template>
      </vaadin-context-menu>
    `);
  });

  describe('selection', () => {
    it('should close on item click', async () => {
      menu._setOpened(true);
      await oneEvent(menu.$.overlay, 'vaadin-overlay-open');
      await nextRender(menu.$.overlay);

      const listBox = menu.$.overlay.content.querySelector('#menu');
      click(listBox.items[0]);
      expect(menu.opened).to.eql(false);
    });

    it('should close on keyboard selection', async () => {
      menu._setOpened(true);
      await oneEvent(menu.$.overlay, 'vaadin-overlay-open');
      await nextRender(menu.$.overlay);

      const spy = sinon.spy();
      menu.addEventListener('opened-changed', spy);

      const item = menu.$.overlay.content.querySelector('#menu vaadin-item');
      enter(item);
      expect(spy.calledOnce).to.be.true;
    });

    it('should focus the child element', async () => {
      menu._setOpened(true);
      await oneEvent(menu.$.overlay, 'vaadin-overlay-open');
      await nextRender(menu.$.overlay);

      const item = menu.$.overlay.content.querySelector('#menu vaadin-item');
      expect(document.activeElement).to.eql(item);
    });

    (isIOS ? it.skip : it)('should focus the child element on `contextmenu` event', async () => {
      fire(menu, 'contextmenu');
      await oneEvent(menu.$.overlay, 'vaadin-overlay-open');
      await nextRender(menu.$.overlay);

      const item = menu.$.overlay.content.querySelector('#menu vaadin-item');
      expect(document.activeElement).to.eql(item);
    });
  });
});

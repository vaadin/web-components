import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync, nextFrame, oneEvent } from '@open-wc/testing-helpers';
import { tap, pressAndReleaseKeyOn } from '@polymer/iron-test-helpers/mock-interactions.js';
import '@vaadin/vaadin-list-box/vaadin-list-box.js';
import '@vaadin/vaadin-item/vaadin-item.js';
import { fire, isIOS } from './common.js';
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
    it('should close on item tap', async () => {
      menu._setOpened(true);
      await oneEvent(menu.$.overlay, 'vaadin-overlay-open');

      const listBox = menu.$.overlay.content.querySelector('#menu');
      await nextFrame();
      tap(listBox.items[0]);
      expect(menu.opened).to.be.false;
    });

    it('should close on keyboard selection', async () => {
      menu._setOpened(true);
      await oneEvent(menu.$.overlay, 'vaadin-overlay-open');

      const item = menu.$.overlay.content.querySelector('#menu vaadin-item');
      pressAndReleaseKeyOn(item, 13, [], 'Enter');
      await aTimeout(1);
      expect(menu.opened).to.be.false;
    });

    it('should focus the child element', async () => {
      menu._setOpened(true);
      await oneEvent(menu.$.overlay, 'vaadin-overlay-open');
      await aTimeout(0);
      const item = menu.$.overlay.content.querySelector('#menu vaadin-item');
      expect(document.activeElement).to.eql(item);
    });

    (isIOS ? it.skip : it)('should focus the child element on `contextmenu` event', async () => {
      fire(menu, 'contextmenu');
      await oneEvent(menu.$.overlay, 'vaadin-overlay-open');
      await aTimeout(0);
      const item = menu.$.overlay.content.querySelector('#menu vaadin-item');
      expect(document.activeElement).to.eql(item);
    });
  });
});

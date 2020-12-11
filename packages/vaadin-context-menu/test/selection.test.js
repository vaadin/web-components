import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@open-wc/testing-helpers';
import { tap, pressAndReleaseKeyOn } from '@polymer/iron-test-helpers/mock-interactions.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import '@vaadin/vaadin-list-box/vaadin-list-box.js';
import '@vaadin/vaadin-item/vaadin-item.js';
import { fire, listenOnce, isIOS } from './common.js';
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
    it('should close on item tap', (done) => {
      listenOnce(menu.$.overlay, 'vaadin-overlay-open', () => {
        const listBox = menu.$.overlay.content.querySelector('#menu');
        afterNextRender(listBox, () => {
          tap(listBox.items[0]);
          expect(menu.opened).to.eql(false);
          done();
        });
      });

      menu._setOpened(true);
    });

    it('should close on keyboard selection', (done) => {
      listenOnce(menu.$.overlay, 'vaadin-overlay-open', () => {
        setTimeout(() => {
          listenOnce(menu, 'opened-changed', () => {
            done();
          });

          const item = menu.$.overlay.content.querySelector('#menu vaadin-item');
          pressAndReleaseKeyOn(item, 13, [], 'Enter');
        }, 10);
      });

      menu._setOpened(true);
    });

    it('should focus the child element', (done) => {
      listenOnce(menu.$.overlay, 'vaadin-overlay-open', () => {
        setTimeout(() => {
          const item = menu.$.overlay.content.querySelector('#menu vaadin-item');
          expect(document.activeElement).to.eql(item);
          done();
        });
      });

      menu._setOpened(true);
    });

    (isIOS ? it.skip : it)('should focus the child element on `contextmenu` event', (done) => {
      listenOnce(menu.$.overlay, 'vaadin-overlay-open', () => {
        setTimeout(() => {
          const item = menu.$.overlay.content.querySelector('#menu vaadin-item');
          expect(document.activeElement).to.eql(item);
          done();
        });
      });

      fire(menu, 'contextmenu');
    });
  });
});

import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync } from '@open-wc/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { gestures } from '@polymer/polymer/lib/utils/gestures.js';
import { fire, listenOnce, isIOS } from './common.js';
import './not-animated-styles.js';
import '../vaadin-context-menu.js';

class MenuTouchWrapper extends PolymerElement {
  static get template() {
    return html`
      <vaadin-context-menu selector="#target" id="menu">
        <div id="target">Target</div>
        <template>
          <div>Menu Content</div>
        </template>
      </vaadin-context-menu>
    `;
  }
}

customElements.define('menu-touch-wrapper', MenuTouchWrapper);

describe('mobile support', () => {
  let menu, target;

  beforeEach(() => {
    const testWrapper = fixtureSync('<menu-touch-wrapper></menu-touch-wrapper>');
    menu = testWrapper.$.menu;
    target = menu.querySelector('#target');
    menu._phone = true;
  });

  afterEach(() => {
    menu.close();
  });

  function makeSoloTouchEvent(type, xy, node, shiftKey = false) {
    xy = xy || middleOfNode(node);
    const touches = makeTouches([xy], node);
    const touchEventInit = {
      touches: touches,
      targetTouches: touches,
      changedTouches: touches
    };
    const event = new CustomEvent(type, {
      bubbles: true,
      cancelable: true,
      composed: true
    });

    for (const property in touchEventInit) {
      event[property] = touchEventInit[property];
    }

    event.shiftKey = shiftKey;
    node.dispatchEvent(event);
    return event;
  }

  function middleOfNode(node) {
    const bcr = node.getBoundingClientRect();
    return {
      y: bcr.top + bcr.height / 2,
      x: bcr.left + bcr.width / 2
    };
  }

  function makeTouches(xyList, node) {
    let id = 0;

    return xyList.map((xy) => {
      return {
        identifier: id++,
        target: node,
        clientX: xy.x,
        clientY: xy.y
      };
    });
  }

  it('should align to bottom of the viewport', (done) => {
    listenOnce(menu, 'opened-changed', () => {
      const styles = window.getComputedStyle(menu.$.overlay);
      expect(styles.alignItems).to.eql('stretch');
      expect(styles.justifyContent).to.eql('flex-end');
      done();
    });

    menu._setOpened(true);
  });

  it('should prevent tap', function () {
    expect(gestures.tap.info.prevent).to.be.false;
    target.dispatchEvent(new CustomEvent('contextmenu', { bubbles: true }));
    expect(gestures.tap.info.prevent).to.be.true;
  });

  (isIOS ? describe : describe.skip)('iOS touch', () => {
    it('should open on long-touch on ios', (done) => {
      makeSoloTouchEvent('touchstart', null, target);

      listenOnce(menu, 'opened-changed', () => {
        expect(menu.opened).to.eql(true);
        done();
      });
    });

    it('should preventDefault on touch-end after long-touch', (done) => {
      makeSoloTouchEvent('touchstart', null, target);

      listenOnce(menu, 'opened-changed', () => {
        const e = makeSoloTouchEvent('touchend', null, target);
        expect(e.defaultPrevented).to.be.true;
        done();
      });
    });

    it('should not open on normal tap', async () => {
      makeSoloTouchEvent('touchstart', null, menu.listenOn);

      await aTimeout(100);
      makeSoloTouchEvent('tap', null, menu.listenOn);

      await aTimeout(600);
      expect(menu.opened).to.eql(false);
    });

    it('should not open when `touchend` was fired too early', async () => {
      const xy = middleOfNode(menu.listenOn);
      makeSoloTouchEvent('touchstart', xy, target);

      // Timeout for dispatching `vaadin-contextmenu` is 500
      await aTimeout(499);
      makeSoloTouchEvent('touchend', null, menu.listenOn);

      await aTimeout(600);
      expect(menu.opened).to.eql(false);
    });

    it('should not open when `touchstart` was dispatch with `shiftKey`', async () => {
      makeSoloTouchEvent('touchstart', null, target, true);

      await aTimeout(600);
      expect(menu.opened).to.eql(false);
    });

    it('should properly set `sourceEvent` on `contextmenu`', (done) => {
      const ev = new CustomEvent('contextmenu', { bubbles: true });
      menu.listenOn.addEventListener('vaadin-contextmenu', (e) => {
        expect(e.detail.sourceEvent).to.eql(ev);
        done();
      });
      target.dispatchEvent(ev);
    });

    it('should properly set `sourceEvent` on `touchstart`', (done) => {
      const ev = makeSoloTouchEvent('touchstart', null, target);
      menu.listenOn.addEventListener('vaadin-contextmenu', (e) => {
        expect(e.detail.sourceEvent).to.eql(ev);
        done();
      });
      target.dispatchEvent(ev);
    });

    it('should forward `preventDefault` to `sourceEvent`', (done) => {
      const ev = makeSoloTouchEvent('touchstart', null, target);
      menu.listenOn.addEventListener('vaadin-contextmenu', (e) => {
        e.preventDefault();
        setTimeout(() => {
          expect(ev.defaultPrevented).to.be.true;
          done();
        });
      });
      target.dispatchEvent(ev);
    });

    it('should not preventDefault on touch-end after normal tap', async () => {
      makeSoloTouchEvent('touchstart', null, target);
      await aTimeout(100);
      const e = makeSoloTouchEvent('touchend', null, target);
      expect(e.defaultPrevented).to.be.false;
    });

    it('should not stop `tap` bubbling in the middle of a long touch', async () => {
      makeSoloTouchEvent('touchstart', null, menu.listenOn);
      await aTimeout(100);
      const evt = fire(menu, 'tap');
      expect(evt.defaultPrevented).to.eql(false);
    });

    it('should not stop `tap` bubbling after a long touch', async () => {
      makeSoloTouchEvent('touchstart', null, menu.listenOn);
      await aTimeout(600);
      const evt = fire(menu, 'tap');
      expect(evt.defaultPrevented).to.eql(false);
    });

    it('should stop `touchend` from creating a tap event which cancels the overlay', (done) => {
      const xy = middleOfNode(target);
      makeSoloTouchEvent('touchstart', xy, target);

      listenOnce(menu, 'opened-changed', () => {
        listenOnce(target, 'tap', () => {
          throw new Error('tap fired!');
        });
        setTimeout(done, 1);
        makeSoloTouchEvent('touchend', xy, target);
      });
    });

    it('should not open when touch moving', async () => {
      const xy = middleOfNode(menu.listenOn);
      makeSoloTouchEvent('touchstart', xy, target);
      await aTimeout(100);
      xy.x += 16; // threshold is 15px from start
      makeSoloTouchEvent('touchmove', xy, target);
      await aTimeout(600);
      expect(menu.opened).to.eql(false);
    });
  });
});

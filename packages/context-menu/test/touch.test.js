import { expect } from '@vaadin/chai-plugins';
import {
  fire,
  fixtureSync,
  isIOS,
  listenOnce,
  makeSoloTouchEvent,
  middleOfNode,
  nextRender,
  touchend,
  touchstart,
} from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './context-menu-test-styles.js';
import '../src/vaadin-context-menu.js';
import { gestures } from '@vaadin/component-base/src/gestures.js';

describe('mobile support', () => {
  let menu, target;

  beforeEach(async () => {
    menu = fixtureSync(`
      <vaadin-context-menu selector="#target">
        <div id="target">Target</div>
      </vaadin-context-menu>
    `);
    await nextRender();
    target = menu.querySelector('#target');
    menu.renderer = (root) => {
      root.innerHTML = '<div>Menu Content</div>';
    };
    menu._phone = true;
  });

  afterEach(() => {
    menu.close();
  });

  it('should align to bottom of the viewport', (done) => {
    listenOnce(menu, 'opened-changed', () => {
      const styles = window.getComputedStyle(menu._overlayElement);
      expect(styles.alignItems).to.eql('stretch');
      expect(styles.justifyContent).to.eql('flex-end');
      done();
    });

    menu._setOpened(true);
  });

  it('should prevent tap', () => {
    expect(gestures.tap.info.prevent).to.be.false;
    target.dispatchEvent(new CustomEvent('contextmenu', { bubbles: true }));
    expect(gestures.tap.info.prevent).to.be.true;
  });

  it('should properly set `sourceEvent` on `contextmenu`', (done) => {
    const ev = new CustomEvent('contextmenu', { bubbles: true });
    menu.listenOn.addEventListener('vaadin-contextmenu', (e) => {
      expect(e.detail.sourceEvent).to.eql(ev);
      done();
    });
    target.dispatchEvent(ev);
  });

  it('should preserve `composedPath()` for the source event', (done) => {
    const ev = new CustomEvent('contextmenu', { bubbles: true });
    menu.listenOn.addEventListener('vaadin-contextmenu', (e) => {
      const { sourceEvent } = e.detail;
      expect(sourceEvent.__composedPath[0]).to.eql(target);
      done();
    });
    target.dispatchEvent(ev);
  });

  (isIOS ? describe : describe.skip)('iOS touch', () => {
    describe('timings', () => {
      let clock;

      beforeEach(() => {
        clock = sinon.useFakeTimers();
      });

      afterEach(() => {
        clock.restore();
      });

      it('should open on long-touch on ios', (done) => {
        listenOnce(menu, 'opened-changed', () => {
          expect(menu.opened).to.eql(true);
          done();
        });

        touchstart(target);
        clock.tick(500);
      });

      it('should preventDefault on touch-end after long-touch', (done) => {
        listenOnce(menu, 'opened-changed', () => {
          const e = makeSoloTouchEvent('touchend', null, target);
          expect(e.defaultPrevented).to.be.true;
          done();
        });

        touchstart(target);
        clock.tick(500);
      });

      it('should not open on normal tap', () => {
        touchstart(menu.listenOn);

        clock.tick(100);
        touchend(menu.listenOn);

        clock.tick(1000);
        expect(menu.opened).to.eql(false);
      });

      it('should not open when `touchend` was fired too early', () => {
        touchstart(menu.listenOn);

        // Timeout for dispatching `vaadin-contextmenu` is 500
        clock.tick(499);
        touchend(menu.listenOn);

        clock.tick(1000);
        expect(menu.opened).to.eql(false);
      });

      it('should not open when `touchstart` was dispatch with `shiftKey`', () => {
        makeSoloTouchEvent('touchstart', null, target, true);

        clock.tick(600);
        expect(menu.opened).to.eql(false);
      });

      it('should not preventDefault on touch-end after normal tap', () => {
        makeSoloTouchEvent('touchstart', null, target);
        clock.tick(100);
        const e = makeSoloTouchEvent('touchend', null, target);
        expect(e.defaultPrevented).to.be.false;
      });

      it('should not stop `tap` bubbling in the middle of a long touch', () => {
        makeSoloTouchEvent('touchstart', null, menu.listenOn);
        clock.tick(100);
        const evt = fire(menu, 'tap');
        expect(evt.defaultPrevented).to.eql(false);
      });

      it('should not stop `tap` bubbling after a long touch', () => {
        makeSoloTouchEvent('touchstart', null, menu.listenOn);
        clock.tick(600);
        const evt = fire(menu, 'tap');
        expect(evt.defaultPrevented).to.eql(false);
      });

      it('should properly set `sourceEvent` on `touchstart`', (done) => {
        const ev = makeSoloTouchEvent('touchstart', null, target);
        menu.listenOn.addEventListener('vaadin-contextmenu', (e) => {
          expect(e.detail.sourceEvent).to.eql(ev);
          done();
        });

        target.dispatchEvent(ev);
        clock.tick(500);
      });

      it('should forward `preventDefault` to `sourceEvent`', (done) => {
        const ev = makeSoloTouchEvent('touchstart', null, target);
        const spy = sinon.spy(ev, 'preventDefault');

        menu.listenOn.addEventListener('vaadin-contextmenu', (e) => {
          e.preventDefault();
          clock.tickAsync(1).then(() => {
            expect(spy.called).to.be.true;
            done();
          });
        });

        target.dispatchEvent(ev);
        clock.tick(500);
      });

      it('should not open when touch moving', () => {
        const xy = middleOfNode(menu.listenOn);
        makeSoloTouchEvent('touchstart', xy, target);
        clock.tick(100);
        xy.x += 16; // Threshold is 15px from start
        makeSoloTouchEvent('touchmove', xy, target);
        clock.tick(600);
        expect(menu.opened).to.eql(false);
      });

      it('should stop `touchend` from creating a tap event which cancels the overlay', (done) => {
        listenOnce(menu, 'opened-changed', () => {
          const spy = sinon.spy();
          target.addEventListener('tap', spy);

          touchend(target);
          clock.tick(1);

          expect(spy.called).to.be.false;
          done();
        });

        touchstart(target);
        clock.tick(500);
      });
    });
  });
});

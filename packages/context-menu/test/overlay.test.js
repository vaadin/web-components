import { expect } from '@vaadin/chai-plugins';
import { fire, fixtureSync, isIOS, nextFrame, nextRender, oneEvent } from '@vaadin/testing-helpers';
import '../src/vaadin-context-menu.js';
import { contextmenu } from './helpers.js';

describe('overlay', () => {
  let menu, overlay, content, viewHeight, viewWidth;

  beforeEach(async () => {
    menu = fixtureSync(`
      <vaadin-context-menu>
        <div id="target" style="width: 100px; outline: 1px dashed #000;">FOOOO</div>
      </vaadin-context-menu>
    `);
    menu.renderer = (root) => {
      root.textContent = 'OVERLAY CONTENT';
    };
    await nextRender();
    overlay = menu._overlayElement;
    content = overlay.$.content;
    // Make content have a fixed size
    content.style.height = content.style.width = '100px';
    content.style.boxSizing = 'border-box';
    // Compute viewport at the end of the test setup
    viewHeight = document.documentElement.clientHeight;
  });

  afterEach(() => {
    overlay.opened = false;
  });

  describe('opening', () => {
    ['ltr', 'rtl'].forEach((direction) => {
      describe(`[dir=${direction}] opening`, () => {
        let isRTL;

        before(async () => {
          isRTL = direction === 'rtl';
          document.documentElement.setAttribute('dir', direction);
          await nextFrame();
          viewWidth = document.documentElement.clientWidth;
        });

        after(() => {
          // Forcing dir to ltr because Safari scroll can get lost if attribute
          // is set to `rtl` and then removed
          if (isRTL) {
            document.documentElement.setAttribute('dir', 'ltr');
          }
        });

        it('should be positioned on click target', async () => {
          contextmenu(menu, isRTL ? 450 : 10, 10);
          await oneEvent(overlay, 'vaadin-overlay-open');
          const rect = overlay.getBoundingClientRect();

          if (isRTL) {
            expect(rect.right).to.closeTo(menu._phone ? viewWidth : 450, 0.1);
          } else {
            expect(rect.left).to.eql(menu._phone ? 0 : 10);
          }
          expect(rect.top).to.eql(menu._phone ? 0 : 10);
        });

        it('should be positioned on detailed mouse event', async () => {
          menu.openOn = 'foobar';

          fire(menu.listenOn, 'foobar', { sourceEvent: { clientX: isRTL ? 450 : 10, clientY: 20 } });
          await oneEvent(overlay, 'vaadin-overlay-open');

          const rect = overlay.getBoundingClientRect();
          if (isRTL) {
            expect(rect.right).to.closeTo(menu._phone ? viewWidth : 450, 0.1);
          } else {
            expect(rect.left).to.eql(menu._phone ? 0 : 10);
          }
          expect(rect.top).to.eql(menu._phone ? 0 : 20);
        });

        it('should be positioned by gesture event', async () => {
          menu.openOn = 'foobar';

          fire(menu.listenOn, 'foobar', { x: isRTL ? 450 : 5, y: 5, sourceEvent: { clientX: 10, clientY: 20 } });
          await oneEvent(overlay, 'vaadin-overlay-open');

          const rect = overlay.getBoundingClientRect();
          if (isRTL) {
            expect(rect.right).to.closeTo(menu._phone ? viewWidth : 450, 0.1);
          } else {
            expect(rect.left).to.eql(menu._phone ? 0 : 5);
          }
          expect(rect.top).to.eql(menu._phone ? 0 : 5);
        });

        it('should be positioned by touch event', async () => {
          menu.openOn = 'touchstart';

          const event = new CustomEvent('touchstart', { bubbles: true, cancelable: true });
          event.touches = event.changedTouches = event.targetTouches = [{ clientX: isRTL ? 450 : 10, clientY: 20 }];

          menu.children[0].dispatchEvent(event);
          await oneEvent(overlay, 'vaadin-overlay-open');

          const rect = overlay.getBoundingClientRect();
          if (isRTL) {
            expect(rect.right).to.closeTo(menu._phone ? viewWidth : 450, 0.1);
          } else {
            expect(rect.left).to.eql(menu._phone ? 0 : 10);
          }
          expect(rect.top).to.eql(menu._phone ? 0 : 20);
        });

        it('should be positioned by detailed touch event', async () => {
          menu.openOn = 'foobar';

          fire(menu.listenOn, 'foobar', {
            sourceEvent: { changedTouches: [{ clientX: isRTL ? 450 : 10, clientY: 20 }] },
          });
          await oneEvent(overlay, 'vaadin-overlay-open');

          const rect = overlay.getBoundingClientRect();
          if (isRTL) {
            expect(rect.right).to.closeTo(menu._phone ? viewWidth : 450, 0.1);
          } else {
            expect(rect.left).to.eql(menu._phone ? 0 : 10);
          }
          expect(rect.top).to.eql(menu._phone ? 0 : 20);
        });
      });

      describe(`[dir=${direction}] position`, () => {
        let isRTL;
        before(async () => {
          isRTL = direction === 'rtl';
          document.documentElement.setAttribute('dir', direction);
          await nextFrame();
          viewWidth = document.documentElement.clientWidth;
        });

        after(() => {
          // Forcing dir to ltr because Safari scroll can get lost if attribute
          // is set to `rtl` and then removed
          if (isRTL) {
            document.documentElement.setAttribute('dir', 'ltr');
          }
        });

        it(`should be aligned relative to top-${isRTL ? 'right' : 'left'} corner`, async () => {
          contextmenu(menu, isRTL ? 450 : 10, 10);
          await oneEvent(overlay, 'vaadin-overlay-open');

          expect(overlay.hasAttribute('end-aligned')).to.be.false;
          expect(overlay.hasAttribute('bottom-aligned')).to.be.false;
          expect(overlay.style[isRTL ? 'right' : 'left']).to.be.equal(isRTL ? `${viewWidth - 450}px` : '10px');
          expect(overlay.style.top).to.be.equal('10px');
        });

        it('should be aligned relative to bottom-right corner', async () => {
          contextmenu(menu, viewWidth, viewHeight);
          await oneEvent(overlay, 'vaadin-overlay-open');

          expect(overlay.hasAttribute('end-aligned')).to.equal(!isRTL);
          expect(overlay.hasAttribute('bottom-aligned')).to.be.true;
          expect(overlay.style.right).to.be.equal('0px');
          expect(overlay.style.bottom).to.be.equal('0px');
        });

        it('css should be correctly configured to set content position', async () => {
          contextmenu(menu, viewWidth, viewHeight);
          await oneEvent(overlay, 'vaadin-overlay-open');

          const border = parseInt(getComputedStyle(overlay.$.overlay).borderWidth);
          const rect = content.getBoundingClientRect();
          expect(rect.width).to.be.closeTo(100, 0.5);
          expect(rect.height).to.be.closeTo(100, 0.5);
          expect(rect.left).to.be.closeTo(viewWidth - 100 - border, 0.5);
          expect(rect.top).to.be.closeTo(viewHeight - 100 - border, 0.5);
        });

        it('should reset css properties and attributes on each open', async () => {
          contextmenu(menu, viewWidth, viewHeight);
          await oneEvent(overlay, 'vaadin-overlay-open');

          overlay.opened = false;
          await nextRender();
          contextmenu(menu, 16, 16);
          await oneEvent(overlay, 'vaadin-overlay-open');

          const border = parseInt(getComputedStyle(overlay.$.overlay).borderWidth);
          const rect = content.getBoundingClientRect();
          expect(rect.left).to.be.closeTo(16 + border, 0.5);
          expect(rect.top).to.be.closeTo(16 + border, 0.5);
          expect(overlay.hasAttribute('end-aligned')).to.equal(isRTL);
          expect(overlay.hasAttribute('bottom-aligned')).to.be.false;
          expect(overlay.style.right).to.be.empty;
          expect(overlay.style.bottom).to.be.empty;
        });

        it('overlay position should be constrained to the viewport', async () => {
          contextmenu(menu, viewWidth * 1.1, viewHeight * 1.1);
          await oneEvent(overlay, 'vaadin-overlay-open');

          const border = parseInt(getComputedStyle(overlay.$.overlay).borderWidth);
          const rect = content.getBoundingClientRect();
          expect(rect.left).to.be.closeTo(viewWidth - 100 - border, 0.5);
          expect(rect.top).to.be.closeTo(viewHeight - 100 - border, 0.5);
        });
      });
    });

    (isIOS ? describe : describe.skip)('<vaadin-overlay> iOS viewport workaround (phone mode)', () => {
      it('should have zero bottom by default', async () => {
        contextmenu(menu);
        await oneEvent(overlay, 'vaadin-overlay-open');
        expect(parseFloat(getComputedStyle(overlay).bottom)).to.equal(0);
      });

      it('should accept --vaadin-overlay-viewport-bottom CSS property', async () => {
        contextmenu(menu);
        await oneEvent(overlay, 'vaadin-overlay-open');
        overlay.style.setProperty('--vaadin-overlay-viewport-bottom', '50px');
        expect(getComputedStyle(overlay).bottom).to.equal('50px');
      });
    });
  });
});

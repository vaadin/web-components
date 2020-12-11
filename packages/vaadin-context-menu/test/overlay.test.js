import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@open-wc/testing-helpers';
import { fire, listenOnce, isIOS } from './common.js';
import './not-animated-styles.js';
import '../vaadin-context-menu.js';

describe('overlay', () => {
  let menu, overlay, content, viewHeight, viewWidth;

  beforeEach(() => {
    menu = fixtureSync(`
      <vaadin-context-menu>
        <template>OVERLAY CONTENT</template>
        <div id="target">FOOOO</div>
      </vaadin-context-menu>
    `);
    overlay = menu.$.overlay;
    content = overlay.$.overlay.children[0];
    // make content have a fixed size
    content.style.height = content.style.width = '100px';
    content.style.boxSizing = 'border-box';
    // Compute viewport at the end of the test setup
    viewHeight = document.documentElement.clientHeight;
  });

  afterEach(() => {
    overlay.opened = false;
  });

  function contextmenu(x, y, shiftKey, target) {
    shiftKey = shiftKey || false;
    const e = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y,
      shiftKey: shiftKey
    });
    (target || menu.listenOn).dispatchEvent(e);
    return e;
  }

  describe('opening', () => {
    it('should be invisible before open', (done) => {
      listenOnce(overlay, 'vaadin-overlay-open', () => {
        expect(window.getComputedStyle(overlay).opacity).to.eql('1');
        done();
      });

      menu.openOn = 'foobar';
      fire(menu.listenOn, 'foobar', { x: 5, y: 5, sourceEvent: { clientX: 10, clientY: 20 } });
      expect(window.getComputedStyle(overlay).opacity).to.eql('0');
    });

    it('should be visible when open', (done) => {
      expect(window.getComputedStyle(overlay).display).to.eql('none');
      listenOnce(overlay, 'vaadin-overlay-open', () => {
        expect(window.getComputedStyle(overlay).display).to.not.eql('none');
        done();
      });

      menu._setOpened(true);
    });

    it('should open on `contextmenu` event', (done) => {
      listenOnce(overlay, 'vaadin-overlay-open', () => {
        expect(menu.opened).to.eql(true);
        done();
      });

      contextmenu();
    });

    it('should clear selected ranges on opening', (done) => {
      listenOnce(overlay, 'vaadin-overlay-open', () => {
        expect(window.getSelection().rangeCount).to.equal(0);
        done();
      });

      const range = document.createRange();
      range.selectNode(menu.listenOn.querySelector('#target'));
      window.getSelection().addRange(range);
      contextmenu();
    });

    it('should set `user-select` to `none` on opening', (done) => {
      listenOnce(overlay, 'vaadin-overlay-open', () => {
        expect(menu.opened).to.eql(true);

        const userSelect = getComputedStyle(menu).webkitUserSelect || getComputedStyle(menu).userSelect;
        expect(userSelect).to.equal('none');
        done();
      });

      ['webkitUserSelect', 'userSelect'].forEach((prop) => expect(getComputedStyle(menu)[prop]).not.to.equal('none'));
      contextmenu();
    });

    it('should unset `user-select` if the listenOn target was changed when opened', (done) => {
      listenOnce(overlay, 'vaadin-overlay-open', () => {
        expect(menu.opened).to.eql(true);
        const newTarget = document.createElement('span');
        newTarget.textContent = 'New target';
        menu.listenOn.parentElement.appendChild(newTarget);
        menu.listenOn = newTarget;

        ['webkitUserSelect', 'userSelect'].forEach((prop) => expect(getComputedStyle(menu)[prop]).not.to.equal('none'));

        done();
      });

      contextmenu();
    });

    ['ltr', 'rtl'].forEach((direction) => {
      describe(`[dir=${direction}] opening`, () => {
        let isRTL;

        before((done) => {
          isRTL = direction === 'rtl';
          document.documentElement.setAttribute('dir', direction);
          if (isRTL) {
            document.body.style.margin = 0;
          }
          requestAnimationFrame(() => {
            viewWidth = document.documentElement.clientWidth;
            done();
          });
        });

        after(() => {
          // Forcing dir to ltr because Safari scroll can get lost if attribute
          // is set to `rtl` and then removed
          if (isRTL) {
            document.documentElement.setAttribute('dir', 'ltr');
            document.body.style.margin = null;
          }
        });

        it('should be positioned on click target', (done) => {
          listenOnce(overlay, 'vaadin-overlay-open', () => {
            const rect = overlay.getBoundingClientRect();

            if (isRTL) {
              expect(rect.right).to.closeTo(menu._phone ? viewWidth : 450, 0.1);
            } else {
              expect(rect.left).to.eql(menu._phone ? 0 : 10);
            }
            expect(rect.top).to.eql(menu._phone ? 0 : 10);
            done();
          });

          contextmenu(isRTL ? 450 : 10, 10);
        });

        it('should be positioned on detailed mouse event', (done) => {
          listenOnce(overlay, 'vaadin-overlay-open', () => {
            const rect = overlay.getBoundingClientRect();
            if (isRTL) {
              expect(rect.right).to.closeTo(menu._phone ? viewWidth : 450, 0.1);
            } else {
              expect(rect.left).to.eql(menu._phone ? 0 : 10);
            }
            expect(rect.top).to.eql(menu._phone ? 0 : 20);
            done();
          });

          menu.openOn = 'foobar';

          fire(menu.listenOn, 'foobar', { sourceEvent: { clientX: isRTL ? 450 : 10, clientY: 20 } });
        });

        it('should be positioned by gesture event', (done) => {
          listenOnce(overlay, 'vaadin-overlay-open', () => {
            const rect = overlay.getBoundingClientRect();
            if (isRTL) {
              expect(rect.right).to.closeTo(menu._phone ? viewWidth : 450, 0.1);
            } else {
              expect(rect.left).to.eql(menu._phone ? 0 : 5);
            }
            expect(rect.top).to.eql(menu._phone ? 0 : 5);
            done();
          });

          menu.openOn = 'foobar';

          fire(menu.listenOn, 'foobar', { x: isRTL ? 450 : 5, y: 5, sourceEvent: { clientX: 10, clientY: 20 } });
        });

        it('should be positioned by detailed gesture event', (done) => {
          listenOnce(overlay, 'vaadin-overlay-open', () => {
            const rect = overlay.getBoundingClientRect();
            if (isRTL) {
              expect(rect.right).to.closeTo(menu._phone ? viewWidth : 450, 0.1);
            } else {
              expect(rect.left).to.eql(menu._phone ? 0 : 5);
            }
            expect(rect.top).to.eql(menu._phone ? 0 : 5);
            done();
          });

          menu.openOn = 'foobar';

          fire(menu.listenOn, 'foobar', { x: isRTL ? 450 : 5, y: 5, sourceEvent: { clientX: 10, clientY: 20 } });
        });

        it('should be positioned by touch event', (done) => {
          listenOnce(overlay, 'vaadin-overlay-open', () => {
            const rect = overlay.getBoundingClientRect();
            if (isRTL) {
              expect(rect.right).to.closeTo(menu._phone ? viewWidth : 450, 0.1);
            } else {
              expect(rect.left).to.eql(menu._phone ? 0 : 10);
            }
            expect(rect.top).to.eql(menu._phone ? 0 : 20);
            done();
          });

          menu.openOn = 'touchstart';

          const event = new CustomEvent('touchstart', { bubbles: true, cancelable: true });
          event.touches = event.changedTouches = event.targetTouches = [{ clientX: isRTL ? 450 : 10, clientY: 20 }];

          menu.children[0].dispatchEvent(event);
        });

        it('should be positioned by detailed touch event', (done) => {
          listenOnce(overlay, 'vaadin-overlay-open', () => {
            const rect = overlay.getBoundingClientRect();
            if (isRTL) {
              expect(rect.right).to.closeTo(menu._phone ? viewWidth : 450, 0.1);
            } else {
              expect(rect.left).to.eql(menu._phone ? 0 : 10);
            }
            expect(rect.top).to.eql(menu._phone ? 0 : 20);
            done();
          });

          menu.openOn = 'foobar';

          fire(menu.listenOn, 'foobar', {
            sourceEvent: { changedTouches: [{ clientX: isRTL ? 450 : 10, clientY: 20 }] }
          });
        });
      });

      (isIOS ? describe.skip : describe)(`[dir=${direction}] position`, () => {
        let isRTL;
        before((done) => {
          isRTL = direction === 'rtl';
          document.documentElement.setAttribute('dir', direction);
          if (isRTL) {
            document.body.style.margin = 0;
          }
          requestAnimationFrame(() => {
            viewWidth = document.documentElement.clientWidth;
            done();
          });
        });

        after(() => {
          // Forcing dir to ltr because Safari scroll can get lost if attribute
          // is set to `rtl` and then removed
          if (isRTL) {
            document.documentElement.setAttribute('dir', 'ltr');
            document.body.style.margin = null;
          }
        });

        it(`should be aligned relative to top-${isRTL ? 'right' : 'left'} corner`, (done) => {
          listenOnce(overlay, 'vaadin-overlay-open', () => {
            expect(overlay.hasAttribute('end-aligned')).to.be.false;
            expect(overlay.hasAttribute('bottom-aligned')).to.be.false;
            expect(overlay.style[isRTL ? 'right' : 'left']).to.be.equal(isRTL ? `${viewWidth - 450}px` : '10px');
            expect(overlay.style.top).to.be.equal('10px');
            done();
          });
          contextmenu(isRTL ? 450 : 10, 10);
        });

        it('should be aligned relative to bottom-right corner', (done) => {
          listenOnce(overlay, 'vaadin-overlay-open', () => {
            expect(overlay.hasAttribute('end-aligned')).to.equal(!isRTL);
            expect(overlay.hasAttribute('bottom-aligned')).to.be.true;
            expect(overlay.style.right).to.be.equal('0px');
            expect(overlay.style.bottom).to.be.equal('0px');
            done();
          });
          contextmenu(viewWidth, viewHeight);
        });

        it('css should be correctly configured to set content position', (done) => {
          listenOnce(overlay, 'vaadin-overlay-open', () => {
            const rect = content.getBoundingClientRect();
            expect(rect.width).to.be.closeTo(100, 0.5);
            expect(rect.height).to.be.closeTo(100, 0.5);
            expect(rect.left).to.be.closeTo(viewWidth - 100, 0.5);
            expect(rect.top).to.be.closeTo(viewHeight - 100, 0.5);
            done();
          });
          contextmenu(viewWidth, viewHeight);
        });

        it('should reset css properties and attributes on each open', (done) => {
          listenOnce(overlay, 'vaadin-overlay-open', () => {
            overlay.opened = false;
            listenOnce(overlay, 'vaadin-overlay-open', () => {
              const rect = content.getBoundingClientRect();
              expect(rect.left).to.be.closeTo(16, 0.5);
              expect(rect.top).to.be.closeTo(16, 0.5);
              expect(overlay.hasAttribute('end-aligned')).to.equal(isRTL);
              expect(overlay.hasAttribute('bottom-aligned')).to.be.false;
              expect(overlay.style.right).to.be.empty;
              expect(overlay.style.bottom).to.be.empty;
              done();
            });
            contextmenu(16, 16);
          });
          contextmenu(viewWidth, viewHeight);
        });

        it('overlay position should be constrained to the viewport', (done) => {
          listenOnce(overlay, 'vaadin-overlay-open', () => {
            const rect = content.getBoundingClientRect();
            expect(rect.left).to.be.closeTo(viewWidth - 100, 0.5);
            expect(rect.top).to.be.closeTo(viewHeight - 100, 0.5);
            done();
          });
          contextmenu(viewWidth * 1.1, viewHeight * 1.1);
        });
      });
    });

    describe('with shift key', () => {
      it('should not open on `contextmenu` event', () => {
        contextmenu(0, 0, true);
        expect(menu.opened).to.eql(false);
      });

      it('should not prevent default of `contextmenu` event', () => {
        const event = contextmenu(0, 0, true);
        expect(event.defaultPrevented).to.not.eql(true);
      });
    });

    (isIOS ? describe : describe.skip)('<vaadin-overlay> iOS viewport workaround (phone mode)', () => {
      it('should have zero bottom by default', (done) => {
        listenOnce(menu, 'opened-changed', () => {
          expect(parseFloat(getComputedStyle(overlay).bottom)).to.equal(0);
          done();
        });

        contextmenu();
      });

      it('should accept --vaadin-overlay-viewport-bottom CSS property', (done) => {
        listenOnce(menu, 'opened-changed', () => {
          overlay.style.setProperty('--vaadin-overlay-viewport-bottom', '50px');
          overlay.updateStyles({ '--vaadin-overlay-viewport-bottom': '50px' });

          expect(getComputedStyle(overlay).bottom).to.equal('50px');
          done();
        });

        contextmenu();
      });
    });
  });

  describe('closing', () => {
    beforeEach((done) => {
      listenOnce(overlay, 'vaadin-overlay-open', () => {
        done();
      });

      menu._setOpened(true);
    });

    it('should close on outside click', (done) => {
      listenOnce(menu, 'opened-changed', () => {
        expect(menu.opened).to.eql(false);
        done();
      });

      fire(document.body, 'click');
    });

    it('should close on menu contextmenu', (done) => {
      listenOnce(menu, 'opened-changed', () => {
        expect(menu.opened).to.eql(false);
        done();
      });

      const e = contextmenu(0, 0, false, overlay);
      expect(e.defaultPrevented).to.be.true;
    });

    it('should close on outside contextmenu', (done) => {
      listenOnce(menu, 'opened-changed', () => {
        expect(menu.opened).to.eql(false);
        done();
      });

      const e = contextmenu(0, 0, false, document.body);
      expect(e.defaultPrevented).to.be.true;
    });

    it('should close on `click`', () => {
      overlay.click();

      expect(menu.opened).to.eql(false);
    });

    it('should close on custom event', () => {
      menu.closeOn = 'foobar';

      overlay.dispatchEvent(new CustomEvent('foobar', { bubbles: true }));

      expect(menu.opened).to.eql(false);
    });

    it('should disable close on empty `closeOn`', () => {
      menu.closeOn = '';

      overlay.dispatchEvent(new CustomEvent('click'));

      expect(menu.opened).to.eql(true);
    });

    describe('with shift key', () => {
      it('should not close on menu contextmenu', () => {
        const e = contextmenu(0, 0, true, overlay);

        expect(menu.opened).to.be.true;
        expect(e.defaultPrevented).to.be.false;
      });

      it('should not close on outside contextmenu', () => {
        const e = contextmenu(0, 0, true, document.body);

        expect(menu.opened).to.be.true;
        expect(e.defaultPrevented).to.be.false;
      });
    });
  });

  describe('styling', () => {
    it('should set default background color for content', () => {
      const overlayPart = overlay.shadowRoot.querySelector('[part~="overlay"]');
      expect(getComputedStyle(overlayPart).backgroundColor).to.eql('rgb(255, 255, 255)');
    });
  });
});

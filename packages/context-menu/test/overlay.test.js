import { expect } from '@vaadin/chai-plugins';
import { esc, fire, fixtureSync, isIOS, nextFrame, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-context-menu.js';

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

  function contextmenu(x, y, shiftKey, target) {
    shiftKey ||= false;
    const e = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y,
      shiftKey,
    });
    (target || menu.listenOn).dispatchEvent(e);
    return e;
  }

  describe('initialization', () => {
    beforeEach(() => {
      menu = document.createElement('vaadin-context-menu');
    });

    afterEach(() => {
      menu.remove();
    });

    it('should not clear selected ranges on initialization', () => {
      const input = fixtureSync('<input value="foo">');
      input.select();
      document.body.appendChild(menu);
      expect(window.getSelection().rangeCount).to.equal(1);
    });
  });

  describe('opening', () => {
    it('should be invisible before open', async () => {
      menu.openOn = 'foobar';
      fire(menu.listenOn, 'foobar', { x: 5, y: 5, sourceEvent: { clientX: 10, clientY: 20 } });
      expect(window.getComputedStyle(overlay).visibility).to.eql('hidden');

      await oneEvent(overlay, 'vaadin-overlay-open');
      expect(window.getComputedStyle(overlay).visibility).to.eql('visible');
    });

    it('should be visible when open', async () => {
      expect(window.getComputedStyle(overlay).display).to.eql('none');

      menu._setOpened(true);
      await oneEvent(overlay, 'vaadin-overlay-open');
      expect(window.getComputedStyle(overlay).display).to.not.eql('none');
    });

    it('should open on `contextmenu` event', async () => {
      contextmenu();
      await oneEvent(overlay, 'vaadin-overlay-open');
      expect(menu.opened).to.be.true;
    });

    it('should clear selected ranges on opening', async () => {
      const range = document.createRange();
      range.selectNode(menu.listenOn.querySelector('#target'));
      window.getSelection().addRange(range);

      contextmenu();
      await oneEvent(overlay, 'vaadin-overlay-open');

      expect(window.getSelection().rangeCount).to.equal(0);
    });

    it('should set `user-select` to `none` on opening', async () => {
      ['webkitUserSelect', 'userSelect'].forEach((prop) => expect(getComputedStyle(menu)[prop]).not.to.equal('none'));

      contextmenu();
      await oneEvent(overlay, 'vaadin-overlay-open');

      const userSelect = getComputedStyle(menu).webkitUserSelect || getComputedStyle(menu).userSelect;
      expect(userSelect).to.equal('none');
    });

    it('should unset `user-select` if the listenOn target was changed when opened', async () => {
      contextmenu();
      await oneEvent(overlay, 'vaadin-overlay-open');

      const newTarget = document.createElement('span');
      newTarget.textContent = 'New target';
      menu.listenOn.parentElement.appendChild(newTarget);
      menu.listenOn = newTarget;

      ['webkitUserSelect', 'userSelect'].forEach((prop) => expect(getComputedStyle(menu)[prop]).not.to.equal('none'));
    });

    ['ltr', 'rtl'].forEach((direction) => {
      describe(`[dir=${direction}] opening`, () => {
        let isRTL;

        before(async () => {
          isRTL = direction === 'rtl';
          document.documentElement.setAttribute('dir', direction);
          if (isRTL) {
            document.body.style.margin = 0;
          }
          await nextFrame();
          viewWidth = document.documentElement.clientWidth;
        });

        after(() => {
          // Forcing dir to ltr because Safari scroll can get lost if attribute
          // is set to `rtl` and then removed
          if (isRTL) {
            document.documentElement.setAttribute('dir', 'ltr');
            document.body.style.margin = null;
          }
        });

        it('should be positioned on click target', async () => {
          contextmenu(isRTL ? 450 : 10, 10);
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

        it('should be positioned by detailed gesture event', async () => {
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
          if (isRTL) {
            document.body.style.margin = 0;
          }
          await nextFrame();
          viewWidth = document.documentElement.clientWidth;
        });

        after(() => {
          // Forcing dir to ltr because Safari scroll can get lost if attribute
          // is set to `rtl` and then removed
          if (isRTL) {
            document.documentElement.setAttribute('dir', 'ltr');
            document.body.style.margin = null;
          }
        });

        it(`should be aligned relative to top-${isRTL ? 'right' : 'left'} corner`, async () => {
          contextmenu(isRTL ? 450 : 10, 10);
          await oneEvent(overlay, 'vaadin-overlay-open');

          expect(overlay.hasAttribute('end-aligned')).to.be.false;
          expect(overlay.hasAttribute('bottom-aligned')).to.be.false;
          expect(overlay.style[isRTL ? 'right' : 'left']).to.be.equal(isRTL ? `${viewWidth - 450}px` : '10px');
          expect(overlay.style.top).to.be.equal('10px');
        });

        it('should be aligned relative to bottom-right corner', async () => {
          contextmenu(viewWidth, viewHeight);
          await oneEvent(overlay, 'vaadin-overlay-open');

          expect(overlay.hasAttribute('end-aligned')).to.equal(!isRTL);
          expect(overlay.hasAttribute('bottom-aligned')).to.be.true;
          expect(overlay.style.right).to.be.equal('0px');
          expect(overlay.style.bottom).to.be.equal('0px');
        });

        it('css should be correctly configured to set content position', async () => {
          contextmenu(viewWidth, viewHeight);
          await oneEvent(overlay, 'vaadin-overlay-open');

          const border = parseInt(getComputedStyle(overlay.$.overlay).borderWidth);
          const rect = content.getBoundingClientRect();
          expect(rect.width).to.be.closeTo(100, 0.5);
          expect(rect.height).to.be.closeTo(100, 0.5);
          expect(rect.left).to.be.closeTo(viewWidth - 100 - border, 0.5);
          expect(rect.top).to.be.closeTo(viewHeight - 100 - border, 0.5);
        });

        it('should reset css properties and attributes on each open', async () => {
          contextmenu(viewWidth, viewHeight);
          await oneEvent(overlay, 'vaadin-overlay-open');

          overlay.opened = false;
          await nextRender();
          contextmenu(16, 16);
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
          contextmenu(viewWidth * 1.1, viewHeight * 1.1);
          await oneEvent(overlay, 'vaadin-overlay-open');

          const border = parseInt(getComputedStyle(overlay.$.overlay).borderWidth);
          const rect = content.getBoundingClientRect();
          expect(rect.left).to.be.closeTo(viewWidth - 100 - border, 0.5);
          expect(rect.top).to.be.closeTo(viewHeight - 100 - border, 0.5);
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
      it('should have zero bottom by default', async () => {
        contextmenu();
        await oneEvent(overlay, 'vaadin-overlay-open');
        expect(parseFloat(getComputedStyle(overlay).bottom)).to.equal(0);
      });

      it('should accept --vaadin-overlay-viewport-bottom CSS property', async () => {
        contextmenu();
        await oneEvent(overlay, 'vaadin-overlay-open');
        overlay.style.setProperty('--vaadin-overlay-viewport-bottom', '50px');
        expect(getComputedStyle(overlay).bottom).to.equal('50px');
      });
    });
  });

  describe('closing', () => {
    beforeEach(async () => {
      menu._setOpened(true);
      await oneEvent(overlay, 'vaadin-overlay-open');
    });

    it('should close on outside click', async () => {
      fire(document.body, 'click');
      await nextRender();
      expect(menu.opened).to.be.false;
    });

    it('should close on menu contextmenu', () => {
      // Dispatch a contextmenu event on the overlay content
      const { left, top } = content.getBoundingClientRect();
      const e = contextmenu(left, top, false, overlay._contentRoot);
      expect(e.defaultPrevented).to.be.true;
      expect(menu.opened).to.be.false;
    });

    it('should close on outside contextmenu', () => {
      // Dispatch a contextmenu event outside the overlay and the target
      const e = contextmenu(1000, 1000, false, document.body);
      expect(e.defaultPrevented).to.be.true;
      expect(menu.opened).to.be.false;
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

  describe('close and re-open on contextmenu', () => {
    let target;

    beforeEach(async () => {
      target = menu.querySelector('#target');
      const { right, bottom } = target.getBoundingClientRect();
      // Pre-open the context menu to the bottom right corner of the target
      contextmenu(right, bottom, false, target);
      await oneEvent(overlay, 'vaadin-overlay-open');
    });

    it('should close and re-open on target contextmenu', async () => {
      const { left, top } = target.getBoundingClientRect();
      // While a context-menu is open, pointer events are disabled on the body so
      // the contextmenu event gets dispatched to the document element
      contextmenu(left, top, false, document.documentElement);
      await nextFrame();
      expect(menu.opened).to.be.true;
    });

    it('should dispatch once on re-open', async () => {
      const contextMenuSpy = sinon.spy();
      target.addEventListener('contextmenu', contextMenuSpy);
      const { left, top } = target.getBoundingClientRect();
      contextmenu(left, top, false, document.documentElement);
      await nextFrame();
      expect(contextMenuSpy.calledOnce).to.be.true;
    });

    it('should re-open to correct coordinates', async () => {
      // Move the target to another location
      target.style.margin = '200px';

      const { left, top } = target.getBoundingClientRect();
      contextmenu(left, top, false, document.documentElement);
      await oneEvent(overlay, 'vaadin-overlay-open');

      const border = parseInt(getComputedStyle(overlay.$.overlay).borderWidth);
      const contentRect = content.getBoundingClientRect();
      expect(contentRect.left).to.equal(left + border);
      expect(contentRect.top).to.equal(top + border);
    });

    it('should cancel the synthetic contextmenu event', async () => {
      const spy = sinon.spy();
      target.addEventListener('contextmenu', spy);
      contextmenu(0, 0, false, document.documentElement);
      await nextFrame();
      expect(spy.called).to.be.true;
      expect(spy.firstCall.firstArg.defaultPrevented).to.be.true;
    });

    it('should re-open for a target inside a shadow root', async () => {
      // Create an element inside the target's shadow root
      const shadowTarget = document.createElement('div');
      shadowTarget.textContent = 'SHADOW';
      const shadowRoot = target.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(shadowTarget);

      // Obtain the composed path of the contextmenu event (grid getEventContext needs this)
      let composedPath;
      menu.renderer = (root, _, context) => {
        const { sourceEvent } = context.detail;
        composedPath = sourceEvent.__composedPath || sourceEvent.composedPath();
        root.textContent = 'OVERLAY CONTENT!';
      };

      const { left, top } = target.getBoundingClientRect();
      contextmenu(left, top, false, document.documentElement);
      await nextFrame();

      expect(menu.opened).to.be.true;
      expect(composedPath.length).to.be.above(0);
      expect(composedPath).to.include(shadowTarget);
    });

    it('should have the target focused on context menu close', async () => {
      // Make the target focusable
      target.tabIndex = 0;

      // Create a child element inside the target
      const child = document.createElement('div');
      child.textContent = 'Child';
      target.appendChild(child);

      // Re-open the context menu on the child
      const { left, top, right, bottom } = child.getBoundingClientRect();
      const x = (left + right) / 2;
      const y = (top + bottom) / 2;
      contextmenu(x, y, false, document.documentElement);
      await oneEvent(overlay, 'vaadin-overlay-open');

      // Close the context menu
      esc(document.body);
      await nextFrame();

      // Check if the target is focused
      expect(target).to.equal(document.activeElement);
    });

    it('should only dispatch one contextmenu event', async () => {
      const contextmenuSpy = sinon.spy();
      window.addEventListener('contextmenu', contextmenuSpy);
      const { left, top } = target.getBoundingClientRect();
      contextmenu(left, top, false, document.documentElement);
      await nextFrame();
      expect(contextmenuSpy.calledOnce).to.be.true;
    });
  });

  describe('exportparts', () => {
    it('should export all overlay parts for styling', () => {
      const parts = [...overlay.shadowRoot.querySelectorAll('[part]')].map((el) => el.getAttribute('part'));
      const exportParts = overlay.getAttribute('exportparts').split(', ');

      parts.forEach((part) => {
        expect(exportParts).to.include(part);
      });
    });
  });
});

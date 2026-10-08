import { expect } from '@vaadin/chai-plugins';
import { aTimeout, esc, fire, fixtureSync, nextFrame, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-context-menu.js';
import { contextmenu } from './helpers.js';

describe('overlay closing', () => {
  let menu, overlay, content, target;

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
    target = menu.querySelector('#target');
  });

  afterEach(() => {
    overlay.opened = false;
  });

  describe('default', () => {
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
      const e = contextmenu(overlay._contentRoot, left, top);
      expect(e.defaultPrevented).to.be.true;
      expect(menu.opened).to.be.false;
    });

    it('should close on outside contextmenu', () => {
      // Dispatch a contextmenu event outside the overlay and the target
      const e = contextmenu(document.body, 1000, 1000);
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

    it('should not close on overlay click with empty `closeOn`', () => {
      menu.closeOn = '';

      overlay.dispatchEvent(new CustomEvent('click'));

      expect(menu.opened).to.eql(true);
    });

    it('should not close on outside click with empty `closeOn`', async () => {
      menu.closeOn = '';

      fire(document.body, 'click');
      await nextRender();

      expect(menu.opened).to.be.true;
    });

    it('should dispatch closed event when the overlay is closed', async () => {
      const closedSpy = sinon.spy();
      menu.addEventListener('closed', closedSpy);
      fire(document.body, 'click');
      await nextRender();
      expect(closedSpy.calledOnce).to.be.true;
    });

    describe('with shift key', () => {
      it('should not close on menu contextmenu', () => {
        const e = contextmenu(overlay, 0, 0, true);

        expect(menu.opened).to.be.true;
        expect(e.defaultPrevented).to.be.false;
      });

      it('should not close on outside contextmenu', () => {
        const e = contextmenu(document.body, 0, 0, true);

        expect(menu.opened).to.be.true;
        expect(e.defaultPrevented).to.be.false;
      });
    });
  });

  describe('close and re-open on contextmenu', () => {
    let target;

    beforeEach(async () => {
      target = menu.querySelector('#target');
      const { right, bottom } = target.getBoundingClientRect();
      // Pre-open the context menu to the bottom right corner of the target
      contextmenu(target, right, bottom);
      await oneEvent(overlay, 'vaadin-overlay-open');
    });

    it('should close and re-open on target contextmenu', async () => {
      const { left, top } = target.getBoundingClientRect();
      // While a context-menu is open, pointer events are disabled on the body so
      // the contextmenu event gets dispatched to the document element
      contextmenu(document.documentElement, left, top);
      await nextFrame();
      expect(menu.opened).to.be.true;
    });

    it('should dispatch once on re-open', async () => {
      const contextMenuSpy = sinon.spy();
      target.addEventListener('contextmenu', contextMenuSpy);
      const { left, top } = target.getBoundingClientRect();
      contextmenu(document.documentElement, left, top);
      await nextFrame();
      expect(contextMenuSpy.calledOnce).to.be.true;
    });

    it('should re-open to correct coordinates', async () => {
      // Move the target to another location
      target.style.margin = '200px';

      const { left, top } = target.getBoundingClientRect();
      contextmenu(document.documentElement, left, top);
      await oneEvent(overlay, 'vaadin-overlay-open');

      const border = parseInt(getComputedStyle(overlay.$.overlay).borderWidth);
      const contentRect = content.getBoundingClientRect();
      expect(contentRect.left).to.equal(left + border);
      expect(contentRect.top).to.equal(top + border);
    });

    it('should cancel the synthetic contextmenu event', async () => {
      const spy = sinon.spy();
      target.addEventListener('contextmenu', spy);
      contextmenu(document.documentElement, 0, 0);
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
      contextmenu(document.documentElement, left, top);
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
      contextmenu(document.documentElement, x, y);
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
      contextmenu(document.documentElement, left, top);
      await nextFrame();
      expect(contextmenuSpy.calledOnce).to.be.true;
    });
  });

  describe('detach', () => {
    it('should be closed after detached', async () => {
      fire(target, 'contextmenu');
      expect(menu.opened).to.be.true;

      const spy = sinon.spy(menu, 'close');

      menu.parentNode.removeChild(menu);
      await aTimeout(0);
      expect(spy.calledOnce).to.be.true;
      expect(menu.opened).to.be.false;
    });

    it('should not close when moved within the DOM', async () => {
      fire(target, 'contextmenu');
      expect(menu.opened).to.be.true;

      const newParent = document.createElement('div');
      document.body.appendChild(newParent);

      newParent.appendChild(menu);
      await aTimeout(0);
      expect(menu.opened).to.be.true;
    });
  });
});

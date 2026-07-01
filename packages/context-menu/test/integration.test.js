import { expect } from '@vaadin/chai-plugins';
import { aTimeout, click, fixtureSync, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import '../src/vaadin-context-menu.js';

describe('integration', () => {
  let menu, wrapper, target, overlay;

  beforeEach(async () => {
    menu = fixtureSync('<vaadin-context-menu></vaadin-context-menu>');
    await nextRender();
    // The target is placed inside the wrapper's shadow root, so an event
    // originating from it is re-targeted to the wrapper (the shadow host).
    wrapper = menu.parentElement;
    wrapper.attachShadow({ mode: 'open' });
    wrapper.shadowRoot.innerHTML = `
      <slot></slot>
      <button style="margin: 20px">Show context menu</button>
    `;
    menu.renderer = (root) => {
      root.textContent = 'foo';
    };
    target = wrapper.shadowRoot.querySelector('button');
    overlay = menu._overlayElement;
  });

  describe('default', () => {
    beforeEach(() => {
      wrapper.addEventListener('click', (e) => {
        menu.open(e);
      });
    });

    it('should open context menu on .open(e)', () => {
      click(target);
      expect(menu.opened).to.eql(true);
    });

    it('should position overlay against the target on keyboard open', async () => {
      // Emulate keyboard-triggered click that reports clientX/clientY as 0
      click(target, { x: 0, y: 0 });
      await oneEvent(overlay, 'vaadin-overlay-open');
      const targetRect = target.getBoundingClientRect();
      const overlayRect = overlay.getBoundingClientRect();
      expect(overlayRect.left).to.be.closeTo(targetRect.left, 0.1);
      expect(overlayRect.top).to.be.closeTo(targetRect.bottom, 0.1);
    });

    it('should position overlay at the pointer on mouse open', async () => {
      click(target, { x: 100, y: 100 });
      await oneEvent(overlay, 'vaadin-overlay-open');
      const overlayRect = overlay.getBoundingClientRect();
      expect(overlayRect.left).to.be.closeTo(100, 0.1);
      expect(overlayRect.top).to.be.closeTo(100, 0.1);
    });
  });

  describe('deferred open', () => {
    // The Flow connector stores the event and opens the menu later, so open()
    // runs once the event finished dispatching and its composed path is empty.
    it('should open with an event used after it finished dispatching', async () => {
      const event = click(target, { x: 0, y: 0 });
      await aTimeout(0);
      menu.open(event);
      await nextRender();
      expect(menu.opened).to.be.true;
    });

    it('should position against the deep target from the stored composed path', async () => {
      // Captured at dispatch time by the gesture / Flow connector
      wrapper.addEventListener('click', (e) => {
        e.__composedPath = e.composedPath();
      });
      const event = click(target, { x: 0, y: 0 });
      const targetRect = target.getBoundingClientRect();

      await aTimeout(0);
      menu.open(event);
      await oneEvent(overlay, 'vaadin-overlay-open');

      const overlayRect = overlay.getBoundingClientRect();
      expect(overlayRect.left).to.be.closeTo(targetRect.left, 0.1);
      expect(overlayRect.top).to.be.closeTo(targetRect.bottom, 0.1);
    });

    it('should resolve the selector target from the stored composed path', async () => {
      const item = document.createElement('div');
      item.className = 'item';
      wrapper.appendChild(item);
      menu.selector = '.item';
      menu.listenOn = wrapper;
      await nextUpdate(menu);

      // Captured at dispatch time by the gesture / Flow connector
      item.addEventListener('click', (e) => {
        e.__composedPath = e.composedPath();
      });
      const event = click(item);

      await aTimeout(0);
      menu.open(event);
      await nextRender();

      expect(menu.opened).to.be.true;
      expect(menu._context.target).to.equal(item);
    });
  });
});

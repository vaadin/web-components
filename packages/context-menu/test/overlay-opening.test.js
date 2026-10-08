import { expect } from '@vaadin/chai-plugins';
import { fire, fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import '../src/vaadin-context-menu.js';
import { contextmenu } from './helpers.js';

describe('overlay opening', () => {
  let menu, overlay;

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
  });

  afterEach(() => {
    overlay.opened = false;
  });

  describe('default', () => {
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
      contextmenu(menu);
      await oneEvent(overlay, 'vaadin-overlay-open');
      expect(menu.opened).to.be.true;
    });

    it('should clear selected ranges on opening', async () => {
      const range = document.createRange();
      range.selectNode(menu.listenOn.querySelector('#target'));
      window.getSelection().addRange(range);

      contextmenu(menu);
      await oneEvent(overlay, 'vaadin-overlay-open');

      expect(window.getSelection().rangeCount).to.equal(0);
    });

    it('should set `user-select` to `none` on opening', async () => {
      ['webkitUserSelect', 'userSelect'].forEach((prop) => expect(getComputedStyle(menu)[prop]).not.to.equal('none'));

      contextmenu(menu);
      await oneEvent(overlay, 'vaadin-overlay-open');

      const userSelect = getComputedStyle(menu).webkitUserSelect || getComputedStyle(menu).userSelect;
      expect(userSelect).to.equal('none');
    });

    it('should unset `user-select` if the listenOn target was changed when opened', async () => {
      contextmenu(menu);
      await oneEvent(overlay, 'vaadin-overlay-open');

      const newTarget = document.createElement('span');
      newTarget.textContent = 'New target';
      menu.listenOn.parentElement.appendChild(newTarget);
      menu.listenOn = newTarget;

      ['webkitUserSelect', 'userSelect'].forEach((prop) => expect(getComputedStyle(menu)[prop]).not.to.equal('none'));
    });

    describe('with shift key', () => {
      it('should not open on `contextmenu` event', () => {
        contextmenu(menu, 0, 0, true);
        expect(menu.opened).to.eql(false);
      });

      it('should not prevent default of `contextmenu` event', () => {
        const event = contextmenu(menu, 0, 0, true);
        expect(event.defaultPrevented).to.not.eql(true);
      });
    });
  });

  describe('openOn', () => {
    beforeEach(async () => {
      menu = fixtureSync('<vaadin-context-menu></vaadin-context-menu>');
      await nextRender();
    });

    it('should open on custom event', async () => {
      menu.openOn = 'click';
      await nextRender();

      menu.click();
      await nextRender();

      expect(menu.opened).to.eql(true);
    });

    it('should not open on `contextmenu`', async () => {
      menu.openOn = 'click';
      await nextRender();

      fire(menu, 'contextmenu');
      await nextRender();

      expect(menu.opened).to.eql(false);
    });

    describe('event listener', () => {
      it('should not add listener when set to empty', async () => {
        expect(menu._oldOpenOn).to.be.ok;
        menu.openOn = '';
        await nextRender();
        expect(menu._oldOpenOn).not.to.be.ok;
      });
    });
  });

  describe('opened', () => {
    beforeEach(async () => {
      menu = fixtureSync('<vaadin-context-menu></vaadin-context-menu>');
      await nextRender();
    });

    it('should be read-only', async () => {
      expect(menu.opened).to.eql(false);

      menu.opened = true;
      await nextRender();
      expect(menu.opened).to.eql(false);
    });

    it('should be set using the private setter', async () => {
      expect(menu.opened).to.eql(false);

      menu._setOpened(true);
      await nextRender();
      expect(menu.opened).to.be.true;
    });
  });

  describe('external target', () => {
    let wrapper, target;

    beforeEach(async () => {
      wrapper = fixtureSync(`
        <div>
          <vaadin-context-menu></vaadin-context-menu>
          <section>
            <div id="target"></div>
          </section>
        </div>
      `);
      await nextRender();
      menu = wrapper.firstElementChild;
      target = wrapper.querySelector('#target');

      menu.listenOn = target;
    });

    it('should open on external target', async () => {
      fire(target, 'contextmenu');
      await nextRender();

      expect(menu.opened).to.eql(true);
    });

    it('should use context selector on external target', async () => {
      menu.selector = 'section'; // Parent of #target
      menu.listenOn = menu.parentElement;
      fire(target, 'contextmenu');
      await nextRender();

      expect(menu._context.target).to.eql(target.parentElement);
    });

    describe('event listeners', () => {
      it('should not target listeners when set to null', async () => {
        expect(menu._oldOpenOn).to.be.ok;
        menu.listenOn = null;
        await nextRender();
        expect(menu._oldOpenOn).not.to.be.ok;
      });
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

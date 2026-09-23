import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextResize } from '@vaadin/testing-helpers';
import '../src/vaadin-menu-bar.js';
import {
  assertHidden,
  assertVisible,
  BUTTON_WIDTH,
  createItems,
  expectCollapsed,
  expectOverflowInside,
} from './helpers.js';

describe('overflow in layouts', () => {
  beforeEach(() => {
    fixtureSync(`
      <style>
        vaadin-menu-bar-button {
          width: ${BUTTON_WIDTH}px;
        }
      </style>
    `);
  });

  describe('responsive behavior in container', () => {
    let container, menu, buttons, overflow;

    beforeEach(async () => {
      container = fixtureSync(
        '<div style="display: flex;"><vaadin-menu-bar style="min-width: 100%"></vaadin-menu-bar></div>',
      );
      menu = container.firstChild;

      container.style.width = `${BUTTON_WIDTH * 2.5}px`;

      menu.items = createItems(5);
      await nextRender();
      buttons = menu._buttons;
      overflow = buttons[buttons.length - 1];
    });

    it('should hide overflow button and reset its items when all buttons fit', async () => {
      // Must work even if menu-bar won't automatically resize to a larger size
      // when more space becomes available
      // see https://github.com/vaadin/vaadin-menu-bar/issues/130
      menu.style.minWidth = '0';
      container.style.width = `${BUTTON_WIDTH * 1.5}px`;
      await nextResize(menu);
      assertHidden(buttons[2]);
      assertHidden(buttons[3]);

      container.style.width = `${BUTTON_WIDTH * 5}px`;
      await nextResize(menu);
      assertVisible(buttons[2]);
      assertVisible(buttons[3]);
      assertVisible(buttons[4]);
      expect(overflow.hasAttribute('hidden')).to.be.true;
      expect(overflow.item.children.length).to.equal(0);
    });
  });

  describe('layout combinations', () => {
    const items = createItems(5);

    async function initMenuBar(container) {
      const menu = container.querySelector('vaadin-menu-bar');
      menu.items = items;
      await nextResize(menu);
      const buttons = menu._buttons;
      const overflow = buttons[buttons.length - 1];
      return { menu, buttons, overflow };
    }

    describe('flex row with sibling', () => {
      let container, overflow;

      beforeEach(async () => {
        container = fixtureSync(`
          <div style="display: flex; width: ${BUTTON_WIDTH * 5}px">
            <vaadin-menu-bar style="width: 100%"></vaadin-menu-bar>
            <div style="min-width: ${BUTTON_WIDTH * 2}px">Sibling</div>
          </div>
        `);
        overflow = (await initMenuBar(container)).overflow;
      });

      it('should collapse items into overflow when sibling takes space', () => {
        expect(overflow.hasAttribute('hidden')).to.be.false;
        expect(overflow.item.children.length).to.be.greaterThan(0);
        expect(overflow.item.children.length).to.be.lessThan(items.length);
      });
    });

    describe('css grid with sibling', () => {
      let container, overflow;

      beforeEach(async () => {
        container = fixtureSync(`
          <div style="display: grid; grid-template-columns: 1fr ${BUTTON_WIDTH * 2}px; width: ${BUTTON_WIDTH * 5}px">
            <vaadin-menu-bar></vaadin-menu-bar>
            <div>Sibling</div>
          </div>
        `);
        overflow = (await initMenuBar(container)).overflow;
      });

      it('should collapse items into overflow', () => {
        expect(overflow.hasAttribute('hidden')).to.be.false;
        expect(overflow.item.children.length).to.be.greaterThan(0);
        expect(overflow.item.children.length).to.be.lessThan(items.length);
      });
    });

    describe('flex row-reverse with no width on menu-bar', () => {
      let container, menu, buttons, overflow;

      beforeEach(async () => {
        container = fixtureSync(`
          <div style="display: flex; flex-direction: row-reverse; width: ${BUTTON_WIDTH * 5}px">
            <div style="min-width: ${BUTTON_WIDTH * 2}px">Sibling</div>
            <vaadin-menu-bar></vaadin-menu-bar>
          </div>
        `);
        ({ menu, buttons, overflow } = await initMenuBar(container));
      });

      it('should collapse items into overflow', () => {
        expect(overflow.hasAttribute('hidden')).to.be.false;
        expect(overflow.item.children.length).to.be.greaterThan(0);
        expect(overflow.item.children.length).to.be.lessThan(items.length);
      });

      it('should restore items when container width increases', async () => {
        container.style.width = `${BUTTON_WIDTH * 8}px`;
        await nextResize(menu);
        buttons.slice(0, -1).forEach((btn) => assertVisible(btn));
        expect(overflow.hasAttribute('hidden')).to.be.true;
      });
    });

    describe('gradual collapse in flex container', () => {
      let container, menu, buttons, overflow;

      beforeEach(async () => {
        // Reproduces the layout from https://github.com/vaadin/web-components/issues/11269:
        // a flex container with a menu-bar (no explicit width) and a sibling.
        // Without the containerWidth snapshot fix, hiding a button causes
        // the host to shrink (min-width: 0), which shrinks the container,
        // causing cascading collapse where ALL items end up in overflow.
        container = fixtureSync(`
          <div style="display: flex; width: ${BUTTON_WIDTH * 3.5}px">
            <vaadin-menu-bar></vaadin-menu-bar>
            <button>Sibling</button>
          </div>
        `);
        menu = container.querySelector('vaadin-menu-bar');
        menu.items = createItems(6);
        await nextResize(menu);
        buttons = menu._buttons;
        overflow = buttons.at(-1);
      });

      it('should not collapse all items at once', () => {
        const visibleButtons = buttons.filter(
          (btn) => btn !== overflow && getComputedStyle(btn).visibility !== 'hidden',
        );
        expect(visibleButtons.length).to.be.greaterThan(0);
        expect(overflow.item.children.length).to.be.greaterThan(0);
        expect(overflow.item.children.length).to.be.lessThan(menu.items.length);
      });
    });

    it('should keep the overflow button inside the menu bar in a grid column sized by content', async () => {
      const container = fixtureSync(`
        <div style="display: grid; grid-template-columns: auto 1fr; width: ${BUTTON_WIDTH * 5}px">
          <vaadin-menu-bar></vaadin-menu-bar>
          <div style="min-width: ${BUTTON_WIDTH * 2}px">Sibling</div>
        </div>
      `);
      const { menu } = await initMenuBar(container);
      expectCollapsed(menu, [2, 3, 4]);
      expectOverflowInside(menu);
    });

    it('should keep the overflow button inside the menu bar in a toolbar with centered items', async () => {
      const container = fixtureSync(`
        <div style="display: flex; align-items: center; width: ${BUTTON_WIDTH * 5}px">
          <vaadin-menu-bar></vaadin-menu-bar>
          <div style="min-width: ${BUTTON_WIDTH * 2}px">Sibling</div>
        </div>
      `);
      const { menu } = await initMenuBar(container);
      expectCollapsed(menu, [2, 3, 4]);
      expectOverflowInside(menu);
    });

    it('should keep the overflow button inside a shrink-to-fit menu bar limited by max-width', async () => {
      const container = fixtureSync(`
        <div style="width: ${BUTTON_WIDTH * 3}px">
          <vaadin-menu-bar style="display: inline-block; max-width: 100%"></vaadin-menu-bar>
        </div>
      `);
      const { menu } = await initMenuBar(container);
      expectCollapsed(menu, [2, 3, 4]);
      expectOverflowInside(menu);
    });
  });

  describe('parent resize', () => {
    let container, text, menu, buttons;

    beforeEach(() => {
      container = fixtureSync(`<div style="display: flex; max-width: ${BUTTON_WIDTH * 3}px"></div>`);
      text = document.createElement('div');
      text.textContent = 'Sibling';
      menu = document.createElement('vaadin-menu-bar');
      menu.items = createItems(4);
      menu.style.minWidth = `${BUTTON_WIDTH * 1.5}px`;
    });

    describe('container', () => {
      beforeEach(async () => {
        container.append(text, menu);
        await nextResize(menu);
        buttons = menu._buttons;
      });

      it('should show buttons when container width increases and menu-bar width stays the same', async () => {
        assertHidden(buttons[2]);
        assertHidden(buttons[3]);

        container.style.maxWidth = `${BUTTON_WIDTH * 5}px`;
        await nextResize(menu);

        assertVisible(buttons[2]);
        assertVisible(buttons[3]);
      });

      it('should show buttons after attaching another container and increasing its width', async () => {
        const other = document.createElement('div');
        other.style.display = 'flex';
        other.style.maxWidth = `${BUTTON_WIDTH * 4}px`;
        container.parentNode.appendChild(other);

        other.append(text, menu);
        other.style.maxWidth = `${BUTTON_WIDTH * 5}px`;
        await nextResize(menu);

        assertVisible(buttons[2]);
        assertVisible(buttons[3]);
      });
    });

    describe('shadow host', () => {
      beforeEach(async () => {
        container.attachShadow({ mode: 'open' });
        container.shadowRoot.append(text, menu);
        await nextResize(menu);
        buttons = menu._buttons;
      });

      it('should show buttons when shadow host width increases and menu-bar width stays the same', async () => {
        assertHidden(buttons[2]);
        assertHidden(buttons[3]);

        container.style.maxWidth = `${BUTTON_WIDTH * 6}px`;
        await nextResize(menu);

        assertVisible(buttons[2]);
        assertVisible(buttons[3]);
      });
    });
  });
});

import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextResize } from '@vaadin/testing-helpers';
import '../src/vaadin-menu-bar.js';
import {
  assertHidden,
  assertVisible,
  BUTTON_WIDTH,
  createItems,
  expectCollapsed,
  expectOverflowInside,
} from './helpers.js';

async function fixtureMenuBar(html, itemsCount = 5) {
  const container = fixtureSync(html);
  const menu = container.querySelector('vaadin-menu-bar') ?? container;
  menu.items = createItems(itemsCount);
  await nextResize(menu);
  const buttons = menu._buttons;
  return { container, menu, buttons, overflow: buttons.at(-1) };
}

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
    it('should hide overflow button and reset its items when all buttons fit', async () => {
      const { container, menu, buttons, overflow } = await fixtureMenuBar(`
        <div style="display: flex; width: ${BUTTON_WIDTH * 2.5}px">
          <vaadin-menu-bar style="min-width: 100%"></vaadin-menu-bar>
        </div>
      `);

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
    it('should collapse items into overflow in a flex row with a sibling', async () => {
      const { menu } = await fixtureMenuBar(`
        <div style="display: flex; width: ${BUTTON_WIDTH * 5}px">
          <vaadin-menu-bar style="width: 100%"></vaadin-menu-bar>
          <div style="min-width: ${BUTTON_WIDTH * 2}px">Sibling</div>
        </div>
      `);
      expectCollapsed(menu, [2, 3, 4]);
    });

    it('should collapse items into overflow in a css grid with a sibling', async () => {
      const { menu } = await fixtureMenuBar(`
        <div style="display: grid; grid-template-columns: 1fr ${BUTTON_WIDTH * 2}px; width: ${BUTTON_WIDTH * 5}px">
          <vaadin-menu-bar></vaadin-menu-bar>
          <div>Sibling</div>
        </div>
      `);
      expectCollapsed(menu, [2, 3, 4]);
    });

    describe('flex row-reverse with no width on menu-bar', () => {
      let container, menu;

      beforeEach(async () => {
        ({ container, menu } = await fixtureMenuBar(`
          <div style="display: flex; flex-direction: row-reverse; width: ${BUTTON_WIDTH * 5}px">
            <div style="min-width: ${BUTTON_WIDTH * 2}px">Sibling</div>
            <vaadin-menu-bar></vaadin-menu-bar>
          </div>
        `));
      });

      it('should collapse items into overflow', () => {
        expectCollapsed(menu, [2, 3, 4]);
      });

      it('should restore items when container width increases', async () => {
        container.style.width = `${BUTTON_WIDTH * 8}px`;
        await nextResize(menu);
        expectCollapsed(menu, []);
      });
    });

    it('should not collapse all items at once in a flex container with a sibling', async () => {
      // Reproduces the layout from https://github.com/vaadin/web-components/issues/11269:
      // a flex container with a menu-bar (no explicit width) and a sibling.
      // Measuring again after hiding a button would let the host shrink
      // (min-width: 0), which shrinks the container, causing cascading
      // collapse where ALL items end up in overflow.
      const { menu, buttons, overflow } = await fixtureMenuBar(
        `
          <div style="display: flex; width: ${BUTTON_WIDTH * 3.5}px">
            <vaadin-menu-bar></vaadin-menu-bar>
            <button>Sibling</button>
          </div>
        `,
        6,
      );
      const visibleButtons = buttons.filter((btn) => btn !== overflow && getComputedStyle(btn).visibility !== 'hidden');
      expect(visibleButtons.length).to.be.greaterThan(0);
      expect(overflow.item.children.length).to.be.greaterThan(0);
      expect(overflow.item.children.length).to.be.lessThan(menu.items.length);
    });

    it('should keep the overflow button inside the menu bar in a grid column sized by content', async () => {
      const { menu } = await fixtureMenuBar(`
        <div style="display: grid; grid-template-columns: auto 1fr; width: ${BUTTON_WIDTH * 5}px">
          <vaadin-menu-bar></vaadin-menu-bar>
          <div style="min-width: ${BUTTON_WIDTH * 2}px">Sibling</div>
        </div>
      `);
      expectCollapsed(menu, [2, 3, 4]);
      expectOverflowInside(menu);
    });

    it('should keep the overflow button inside the menu bar in a toolbar with centered items', async () => {
      const { menu } = await fixtureMenuBar(`
        <div style="display: flex; align-items: center; width: ${BUTTON_WIDTH * 5}px">
          <vaadin-menu-bar></vaadin-menu-bar>
          <div style="min-width: ${BUTTON_WIDTH * 2}px">Sibling</div>
        </div>
      `);
      expectCollapsed(menu, [2, 3, 4]);
      expectOverflowInside(menu);
    });

    it('should keep the overflow button inside a shrink-to-fit menu bar limited by max-width', async () => {
      const { menu } = await fixtureMenuBar(`
        <div style="width: ${BUTTON_WIDTH * 3}px">
          <vaadin-menu-bar style="display: inline-block; max-width: 100%"></vaadin-menu-bar>
        </div>
      `);
      expectCollapsed(menu, [2, 3, 4]);
      expectOverflowInside(menu);
    });
  });

  describe('parent resize', () => {
    let container, menu, buttons;

    beforeEach(async () => {
      ({ container, menu, buttons } = await fixtureMenuBar(
        `
          <div style="display: flex; max-width: ${BUTTON_WIDTH * 3}px">
            <div>Sibling</div>
            <vaadin-menu-bar style="min-width: ${BUTTON_WIDTH * 1.5}px"></vaadin-menu-bar>
          </div>
        `,
        4,
      ));
      assertHidden(buttons[2]);
      assertHidden(buttons[3]);
    });

    it('should show buttons when container width increases and menu-bar width stays the same', async () => {
      container.style.maxWidth = `${BUTTON_WIDTH * 5}px`;
      await nextResize(menu);

      assertVisible(buttons[2]);
      assertVisible(buttons[3]);
    });

    it('should show buttons after attaching another container and increasing its width', async () => {
      const other = fixtureSync(`<div style="display: flex; max-width: ${BUTTON_WIDTH * 4}px"></div>`);

      other.append(...container.children);
      other.style.maxWidth = `${BUTTON_WIDTH * 5}px`;
      await nextResize(menu);

      assertVisible(buttons[2]);
      assertVisible(buttons[3]);
    });

    it('should show buttons when shadow host width increases and menu-bar width stays the same', async () => {
      const host = fixtureSync(`<div style="display: flex; max-width: ${BUTTON_WIDTH * 3}px"></div>`);
      host.attachShadow({ mode: 'open' });

      host.shadowRoot.append(...container.children);
      await nextResize(menu);
      assertHidden(buttons[2]);
      assertHidden(buttons[3]);

      host.style.maxWidth = `${BUTTON_WIDTH * 6}px`;
      await nextResize(menu);

      assertVisible(buttons[2]);
      assertVisible(buttons[3]);
    });
  });
});

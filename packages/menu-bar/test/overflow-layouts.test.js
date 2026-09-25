import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextFrame, nextResize } from '@vaadin/testing-helpers';
import sinon from 'sinon';
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

// Each round lets the resize observer run and the detection that it schedules
async function nextRounds(count = 5) {
  for (let i = 0; i < count; i++) {
    await nextFrame();
    await aTimeout(0);
  }
}

// Width of the given number of kept buttons plus the overflow button,
// each button after the first overlaps the previous one by its 1px border
const keptWidth = (count) => BUTTON_WIDTH * (count + 1) - count;

const expectNoSpareSpace = (menu) => {
  const overflow = menu._buttons.at(-1).getBoundingClientRect();
  expect(overflow.right).to.be.closeTo(menu.getBoundingClientRect().right, 0.5);
};

const expectFrozen = (menu, frozen) => {
  expect(menu.hasAttribute('overflow-frozen'), 'overflow-frozen').to.equal(frozen);
  expect(menu.style.getPropertyValue('--_vaadin-menu-bar-content-width') !== '', 'content width').to.equal(frozen);
};

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

    it('should not take space from a flex title next to the menu bar', async () => {
      const { container, menu } = await fixtureMenuBar(`
        <div style="display: flex; width: ${BUTTON_WIDTH * 3.5}px">
          <div style="flex: 1"></div>
          <vaadin-menu-bar></vaadin-menu-bar>
        </div>
      `);
      expectCollapsed(menu, [2, 3, 4]);
      expectNoSpareSpace(menu);
      expect(menu.getBoundingClientRect().width).to.be.closeTo(keptWidth(2), 0.5);
      const title = container.firstElementChild;
      expect(title.getBoundingClientRect().width).to.be.closeTo(BUTTON_WIDTH * 3.5 - keptWidth(2), 0.5);
      expectFrozen(menu, false);
    });

    it('should not take space from a 1fr grid column next to the menu bar', async () => {
      const { container, menu } = await fixtureMenuBar(`
        <div style="display: grid; grid-template-columns: auto 1fr; width: ${BUTTON_WIDTH * 3.5}px">
          <vaadin-menu-bar></vaadin-menu-bar>
          <div></div>
        </div>
      `);
      expectCollapsed(menu, [2, 3, 4]);
      expectNoSpareSpace(menu);
      expect(menu.getBoundingClientRect().width).to.be.closeTo(keptWidth(2), 0.5);
      const column = container.lastElementChild;
      expect(column.getBoundingClientRect().width).to.be.closeTo(BUTTON_WIDTH * 3.5 - keptWidth(2), 0.5);
      expectFrozen(menu, false);
    });

    it('should not leave spare space in the menu bar before a fixed width sibling', async () => {
      const { container, menu } = await fixtureMenuBar(`
        <div style="display: flex; width: ${BUTTON_WIDTH * 3.5}px">
          <vaadin-menu-bar></vaadin-menu-bar>
          <div style="flex: none; width: ${BUTTON_WIDTH}px"></div>
        </div>
      `);
      expectCollapsed(menu, [1, 2, 3, 4]);
      expectNoSpareSpace(menu);
      expect(menu.getBoundingClientRect().width).to.be.closeTo(keptWidth(1), 0.5);
      const sibling = container.lastElementChild;
      expect(sibling.getBoundingClientRect().left).to.be.closeTo(menu.getBoundingClientRect().right, 0.5);
      expectFrozen(menu, false);
    });

    it('should not leave spare space in the menu bar in a toolbar with gaps', async () => {
      const { menu } = await fixtureMenuBar(`
        <div style="display: flex; gap: 10px; width: ${BUTTON_WIDTH * 3.5}px">
          <div style="flex: none; width: 30px"></div>
          <vaadin-menu-bar></vaadin-menu-bar>
          <div style="flex: none; width: 30px"></div>
        </div>
      `);
      expectCollapsed(menu, [1, 2, 3, 4]);
      expectNoSpareSpace(menu);
      expect(menu.getBoundingClientRect().width).to.be.closeTo(keptWidth(1), 0.5);
      expectFrozen(menu, false);
    });

    it('should keep the overflow button inside the menu bar next to a title in a space-between row in RTL', async () => {
      const { menu } = await fixtureMenuBar(`
        <div style="display: flex; justify-content: space-between; width: ${BUTTON_WIDTH * 3.5}px">
          <div style="width: ${BUTTON_WIDTH * 2.5}px"></div>
          <vaadin-menu-bar dir="rtl" theme="end-aligned" reverse-collapse></vaadin-menu-bar>
        </div>
      `);
      expectCollapsed(menu, [0, 1, 2, 3]);
      expectOverflowInside(menu);
      expectFrozen(menu, true);
    });

    it('should keep the overflow button inside the menu bar when all buttons collapse in a space-between row', async () => {
      const { menu } = await fixtureMenuBar(`
        <div style="display: flex; justify-content: space-between; width: ${BUTTON_WIDTH * 3.5}px">
          <div style="width: ${BUTTON_WIDTH * 10}px"></div>
          <vaadin-menu-bar></vaadin-menu-bar>
        </div>
      `);
      expectCollapsed(menu, [0, 1, 2, 3, 4]);
      expect(menu.hasAttribute('has-single-button')).to.be.true;
      expectOverflowInside(menu);
      expectFrozen(menu, true);
    });

    it('should keep the overflow button inside the menu bar in a flex item sized by content', async () => {
      // Both flex items shrink in proportion to their content, like split layout panes
      const { menu } = await fixtureMenuBar(`
        <div style="display: flex; width: ${BUTTON_WIDTH * 5}px">
          <div style="min-width: 0"><vaadin-menu-bar></vaadin-menu-bar></div>
          <div style="min-width: 0"><div style="width: ${BUTTON_WIDTH * 3}px"></div></div>
        </div>
      `);
      expectCollapsed(menu, [2, 3, 4]);
      expectOverflowInside(menu);
    });

    it('should keep the overflow button inside the menu bar next to a full width sibling', async () => {
      // Reproduces the layout from https://github.com/vaadin/web-components/issues/8004:
      // the sibling asks for the whole row, so the menu bar can never show every item
      const { menu } = await fixtureMenuBar(`
        <div style="display: flex; width: ${BUTTON_WIDTH * 5}px">
          <div style="width: 100%"></div>
          <vaadin-menu-bar></vaadin-menu-bar>
        </div>
      `);
      expectCollapsed(menu, [1, 2, 3, 4]);
      expectOverflowInside(menu);
    });

    it('should restore buttons and release the width when a flex item sized by content gets wider', async () => {
      const { container, menu } = await fixtureMenuBar(`
        <div style="display: flex; width: ${BUTTON_WIDTH * 5}px">
          <div style="min-width: 0"><vaadin-menu-bar></vaadin-menu-bar></div>
          <div style="min-width: 0"><div style="width: ${BUTTON_WIDTH * 3}px"></div></div>
        </div>
      `);
      container.style.width = `${BUTTON_WIDTH * 9}px`;
      await nextResize(menu);
      expectCollapsed(menu, []);
      // The menu bar shrinks back to its buttons, no width is kept from the collapsed state
      const lastButton = menu._buttons.at(-2);
      expect(lastButton.getBoundingClientRect().right).to.be.closeTo(menu.getBoundingClientRect().right, 0.5);
      expectFrozen(menu, false);

      container.style.width = `${BUTTON_WIDTH * 5}px`;
      await nextRounds();
      expectCollapsed(menu, [2, 3, 4]);
      expectOverflowInside(menu);
    });
  });

  describe('frozen in a space-between row', () => {
    let container, menu;

    beforeEach(async () => {
      // The title shrinks with the menu bar, so the host gets less than its kept buttons need
      ({ container, menu } = await fixtureMenuBar(`
        <div style="display: flex; justify-content: space-between; width: ${BUTTON_WIDTH * 3.5}px">
          <div style="width: ${BUTTON_WIDTH * 2.5}px"></div>
          <vaadin-menu-bar></vaadin-menu-bar>
        </div>
      `));
    });

    it('should keep the overflow button inside the menu bar', () => {
      expectCollapsed(menu, [1, 2, 3, 4]);
      expectOverflowInside(menu);
      expectFrozen(menu, true);
    });

    it('should keep one button collapsed until the overflow button fits in the frozen width', async () => {
      // The frozen menu bar gets room for all buttons, but not for the overflow button as well
      container.style.width = `${BUTTON_WIDTH * 7.5}px`;
      await nextRounds();
      expectCollapsed(menu, [4]);
      expectOverflowInside(menu);
      expectFrozen(menu, true);
    });

    it('should release the width when all buttons and the overflow button fit', async () => {
      container.style.width = `${BUTTON_WIDTH * 10}px`;
      await nextRounds();
      expectCollapsed(menu, []);
      expectFrozen(menu, false);
    });

    it('should release the width when all items are removed', async () => {
      menu.items = [];
      await nextRounds();
      expectFrozen(menu, false);
    });

    it('should release the width when the only item fits', async () => {
      menu.items = createItems(1);
      await nextRounds();
      assertVisible(menu._buttons[0]);
      expect(menu._buttons.at(-1).hasAttribute('hidden'), 'overflow button hidden').to.be.true;
      expectFrozen(menu, false);
    });

    it('should release the width when more items fit in a wider row', async () => {
      menu.items = createItems(6);
      container.style.width = `${BUTTON_WIDTH * 20}px`;
      await nextRounds();
      expectCollapsed(menu, []);
      expectFrozen(menu, false);
    });
  });

  describe('two menu bars in one row', () => {
    async function fixtureTwoMenuBars(startCount, endCount) {
      const row = fixtureSync(`
        <div style="display: flex; width: ${BUTTON_WIDTH * 5}px">
          <vaadin-menu-bar style="flex: 1 1 auto"></vaadin-menu-bar>
          <vaadin-menu-bar style="flex: 1 1 auto" theme="end-aligned"></vaadin-menu-bar>
        </div>
      `);
      const [start, end] = row.querySelectorAll('vaadin-menu-bar');
      start.items = createItems(startCount);
      end.items = createItems(endCount);
      await nextResize(start);
      await nextResize(end);
      // Give the two menu bars time to react to each other
      await nextRounds();
      return { row, start, end };
    }

    async function expectDetectionsToStop(...menus) {
      const spies = menus.map((menu) => sinon.spy(menu, '__detectOverflow'));
      await nextRounds();
      spies.forEach((spy, i) => expect(spy, `detections of menu bar ${i}`).to.not.be.called);
    }

    it('should share the row equally and keep both overflow buttons inside with equal items', async () => {
      const { start, end } = await fixtureTwoMenuBars(5, 5);
      await expectDetectionsToStop(start, end);
      expectCollapsed(start, [1, 2, 3, 4]);
      expectCollapsed(end, [1, 2, 3, 4]);
      expectOverflowInside(start);
      expectOverflowInside(end);
    });

    it('should give the menu bar with more items more room and keep both overflow buttons inside', async () => {
      const { start, end } = await fixtureTwoMenuBars(8, 3);
      await expectDetectionsToStop(start, end);
      expect(start.getBoundingClientRect().width).to.be.greaterThan(end.getBoundingClientRect().width);
      expectCollapsed(start, [2, 3, 4, 5, 6, 7]);
      expectCollapsed(end, [0, 1, 2]);
      expectOverflowInside(start);
      expectOverflowInside(end);
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

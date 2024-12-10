import { expect } from '@vaadin/chai-plugins';
import { click as helperClick, fixtureSync, isFirefox, nextFrame } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import { html, render } from 'lit';
import type { VirtualList } from '../vaadin-virtual-list';

type TestItem = { id: number; name: string } | undefined;

async function click(el: HTMLElement) {
  el.focus();
  await new Promise<void>((resolve) => {
    queueMicrotask(() => resolve());
  });
  helperClick(el);
  await nextFrame();
}

async function shiftTab() {
  await sendKeys({ down: 'Shift' });
  await sendKeys({ press: 'Tab' });
  await sendKeys({ up: 'Shift' });
}

describe('selection', () => {
  let list: VirtualList<TestItem>;
  let beforeButton: HTMLButtonElement;
  let afterButton: HTMLButtonElement;

  function getRenderedItem(index: number) {
    const childElements = Array.from(list.children) as Array<HTMLElement & { __item: TestItem }>;
    return childElements.find((child) => !child.hidden && child.__item?.id === index);
  }

  beforeEach(async () => {
    [beforeButton, list, afterButton] = fixtureSync(`
      <div>
        <button id="before">before</button>
        <vaadin-virtual-list></vaadin-virtual-list>
        <button id="after">after</button>
      </div>
    `).children as any;

    list.style.height = '200px';
    list.items = Array.from({ length: 100 }, (_, i) => ({ id: i, name: `Item ${i}` }));
    list.renderer = (root, _, { item, selected }) => {
      root.textContent = `${item?.name} ${selected ? 'selected' : ''}`;
    };
    await nextFrame();
  });

  it('should not be focusable by default', async () => {
    beforeButton.focus();
    await sendKeys({ press: 'Tab' });
    expect([...list.children].includes(document.activeElement!)).to.be.false;
  });

  it('should not be focusable backwards', async () => {
    afterButton.focus();
    await shiftTab();
    if (isFirefox) {
      expect(document.activeElement).to.equal(list);
    } else {
      expect(document.activeElement).to.equal(beforeButton);
    }
  });

  it('should select an item programmatically', async () => {
    expect(getRenderedItem(0)!.hasAttribute('selected')).to.be.false;
    list.selectedItems = [list.items![0]];
    await nextFrame();
    expect(getRenderedItem(0)!.hasAttribute('selected')).to.be.true;
  });

  it('should not re-render when focused', async () => {
    const rendererSpy = sinon.spy(list.renderer!);
    list.renderer = rendererSpy;
    await nextFrame();

    rendererSpy.resetHistory();
    const firstItem = getRenderedItem(0)!;
    firstItem.tabIndex = 0;
    firstItem.focus();

    expect(rendererSpy.called).to.be.false;
  });

  it('should not re-render when blurred', async () => {
    const rendererSpy = sinon.spy(list.renderer!);
    list.renderer = rendererSpy;
    await nextFrame();
    const firstItem = getRenderedItem(0)!;
    firstItem.tabIndex = 0;
    firstItem.focus();

    rendererSpy.resetHistory();
    await sendKeys({ press: 'Tab' });

    expect(rendererSpy.called).to.be.false;
  });

  it('should not mark element focused', () => {
    const firstItem = getRenderedItem(0)!;
    firstItem.tabIndex = 0;
    firstItem.focus();
    list.requestContentUpdate();
    expect(getRenderedItem(0)!.hasAttribute('focused')).to.be.false;
  });

  it('should not cancel Escape key default behavior', async () => {
    const spy = sinon.spy();
    list.addEventListener('keydown', spy);
    const firstItem = getRenderedItem(0)!;
    firstItem.tabIndex = 0;
    firstItem.focus();
    await sendKeys({ press: 'Escape' });
    expect(spy.firstCall.args[0].defaultPrevented).to.be.false;
  });

  describe('selectable', () => {
    beforeEach(async () => {
      list.selectionMode = 'multi';
      await nextFrame();
    });

    it('should be focusable', async () => {
      beforeButton.focus();
      await sendKeys({ press: 'Tab' });
      expect(list.contains(document.activeElement)).to.be.true;
    });

    it('should be unfocusable forwards', async () => {
      beforeButton.focus();
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Tab' });
      expect(document.activeElement).to.equal(afterButton);
    });

    it('should not scroll when tabbing through', async () => {
      beforeButton.focus();
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Tab' });
      await nextFrame();
      expect(list.firstVisibleIndex).to.equal(0);
    });

    it('should be unfocusable backwards', async () => {
      beforeButton.focus();
      await sendKeys({ press: 'Tab' });

      await shiftTab();
      expect(document.activeElement).to.equal(beforeButton);
    });

    it('should not focus empty list', async () => {
      list.items = [];
      await nextFrame();
      beforeButton.focus();
      await sendKeys({ press: 'Tab' });
      expect(document.activeElement).to.equal(afterButton);
    });

    it('should focus first item after restoring items', async () => {
      const items = list.items;
      list.items = [];
      await nextFrame();
      list.items = items;
      await nextFrame();

      beforeButton.focus();
      await sendKeys({ press: 'Tab' });
      expect(document.activeElement).to.equal(getRenderedItem(0));
    });

    it('should select an item by clicking', async () => {
      expect(getRenderedItem(0)!.hasAttribute('selected')).to.be.false;
      await click(getRenderedItem(0)!);
      await nextFrame();
      expect(getRenderedItem(0)!.hasAttribute('selected')).to.be.true;
    });

    it('should re-render items once on click select', async () => {
      const rendererSpy = sinon.spy(list.renderer!);
      list.renderer = rendererSpy;
      await nextFrame();

      rendererSpy.resetHistory();
      await click(getRenderedItem(0)!);
      await nextFrame();

      expect(rendererSpy.getCalls().filter((call) => call.args[2].index === 0).length).to.equal(1);
    });

    it('should select an item with keyboard', async () => {
      expect(getRenderedItem(0)!.hasAttribute('selected')).to.be.false;
      beforeButton.focus();
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Space' });
      expect(getRenderedItem(0)!.hasAttribute('selected')).to.be.true;
    });

    it('should scroll back to the focused item when selecting an item with keyboard', async () => {
      beforeButton.focus();
      await sendKeys({ press: 'Tab' });
      list.scrollToIndex(100);
      await sendKeys({ press: 'Space' });
      expect(getRenderedItem(0)!.hasAttribute('selected')).to.be.true;
      expect(getRenderedItem(0)!.hasAttribute('focused')).to.be.true;
      expect(list.selectedItems).to.deep.equal([list.items![0]]);
    });

    it('should scroll back to the focused item when selecting an item with keyboard (manual scroll)', async () => {
      beforeButton.focus();
      await sendKeys({ press: 'Tab' });
      list.scrollTop = 1000;
      await nextFrame();
      await sendKeys({ press: 'Space' });
      expect(getRenderedItem(0)!.hasAttribute('selected')).to.be.true;
      expect(getRenderedItem(0)!.hasAttribute('focused')).to.be.true;
    });

    it('should ignore selection of undefined items (Flow VirtualList)', async () => {
      list.items = [undefined];
      beforeButton.focus();
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Space' });
      expect(list.selectedItems).to.be.empty;
    });

    it('should select multiple items with keyboard', async () => {
      beforeButton.focus();
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Space' });
      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ press: 'Space' });
      await nextFrame();
      expect(getRenderedItem(0)!.hasAttribute('selected')).to.be.true;
    });

    it('should update selectedItems array', async () => {
      beforeButton.focus();
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Space' });
      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ press: 'Space' });
      await nextFrame();
      expect(list.selectedItems).to.deep.equal([list.items![0], list.items![1]]);
    });

    it('should dispatch selected-items-changed event', async () => {
      const spy = sinon.spy();
      list.addEventListener('selected-items-changed', spy);
      beforeButton.focus();
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Space' });
      expect(spy.calledOnce).to.be.true;
    });

    it('should unselect an item by clicking again', async () => {
      await click(getRenderedItem(0)!);
      await click(getRenderedItem(0)!);
      await nextFrame();
      expect(getRenderedItem(0)!.hasAttribute('selected')).to.be.false;
    });

    it('should select multiple items by clicking', async () => {
      await click(getRenderedItem(0)!);
      await click(getRenderedItem(1)!);
      await nextFrame();
      expect(getRenderedItem(0)!.hasAttribute('selected')).to.be.true;
      expect(getRenderedItem(1)!.hasAttribute('selected')).to.be.true;
    });

    it('should make the clicked item focusable', async () => {
      await click(getRenderedItem(1)!);
      beforeButton.focus();
      await sendKeys({ press: 'Tab' });
      expect(document.activeElement).to.equal(getRenderedItem(1));
    });

    it('should select items by identity', async () => {
      list.itemIdPath = 'id';
      list.selectedItems = [{ id: 0, name: 'Item 0' }];
      await nextFrame();
      expect(getRenderedItem(0)!.hasAttribute('selected')).to.be.true;
    });

    it('should select items by identity when identity changed dynamically', async () => {
      list.selectedItems = [{ id: 0, name: 'Item 0' }];
      await nextFrame();
      list.itemIdPath = 'id';
      await nextFrame();
      expect(getRenderedItem(0)!.hasAttribute('selected')).to.be.true;
    });

    it('should scroll the focused item into view', async () => {
      list.scrollToIndex(100);
      expect(list.firstVisibleIndex).not.to.equal(0);

      beforeButton.focus();
      await sendKeys({ press: 'Tab' });

      expect(list.contains(document.activeElement)).to.be.true;
      expect(list.firstVisibleIndex).to.equal(0);
    });

    it('should not try to focus an index below 0', async () => {
      beforeButton.focus();
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'ArrowUp' });
      expect(document.activeElement).to.equal(getRenderedItem(0));
    });

    it('should not try to focus an index beyond items.length', async () => {
      const lastIndex = list.items!.length - 1;
      list.scrollToIndex(lastIndex);
      await click(getRenderedItem(lastIndex)!);
      await sendKeys({ press: 'ArrowDown' });
      expect(document.activeElement).to.equal(getRenderedItem(lastIndex));
    });

    it('should focus the last visible index when items length reduced', async () => {
      const lastIndex = list.items!.length - 1;
      list.scrollToIndex(lastIndex);
      await click(getRenderedItem(lastIndex)!);

      list.items = list.items!.slice(0, -1);
      await nextFrame();
      expect(document.activeElement).to.equal(getRenderedItem(lastIndex - 1));
      expect(getRenderedItem(lastIndex - 1)!.hasAttribute('focused')).to.be.true;
    });

    it('should unselect an item by clicking another item on single-selection mode', async () => {
      list.selectionMode = 'single';
      await click(getRenderedItem(0)!);
      await click(getRenderedItem(1)!);
      expect(getRenderedItem(0)!.hasAttribute('selected')).to.be.false;
      expect(getRenderedItem(1)!.hasAttribute('selected')).to.be.true;
    });

    it('should deselect all items when deselecting on single-selection mode', async () => {
      list.selectionMode = 'single';
      list.selectedItems = [list.items![0], list.items![1]];
      await click(getRenderedItem(0)!);
      expect(getRenderedItem(0)!.hasAttribute('selected')).to.be.false;
      expect(getRenderedItem(1)!.hasAttribute('selected')).to.be.false;
    });

    it('should deselect other items when selecting on single-selection mode', async () => {
      list.selectionMode = 'single';
      list.selectedItems = [list.items![0], list.items![1]];
      await click(getRenderedItem(2)!);
      expect(getRenderedItem(0)!.hasAttribute('selected')).to.be.false;
      expect(getRenderedItem(1)!.hasAttribute('selected')).to.be.false;
      expect(getRenderedItem(2)!.hasAttribute('selected')).to.be.true;
    });

    it('should cancel arrow keys default behavior', async () => {
      const spy = sinon.spy();
      list.addEventListener('keydown', spy);

      beforeButton.focus();
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'ArrowDown' });
      expect(spy.firstCall.args[0].defaultPrevented).to.be.true;
    });

    it('should cancel space keys default behavior', async () => {
      const spy = sinon.spy();
      list.addEventListener('keydown', spy);

      beforeButton.focus();
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Space' });
      expect(spy.firstCall.args[0].defaultPrevented).to.be.true;
    });

    it('should mark element focused', async () => {
      expect(getRenderedItem(0)!.hasAttribute('focused')).to.be.false;
      beforeButton.focus();
      await sendKeys({ press: 'Tab' });
      expect(getRenderedItem(0)!.hasAttribute('focused')).to.be.true;
    });

    it('should not mark unfocused element focused', async () => {
      beforeButton.focus();
      await sendKeys({ press: 'Tab' });
      expect(getRenderedItem(1)!.hasAttribute('focused')).to.be.false;
    });

    it('should not mark element focused if it does not match virtual focus index', async () => {
      beforeButton.focus();
      await sendKeys({ press: 'Tab' });
      list.scrollToIndex(list.items!.length - 1);

      expect([...list.children].some((child) => child.hasAttribute('focused'))).to.be.false;
    });

    it('should throw on enter when there are no focusable child elements', async () => {
      beforeButton.focus();
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Enter' });
    });

    it('should ensure focused index in viewport when navigating down with arrow keys', async () => {
      const lastVisibleIndex = list.lastVisibleIndex;
      await click(getRenderedItem(lastVisibleIndex)!);
      await sendKeys({ press: 'ArrowDown' });
      await nextFrame();
      const newLastVisibleIndex = list.lastVisibleIndex;
      expect(newLastVisibleIndex).to.equal(lastVisibleIndex + 1);

      const listRect = list.getBoundingClientRect();
      const lastVisibleItemRect = getRenderedItem(newLastVisibleIndex)!.getBoundingClientRect();
      expect(lastVisibleItemRect.bottom).to.be.closeTo(listRect.bottom, 1);
    });

    it('should ensure focused index in viewport when navigating up with arrow keys', async () => {
      list.scrollToIndex(list.items!.length - 1);
      const firstVisibleIndex = list.firstVisibleIndex;
      await click(getRenderedItem(firstVisibleIndex)!);
      await sendKeys({ press: 'ArrowUp' });
      await nextFrame();
      const newFirstVisibleIndex = list.firstVisibleIndex;
      expect(newFirstVisibleIndex).to.equal(firstVisibleIndex - 1);

      const listRect = list.getBoundingClientRect();
      const firstVisibleItemRect = getRenderedItem(newFirstVisibleIndex)!.getBoundingClientRect();
      expect(firstVisibleItemRect.top).to.equal(listRect.top);
    });

    it('should re-render items on selection', async () => {
      expect(getRenderedItem(0)?.textContent).to.equal('Item 0 ');
      list.selectedItems = [list.items![0]];
      await nextFrame();
      expect(getRenderedItem(0)?.textContent).to.equal('Item 0 selected');
      list.selectedItems = [];
      await nextFrame();
      expect(getRenderedItem(0)?.textContent).to.equal('Item 0 ');
    });

    it('should re-render items once on selection', async () => {
      const rendererSpy = sinon.spy(list.renderer!);
      list.renderer = rendererSpy;
      await nextFrame();

      rendererSpy.resetHistory();
      list.selectedItems = [list.items![0]];
      await nextFrame();

      expect(rendererSpy.getCalls().filter((call) => call.args[2].index === 0).length).to.equal(1);
    });

    it('should not throw on click when there are no items', async () => {
      list.items = [];
      await nextFrame();
      await click(list);
    });

    it('should focus an item on virtual list click', async () => {
      list.items = list.items!.slice(0, 5);
      await nextFrame();
      click(list);
      click(list);
      await nextFrame();
      expect(document.activeElement).to.equal(getRenderedItem(0));
    });

    it('should not select an item on virtual list click', async () => {
      list.items = list.items!.slice(0, 5);
      await nextFrame();
      click(list);
      expect(list.selectedItems).to.be.empty;
    });

    it('should not throw is items are unset', () => {
      list.items = undefined;
    });

    it('should not change scroll position when tabbing backwards into the focus item', async () => {
      click(getRenderedItem(5)!);
      afterButton.focus();
      const scrollTop = list.scrollTop;
      await shiftTab();
      expect(list.scrollTop).to.equal(scrollTop);
    });

    describe('focusable children', () => {
      beforeEach(async () => {
        list.renderer = (root, _, { item }) => {
          render(html`<button>${item?.name}</button>`, root);
        };
        await nextFrame();
      });

      it('should be in navigating state', async () => {
        beforeButton.focus();
        await sendKeys({ press: 'Tab' });
        expect(list.hasAttribute('navigating')).to.be.true;
      });

      it('should not focus child elements', async () => {
        beforeButton.focus();
        await sendKeys({ press: 'Tab' });
        await sendKeys({ press: 'Tab' });
        expect(document.activeElement).to.equal(afterButton);
      });

      it('should focus focusable child element', async () => {
        beforeButton.focus();
        await sendKeys({ press: 'Tab' });
        await sendKeys({ press: 'Enter' });
        expect(document.activeElement!.localName).to.equal('button');
        expect(document.activeElement!.parentElement).to.equal(getRenderedItem(0));
      });

      it('should be in interacting state', async () => {
        beforeButton.focus();
        await sendKeys({ press: 'Tab' });
        await sendKeys({ press: 'Enter' });
        expect(list.hasAttribute('interacting')).to.be.true;
      });

      it('should focus tab to the next focusable child', async () => {
        beforeButton.focus();
        await sendKeys({ press: 'Tab' });
        await sendKeys({ press: 'Enter' });
        await sendKeys({ press: 'Tab' });
        expect(document.activeElement!.localName).to.equal('button');
        expect(document.activeElement!.parentElement).to.equal(getRenderedItem(1));
      });

      it('should not re-render when tabbing between focusable children inside a single parent', async () => {
        // Create a renderer with two focusable children inside a single parent
        const rendererSpy = sinon.spy((root, _, { item }) => {
          render(html`<button>${item?.name}</button><button>${item?.name}</button>`, root);
        });
        list.renderer = rendererSpy;
        await nextFrame();

        // Enter interacting state
        beforeButton.focus();
        await sendKeys({ press: 'Tab' });
        await sendKeys({ press: 'Enter' });
        await nextFrame();
        rendererSpy.resetHistory();

        // Tab to the next focusable child inside the same parent
        await sendKeys({ press: 'Tab' });
        expect(rendererSpy.called).to.be.false;
      });

      it('should focus the item element on escape', async () => {
        beforeButton.focus();
        await sendKeys({ press: 'Tab' });
        await sendKeys({ press: 'Enter' });
        await sendKeys({ press: 'Escape' });
        expect(document.activeElement).to.equal(getRenderedItem(0));
      });

      it('should return to navigating state', async () => {
        beforeButton.focus();
        await sendKeys({ press: 'Tab' });
        await sendKeys({ press: 'Enter' });
        await sendKeys({ press: 'Escape' });
        expect(list.hasAttribute('navigating')).to.be.true;
      });

      it('should tab backwards from a focusable child', async () => {
        beforeButton.focus();
        await sendKeys({ press: 'Tab' });
        await sendKeys({ press: 'Enter' });

        await shiftTab();
        expect(document.activeElement).to.equal(beforeButton);
      });

      it('should focus tab to the next focusable child after clicking a child', async () => {
        await click(getRenderedItem(0)!.querySelector('button')!);
        await sendKeys({ press: 'Tab' });
        expect(document.activeElement!.parentElement).to.equal(getRenderedItem(1));
      });

      it('should focus the first item element after blurring from a focusable child', async () => {
        beforeButton.focus();
        await sendKeys({ press: 'Tab' });
        await sendKeys({ press: 'Enter' });
        await shiftTab();
        await sendKeys({ press: 'Tab' });

        expect(document.activeElement).to.equal(getRenderedItem(0));
      });

      it('should refocus the focused child element', async () => {
        beforeButton.focus();
        await sendKeys({ press: 'Tab' });
        await sendKeys({ press: 'Enter' });
        await sendKeys({ press: 'Tab' });
        await sendKeys({ press: 'Escape' });
        await sendKeys({ press: 'Enter' });

        expect(document.activeElement?.parentElement).to.equal(getRenderedItem(1));
      });

      it('should not select an item when clicking a child element', async () => {
        await click(getRenderedItem(0)!.querySelector('button')!);
        expect(list.selectedItems).to.be.empty;
      });

      it('should tab through focusable children when selection mode is unset', async () => {
        // Because focus works diffrently on Firefox and Chrome, use a renderer with two focusable children
        list.renderer = (root, _, { item }) => {
          render(html`<button>${item?.name}</button><button>${item?.name}</button>`, root);
        };
        list.selectionMode = 'none';
        await nextFrame();

        beforeButton.focus();
        await sendKeys({ press: 'Tab' });
        await sendKeys({ press: 'Tab' });
        expect(document.activeElement!.parentElement).to.equal(getRenderedItem(0));
      });

      it('should not have focused items when selection mode is unset', async () => {
        list.selectionMode = 'none';
        list.scrollToIndex(10);
        await nextFrame();
        expect(list.querySelector('[focused]')).to.be.null;
      });

      it('should clear navigating state when selection mode is unset', async () => {
        beforeButton.focus();
        await sendKeys({ press: 'Tab' });
        list.selectionMode = 'none';
        await nextFrame();
        expect(list.hasAttribute('navigating')).to.be.false;
      });
    });
  });

  describe('a11y', () => {
    it('should have role="list"', () => {
      expect(list.role).to.equal('list');
    });

    it('should have items with role="listitem"', () => {
      expect(getRenderedItem(0)!.role).to.equal('listitem');
    });

    it('should have items without aria-selected', () => {
      expect(getRenderedItem(0)!.ariaSelected).to.be.null;
    });

    it('should assign aria-setsize and aria-posinset', () => {
      list.scrollToIndex(list.items!.length - 1);
      const lastVisibleIndex = list.lastVisibleIndex;
      expect(getRenderedItem(lastVisibleIndex)!.ariaSetSize).to.equal('100');
      expect(getRenderedItem(lastVisibleIndex)!.ariaPosInSet).to.equal('100');
    });

    it('should generate aria-label to the items', async () => {
      list.itemAccessibleNameGenerator = (item) => `Accessible ${item?.name}`;
      await nextFrame();
      expect(getRenderedItem(0)!.ariaLabel).to.equal('Accessible Item 0');
    });

    it('should remove aria-label from the items', () => {
      list.itemAccessibleNameGenerator = (item) => `Accessible ${item?.name}`;
      list.itemAccessibleNameGenerator = undefined;
      expect(getRenderedItem(0)!.ariaLabel).to.be.null;
    });

    it('should not invoke itemAccessibleNameGenerator when items are emptied', async () => {
      const spy = sinon.spy((item) => `Accessible ${item?.name}`);
      list.itemAccessibleNameGenerator = spy;
      await nextFrame();

      spy.resetHistory();
      list.items = [];
      expect(spy.called).to.be.false;
    });

    describe('selectable', () => {
      beforeEach(async () => {
        list.selectionMode = 'multi';
        await nextFrame();
      });

      it('should have role="listbox"', () => {
        expect(list.role).to.equal('listbox');
      });

      it('should have items with role="option"', () => {
        expect(getRenderedItem(0)!.role).to.equal('option');
      });

      it('should aria-selected="false" on non-selected items', () => {
        expect(getRenderedItem(0)!.ariaSelected).to.equal('false');
      });

      it('should aria-selected="true" on selected items', async () => {
        list.selectedItems = [list.items![0]];
        await nextFrame();
        expect(getRenderedItem(0)!.ariaSelected).to.equal('true');
      });

      it('should have aria-multiselectable="true"', () => {
        expect(list.ariaMultiSelectable).to.equal('true');
      });

      it('should not have aria-multiselectable when selectionMode is "single"', async () => {
        list.selectionMode = 'single';
        await nextFrame();
        expect(list.ariaMultiSelectable).to.be.null;
      });
    });
  });
});

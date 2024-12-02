import { expect } from '@vaadin/chai-plugins';
import { click as helperClick, fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import { html, render } from 'lit';
import type { VirtualList } from '../vaadin-virtual-list';

type TestItem = { id: number; name: string } | undefined;

async function click(el: HTMLElement) {
  el.focus();
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
    expect(document.activeElement).to.equal(afterButton);
  });

  it('should select an item programmatically', async () => {
    expect(getRenderedItem(0)!.hasAttribute('selected')).to.be.false;
    list.selectedItems = [list.items![0]];
    await nextFrame();
    expect(getRenderedItem(0)!.hasAttribute('selected')).to.be.true;
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

    it('should not scroll when tabbing trough', async () => {
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

    it('should select an item by clicking', async () => {
      expect(getRenderedItem(0)!.hasAttribute('selected')).to.be.false;
      await click(getRenderedItem(0)!);
      await nextFrame();
      expect(getRenderedItem(0)!.hasAttribute('selected')).to.be.true;
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
      expect(list.selectedItems).to.deep.equal([list.items![0]]);
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

    it('should unselect an item by clicking another item on single-selection mode', async () => {
      list.selectionMode = 'single';
      await click(getRenderedItem(0)!);
      await click(getRenderedItem(1)!);
      expect(getRenderedItem(0)!.hasAttribute('selected')).to.be.false;
      expect(getRenderedItem(1)!.hasAttribute('selected')).to.be.true;
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
      expect(lastVisibleItemRect.bottom).to.equal(listRect.bottom);
    });

    it('should ensure focused index in viewport when navigating up with arrow keys', async () => {
      list.scrollToIndex(list.items!.length - 1);
      const firstVisibleIndex = list.firstVisibleIndex;
      await click(getRenderedItem(firstVisibleIndex)!);
      await sendKeys({ press: 'ArrowUp' });
      await nextFrame();
      const newfirstVisibleIndex = list.firstVisibleIndex;
      expect(newfirstVisibleIndex).to.equal(firstVisibleIndex - 1);

      const listRect = list.getBoundingClientRect();
      const firstVisibleItemRect = getRenderedItem(newfirstVisibleIndex)!.getBoundingClientRect();
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

    describe('focusable children', () => {
      beforeEach(async () => {
        list.renderer = (root, _, { item }) => {
          render(html`<button>${item?.name}</button>`, root);
        };
        await nextFrame();
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

      it('should focus tab to the next focsuable child', async () => {
        beforeButton.focus();
        await sendKeys({ press: 'Tab' });
        await sendKeys({ press: 'Enter' });
        await sendKeys({ press: 'Tab' });
        expect(document.activeElement!.localName).to.equal('button');
        expect(document.activeElement!.parentElement).to.equal(getRenderedItem(1));
      });

      it('should focus the item element on escape', async () => {
        beforeButton.focus();
        await sendKeys({ press: 'Tab' });
        await sendKeys({ press: 'Enter' });
        await sendKeys({ press: 'Escape' });
        expect(document.activeElement).to.equal(getRenderedItem(0));
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

      it('should tab trough focusable children when selection mode is unset', async () => {
        list.selectionMode = undefined;
        beforeButton.focus();
        await sendKeys({ press: 'Tab' });
        expect(document.activeElement!.parentElement).to.equal(getRenderedItem(0));
      });

      it('should not have focused items when selection mode is unset', async () => {
        list.selectionMode = undefined;
        list.scrollToIndex(10);
        await nextFrame();
        expect(list.querySelector('[focused]')).to.be.null;
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

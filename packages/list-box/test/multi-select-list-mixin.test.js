import { expect } from '@vaadin/chai-plugins';
import { definePolymer, fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { MultiSelectListMixin } from '../src/vaadin-multi-select-list-mixin.js';

describe('MultiSelectListMixin', () => {
  const listTag = definePolymer(
    'multi-select-list-element',
    `
      <style>
        :host {
          display: block;
        }

        #scroll {
          overflow: auto;
          display: flex;
        }

        :host([orientation='vertical']) #scroll {
          height: 100%;
          flex-direction: column;
        }
      </style>
      <div id="scroll">
        <slot></slot>
      </div>
    `,
    (Base) =>
      class extends MultiSelectListMixin(Base) {
        get _scrollerElement() {
          return this.$.scroll;
        }
      },
  );

  const itemTag = definePolymer(
    'item-element',
    `
      <style>
        :host {
          display: block;
        }
      </style>
      <slot></slot>
    `,
    (Base) =>
      class extends Base {
        static get properties() {
          return {
            _hasVaadinItemMixin: {
              value: true,
            },
          };
        }
      },
  );

  let list;

  beforeEach(async () => {
    list = fixtureSync(`
      <${listTag}>
        <${itemTag}>Item 0</${itemTag}>
        <${itemTag}>Item 1</${itemTag}>
        <${itemTag}>Item 2</${itemTag}>
        <${itemTag}>Item 3</${itemTag}>
      </${listTag}>
    `);
    await nextRender();
  });

  it('should clear selected when multiple is set to true', async () => {
    list.selected = 3;
    await nextUpdate(list);

    list.multiple = true;
    await nextUpdate(list);
    expect(list.selected).to.be.equal(undefined);
  });

  it('should move selected to selectedValues when multiple is set to true', async () => {
    list.selected = 3;
    await nextUpdate(list);

    list.multiple = true;
    await nextUpdate(list);
    expect(list.selectedValues).to.eql([3]);
  });

  it('should clear selectedValues when multiple is set back to false', async () => {
    list.multiple = true;
    await nextUpdate(list);

    list.selectedValues = [3];
    await nextUpdate(list);

    list.multiple = false;
    await nextUpdate(list);
    expect(list.selectedValues).to.eql([]);
  });

  it('should reset selected items when multiple is set back to false', async () => {
    list.multiple = true;
    await nextUpdate(list);

    list.selectedValues = [1, 3];
    await nextUpdate(list);

    list.multiple = false;
    await nextUpdate(list);
    expect(list.items.filter((item) => item.selected).length).to.eql(0);
  });

  it('should set selectedValues when clicking item', async () => {
    list.multiple = true;
    await nextUpdate(list);
    list.items[3].click();
    expect(list.selected).to.be.equal(undefined);
    expect(list.selectedValues).to.eql([3]);
  });

  it('should set selected when clicking item and multiple is set to false', async () => {
    list.items[3].click();
    await nextUpdate(list);
    expect(list.selected).to.be.equal(3);
    expect(list.selectedValues).to.eql([]);
  });

  it('should add item to the selectedValues when clicking', async () => {
    list.multiple = true;
    await nextUpdate(list);

    list.items[1].click();
    await nextUpdate(list);
    expect(list.selectedValues).to.eql([1]);
    expect(list.items[1].selected).to.be.true;

    list.items[3].click();
    await nextUpdate(list);
    expect(list.selectedValues).to.eql([1, 3]);
    expect(list.items[3].selected).to.be.true;
  });

  it('should remove item from the selectedValues when clicking', async () => {
    list.multiple = true;
    await nextUpdate(list);

    list.selectedValues = [1, 3];
    await nextUpdate(list);

    list.items[1].click();
    await nextUpdate(list);
    expect(list.selectedValues).to.eql([3]);
    expect(list.items[1].selected).to.be.false;

    list.items[3].click();
    await nextUpdate(list);
    expect(list.selectedValues).to.eql([]);
    expect(list.items[3].selected).to.be.false;
  });

  it('should fire one selected-values-changed event', async () => {
    list.multiple = true;
    await nextUpdate(list);

    const spy = sinon.spy();
    list.addEventListener('selected-values-changed', spy);
    list.items[3].click();
    await nextUpdate(list);
    expect(spy.calledOnce).to.be.true;
    expect(spy.firstCall.args[0].detail.value).to.eql([3]);
  });

  it('when orientation is horizontal should move scroll horizontally on item selection', async () => {
    list.multiple = true;
    list.style.width = '50px';
    list.orientation = 'horizontal';
    await nextUpdate(list);
    expect(list._scrollerElement.scrollLeft).to.be.equal(0);

    list.items[3].click();
    await nextUpdate(list);
    expect(list._scrollerElement.scrollLeft).to.be.greaterThan(0);
  });

  it('when orientation is vertical should move scroll vertically on item selection', async () => {
    list.multiple = true;
    list.style.display = 'flex';
    list.style.height = '50px';
    list.orientation = 'vertical';
    await nextUpdate(list);
    expect(list._scrollerElement.scrollTop).to.be.equal(0);

    list.items[3].click();
    await nextUpdate(list);
    expect(list._scrollerElement.scrollTop).to.be.greaterThan(0);
  });

  it('should toggle aria-multiselectable on multiple property change', async () => {
    list.multiple = true;
    await nextUpdate(list);
    expect(list.hasAttribute('aria-multiselectable')).to.be.true;

    list.multiple = false;
    await nextUpdate(list);
    expect(list.hasAttribute('aria-multiselectable')).to.be.false;
  });

  it('should not reset selected state when setting disabled to false', async () => {
    list.multiple = true;
    list.disabled = true;
    await nextUpdate(list);

    list.selectedValues = [2];
    await nextUpdate(list);

    list.disabled = false;
    await nextUpdate(list);
    expect(list.items[2].selected).to.be.true;
  });
});

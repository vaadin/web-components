import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { MultiSelectListMixin } from '../src/vaadin-multi-select-list-mixin.js';

customElements.define(
  'test-list-element',
  class extends MultiSelectListMixin(PolymerElement) {
    static get template() {
      return html`
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
      `;
    }

    get _scrollerElement() {
      return this.$.scroll;
    }
  },
);

customElements.define(
  'test-item-element',
  class extends PolymerElement {
    static get template() {
      return html`
        <style>
          :host {
            display: block;
          }
        </style>
        <slot></slot>
      `;
    }

    static get properties() {
      return {
        _hasVaadinItemMixin: {
          value: true,
        },
      };
    }
  },
);

describe('MultiSelectListMixin', () => {
  let list;

  beforeEach(() => {
    list = fixtureSync(`
      <test-list-element>
        <test-item-element>Item 0</test-item-element>
        <test-item-element>Item 1</test-item-element>
        <test-item-element>Item 2</test-item-element>
        <test-item-element>Item 3</test-item-element>
      </test-list-element>
    `);
    list._observer.flush();
  });

  it('should clear selected when multiple=true', () => {
    list.selected = 3;
    list.multiple = true;
    expect(list.selected).to.be.equal(undefined);
  });

  it('should move selected to selectedValues when multiple=true', () => {
    list.selected = 3;
    list.multiple = true;
    expect(list.selectedValues).to.eql([3]);
  });

  it('should clear selectedValues when multiple=false', () => {
    list.multiple = true;
    list.selectedValues = [3];
    list.multiple = false;
    expect(list.selectedValues).to.eql([]);
  });

  it('should reset selected items when multiple=false', () => {
    list.multiple = true;
    list.selectedValues = [1, 3];
    list.multiple = false;
    expect(list.items.filter((item) => item.selected).length).to.eql(0);
  });

  it('should set selectedValues when clicking item', () => {
    list.multiple = true;
    list.items[3].click();
    expect(list.selected).to.be.equal(undefined);
    expect(list.selectedValues).to.eql([3]);
  });

  it('should set selected when clicking item and multiple=false', () => {
    list.items[3].click();
    expect(list.selected).to.be.equal(3);
    expect(list.selectedValues).to.eql([]);
  });

  it('should add item to the selectedValues when clicking', () => {
    list.multiple = true;
    list.items[1].click();
    expect(list.selectedValues).to.eql([1]);
    expect(list.items[1].selected).to.be.true;
    list.items[3].click();
    expect(list.selectedValues).to.eql([1, 3]);
    expect(list.items[3].selected).to.be.true;
  });

  it('should remove item from the selectedValues when clicking', () => {
    list.multiple = true;
    list.selectedValues = [1, 3];
    list.items[1].click();
    expect(list.selectedValues).to.eql([3]);
    expect(list.items[1].selected).to.be.false;
    list.items[3].click();
    expect(list.selectedValues).to.eql([]);
    expect(list.items[3].selected).to.be.false;
  });

  it('should fire one selected-values-changed event', () => {
    list.multiple = true;
    const spy = sinon.spy();
    list.addEventListener('selected-values-changed', spy);
    list.items[3].click();
    expect(spy.calledOnce).to.be.true;
    expect(spy.firstCall.args[0].detail.value).to.eql([3]);
  });

  it('when orientation is horizontal should move scroll horizontally on item selection', () => {
    list.multiple = true;
    list.style.width = '50px';
    list.orientation = 'horizontal';
    expect(list._scrollerElement.scrollLeft).to.be.equal(0);

    list.items[3].click();
    expect(list._scrollerElement.scrollLeft).to.be.greaterThan(0);
  });

  it('when orientation is vertical should move scroll vertically on item selection', () => {
    list.multiple = true;
    list.style.display = 'flex';
    list.style.height = '50px';
    list.orientation = 'vertical';
    expect(list._scrollerElement.scrollTop).to.be.equal(0);

    list.items[3].click();
    expect(list._scrollerElement.scrollTop).to.be.greaterThan(0);
  });

  it('should remove aria-multiselectable when multiple is set back to false', () => {
    list.multiple = true;
    expect(list.hasAttribute('aria-multiselectable')).to.be.true;

    list.multiple = false;
    expect(list.hasAttribute('aria-multiselectable')).to.be.false;
  });
});

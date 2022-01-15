import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@polymer/polymer/lib/elements/dom-bind.js';
import '@vaadin/polymer-legacy-adapter/template-renderer.js';
import '@vaadin/text-field/vaadin-text-field.js';
import '../vaadin-grid.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import {
  flushGrid,
  getBodyCellContent,
  getCell,
  getCellContent,
  getContainerCellContent,
  getFirstCell,
  infiniteDataProvider
} from './helpers.js';

class GridWithSlots extends PolymerElement {
  static get template() {
    return html`
      <vaadin-grid size="10" id="grid" style="height: 300px" data-provider="[[dataProvider]]">
        <vaadin-grid-column>
          <template>[[_format(index)]] [[parentProp]] [[_formatItem(item)]]</template>
          <template class="header">[[_format('header1')]] [[parentProp]]</template>
          <template class="footer">Footer</template>
        </vaadin-grid-column>
        <vaadin-grid-column>
          <template>
            <vaadin-text-field on-value-changed="_valueChanged" value="{{parentProp}}"></vaadin-text-field>
          </template>
          <template class="header">
            <vaadin-text-field on-invalid-changed="_invalidChanged" value="{{parentProp}}"></vaadin-text-field>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column>
          <template>
            <vaadin-text-field value="{{parentPath.foo}}"></vaadin-text-field>
          </template>
          <template class="header">
            <vaadin-text-field value="{{parentPath.foo}}"></vaadin-text-field>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column>
          <template>
            <vaadin-text-field value="{{item.value}}"></vaadin-text-field>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column>
          <template>[[item.value]]</template>
        </vaadin-grid-column>
        <vaadin-grid-column>
          <slot name="grid-column-header-template"></slot>
          <slot name="grid-column-template"></slot>
          <slot name="grid-column-footer-template"></slot>
        </vaadin-grid-column>
      </vaadin-grid>
    `;
  }

  static get properties() {
    return {
      parentProp: String,
      parentPath: {
        type: Object,
        value: function () {
          return {
            foo: 'foo'
          };
        }
      },
      dataProvider: {
        value: function () {
          return infiniteDataProvider;
        }
      }
    };
  }

  _format(value) {
    return 'foo' + value;
  }

  _formatItem(item) {
    return item;
  }

  _valueChanged() {
    this.valueChanged = true;
  }

  _invalidChanged() {
    this.invalidChanged = true;
  }
}

customElements.define('grid-with-slots', GridWithSlots);

class SlottedTemplates extends PolymerElement {
  static get template() {
    return html`
      <grid-with-slots id="wrapper">
        <template class="header" slot="grid-column-header-template">header-[[foo]]</template>
        <slot name="grid-column-template" slot="grid-column-template"></slot>
        <template class="footer" slot="grid-column-footer-template">[[_getFooter(bar)]]</template>
      </grid-with-slots>
    `;
  }

  static get properties() {
    return {
      foo: String,
      bar: String
    };
  }

  _getFooter(bar) {
    return `footer-${bar}`;
  }
}

customElements.define('slotted-templates', SlottedTemplates);

function getHeaderCell(grid, index) {
  return grid.$.header.querySelectorAll('[part~="cell"]')[index];
}

function getFirstHeaderCell(grid) {
  return getHeaderCell(grid, 0);
}

describe('templates', () => {
  let container, grid;

  describe('formatting', () => {
    beforeEach(async () => {
      container = fixtureSync('<grid-with-slots></grid-with-slots>');
      grid = container.$.grid;
      flushGrid(grid);
      await nextFrame();
    });

    it('should fire an event when a non-focusable element is clicked', () => {
      const spy = sinon.spy();
      grid.addEventListener('cell-activate', spy);

      getCell(grid, 0)._content.click();

      expect(spy.calledOnce).to.be.true;
      const e = spy.firstCall.args[0];
      expect(e.detail.model.index).to.eql(0);
    });

    it('should not fire an event when a focusable element is clicked', () => {
      const spy = sinon.spy();
      grid.addEventListener('cell-activate', spy);

      const input = getCellContent(getCell(grid, 1)).querySelector('vaadin-text-field');
      input.focus();
      input.click();

      expect(spy.called).to.be.false;
    });

    it('should not restamp header templates on attach', () => {
      const parent = grid.parentNode;
      parent.removeChild(grid);

      parent.appendChild(grid);
      flushGrid(grid);

      expect(grid.$.header.children[0].children[0].children.length).to.eql(1); // with a header template
      expect(grid.$.header.children[0].children[3].children.length).to.eql(1); // without a header template
    });

    it('should not restamp footer templates on attach', () => {
      const parent = grid.parentNode;
      parent.removeChild(grid);

      parent.appendChild(grid);
      flushGrid(grid);

      expect(grid.$.footer.children[0].children[0].children.length).to.eql(1); // with a footer template
      expect(grid.$.footer.children[0].children[3].children.length).to.eql(1); // without footer template
    });

    describe('using functions inside templates', () => {
      it('should work inside cell templates', () => {
        expect(getCellContent(getFirstCell(grid)).textContent).to.contain('foo0');
      });

      it('should work inside header templates', () => {
        expect(getCellContent(getFirstHeaderCell(grid)).textContent).to.contain('fooheader1');
      });

      it('should not invoke computed functions with null item', () => {
        const spy = sinon.spy(container, '_formatItem');
        grid.size = 1000;
        grid.scrollToIndex(100);
        spy.getCalls().forEach((call) => {
          expect(call.args[0]).not.to.be.null;
        });
        spy.restore();
      });

      it('should not invoke computed functions with empty item', () => {
        const spy = sinon.spy(container, '_formatItem');
        grid.size = 1000;
        grid.scrollToIndex(100);
        spy.getCalls().forEach((call) => {
          expect(call.args[0]).not.to.be.empty;
        });
        spy.restore();
      });
    });

    describe('using parent properties inside templates', () => {
      beforeEach(() => {
        container.parentProp = 'foobar';
      });

      it('should bind inside cell templates', () => {
        expect(getCellContent(getCell(grid, 0)).textContent).to.contain('foobar');
        expect(getCellContent(getCell(grid, 6)).textContent).to.contain('foobar');
      });

      it('should two-way bind parent properties inside cell templates', () => {
        const input = getCellContent(getCell(grid, 1)).querySelector('vaadin-text-field');
        expect(input.value).to.eql('foobar');

        input.value = 'value';

        expect(container.parentProp).to.eql('value');
      });

      it('should bind inside header templates', () => {
        expect(getCellContent(getFirstHeaderCell(grid)).textContent).to.contain('foobar');
      });

      it('should two-way bind parent properties inside header templates', () => {
        const input = getCellContent(getHeaderCell(grid, 1)).querySelector('vaadin-text-field');
        expect(input.value).to.eql('foobar');

        input.value = 'value';

        expect(container.parentProp).to.eql('value');
      });
    });

    describe('using event handlers inside templates', () => {
      it('should add event listeners inside cell templates', () => {
        const input = getCellContent(getCell(grid, 1)).querySelector('vaadin-text-field');

        input.value = 'foo';

        expect(container.valueChanged).to.eql(true);
      });

      it('should add event listeners inside header templates', () => {
        const input = getCellContent(getHeaderCell(grid, 1)).querySelector('vaadin-text-field');

        input.invalid = 'foo';

        expect(container.invalidChanged).to.eql(true);
      });
    });

    describe('using parent paths inside templates', () => {
      let fooSetter;
      beforeEach(async () => {
        // Observe the model
        const observedModel = container.parentPath;
        let foo = observedModel.foo;
        fooSetter = sinon.spy();
        Object.defineProperty(observedModel, 'foo', {
          set: (newVal) => {
            fooSetter(newVal);
            foo = newVal;
          },
          get: () => foo
        });

        // Change the object, notify Polymer
        container.set('parentPath.foo', 'bar');
        await nextFrame();
      });

      it('should bind inside cell templates', () => {
        expect(getCellContent(getCell(grid, 2)).querySelector('vaadin-text-field').value).to.contain('bar');
        expect(getCellContent(getCell(grid, 8)).querySelector('vaadin-text-field').value).to.contain('bar');
      });

      it('should two-way bind parent path inside cell templates', () => {
        const input = getCellContent(getCell(grid, 2)).querySelector('vaadin-text-field');
        expect(input.value).to.eql('bar');

        input.value = 'value';

        expect(container.parentPath.foo).to.eql('value');
      });

      it('should bind inside header templates', () => {
        expect(getCellContent(getHeaderCell(grid, 2)).querySelector('vaadin-text-field').value).to.contain('bar');
      });

      it('should two-way bind parent path inside header templates', () => {
        const input = getCellContent(getHeaderCell(grid, 2)).querySelector('vaadin-text-field');
        expect(input.value).to.eql('bar');

        input.value = 'value';

        expect(container.parentPath.foo).to.eql('value');
      });

      it('should call setter only once', () => {
        expect(fooSetter.calledOnce).to.be.true;
        expect(fooSetter.calledWith('bar')).to.be.true;
      });
    });
  });

  describe('using instance paths inside templates', () => {
    let input;

    beforeEach(async () => {
      container = fixtureSync('<grid-with-slots></grid-with-slots>');
      grid = container.$.grid;

      // The infinite data provider doesn't support 2-way binding of the item property
      // so that the array data provider should be used instead:
      grid.dataProvider = null;
      grid.items = [{ value: 'item0' }, { value: 'item1' }];

      flushGrid(grid);
      await nextFrame();
      input = getCellContent(getCell(grid, 3)).querySelector('vaadin-text-field');
    });

    it('should two-way bind instance path inside cell templates', async () => {
      const cell = getCell(grid, 3);

      input.value = 'bar0';

      await nextFrame();
      expect(getCellContent(cell).__templateInstance.item.value).to.eql('bar0');
    });

    it('should notify other cell templates for instance path changes', async () => {
      const cell = getCell(grid, 4);

      input.value = 'bar0';

      await nextFrame();
      expect(getCellContent(cell).textContent).to.contain('bar0');
    });
  });
});

describe('using items array', () => {
  let div, grid;

  before(async () => {
    fixtureSync(`
      <dom-bind>
        <template>
          <div id="div">[[items.0.foo]]</div>
          <vaadin-grid id="grid" items="{{items}}">
            <vaadin-grid-column>
              <template>
                <input value="{{item.foo::input}}" />
                <input type="checkbox" checked="{{selected::change}}" />
              </template>
            </vaadin-grid-column>
          </vaadin-grid>
        </template>
      </dom-bind>
    `);
    div = document.getElementById('div');
    grid = div.nextElementSibling;
    const bind = grid.nextElementSibling;
    bind.set('items', [{ foo: 'bar' }]);
    flushGrid(grid);
    await nextFrame();
  });

  it('should notify items array path', async () => {
    const input = getBodyCellContent(grid, 0, 0).querySelector('input');
    input.value = 'baz';
    input.dispatchEvent(new CustomEvent('input'));
    await nextFrame();
    expect(div.textContent).to.equal('baz');
  });

  it('should not notify for non-item properties', async () => {
    const input = grid.querySelector('input[type="checkbox"]');
    const spy = sinon.spy(grid, 'notifyPath');

    input.checked = true;
    input.dispatchEvent(new CustomEvent('change'));

    await nextFrame();
    spy.getCalls().forEach((call) => {
      expect(call.args[0]).to.not.contain('items');
    });
  });
});

describe('slotted templates', () => {
  let slotted, wrapper, grid;

  before(async () => {
    slotted = fixtureSync(`
      <slotted-templates>
        <template slot="grid-column-template">body-[[index]]</template>
      </slotted-templates>
    `);
    wrapper = slotted.$.wrapper;
    grid = wrapper.$.grid;
    flushGrid(grid);
    await nextFrame();
  });

  it('should slot column template', () => {
    expect(getContainerCellContent(grid.$.items, 0, 5).textContent).to.equal('body-0');
  });

  it('should support data-binding in slotted templates', async () => {
    slotted.foo = 'foo';
    await nextFrame();
    expect(getContainerCellContent(grid.$.header, 0, 5).textContent).to.equal('header-foo');

    slotted.bar = 'bar';
    await nextFrame();
    expect(getContainerCellContent(grid.$.footer, 0, 5).textContent).to.equal('footer-bar');
  });

  ['header', 'footer'].forEach((container) => {
    it(`should change the ${container} template`, async () => {
      const newTemplate = document.createElement('template');
      newTemplate.classList.add(container);
      newTemplate.setAttribute('slot', `grid-column-${container}-template`);
      newTemplate.innerHTML = `${container}-bar`;

      wrapper.removeChild(wrapper.querySelector(`template.${container}`));
      wrapper.appendChild(newTemplate);
      await nextRender();
      flushGrid(grid);

      expect(getContainerCellContent(grid.$[container], 0, 5).textContent).to.equal(`${container}-bar`);
    });
  });

  it(`should change the body template`, async () => {
    const newTemplate = document.createElement('template');
    newTemplate.setAttribute('slot', `grid-column-template`);
    newTemplate.innerHTML = `bar-[[index]]`;

    slotted.removeChild(slotted.querySelector(`template`));
    slotted.appendChild(newTemplate);
    await nextRender();
    flushGrid(grid);

    expect(getContainerCellContent(grid.$.items, 0, 5).textContent).to.equal('bar-0');
  });
});

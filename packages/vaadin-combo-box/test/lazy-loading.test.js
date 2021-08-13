import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync, nextFrame, enterKeyDown, fire } from '@vaadin/testing-helpers';
import { flush } from '@polymer/polymer/lib/utils/flush.js';
import '@polymer/iron-input/iron-input.js';
import { ComboBoxPlaceholder } from '../src/vaadin-combo-box-placeholder.js';
import { getViewportItems, makeItems } from './helpers.js';
import './not-animated-styles.js';
import '../vaadin-combo-box.js';
import '../vaadin-combo-box-light.js';
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

registerStyles(
  'vaadin-combo-box*',
  css`
    :host {
      --vaadin-combo-box-overlay-max-height: 400px;
    }
  `
);

describe('lazy loading', () => {
  const DEFAULT_PAGE_SIZE = 50;
  const SIZE = 200;
  const allItems = makeItems(SIZE);
  let dataProviderItems;
  let spyDataProvider;
  let spyAsyncDataProvider;

  const getDataProvider = (allItems) => (params, callback) => {
    const filteredItems = allItems.filter((item) => item.indexOf(params.filter) > -1);
    const size = filteredItems.length;
    const offset = params.page * params.pageSize;
    dataProviderItems = filteredItems.slice(offset, offset + params.pageSize);
    callback(dataProviderItems, size);
  };

  const dataProvider = getDataProvider(allItems);

  const asyncDataProvider = (params, callback) => {
    setTimeout(() => dataProvider(params, callback));
  };

  const objectDataProvider = (params, callback) => {
    const offset = params.page * params.pageSize;
    const n = Math.min(offset + params.pageSize, SIZE) - offset;
    dataProviderItems = Array(...new Array(n)).map((_, i) => {
      return { id: i, value: `value ${i}`, label: `label ${i}` };
    });
    callback(dataProviderItems, SIZE);
  };

  const setInputValue = (value) => {
    if (comboBox.inputElement.tagName === 'IRON-INPUT') {
      comboBox.inputElement._initSlottedInput();
      comboBox.inputElement.inputElement.value = value;
    } else {
      comboBox.inputElement.value = value;
    }
  };

  before(() => {
    sinon.stub(console, 'warn');
  });

  after(() => {
    console.warn.restore();
  });

  beforeEach(() => {
    spyDataProvider = sinon.spy(dataProvider);
    spyAsyncDataProvider = sinon.spy(asyncDataProvider);
  });

  let comboBox, isComboBoxLight;

  const describeLazyLoading = () => {
    describe('dataProvider', () => {
      it('should not be invoked when set', () => {
        comboBox.dataProvider = spyDataProvider;
        expect(spyDataProvider.called).to.be.false;
      });

      it('should be invoked on open', () => {
        comboBox.dataProvider = spyDataProvider;
        comboBox.opened = true;
        expect(spyDataProvider.calledOnce).to.be.true;
      });

      it('should be invoked with size set', () => {
        comboBox.size = SIZE;
        comboBox.dataProvider = spyDataProvider;
        comboBox.opened = true;
        expect(spyDataProvider.calledOnce).to.be.true;
      });

      it('should not throw with large size', () => {
        expect(() => (comboBox.size = 500000)).not.to.throw(Error);
      });

      it('should throw if set after items', () => {
        comboBox.items = ['foo'];
        function setDataProvider() {
          comboBox.dataProvider = spyDataProvider;
        }
        expect(setDataProvider).to.throw('not supported');
        expect(spyDataProvider.called).to.be.false;
        expect(comboBox.dataProvider).to.be.undefined;
      });

      it('should throw if items are set after', () => {
        comboBox.dataProvider = spyDataProvider;
        function setItems() {
          comboBox.items = ['foo'];
        }
        expect(setItems).to.throw('not supported');
        expect(comboBox.items).to.be.undefined;
      });

      (isComboBoxLight ? it.skip : it)('should clear value on clear button press before opened', () => {
        comboBox.dataProvider = dataProvider;
        comboBox.selectedItem = 'item 0';
        comboBox.clearButtonVisible = true;
        comboBox.inputElement.$.clearButton.click();
        comboBox.opened = true;
        flush();
        expect(comboBox.value).to.be.empty;
        expect(comboBox.selectedItem).to.be.null;
      });

      (isComboBoxLight ? describe.skip : describe)('when autoOpenDisabled', () => {
        beforeEach(() => (comboBox.autoOpenDisabled = true));

        it('should not clear filter when loading first page', () => {
          expect(comboBox.autoOpenDisabled).to.be.true;
          expect(comboBox.opened).to.be.false;
          comboBox.dataProvider = spyDataProvider;
          setInputValue('item 1');
          fire(comboBox.inputElement, 'input');
          comboBox.opened = true;
          flush();
          expect(comboBox.filter).to.equal('item 1');
          const { filter } = spyDataProvider.lastCall.args[0];
          expect(filter).to.equal('item 1');
        });
      });

      describe('when open', function () {
        this.timeout(15000);
        beforeEach(() => (comboBox.opened = true));

        it('should be invoked when set', () => {
          comboBox.dataProvider = spyDataProvider;
          expect(spyDataProvider.calledOnce).to.be.true;
        });

        it('should receive params argument', () => {
          comboBox.dataProvider = spyDataProvider;
          const params = spyDataProvider.lastCall.args[0];
          expect(typeof params).to.equal('object');
        });

        it('should have filter param', () => {
          comboBox.dataProvider = spyDataProvider;
          const params = spyDataProvider.lastCall.args[0];
          expect(params.filter).to.equal('');
        });

        it('should receive callback argument', () => {
          comboBox.dataProvider = spyDataProvider;
          const callback = spyDataProvider.lastCall.args[1];
          expect(typeof callback).to.equal('function');
        });

        it('should request page 0', () => {
          comboBox.dataProvider = spyDataProvider;
          const params = spyDataProvider.lastCall.args[0];
          expect(params.page).to.equal(0);
        });

        (window.innerHeight > 900 ? it.skip : it)('should request page 1 on scroll', () => {
          comboBox.dataProvider = spyDataProvider;
          spyDataProvider.resetHistory();
          comboBox.$.overlay._scrollIntoView(75);
          expect(spyDataProvider.called).to.be.true;
          const pages = spyDataProvider.getCalls().map((call) => call.args[0].page);
          expect(pages).to.contain(1);
        });

        (window.innerHeight > 900 ? it.skip : it)('should request page 2 on scroll', () => {
          comboBox.dataProvider = spyDataProvider;
          spyDataProvider.resetHistory();
          comboBox.$.overlay._scrollIntoView(125);
          expect(spyDataProvider.called).to.be.true;
          const pages = spyDataProvider.getCalls().map((call) => call.args[0].page);
          expect(pages).to.contain(2);
        });

        it('should request with empty filter', () => {
          comboBox.dataProvider = spyDataProvider;
          const params = spyDataProvider.lastCall.args[0];
          expect(params.filter).to.equal('');
        });

        it('should request on filter change with user’s filter', () => {
          comboBox.dataProvider = spyDataProvider;
          spyDataProvider.resetHistory();
          comboBox.filter = 'item 1';
          expect(spyDataProvider.called).to.be.true;
          const params = spyDataProvider.lastCall.args[0];
          expect(params.filter).to.equal('item 1');
        });

        it('should clear filter on value change', () => {
          comboBox.dataProvider = spyDataProvider;
          comboBox.filter = 'item 1';
          spyDataProvider.resetHistory();
          comboBox.value = 'foo';
          const params = spyDataProvider.lastCall.args[0];
          expect(params.filter).to.equal('');
        });

        it('should clear filter on value clear', () => {
          comboBox.dataProvider = dataProvider;
          comboBox.filter = 'item 1';
          comboBox.value = 'item 1';
          comboBox.value = '';
          flush();
          expect(comboBox.filter).to.equal('');
        });

        it('should clear filter on opened change', () => {
          comboBox.dataProvider = dataProvider;
          comboBox.filter = 'item 1';
          comboBox.opened = false;
          flush();
          expect(comboBox.filter).to.equal('');
        });

        it('should not request on value change', () => {
          comboBox.dataProvider = spyDataProvider;
          spyDataProvider.resetHistory();
          comboBox.value = 'item 1';
          expect(spyDataProvider.called).to.be.false;
        });

        it('should populate filteredItems', () => {
          expect(comboBox.filteredItems).to.be.undefined;
          comboBox.dataProvider = dataProvider;
          expect(comboBox.filteredItems).to.be.instanceof(Array);
          expect(comboBox.filteredItems).to.have.lengthOf(SIZE);
          const filteredItemsFirstPage = comboBox.filteredItems.slice(0, comboBox.pageSize);
          expect(filteredItemsFirstPage).to.eql(dataProviderItems);
        });

        it('should toggle loading', (done) => {
          expect(comboBox.loading).to.be.false;
          comboBox.dataProvider = (params, callback) => {
            expect(comboBox.loading).to.be.true;
            callback([], 0);
            expect(comboBox.loading).to.be.false;
            done();
          };
        });

        it('should request page after partial filter & cancel & reopen', () => {
          comboBox.dataProvider = spyDataProvider;
          comboBox.filter = 'it';
          spyDataProvider.resetHistory();
          comboBox.cancel();
          flush();
          comboBox.opened = true;
          const params = spyDataProvider.lastCall.args[0];
          expect(params.filter).to.equal('');
        });

        it('should not request loaded page again', () => {
          comboBox.dataProvider = spyDataProvider;
          comboBox.open();
          comboBox.close();
          comboBox.open();
          expect(spyDataProvider.calledOnce).to.be.true;
        });

        it('should not request empty loaded page again', () => {
          const dp = sinon.spy((params, callback) => callback([], 0));
          comboBox.dataProvider = dp;
          comboBox.open();
          comboBox.close();
          comboBox.open();
          expect(dp.calledOnce).to.be.true;
        });

        it('should render all visible items after delayed response', (done) => {
          const items = [...Array(10)].map((_, i) => 'item ' + i);
          comboBox.dataProvider = (params, callback) => {
            setTimeout(() => {
              callback(items, 10);
              setTimeout(() => {
                const renderedTexts = Array.from(
                  comboBox.$.overlay._selector.querySelectorAll('vaadin-combo-box-item')
                ).map((i) => i.shadowRoot.querySelector('#content').innerText);
                expect(renderedTexts).to.eql(items);
                done();
              });
            }, 50);
          };
          comboBox.open();
        });
      });

      describe('when selecting item', () => {
        const clickFirstItem = () => comboBox.$.overlay._selector.querySelector('vaadin-combo-box-item').click();

        beforeEach(() => {
          comboBox.dataProvider = spyDataProvider;
          comboBox.open();
          flush();
        });

        it('should not be invoked', () => {
          spyDataProvider.resetHistory();
          clickFirstItem();
          expect(comboBox.selectedItem).to.eql('item 0');
          expect(spyDataProvider.callCount).to.eql(0);
        });

        // FIXME: fails for combo-box-light (items are not updated)
        (isComboBoxLight ? it.skip : it)('should not be invoked if items are filtered', () => {
          setInputValue('1');
          fire(comboBox.inputElement, 'input');

          flush();
          spyDataProvider.resetHistory();

          clickFirstItem();
          expect(comboBox.selectedItem).to.eql('item 1');
          expect(spyDataProvider.callCount).to.eql(0);
        });
      });

      describe('async', () => {
        it('should be invoked on open', () => {
          comboBox.dataProvider = spyAsyncDataProvider;
          comboBox.opened = true;
          expect(spyAsyncDataProvider.calledOnce).to.be.true;
        });

        it('should be invoked on open with pre-defined size', () => {
          comboBox.size = SIZE;
          comboBox.dataProvider = spyAsyncDataProvider;
          comboBox.opened = true;
          expect(spyAsyncDataProvider.calledOnce).to.be.true;
        });

        (window.innerHeight > 900 ? it.skip : it)('should request page 1 on scroll', () => {
          comboBox.size = SIZE;
          comboBox.dataProvider = spyAsyncDataProvider;
          comboBox.opened = true;
          spyAsyncDataProvider.resetHistory();
          comboBox.$.overlay._scrollIntoView(75);
          expect(spyAsyncDataProvider.called).to.be.true;
          const pages = spyAsyncDataProvider.getCalls().map((call) => call.args[0].page);
          expect(pages).to.contain(1);
        });

        (window.innerHeight > 900 ? it.skip : it)('should request page 2 on scroll', () => {
          comboBox.size = SIZE;
          comboBox.dataProvider = spyAsyncDataProvider;
          comboBox.opened = true;
          spyAsyncDataProvider.resetHistory();
          comboBox.$.overlay._scrollIntoView(125);
          expect(spyAsyncDataProvider.called).to.be.true;
          const pages = spyAsyncDataProvider.getCalls().map((call) => call.args[0].page);
          expect(pages).to.contain(2);
        });

        it('should not select placeholder items', () => {
          comboBox.size = SIZE;
          comboBox.dataProvider = spyAsyncDataProvider;
          comboBox.opened = true;
          const itemElement = comboBox.$.overlay._selector.querySelector('vaadin-combo-box-item');
          expect(itemElement.item).to.be.instanceof(ComboBoxPlaceholder);
          itemElement.click();
          expect(comboBox.opened).to.equal(true);
          expect(comboBox.selectedItem).to.not.be.instanceOf(ComboBoxPlaceholder);
        });

        it('should set custom value on enter', () => {
          comboBox.allowCustomValue = true;
          comboBox.dataProvider = spyAsyncDataProvider;
          comboBox.opened = true;

          setInputValue('custom value');
          fire(comboBox.inputElement, 'input');

          enterKeyDown(comboBox.inputElement);
          expect(comboBox.value).to.eql('custom value');
        });
      });

      describe('changing dataProvider', () => {
        it('should have correct items after changing dataProvider to return less items', () => {
          comboBox.dataProvider = (params, callback) => callback(['foo', 'bar'], 2);
          comboBox.open();
          comboBox.close();

          comboBox.clearCache();
          comboBox.dataProvider = (params, callback) => callback(['baz'], 1);
          comboBox.open();

          expect(comboBox.filteredItems).to.eql(['baz']);
          const visibleItems = Array.from(
            comboBox.$.overlay._selector.querySelectorAll('vaadin-combo-box-item')
          ).filter((item) => !item.hidden);
          expect(visibleItems.map((item) => item.$.content.innerText)).to.eql(['baz']);
        });
      });
    });

    describe('pageSize', () => {
      it('should have default value', () => {
        expect(typeof comboBox.pageSize).to.equal('number');
        expect(comboBox.pageSize).to.equal(DEFAULT_PAGE_SIZE);
      });

      it('should use default value in dataProvider', () => {
        comboBox.opened = true;
        comboBox.dataProvider = spyDataProvider;
        const params = spyDataProvider.lastCall.args[0];
        expect(typeof comboBox.pageSize).to.equal('number');
        expect(params.pageSize).to.equal(DEFAULT_PAGE_SIZE);
      });

      it('should use a custom value in dataProvider', () => {
        comboBox.opened = true;
        comboBox.pageSize = 123;
        comboBox.dataProvider = spyDataProvider;
        const params = spyDataProvider.lastCall.args[0];
        expect(params.pageSize).to.equal(123);
      });

      it('should throw when set to zero', () => {
        comboBox.pageSize = 123;
        expect(() => (comboBox.pageSize = 0)).to.throw('pageSize');
        expect(comboBox.pageSize).to.equal(123);
      });

      it('should throw when set to non-integer', () => {
        comboBox.pageSize = 123;
        expect(() => (comboBox.pageSize = undefined)).to.throw('pageSize');
        expect(() => (comboBox.pageSize = null)).to.throw('pageSize');
        expect(() => (comboBox.pageSize = NaN)).to.throw('pageSize');
        expect(() => (comboBox.pageSize = 10.5)).to.throw('pageSize');
        expect(() => (comboBox.pageSize = '10')).to.throw('pageSize');
        expect(comboBox.pageSize).to.equal(123);
      });

      it('should throw when set to negative value', () => {
        comboBox.pageSize = 10;
        expect(() => (comboBox.pageSize = -1)).to.throw('pageSize');
        expect(comboBox.pageSize).to.equal(10);
      });
    });

    describe('size', () => {
      it('should not have default value', () => {
        expect(comboBox.size).to.be.undefined;
      });

      it('should be set from dataProvider callback', () => {
        comboBox.opened = true;
        comboBox.dataProvider = spyDataProvider;
        expect(comboBox.size).to.equal(SIZE);
      });

      it('should remove extra filteredItems when decreasing size', () => {
        comboBox.dataProvider = (params, callback) => callback(['foo', 'bar'], 2);
        comboBox.open();

        comboBox.size = 1;
        expect(comboBox.filteredItems).to.eql(['foo']);
      });

      it('should not show the loading on size change while pending the data provider', () => {
        const allItems = makeItems(200);

        comboBox.size = 200;
        comboBox.dataProvider = (params, callback) => {
          if (params.page > 1) {
            // Pending the page = 2...
            return;
          }
          const offset = params.page * params.pageSize;
          const slice = allItems.slice(offset, offset + params.pageSize);
          callback(slice, allItems.length);
        };
        comboBox.open();
        expect(comboBox.loading).to.be.false;
        comboBox.$.overlay._scrollIntoView(45);
        expect(comboBox.loading).to.be.false;
        comboBox.$.overlay._scrollIntoView(150);
        // Fetching the page = 2 and stucking
        expect(comboBox.loading).to.be.true;
        // Updating the size means we don't need pending requests anymore,
        // and combo box should show no loading
        comboBox.size = 100;
        expect(comboBox.loading).to.be.false;
      });

      it('should not show the loading on fast scrolling and size update', () => {
        const ITEMS_SIZE = 1000;
        const allItems = makeItems(ITEMS_SIZE);

        comboBox.size = ITEMS_SIZE;
        comboBox.dataProvider = (params, callback) => {
          // Response for the first page immediately
          if (params.page === 0) {
            const offset = params.page * params.pageSize;
            const slice = allItems.slice(offset, offset + params.pageSize);
            callback(slice, allItems.length);
          }
          // ...and postpone the response for rest of the pages, in order to
          // have them stuck in the pending queue
        };
        comboBox.open();
        // Scroll fast to a large page
        comboBox.$.overlay._scrollIntoView(400);
        expect(comboBox.loading).to.be.true;
        // Reduce the size and trigger pending queue cleanup
        comboBox.size = 50;
        expect(comboBox.loading).to.be.false;
      });
    });

    describe('value (string items)', () => {
      beforeEach(() => {
        comboBox.dataProvider = dataProvider;
      });

      it('should allow setting initial value', () => {
        comboBox.value = 'foo';
        expect(comboBox.value).to.equal('foo');
      });

      it('should allow setting initial value when size present', () => {
        comboBox.size = SIZE;
        comboBox.value = 'foo';
        expect(comboBox.value).to.equal('foo');
      });

      it('should warn if used without selectedItem', () => {
        console.warn.resetHistory();
        comboBox.value = 'foo';
        expect(console.warn.calledOnce).to.be.true;
        expect(console.warn.firstCall.args[0]).to.contain('selectedItem');
      });

      it('should not warn if used with selectedItem', () => {
        console.warn.resetHistory();
        comboBox.selectedItem = 'foo';
        comboBox.value = 'foo';
        expect(console.warn.called).to.be.false;
      });

      it('should not set selectedItem when matching value item is not loaded', () => {
        comboBox.value = 'item 0';
        expect(comboBox.selectedItem).to.be.undefined;
      });

      it('should set selectedItem matching value when items are loading', () => {
        comboBox.value = 'item 0';
        comboBox.opened = true; // loads first page of dataProvider items
        expect(comboBox.selectedItem).to.equal('item 0');
      });

      it('should set selectedItem matching value when items are loaded', () => {
        comboBox.opened = true; // loads first page of dataProvider items
        // comboBox.$.overlay.updateViewportBoundaries();
        comboBox.$.overlay.ensureItemsRendered();
        comboBox.value = 'item 0';
        expect(comboBox.selectedItem).to.equal('item 0');
      });
    });

    describe('value (object items)', () => {
      beforeEach(() => {
        comboBox.itemIdPath = 'id';
        comboBox.dataProvider = objectDataProvider;
      });

      it('should allow setting initial value', () => {
        comboBox.value = 'foo';
        expect(comboBox.value).to.equal('foo');
      });

      it('should allow setting initial value when size present', () => {
        comboBox.size = SIZE;
        comboBox.value = 'foo';
        expect(comboBox.value).to.equal('foo');
      });

      it('should warn if used without selectedItem', () => {
        console.warn.resetHistory();
        comboBox.value = 'foo';
        expect(console.warn.calledOnce).to.be.true;
        expect(console.warn.firstCall.args[0]).to.contain('selectedItem');
      });

      it('should not warn if used with selectedItem', () => {
        console.warn.resetHistory();
        comboBox.selectedItem = { value: 'foo', label: 'foo' };
        comboBox.value = 'foo';
        expect(console.warn.called).to.be.false;
      });

      it('should not set selectedItem when matching item is not loaded', () => {
        comboBox.value = 'value 0';
        expect(comboBox.selectedItem).to.be.undefined;
      });

      it('should set matching selectedItem when items are loading', () => {
        comboBox.value = 'value 0';
        comboBox.opened = true; // loads first page of dataProvider items
        expect(comboBox.selectedItem).to.eql({ id: 0, value: 'value 0', label: 'label 0' });
      });

      it('should not mark placeholders selected when items are loading', () => {
        comboBox.itemIdPath = 'key';
        comboBox.dataProvider = (p, c) => {
          if (!comboBox.dataProvider.__jammed) {
            c([{ key: 0, label: 'foo' }], 1);
          }
          comboBox.dataProvider.__jammed = true;
        };
        comboBox.opened = true;
        comboBox.opened = false;
        comboBox.clearCache();
        comboBox.opened = true;

        const selected = comboBox.$.overlay._selector.querySelectorAll('[selected]');
        expect(selected).to.be.empty;
      });

      it('should set matching selectedItem when items are loaded', () => {
        comboBox.opened = true; // loads first page of dataProvider items
        // comboBox.$.overlay.updateViewportBoundaries();
        comboBox.$.overlay.ensureItemsRendered();
        comboBox.value = 'value 0';
        expect(comboBox.selectedItem).to.eql({ id: 0, value: 'value 0', label: 'label 0' });
      });
    });

    describe('selectedItem (string items)', () => {
      beforeEach(() => (comboBox.dataProvider = dataProvider));

      it('should allow setting initial selectedItem', () => {
        comboBox.selectedItem = 'item 0';
        expect(comboBox.selectedItem).to.equal('item 0');
      });

      it('should assign selectedItem', () => {
        comboBox.selectedItem = 'item 0';
        expect(comboBox.value).to.equal('item 0');
      });

      it('should select value matching selectedItem when items are loading', () => {
        comboBox.selectedItem = 'item 0';
        comboBox.opened = true;
        // comboBox.$.overlay.updateViewportBoundaries();
        comboBox.$.overlay.ensureItemsRendered();
        expect(comboBox.value).to.equal('item 0');
        const selectedRenderedItemElements = Array.from(
          comboBox.$.overlay._selector.querySelectorAll('vaadin-combo-box-item')
        ).filter((itemEl) => itemEl.selected);
        expect(selectedRenderedItemElements).to.have.lengthOf(1);
        expect(selectedRenderedItemElements[0].item).to.equal('item 0');
      });

      it('should select value matching selectedItem when items are loaded', async () => {
        comboBox.opened = true;
        // comboBox.$.overlay.updateViewportBoundaries();
        comboBox.$.overlay.ensureItemsRendered();
        comboBox.selectedItem = 'item 0';
        expect(comboBox.value).to.equal('item 0');
        await nextFrame();
        flush();
        const selectedRenderedItemElements = Array.from(
          comboBox.$.overlay._selector.querySelectorAll('vaadin-combo-box-item')
        ).filter((itemEl) => itemEl.selected);
        // doesn't work when run on SauceLabs, work locally
        // expect(selectedRenderedItemElements).to.have.lengthOf(1);
        expect(selectedRenderedItemElements[0].item).to.equal('item 0');
      });
    });

    describe('selectedItem (object items)', () => {
      beforeEach(() => {
        comboBox.itemIdPath = 'id';
        comboBox.dataProvider = objectDataProvider;
      });

      it('should allow setting initial selectedItem', () => {
        comboBox.selectedItem = { id: 0, value: 'value 0', label: 'label 0' };
        expect(comboBox.selectedItem).to.eql({ id: 0, value: 'value 0', label: 'label 0' });
      });

      it('should assign selectedItem', () => {
        comboBox.selectedItem = { id: 0, value: 'value 0', label: 'label 0' };
        expect(comboBox.value).to.equal('value 0');
      });

      it('should select value matching selectedItem when items are loading', () => {
        comboBox.selectedItem = { id: 0, value: 'value 0', label: 'label 0' };
        comboBox.opened = true;
        // comboBox.$.overlay.updateViewportBoundaries();
        comboBox.$.overlay.ensureItemsRendered();
        expect(comboBox.value).to.equal('value 0');
        const selectedRenderedItemElements = Array.from(
          comboBox.$.overlay._selector.querySelectorAll('vaadin-combo-box-item')
        ).filter((itemEl) => itemEl.selected);
        expect(selectedRenderedItemElements).to.have.lengthOf(1);
        expect(selectedRenderedItemElements[0].item).to.eql({ id: 0, value: 'value 0', label: 'label 0' });
      });

      it('should select value matching selectedItem when items are loaded', async () => {
        comboBox.opened = true;
        // comboBox.$.overlay.updateViewportBoundaries();
        comboBox.$.overlay.ensureItemsRendered();
        comboBox.selectedItem = { id: 0, value: 'value 0', label: 'label 0' };
        expect(comboBox.value).to.equal('value 0');
        await nextFrame();
        flush();
        const selectedRenderedItemElements = Array.from(
          comboBox.$.overlay._selector.querySelectorAll('vaadin-combo-box-item')
        ).filter((itemEl) => itemEl.selected);
        // doesn't work when run on SauceLabs, work locally
        // expect(selectedRenderedItemElements).to.have.lengthOf(1);
        expect(selectedRenderedItemElements[0].item).to.eql({ id: 0, value: 'value 0', label: 'label 0' });
      });
    });

    describe('itemIdPath', () => {
      it('should not have default value', () => {
        expect(comboBox.itemIdPath).to.be.undefined;
      });

      it('should support shallow paths', async () => {
        comboBox.itemIdPath = 'id';
        comboBox.selectedItem = { id: 0 };
        comboBox.dataProvider = objectDataProvider;
        comboBox.opened = true;
        // comboBox.$.overlay.updateViewportBoundaries();
        comboBox.$.overlay.ensureItemsRendered();
        await nextFrame();
        flush();
        const selectedRenderedItemElements = Array.from(
          comboBox.$.overlay._selector.querySelectorAll('vaadin-combo-box-item')
        ).filter((itemEl) => itemEl.selected);
        // doesn't work when run on SauceLabs, work locally
        // expect(selectedRenderedItemElements).to.have.lengthOf(1);
        expect(selectedRenderedItemElements[0].item).to.eql({ id: 0, value: 'value 0', label: 'label 0' });
      });

      it('should support deep paths', async () => {
        comboBox.itemIdPath = 'db.key';
        comboBox.selectedItem = { db: { key: '#0' } };
        comboBox.dataProvider = (params, callback) => {
          objectDataProvider(params, (items, size) =>
            callback(
              items.map((i) => {
                i.db = { key: `#${i.id}` };
                return i;
              }),
              size
            )
          );
        };
        comboBox.opened = true;
        // comboBox.$.overlay.updateViewportBoundaries();
        comboBox.$.overlay.ensureItemsRendered();
        await nextFrame();
        flush();
        const selectedRenderedItemElements = Array.from(
          comboBox.$.overlay._selector.querySelectorAll('vaadin-combo-box-item')
        ).filter((itemEl) => itemEl.selected);
        // doesn't work when run on SauceLabs, work locally
        // expect(selectedRenderedItemElements).to.have.lengthOf(1);
        expect(selectedRenderedItemElements[0].item).to.eql({
          id: 0,
          value: 'value 0',
          label: 'label 0',
          db: { key: '#0' }
        });
      });
    });

    describe('clearCache', () => {
      describe('before open', () => {
        beforeEach(() => {
          comboBox.dataProvider = spyDataProvider;
        });

        it('should not request first page', () => {
          comboBox.clearCache();
          expect(spyDataProvider.called).to.be.false;
        });

        it('should not throw with large size', () => {
          comboBox.size = 500000;
          expect(() => comboBox.clearCache()).not.to.throw(Error);
        });
      });

      describe('when open', () => {
        beforeEach(() => {
          comboBox.opened = true;
        });

        it('should replace filteredItems with placeholders', () => {
          comboBox.dataProvider = spyAsyncDataProvider;
          comboBox.size = SIZE;
          comboBox.filteredItems = ['item 0', 'item 1'];
          comboBox.clearCache();
          expect(comboBox.filteredItems.length).to.equal(SIZE);
          comboBox.filteredItems.forEach((item) => {
            expect(item).to.be.instanceOf(ComboBoxPlaceholder);
          });
        });

        it('should reuse one placeholder instance', () => {
          comboBox.dataProvider = spyAsyncDataProvider;
          comboBox.size = SIZE;
          comboBox.clearCache();
          expect(comboBox.filteredItems[0]).to.equal(comboBox.filteredItems[1]);
        });

        it('should request first page', () => {
          comboBox.dataProvider = spyDataProvider;
          spyDataProvider.resetHistory();
          comboBox.clearCache();
          expect(spyDataProvider.called).to.be.true;
          const params = spyDataProvider.firstCall.args[0];
          expect(params.page).to.equal(0);
        });

        it('should clear old pending requests', () => {
          let slowCallback;
          comboBox.dataProvider = (params, callback) => {
            if (!slowCallback) {
              slowCallback = callback;
            }
          };
          comboBox.clearCache();
          slowCallback([{}]);
          expect(comboBox.filteredItems).to.be.empty;
        });
      });

      describe('after closed', () => {
        beforeEach(() => {
          comboBox.opened = true;
          comboBox.dataProvider = spyDataProvider;
          comboBox.opened = false;
          spyDataProvider.resetHistory();
        });

        it('should not request first page', () => {
          comboBox.clearCache();
          expect(spyDataProvider.called).to.be.false;
        });

        it('should request page 1 on scroll after reopen', () => {
          comboBox.clearCache();
          comboBox.opened = true;
          comboBox.$.overlay._scrollIntoView(75);
          expect(spyDataProvider.called).to.be.true;
          const pages = spyDataProvider.getCalls().map((call) => call.args[0].page);
          expect(pages).to.contain(1);
        });
      });

      describe('using data provider, lost focus before data is returned', () => {
        let returnedItems;
        const bluringDataProvider = (params, callback) => {
          comboBox.blur();
          callback(returnedItems, returnedItems.length);
        };

        beforeEach(() => {
          returnedItems = ['item 12'];
          comboBox.focus();
          comboBox.opened = true;
          comboBox.dataProvider = bluringDataProvider;
          comboBox.opened = false;
          comboBox.focus();
        });

        it('should set value without auto-open-disabled', () => {
          comboBox.autoOpenDisabled = false;
          expect(comboBox.autoOpenDisabled).to.be.false;

          const filterValue = 'item 12';
          comboBox._inputElementValue = filterValue;
          comboBox.filter = filterValue;
          expect(comboBox.opened).to.be.false;
          expect(comboBox.hasAttribute('focused')).to.be.false;
          expect(comboBox.value).to.equal('item 12');
        });

        it('should set value with auto-open-disabled', () => {
          comboBox.autoOpenDisabled = true;
          expect(comboBox.autoOpenDisabled).to.be.true;

          const filterValue = 'item 12';
          comboBox._inputElementValue = filterValue;
          comboBox.filter = filterValue;
          expect(comboBox.opened).to.be.false;
          expect(comboBox.hasAttribute('focused')).to.be.false;
          expect(comboBox.value).to.equal('item 12');
        });

        it('should set value without auto-open-disabled even if case does not match', () => {
          comboBox.autoOpenDisabled = false;
          expect(comboBox.autoOpenDisabled).to.be.false;

          const filterValue = 'ItEm 12';
          comboBox._inputElementValue = filterValue;
          comboBox.filter = filterValue;
          expect(comboBox.opened).to.be.false;
          expect(comboBox.hasAttribute('focused')).to.be.false;
          expect(comboBox.value).to.equal('item 12');
        });

        it('should set value with auto-open-disabled even if case does not match', () => {
          comboBox.autoOpenDisabled = true;
          expect(comboBox.autoOpenDisabled).to.be.true;

          const filterValue = 'iTem 12';
          comboBox._inputElementValue = filterValue;
          comboBox.filter = filterValue;
          expect(comboBox.opened).to.be.false;
          expect(comboBox.hasAttribute('focused')).to.be.false;
          expect(comboBox.value).to.equal('item 12');
        });

        it('should set first value of multiple matches that differ only in case', () => {
          returnedItems = ['item 12', 'IteM 12'];

          const filterValue = 'IteM 12';
          comboBox._inputElementValue = filterValue;
          comboBox.filter = filterValue;
          expect(comboBox.opened).to.be.false;
          expect(comboBox.hasAttribute('focused')).to.be.false;
          expect(comboBox.value).to.equal('item 12');
        });

        it('should keep empty value if it is not an exact match', () => {
          comboBox._inputElementValue = 'item';
          comboBox.filter = 'item';
          expect(comboBox.opened).to.be.false;
          expect(comboBox.hasAttribute('focused')).to.be.false;
          expect(comboBox.value).to.equal('');
        });

        it('should keep previous value if it is not an exact match', () => {
          comboBox.filteredItems = ['other value', 'item 12'];
          comboBox.value = 'other value';
          expect(comboBox.value).to.equal('other value');

          returnedItems = ['item 12'];
          const filterValue = 'item 1';
          comboBox._inputElementValue = filterValue;
          comboBox.filter = filterValue;
          expect(comboBox.opened).to.be.false;
          expect(comboBox.hasAttribute('focused')).to.be.false;
          expect(comboBox.value).to.equal('other value');
        });

        it('should keep previous value if allow-custom-value is set', () => {
          comboBox.allowCustomValue = true;
          comboBox.open();
          setInputValue('other value');
          fire(comboBox.inputElement, 'input');
          comboBox.close();
          expect(comboBox.value).to.eql('other value');

          comboBox.focus();
          setInputValue('item 12');
          comboBox.filter = 'item 12';

          expect(comboBox.value).to.eql('other value');
          expect(comboBox.inputElement.value).to.eql('other value');
        });
      });

      describe('after empty data set loaded', () => {
        const emptyDataProvider = sinon.spy((params, callback) => callback([], 0));

        beforeEach(() => {
          comboBox.dataProvider = emptyDataProvider;
          comboBox.open();
          comboBox.close();
          emptyDataProvider.resetHistory();
        });

        it('should request first page on open', () => {
          comboBox.clearCache();
          comboBox.open();
          expect(emptyDataProvider.calledOnce).to.be.true;
        });
      });
    });

    describe('undefined size', () => {
      const ESTIMATED_SIZE = 1234;
      const allItems = makeItems(ESTIMATED_SIZE);

      it('should restore the scroll position after size update', () => {
        const targetItemIndex = 75;
        comboBox.dataProvider = getDataProvider(allItems);
        comboBox.opened = true;
        comboBox.$.overlay._scrollIntoView(targetItemIndex);
        comboBox.size = 300;
        // verify whether the scroller not jumped to 0 pos and restored properly,
        // having the item with 'targetItemIndex' in the bottom
        // (exact visible items may vary depending of window size),
        // and sometimes the 'ironList.scrollToIndex' does not point
        // precisely to the given index, so use some margin
        const scrollMargin = 5;
        const expectedFirstVisibleIndex = targetItemIndex - comboBox.$.overlay._visibleItemsCount() - scrollMargin;
        expect(getViewportItems(comboBox)[0].index).to.be.greaterThan(expectedFirstVisibleIndex);
        expect(getViewportItems(comboBox).pop().index).to.be.lessThan(targetItemIndex + 1);
      });

      it('should reset to 0 when filter applied and filtered items size more than page size', () => {
        comboBox.items = allItems;
        comboBox.opened = true;
        comboBox.$.overlay._scrollIntoView(500);
        comboBox.filter = '1';
        expect(getViewportItems(comboBox)[0].index).to.be.equal(0);
      });

      // Verifies https://github.com/vaadin/vaadin-combo-box/issues/957
      it('should fetch the items after scrolling to the bottom with scrollbar', async () => {
        const REAL_SIZE = 1234;
        let ESTIMATED_SIZE = 200;
        const allItems = makeItems(REAL_SIZE);

        // DataProvider for unknown size lazy loading
        const getDataProvider = (allItems) => (params, callback) => {
          const filteredItems = allItems.filter((item) => item.indexOf(params.filter) > -1);
          const offset = params.page * params.pageSize;
          const end = offset + params.pageSize;

          dataProviderItems = filteredItems.slice(offset, end);

          if (dataProviderItems.size === 0) {
            ESTIMATED_SIZE = offset;
          } else if (dataProviderItems.size < params.pageSize) {
            ESTIMATED_SIZE = offset + dataProviderItems.size;
          } else if (end > ESTIMATED_SIZE - params.pageSize) {
            ESTIMATED_SIZE += 200;
          }
          callback(dataProviderItems, ESTIMATED_SIZE);
        };

        comboBox.dataProvider = getDataProvider(allItems);
        comboBox.opened = true;
        flush();

        // Scroll to the end, as though if we drag the scrollbar and move it
        // to the bottom
        const scrollHeight = comboBox.$.overlay._selector._scrollHeight;
        comboBox.$.overlay._scroller.scrollTop += scrollHeight;

        // Flush the pending changes after the scrolling
        await nextFrame();
        flush();

        const lastVisibleIndex = getViewportItems(comboBox).pop().index;
        // Check if the next few items after the last visible item are not empty
        for (let nextIndexIncrement = 0; nextIndexIncrement < 5; nextIndexIncrement++) {
          const lastItem = comboBox.filteredItems[lastVisibleIndex + nextIndexIncrement];
          expect(lastItem instanceof ComboBoxPlaceholder).is.false;
        }
      });

      it('should not show the loading when exact size is suddenly reached in the middle of requested range', () => {
        const REAL_SIZE = 294;
        const ESTIMATED_SIZE = 400;

        const allItems = makeItems(REAL_SIZE);
        let lastPageAlreadyRequested = false;

        comboBox.size = ESTIMATED_SIZE;

        // Simulates a combo-box server side data provider specifics with
        // undefined size
        comboBox.dataProvider = (params, callback) => {
          const offset = params.page * params.pageSize;
          const slice = allItems.slice(offset, offset + params.pageSize);

          // Combo box server side always notifies about size change
          comboBox.size = params.page < 5 ? ESTIMATED_SIZE : REAL_SIZE;

          if (params.page < 5) {
            callback(slice, ESTIMATED_SIZE);
          } else if (params.page === 5) {
            // Combo box server side does not update the client with the
            // items which were sent recently
            if (!lastPageAlreadyRequested) {
              callback(slice, REAL_SIZE);
              lastPageAlreadyRequested = true;
            }
          }
        };
        comboBox.open();
        // Scroll to last page and verify there is no loading indicator and
        // the last page has been fetched and rendered
        comboBox.$.overlay._scrollIntoView(274);
        expect(comboBox.loading).to.be.false;
        expect(comboBox.filteredItems).to.contain('item 293');
      });
    });
  };

  describe('combo-box', () => {
    beforeEach(() => {
      comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
    });

    describeLazyLoading();
  });

  describe('combo-box-light', () => {
    beforeEach(() => {
      comboBox = fixtureSync(`
        <vaadin-combo-box-light attr-for-value="bind-value">
          <iron-input>
            <input>
          </iron-input>
        </vaadin-combo-box-light>
      `);
    });

    isComboBoxLight = true;

    describeLazyLoading();
  });
});

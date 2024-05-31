import { expect } from '@esm-bundle/chai';
import { arrowDownKeyDown, aTimeout, enterKeyDown, fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { ComboBoxPlaceholder } from '../src/vaadin-combo-box-placeholder.js';
import {
  clickItem,
  flushComboBox,
  getAllItems,
  getFirstItem,
  getFocusedItemIndex,
  getSelectedItem,
  getViewportItems,
  getVisibleItemsCount,
  makeItems,
  scrollToIndex,
  setInputValue,
} from './helpers.js';

describe('data provider', () => {
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

  const asyncObjectDataProvider = (params, callback) => {
    setTimeout(() => objectDataProvider(params, callback));
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
        expect(() => {
          comboBox.size = 500000;
        }).not.to.throw(Error);
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
        comboBox.$.clearButton.click();
        comboBox.opened = true;
        expect(comboBox.value).to.be.empty;
        expect(comboBox.selectedItem).to.be.null;
      });

      (isComboBoxLight ? describe.skip : describe)('when autoOpenDisabled', () => {
        beforeEach(() => {
          comboBox.autoOpenDisabled = true;
          comboBox.inputElement.focus();
          comboBox.dataProvider = spyDataProvider;
          spyDataProvider.resetHistory();
        });

        it('should be invoked on open', () => {
          comboBox.opened = true;
          expect(spyDataProvider.calledOnce).to.be.true;
        });

        it('should be invoked with the correct filter when filtering', () => {
          setInputValue(comboBox, 'item 1');
          expect(comboBox.filter).to.equal('item 1');
          expect(spyDataProvider.calledOnce).to.be.true;
          const { filter } = spyDataProvider.lastCall.args[0];
          expect(filter).to.equal('item 1');
        });

        it('should not be invoked on open after filtering', () => {
          setInputValue(comboBox, 'item 1');
          spyDataProvider.resetHistory();
          comboBox.opened = true;
          expect(spyDataProvider.called).to.be.false;
        });
      });

      describe('when open', () => {
        beforeEach(() => {
          comboBox.inputElement.focus();
          comboBox.opened = true;
        });

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

        (window.innerHeight > 900 ? it.skip : it)('should request page 1 on scroll', async () => {
          comboBox.dataProvider = spyDataProvider;
          spyDataProvider.resetHistory();
          comboBox._scrollIntoView(75);
          await nextFrame();
          expect(spyDataProvider.called).to.be.true;
          const pages = spyDataProvider.getCalls().map((call) => call.args[0].page);
          expect(pages).to.contain(1);
        });

        (window.innerHeight > 900 ? it.skip : it)('should request page 2 on scroll', async () => {
          comboBox.dataProvider = spyDataProvider;
          spyDataProvider.resetHistory();
          comboBox._scrollIntoView(125);
          await nextFrame();
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
          setInputValue(comboBox, 'item 1');
          expect(spyDataProvider.called).to.be.true;
          const params = spyDataProvider.lastCall.args[0];
          expect(params.filter).to.equal('item 1');
        });

        it('should clear filter on value change', () => {
          comboBox.dataProvider = spyDataProvider;
          setInputValue(comboBox, 'item 1');
          spyDataProvider.resetHistory();
          comboBox.value = 'foo';
          const params = spyDataProvider.lastCall.args[0];
          expect(params.filter).to.equal('');
        });

        it('should clear filter on value clear', () => {
          comboBox.dataProvider = dataProvider;
          setInputValue(comboBox, 'item 1');
          comboBox.value = 'item 1';
          comboBox.value = '';
          expect(comboBox.filter).to.equal('');
        });

        it('should clear filter on opened change', () => {
          comboBox.dataProvider = dataProvider;
          setInputValue(comboBox, 'item 1');
          comboBox.opened = false;
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
          setInputValue(comboBox, 'it');
          spyDataProvider.resetHistory();
          comboBox.cancel();
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

        it('should request pages asynchronously when scrolling', async () => {
          comboBox.dataProvider = spyDataProvider;
          spyDataProvider.resetHistory();
          comboBox._scrollIntoView(50);
          expect(spyDataProvider.called).to.be.false;
          await nextFrame();
          expect(spyDataProvider.calledOnce).to.be.true;
        });

        it('should render all visible items after delayed response', (done) => {
          const items = [...Array(10)].map((_, i) => `item ${i}`);
          comboBox.dataProvider = (params, callback) => {
            setTimeout(() => {
              callback(items, 10);
              setTimeout(() => {
                const renderedTexts = getAllItems(comboBox).map((item) => item.innerText);
                expect(renderedTexts).to.eql(items);
                done();
              });
            }, 50);
          };
          comboBox.open();
        });

        it('should rerender once loaded updated items', (done) => {
          comboBox.dataProvider = (_, callback) => {
            if (!comboBox.filteredItems.length) {
              // First batch of items for page 0
              callback(['foo'], 1);
              // Asynchronously clear the cache which leads to another request for page 0
              setTimeout(() => comboBox.clearCache());
            } else {
              // Second batch of items for page 0
              callback(['bar'], 1);

              setTimeout(() => {
                // Expect the renderer to have run for the updated items.
                expect(getViewportItems(comboBox)[0].textContent).to.equal('bar');

                // Avoid getting done called multiple times
                if (!done._called) {
                  done._called = true;
                  done();
                }
              });
            }
          };
          comboBox.open();
        });
      });

      describe('empty data set is loaded', () => {
        beforeEach(() => {
          comboBox.dataProvider = sinon.spy((_params, callback) => callback([], 0));
          comboBox.open();
          comboBox.close();
          comboBox.dataProvider.resetHistory();
        });

        it('should not request first page on open', () => {
          comboBox.open();
          expect(comboBox.dataProvider).to.be.not.called;
        });

        it('should request first page on open after increasing size property', () => {
          comboBox.size = SIZE;
          comboBox.open();
          expect(comboBox.dataProvider).to.be.calledOnce;
        });

        it('should request first page on open after clearing cache', () => {
          comboBox.clearCache();
          comboBox.open();
          expect(comboBox.dataProvider).to.be.calledOnce;
        });
      });

      describe('when selecting item', () => {
        beforeEach(() => {
          comboBox.dataProvider = spyDataProvider;
          comboBox.open();
        });

        it('should not be invoked', () => {
          spyDataProvider.resetHistory();
          clickItem(comboBox, 0);
          expect(comboBox.selectedItem).to.eql('item 0');
          expect(spyDataProvider.callCount).to.eql(0);
        });

        // FIXME: fails for combo-box-light (items are not updated)
        (isComboBoxLight ? it.skip : it)('should not be invoked if items are filtered', () => {
          setInputValue(comboBox, '1');

          spyDataProvider.resetHistory();

          clickItem(comboBox, 0);
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

        it('should be invoked with correct filter parameter', async () => {
          comboBox.dataProvider = spyAsyncDataProvider;
          setInputValue(comboBox, '1');
          // Wait for the async data provider to respond
          await aTimeout(0);
          expect(spyAsyncDataProvider.calledOnce).to.be.true;
          expect(spyAsyncDataProvider.firstCall.args[0].filter).to.equal('1');
        });

        it('should be invoked on open with pre-defined size', () => {
          comboBox.size = SIZE;
          comboBox.dataProvider = spyAsyncDataProvider;
          comboBox.opened = true;
          expect(spyAsyncDataProvider.calledOnce).to.be.true;
        });

        (window.innerHeight > 900 ? it.skip : it)('should request page 1 on scroll', async () => {
          comboBox.size = SIZE;
          comboBox.dataProvider = spyAsyncDataProvider;
          comboBox.opened = true;
          spyAsyncDataProvider.resetHistory();
          comboBox._scrollIntoView(75);
          await nextFrame();
          expect(spyAsyncDataProvider.called).to.be.true;
          const pages = spyAsyncDataProvider.getCalls().map((call) => call.args[0].page);
          expect(pages).to.contain(1);
        });

        (window.innerHeight > 900 ? it.skip : it)('should request page 2 on scroll', async () => {
          comboBox.size = SIZE;
          comboBox.dataProvider = spyAsyncDataProvider;
          comboBox.opened = true;
          spyAsyncDataProvider.resetHistory();
          comboBox._scrollIntoView(125);
          await nextFrame();
          expect(spyAsyncDataProvider.called).to.be.true;
          const pages = spyAsyncDataProvider.getCalls().map((call) => call.args[0].page);
          expect(pages).to.contain(2);
        });

        it('should not select placeholder items', () => {
          comboBox.size = SIZE;
          comboBox.dataProvider = spyAsyncDataProvider;
          comboBox.opened = true;
          const itemElement = getFirstItem(comboBox);
          expect(itemElement.item).to.be.instanceof(ComboBoxPlaceholder);
          itemElement.click();
          expect(comboBox.opened).to.equal(true);
          expect(comboBox.selectedItem).to.not.be.instanceOf(ComboBoxPlaceholder);
        });

        it('should set custom value on enter', () => {
          comboBox.allowCustomValue = true;
          comboBox.dataProvider = spyAsyncDataProvider;
          comboBox.opened = true;

          setInputValue(comboBox, 'custom value');

          enterKeyDown(comboBox.inputElement);
          expect(comboBox.value).to.eql('custom value');
        });

        it('should keep the focused item focused when loading more items', async () => {
          comboBox.size = SIZE;
          comboBox.dataProvider = spyAsyncDataProvider;
          comboBox.opened = true;
          // Wait for the async data provider to respond
          await aTimeout(0);

          arrowDownKeyDown(comboBox.inputElement);
          expect(getFocusedItemIndex(comboBox)).to.equal(0);

          comboBox._scrollIntoView(50);
          await nextFrame();
          // Wait for the async data provider to respond
          await aTimeout(0);

          comboBox._scrollIntoView(0);
          await nextFrame();
          expect(getFocusedItemIndex(comboBox)).to.equal(0);
        });

        it('should keep the focused item focused when loading more items including a selected item', async () => {
          comboBox.size = SIZE;
          comboBox.dataProvider = spyAsyncDataProvider;
          comboBox.value = 'item 50';
          comboBox.opened = true;
          // Wait for the async data provider to respond
          await aTimeout(0);
          expect(comboBox.selectedItem).to.not.exist;

          arrowDownKeyDown(comboBox.inputElement);
          expect(getFocusedItemIndex(comboBox)).to.equal(0);

          comboBox._scrollIntoView(50);
          await nextFrame();
          // Wait for the async data provider to respond
          await aTimeout(0);
          expect(comboBox.selectedItem).to.exist;

          comboBox._scrollIntoView(0);
          await nextFrame();
          expect(getFocusedItemIndex(comboBox)).to.equal(0);
        });

        it('should not jump back to focused item after scroll', async () => {
          comboBox.size = SIZE;
          comboBox.dataProvider = spyAsyncDataProvider;
          comboBox.opened = true;
          // Wait for the async data provider to respond
          await aTimeout(0);

          comboBox.value = 'item 8';
          comboBox.close();

          comboBox.opened = true;
          // Wait for the async data provider to respond
          await aTimeout(0);
          // Wait for items to render
          await nextFrame();
          comboBox._scrollIntoView(50);
          // Wait for the async data provider to respond
          await aTimeout(0);
          // Wait for the __loadingChanged observer
          await aTimeout(0);

          expect(comboBox._focusedIndex).to.equal(-1);
          const items = getViewportItems(comboBox);
          expect(items.some((item) => item.index === 50)).to.be.true;
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
          // The helper already excludes hidden items
          const visibleItems = getAllItems(comboBox);
          expect(visibleItems.map((item) => item.innerText)).to.eql(['baz']);
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
        expect(() => {
          comboBox.pageSize = 0;
        }).to.throw('pageSize');
        expect(comboBox.pageSize).to.equal(123);
      });

      it('should throw when set an invalid value', () => {
        comboBox.pageSize = 123;
        [undefined, null, NaN, 10.5, '10', -1].forEach((size) => {
          expect(() => {
            comboBox.pageSize = size;
          }).to.throw('pageSize');
        });
        expect(comboBox.pageSize).to.equal(123);
      });
    });

    describe('size', () => {
      it('should be undefined by default', () => {
        expect(comboBox.size).to.be.undefined;
      });

      it('should be undefined after setting dataProvider', () => {
        comboBox.dataProvider = spyDataProvider;
        expect(comboBox.size).to.be.undefined;
      });

      it('should be set from dataProvider callback', () => {
        comboBox.opened = true;
        comboBox.dataProvider = spyDataProvider;
        expect(comboBox.size).to.equal(SIZE);
      });

      it('should be 0 after dataProvider returns size 0', () => {
        comboBox.opened = true;
        comboBox.dataProvider = (params, callback) => callback([], 0);
        expect(comboBox.size).to.equal(0);
      });

      it('should keep previous value after dataProvider returns size undefined', () => {
        comboBox.opened = true;
        comboBox.dataProvider = spyDataProvider;
        expect(comboBox.size).to.equal(SIZE);
        comboBox.dataProvider = (params, callback) => callback([], undefined);
        expect(comboBox.size).to.equal(SIZE);
      });

      it('should not add items exceeding the size returned by dataProvider', () => {
        comboBox.dataProvider = (params, callback) => callback(['foo', 'bar'], 1);
        comboBox.opened = true;
        expect(comboBox.filteredItems).to.eql(['foo']);
      });

      it('should add items when dataProvider return size undefined', () => {
        comboBox.dataProvider = (params, callback) => callback(['foo', 'bar'], undefined);
        comboBox.opened = true;
        expect(comboBox.filteredItems).to.eql(['foo', 'bar']);
      });

      it('should remove extra filteredItems when decreasing size', () => {
        comboBox.dataProvider = (params, callback) => callback(['foo', 'bar'], 2);
        comboBox.open();

        comboBox.size = 1;
        expect(comboBox.filteredItems).to.eql(['foo']);
      });

      it('should not reset when dataProvider callback has undefined size', () => {
        comboBox.size = SIZE;
        comboBox.dataProvider = (params, callback) => {
          callback(allItems);
        };
        comboBox.opened = true;
        expect(comboBox.size).to.equal(SIZE);
      });

      it('should not show the loading on size change while pending the data provider', async () => {
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
        comboBox._scrollIntoView(45);
        await nextFrame();
        expect(comboBox.loading).to.be.false;
        comboBox._scrollIntoView(150);
        await nextFrame();
        // Fetching the page = 2 and stucking
        expect(comboBox.loading).to.be.true;
        // Updating the size means we don't need pending requests anymore,
        // and combo box should show no loading
        comboBox.size = 100;
        expect(comboBox.loading).to.be.false;
      });

      it('should not show the loading on fast scrolling and size update', async () => {
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
        comboBox._scrollIntoView(400);
        await nextFrame();
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
        comboBox.opened = true; // Loads first page of dataProvider items
        expect(comboBox.selectedItem).to.equal('item 0');
      });

      it('should set selectedItem matching value when items are loaded', () => {
        comboBox.opened = true; // Loads first page of dataProvider items
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
        comboBox.opened = true; // Loads first page of dataProvider items
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

        expect(getSelectedItem(comboBox)).to.be.null;
      });

      it('should set matching selectedItem when items are loaded', () => {
        comboBox.opened = true; // Loads first page of dataProvider items
        comboBox.value = 'value 0';
        expect(comboBox.selectedItem).to.eql({ id: 0, value: 'value 0', label: 'label 0' });
      });
    });

    describe('selectedItem (string items)', () => {
      beforeEach(() => {
        comboBox.dataProvider = asyncDataProvider;
      });

      it('should allow setting initial selectedItem', () => {
        comboBox.selectedItem = 'item 0';
        expect(comboBox.selectedItem).to.equal('item 0');
      });

      it('should assign selectedItem', () => {
        comboBox.selectedItem = 'item 0';
        expect(comboBox.value).to.equal('item 0');
      });

      describe('some items are loaded', () => {
        beforeEach(async () => {
          comboBox.opened = true;
          await aTimeout(0);
        });

        it('should render selectedItem as selected when setting it', () => {
          const loadedItem = 'item 0';
          comboBox.selectedItem = loadedItem;
          flushComboBox(comboBox);
          const items = getAllItems(comboBox).filter((itemEl) => itemEl.selected);
          expect(items).to.have.lengthOf(1);
          expect(items[0].item).to.deep.equal(loadedItem);
        });

        it('should render selectedItem as selected when setting it while loading more items', async () => {
          const alreadyLoadedItem = `item ${comboBox.pageSize - 1}`;

          scrollToIndex(comboBox, comboBox.pageSize - 1);
          await nextFrame();
          expect(comboBox.loading).to.be.true;

          comboBox.selectedItem = alreadyLoadedItem;
          flushComboBox(comboBox);

          const items = getAllItems(comboBox).filter((itemEl) => itemEl.selected);
          expect(items).to.have.lengthOf(1);
          expect(items[0].item).to.deep.equal(alreadyLoadedItem);
        });
      });
    });

    describe('selectedItem (object items)', () => {
      beforeEach(() => {
        comboBox.itemIdPath = 'id';
        comboBox.dataProvider = asyncObjectDataProvider;
      });

      it('should allow setting initial selectedItem', () => {
        comboBox.selectedItem = { id: 0, value: 'value 0', label: 'label 0' };
        expect(comboBox.selectedItem).to.eql({ id: 0, value: 'value 0', label: 'label 0' });
      });

      it('should assign selectedItem', () => {
        comboBox.selectedItem = { id: 0, value: 'value 0', label: 'label 0' };
        expect(comboBox.value).to.equal('value 0');
      });

      describe('some items are loaded', () => {
        beforeEach(async () => {
          comboBox.opened = true;
          await aTimeout(0);
        });

        it('should render selectedItem as selected when setting it', () => {
          const loadedItem = { id: 0, value: 'value 0', label: 'label 0' };
          comboBox.selectedItem = loadedItem;
          flushComboBox(comboBox);
          const items = getAllItems(comboBox).filter((itemEl) => itemEl.selected);
          expect(items).to.have.lengthOf(1);
          expect(items[0].item).to.deep.equal(loadedItem);
        });

        it('should render selectedItem as selected when setting it while loading more items', async () => {
          const alreadyLoadedItem = {
            id: comboBox.pageSize - 1,
            value: `value ${comboBox.pageSize - 1}`,
            label: `label ${comboBox.pageSize - 1}`,
          };

          scrollToIndex(comboBox, comboBox.pageSize - 1);
          await nextFrame();
          expect(comboBox.loading).to.be.true;

          comboBox.selectedItem = alreadyLoadedItem;
          flushComboBox(comboBox);

          const items = getAllItems(comboBox).filter((itemEl) => itemEl.selected);
          expect(items).to.have.lengthOf(1);
          expect(items[0].item).to.deep.equal(alreadyLoadedItem);
        });
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
        await nextFrame();
        const selectedRenderedItemElements = getAllItems(comboBox).filter((itemEl) => itemEl.selected);
        // Doesn't work when run on SauceLabs, work locally
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
              size,
            ),
          );
        };
        comboBox.opened = true;
        await nextFrame();
        const selectedRenderedItemElements = getAllItems(comboBox).filter((itemEl) => itemEl.selected);
        // Doesn't work when run on SauceLabs, work locally
        // expect(selectedRenderedItemElements).to.have.lengthOf(1);
        expect(selectedRenderedItemElements[0].item).to.eql({
          id: 0,
          value: 'value 0',
          label: 'label 0',
          db: { key: '#0' },
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

        it('should be scrolled to start on reopen', async () => {
          comboBox.dataProvider = spyAsyncDataProvider;
          comboBox.size = SIZE;
          comboBox.opened = false;

          // Wait for the async data provider to respond
          await aTimeout(0);

          // Reopen
          comboBox.open();
          await nextFrame();

          expect(getViewportItems(comboBox)[0].index).to.eql(0);
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

        it('should request first page on reopen', () => {
          comboBox.clearCache();
          comboBox.opened = true;
          expect(spyDataProvider).to.be.calledOnce;
          const params = spyDataProvider.firstCall.args[0];
          expect(params.page).to.equal(0);
        });

        it('should request page 1 on scroll after reopen', async () => {
          comboBox.clearCache();
          comboBox.opened = true;
          comboBox._scrollIntoView(75);
          await nextFrame();
          expect(spyDataProvider.called).to.be.true;
          const pages = spyDataProvider.getCalls().map((call) => call.args[0].page);
          expect(pages).to.contain(1);
        });

        it('should reset visible items count to 0', () => {
          expect(getVisibleItemsCount(comboBox)).to.equal(0);
        });
      });

      describe('using data provider, lost focus before data is returned', () => {
        let returnedItems;

        const bluringDataProvider = (params, callback) => {
          comboBox.inputElement.blur();
          callback(returnedItems, returnedItems.length);
        };

        beforeEach(() => {
          returnedItems = ['item 12'];
          comboBox.focus();
          comboBox.opened = true;
          comboBox.dataProvider = bluringDataProvider;
          comboBox.opened = false;
          comboBox.inputElement.focus();
        });

        it('should set value without auto-open-disabled', () => {
          comboBox.autoOpenDisabled = false;
          expect(comboBox.autoOpenDisabled).to.be.false;

          setInputValue(comboBox, 'item 12');

          expect(comboBox.opened).to.be.false;
          expect(comboBox.hasAttribute('focused')).to.be.false;
          expect(comboBox.value).to.equal('item 12');
        });

        it('should set value with auto-open-disabled', () => {
          comboBox.autoOpenDisabled = true;
          expect(comboBox.autoOpenDisabled).to.be.true;

          setInputValue(comboBox, 'item 12');

          expect(comboBox.opened).to.be.false;
          expect(comboBox.hasAttribute('focused')).to.be.false;
          expect(comboBox.value).to.equal('item 12');
        });

        it('should set value without auto-open-disabled even if case does not match', () => {
          comboBox.autoOpenDisabled = false;
          expect(comboBox.autoOpenDisabled).to.be.false;

          setInputValue(comboBox, 'ItEm 12');

          expect(comboBox.opened).to.be.false;
          expect(comboBox.hasAttribute('focused')).to.be.false;
          expect(comboBox.value).to.equal('item 12');
        });

        it('should set value with auto-open-disabled even if case does not match', () => {
          comboBox.autoOpenDisabled = true;
          expect(comboBox.autoOpenDisabled).to.be.true;

          setInputValue(comboBox, 'iTem 12');

          expect(comboBox.opened).to.be.false;
          expect(comboBox.hasAttribute('focused')).to.be.false;
          expect(comboBox.value).to.equal('item 12');
        });

        it('should set first value of multiple matches that differ only in case', () => {
          returnedItems = ['item 12', 'IteM 12'];

          setInputValue(comboBox, 'IteM 12');

          expect(comboBox.opened).to.be.false;
          expect(comboBox.hasAttribute('focused')).to.be.false;
          expect(comboBox.value).to.equal('item 12');
        });

        it('should keep empty value if it is not an exact match', () => {
          setInputValue(comboBox, 'item');
          expect(comboBox.opened).to.be.false;
          expect(comboBox.hasAttribute('focused')).to.be.false;
          expect(comboBox.value).to.equal('');
        });

        it('should keep previous value if it is not an exact match', () => {
          comboBox.filteredItems = ['other value', 'item 12'];
          comboBox.value = 'other value';
          expect(comboBox.value).to.equal('other value');

          returnedItems = ['item 12'];
          setInputValue(comboBox, 'item 1');

          expect(comboBox.opened).to.be.false;
          expect(comboBox.hasAttribute('focused')).to.be.false;
          expect(comboBox.value).to.equal('other value');
        });
      });
    });

    describe('dropdown behaviour', () => {
      let openedSpy;

      beforeEach(() => {
        comboBox.dataProvider = spyDataProvider;
        comboBox.opened = true;
        spyDataProvider.resetHistory();

        openedSpy = sinon.spy();
        comboBox.addEventListener('vaadin-combo-box-dropdown-opened', openedSpy);
      });

      it('should not toggle between opened and closed when filtering', () => {
        // Filter for something that should return results
        comboBox.filter = 'item';
        // Verify data provider has been called
        expect(spyDataProvider.calledOnce).to.be.true;
        // Dropdown should not have been closed and re-opened
        expect(openedSpy.called).to.be.false;
      });

      it('should not toggle between opened and closed when setting a value', () => {
        // Filter for something that should return results
        comboBox.filter = 'item';
        // Set a value
        comboBox.value = 'item 1';
        // Dropdown should not have been closed and re-opened
        expect(openedSpy.called).to.be.false;
      });

      it('should close when there are no items', () => {
        // Filter for something that doesn't exist
        comboBox.filter = 'doesnotexist';
        // Verify data provider has been called
        expect(spyDataProvider.calledOnce).to.be.true;
        // Dropdown should close
        expect(comboBox.$.overlay.opened).to.be.false;
      });
    });
  };

  describe('combo-box', () => {
    beforeEach(async () => {
      comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
      await nextRender();
    });

    describeLazyLoading();
  });

  describe('combo-box-light', () => {
    beforeEach(async () => {
      comboBox = fixtureSync(`
        <vaadin-combo-box-light>
          <vaadin-text-field></vaadin-text-field>
        </vaadin-combo-box-light>
      `);
      await nextRender();
    });

    isComboBoxLight = true;

    describeLazyLoading();
  });
});

import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-multi-select-combo-box.js';
import { ComboBoxPlaceholder } from '@vaadin/combo-box/src/vaadin-combo-box-placeholder.js';
import { getDataProvider, getSelectAllButton, setInputValue } from './helpers.js';

describe('select all with data provider', () => {
  let comboBox, inputElement, handler, changeSpy;

  const getSelectAllText = () => getSelectAllButton(comboBox).shadowRoot.textContent.trim();

  const clickButton = () => getSelectAllButton(comboBox).click();

  const createDeferred = () => {
    let resolve;
    const promise = new Promise((r) => {
      resolve = r;
    });
    return { promise, resolve };
  };

  beforeEach(() => {
    handler = sinon.spy(() => Promise.resolve());
    changeSpy = sinon.spy();
  });

  describe('with _allSelected', () => {
    let pendingRequests;

    const flushDataProvider = () => {
      pendingRequests.forEach((request) => request());
      pendingRequests = [];
    };

    beforeEach(async () => {
      const items = Array.from({ length: 100 }, (_, i) => `Item ${i}`);
      const dataProvider = getDataProvider(items);
      pendingRequests = [];

      comboBox = fixtureSync(
        `<vaadin-multi-select-combo-box select-all-button-visible></vaadin-multi-select-combo-box>`,
      );
      comboBox.pageSize = 10;
      comboBox.dataProvider = (params, callback) => {
        pendingRequests.push(() => dataProvider(params, callback));
      };
      comboBox.addEventListener('change', changeSpy);
      comboBox._toggleSelectAllHandler = handler;
      comboBox._allSelected = false;
      await nextRender();
      inputElement = comboBox.inputElement;
      comboBox.opened = true;
      flushDataProvider();
      await nextRender();
    });

    describe('button', () => {
      it('should render the button while the handler is set', () => {
        expect(getSelectAllButton(comboBox)).to.be.ok;

        comboBox._toggleSelectAllHandler = null;
        expect(getSelectAllButton(comboBox)).to.be.null;
      });

      it('should hide the button while the filtered items are loading', async () => {
        setInputValue(comboBox, 'Item 1');
        await nextRender();
        expect(getSelectAllButton(comboBox)).to.be.null;

        flushDataProvider();
        await nextRender();
        expect(getSelectAllButton(comboBox)).to.be.ok;
      });
    });

    describe('label', () => {
      it('should use _allSelected to compute the label', () => {
        expect(getSelectAllText()).to.equal('Select All');

        comboBox._allSelected = true;
        expect(getSelectAllText()).to.equal('Deselect All');
      });

      it('should use filtered labels when a filter is set', async () => {
        setInputValue(comboBox, 'Item 1');
        flushDataProvider();
        await nextRender();
        expect(getSelectAllText()).to.equal('Select Filtered');

        comboBox._allSelected = true;
        expect(getSelectAllText()).to.equal('Deselect Filtered');
      });

      it('should not compute the label from the loaded pages', async () => {
        // Only the first page is loaded and all of it is selected, but the
        // server says that not all items are selected
        comboBox.selectedItems = Array.from({ length: 10 }, (_, i) => `Item ${i}`);
        await nextRender();
        expect(getSelectAllText()).to.equal('Select All');
      });
    });

    describe('toggle', () => {
      it('should call the handler on click without changing the selection', () => {
        clickButton();
        expect(handler).to.be.calledOnce;
        expect(comboBox.selectedItems).to.deep.equal([]);
        expect(changeSpy).to.not.be.called;
      });

      it('should call the handler on Enter without changing the selection', async () => {
        inputElement.focus();
        await sendKeys({ press: 'ArrowDown' });
        await sendKeys({ press: 'Enter' });
        expect(handler).to.be.calledOnce;
        expect(comboBox.selectedItems).to.deep.equal([]);
        expect(changeSpy).to.not.be.called;
      });
    });

    describe('announcements', () => {
      let clock, region, consoleError;

      beforeEach(() => {
        region = document.querySelector('[aria-live]');
        clock = sinon.useFakeTimers({ shouldClearNativeTimers: true });
        region.textContent = '';
        consoleError = sinon.stub(console, 'error');
      });

      afterEach(() => {
        clock.restore();
        consoleError.restore();
      });

      it('should announce the total after the handler resolves', async () => {
        const deferred = createDeferred();
        comboBox._toggleSelectAllHandler = () => deferred.promise;

        clickButton();
        await clock.tickAsync(150);
        expect(region.textContent).to.equal('');

        comboBox.selectedItems = ['Item 0', 'Item 1', 'Item 2', 'Item 3'];
        deferred.resolve();
        await clock.tickAsync(150);
        expect(region.textContent).to.equal('4 items selected');
      });

      it('should announce cleared selection after the handler resolves', async () => {
        comboBox.selectedItems = ['Item 0', 'Item 1', 'Item 2', 'Item 3'];
        comboBox._toggleSelectAllHandler = () => {
          comboBox.selectedItems = [];
          return Promise.resolve();
        };

        clickButton();
        await clock.tickAsync(150);
        expect(region.textContent).to.equal('Selection cleared');
      });

      it('should not announce when the handler rejects', async () => {
        comboBox._toggleSelectAllHandler = () => Promise.reject(new Error('failed'));

        clickButton();
        await clock.tickAsync(150);
        expect(region.textContent).to.equal('');
      });
    });

    describe('errors', () => {
      let consoleError;

      beforeEach(() => {
        consoleError = sinon.stub(console, 'error');
      });

      afterEach(() => {
        consoleError.restore();
      });

      it('should log an error when the handler rejects', async () => {
        comboBox._toggleSelectAllHandler = () => Promise.reject(new Error('failed'));
        clickButton();
        await nextRender();
        expect(consoleError).to.be.calledOnce;
      });

      it('should log an error when the handler throws', async () => {
        comboBox._toggleSelectAllHandler = () => {
          throw new Error('failed');
        };
        clickButton();
        await nextRender();
        expect(consoleError).to.be.calledOnce;
      });
    });
  });

  describe('without _allSelected', () => {
    let pendingRequests;

    const flushDataProvider = () => {
      pendingRequests.forEach((request) => request());
      pendingRequests = [];
    };

    beforeEach(async () => {
      // All items fit in one page, like with client-side filtering in Flow.
      // The server does not set `_allSelected` in that case.
      const dataProvider = getDataProvider(['Apple', 'Banana', 'Lemon', 'Orange']);
      pendingRequests = [];

      comboBox = fixtureSync(
        `<vaadin-multi-select-combo-box select-all-button-visible></vaadin-multi-select-combo-box>`,
      );
      comboBox.dataProvider = (params, callback) => {
        pendingRequests.push(() => dataProvider(params, callback));
      };
      comboBox.addEventListener('change', changeSpy);
      comboBox._toggleSelectAllHandler = handler;
      await nextRender();
      comboBox.opened = true;
      flushDataProvider();
      await nextRender();
    });

    it('should compute the label from the filtered items', async () => {
      expect(getSelectAllText()).to.equal('Select All');

      comboBox.selectedItems = ['Apple', 'Banana', 'Lemon', 'Orange'];
      await nextRender();
      expect(getSelectAllText()).to.equal('Deselect All');
    });

    it('should toggle the selection locally and fire change', () => {
      clickButton();
      expect(comboBox.selectedItems).to.deep.equal(['Apple', 'Banana', 'Lemon', 'Orange']);
      expect(changeSpy).to.be.calledOnce;
      expect(handler).to.not.be.called;
    });

    it('should not select placeholders while the items are refreshed', () => {
      // Mimic the Flow connector, which replaces the loaded items with
      // placeholders in place until the new data arrives
      const filteredItems = comboBox.filteredItems;
      for (let i = 0; i < filteredItems.length; i++) {
        filteredItems[i] = new ComboBoxPlaceholder();
      }

      clickButton();
      expect(comboBox.selectedItems).to.deep.equal([]);
    });

    it('should switch to the state from the server once it is set', () => {
      comboBox._allSelected = true;
      expect(getSelectAllText()).to.equal('Deselect All');

      clickButton();
      expect(handler).to.be.calledOnce;
      expect(comboBox.selectedItems).to.deep.equal([]);
    });
  });

  describe('with items', () => {
    beforeEach(async () => {
      comboBox = fixtureSync(
        `<vaadin-multi-select-combo-box select-all-button-visible></vaadin-multi-select-combo-box>`,
      );
      comboBox.items = ['Apple', 'Banana', 'Lemon', 'Orange'];
      comboBox.addEventListener('change', changeSpy);
      comboBox._toggleSelectAllHandler = handler;
      await nextRender();
      comboBox.opened = true;
      await nextRender();
    });

    it('should ignore the handler when computing selection state', async () => {
      comboBox._allSelected = false;
      comboBox.selectedItems = ['Apple', 'Banana', 'Lemon', 'Orange'];
      await nextRender();
      expect(getSelectAllText()).to.equal('Deselect All');
    });

    it('should toggle the selection locally', () => {
      clickButton();
      expect(comboBox.selectedItems).to.deep.equal(['Apple', 'Banana', 'Lemon', 'Orange']);
      expect(changeSpy).to.be.calledOnce;
      expect(handler).to.not.be.called;
    });

    it('should render the button without the handler', () => {
      comboBox._toggleSelectAllHandler = null;
      expect(getSelectAllButton(comboBox)).to.be.ok;
    });
  });
});

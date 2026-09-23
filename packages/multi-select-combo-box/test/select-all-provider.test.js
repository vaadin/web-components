import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-multi-select-combo-box.js';
import { getDataProvider, getSelectAllButton, setInputValue } from './helpers.js';

describe('select all provider', () => {
  let comboBox, inputElement, provider, changeSpy;

  const getSelectAllText = () => getSelectAllButton(comboBox).shadowRoot.textContent.trim();

  const clickButton = () => getSelectAllButton(comboBox).click();

  const createProvider = () => {
    const result = {
      allSelected: false,
      isAllSelected: sinon.spy(() => result.allSelected),
      toggleSelectAll: sinon.spy(() => Promise.resolve()),
    };
    return result;
  };

  const createDeferred = () => {
    let resolve;
    const promise = new Promise((r) => {
      resolve = r;
    });
    return { promise, resolve };
  };

  beforeEach(() => {
    provider = createProvider();
    changeSpy = sinon.spy();
  });

  describe('data provider', () => {
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
      comboBox._selectAllProvider = provider;
      await nextRender();
      inputElement = comboBox.inputElement;
      comboBox.opened = true;
      flushDataProvider();
      await nextRender();
    });

    describe('button', () => {
      it('should render the button while the provider is set', () => {
        expect(getSelectAllButton(comboBox)).to.be.ok;

        comboBox._selectAllProvider = null;
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
      it('should use provider.isAllSelected result to compute the label', async () => {
        expect(getSelectAllText()).to.equal('Select All');

        provider.allSelected = true;
        comboBox.selectedItems = ['Item 0'];
        await nextRender();
        expect(getSelectAllText()).to.equal('Deselect All');
      });

      it('should use filtered labels when a filter is set', async () => {
        setInputValue(comboBox, 'Item 1');
        flushDataProvider();
        await nextRender();
        expect(getSelectAllText()).to.equal('Select Filtered');

        provider.allSelected = true;
        comboBox.selectedItems = ['Item 1'];
        await nextRender();
        expect(getSelectAllText()).to.equal('Deselect Filtered');
      });

      it('should update the label when requesting a select all update', () => {
        provider.allSelected = true;
        comboBox._requestSelectAllUpdate();
        expect(getSelectAllText()).to.equal('Deselect All');
      });
    });

    describe('isAllSelected', () => {
      beforeEach(() => {
        provider.isAllSelected.resetHistory();
      });

      it('should query isAllSelected when selectedItems change', async () => {
        comboBox.selectedItems = ['Item 0'];
        await nextRender();
        expect(provider.isAllSelected).to.be.calledOnce;
      });

      it('should query isAllSelected once the filtered items are loaded', async () => {
        setInputValue(comboBox, 'Item 1');
        await nextRender();
        expect(provider.isAllSelected).to.not.be.called;

        flushDataProvider();
        await nextRender();
        expect(provider.isAllSelected).to.be.calledOnce;
      });

      it('should not query isAllSelected on keyboard navigation', async () => {
        inputElement.focus();
        await sendKeys({ press: 'ArrowDown' });
        await sendKeys({ press: 'ArrowDown' });
        expect(provider.isAllSelected).to.not.be.called;
      });
    });

    describe('toggleSelectAll', () => {
      it('should call toggleSelectAll on click without changing the selection', () => {
        clickButton();
        expect(provider.toggleSelectAll).to.be.calledOnce;
        expect(comboBox.selectedItems).to.deep.equal([]);
        expect(changeSpy).to.not.be.called;
      });

      it('should call toggleSelectAll on Enter without changing the selection', async () => {
        inputElement.focus();
        await sendKeys({ press: 'ArrowDown' });
        await sendKeys({ press: 'Enter' });
        expect(provider.toggleSelectAll).to.be.calledOnce;
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

      it('should announce the total after toggleSelectAll resolves', async () => {
        const deferred = createDeferred();
        provider.toggleSelectAll = () => deferred.promise;

        clickButton();
        await clock.tickAsync(150);
        expect(region.textContent).to.equal('');

        comboBox.selectedItems = ['Item 0', 'Item 1', 'Item 2', 'Item 3'];
        deferred.resolve();
        await clock.tickAsync(150);
        expect(region.textContent).to.equal('4 items selected');
      });

      it('should announce cleared selection after toggleSelectAll resolves', async () => {
        comboBox.selectedItems = ['Item 0', 'Item 1', 'Item 2', 'Item 3'];
        provider.toggleSelectAll = () => {
          comboBox.selectedItems = [];
          return Promise.resolve();
        };

        clickButton();
        await clock.tickAsync(150);
        expect(region.textContent).to.equal('Selection cleared');
      });

      it('should not announce when toggleSelectAll rejects', async () => {
        provider.toggleSelectAll = () => Promise.reject(new Error('failed'));

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

      it('should log an error when toggleSelectAll rejects', async () => {
        provider.toggleSelectAll = () => Promise.reject(new Error('failed'));
        clickButton();
        await nextRender();
        expect(consoleError).to.be.calledOnce;
      });

      it('should log an error when toggleSelectAll throws', async () => {
        provider.toggleSelectAll = () => {
          throw new Error('failed');
        };
        clickButton();
        await nextRender();
        expect(consoleError).to.be.calledOnce;
      });

      it('should log an error and use the select label when isAllSelected throws', async () => {
        provider.isAllSelected = () => {
          throw new Error('failed');
        };
        comboBox.selectedItems = ['Item 0'];
        await nextRender();
        expect(consoleError).to.be.calledOnce;
        expect(getSelectAllText()).to.equal('Select All');

        provider.isAllSelected = () => true;
        comboBox._requestSelectAllUpdate();
        expect(getSelectAllText()).to.equal('Deselect All');
      });
    });
  });

  describe('items', () => {
    beforeEach(async () => {
      comboBox = fixtureSync(
        `<vaadin-multi-select-combo-box select-all-button-visible></vaadin-multi-select-combo-box>`,
      );
      comboBox.items = ['Apple', 'Banana', 'Lemon', 'Orange'];
      comboBox.addEventListener('change', changeSpy);
      comboBox._selectAllProvider = provider;
      await nextRender();
      comboBox.opened = true;
      await nextRender();
    });

    it('should ignore the provider when computing selection state', async () => {
      comboBox.selectedItems = ['Apple', 'Banana', 'Lemon', 'Orange'];
      await nextRender();
      expect(getSelectAllText()).to.equal('Deselect All');
      expect(provider.isAllSelected).to.not.be.called;
    });

    it('should toggle the selection locally', () => {
      clickButton();
      expect(comboBox.selectedItems).to.deep.equal(['Apple', 'Banana', 'Lemon', 'Orange']);
      expect(changeSpy).to.be.calledOnce;
      expect(provider.toggleSelectAll).to.not.be.called;
    });

    it('should render the button without the provider', () => {
      comboBox._selectAllProvider = null;
      expect(getSelectAllButton(comboBox)).to.be.ok;
    });
  });
});

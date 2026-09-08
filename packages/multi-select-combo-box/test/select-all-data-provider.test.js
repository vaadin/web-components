import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-multi-select-combo-box.js';
import { getAsyncDataProvider, getDataProvider, getSelectAllButton, setInputValue } from './helpers.js';

describe('select all with data provider', () => {
  let comboBox, changeSpy;

  const getLabel = () => getSelectAllButton(comboBox).textContent.trim();

  const clickButton = () => getSelectAllButton(comboBox).click();

  /** Opens the overlay and waits for the state received from the provider to be rendered. */
  const open = async () => {
    comboBox.opened = true;
    await nextRender();
  };

  /** Waits for the component to ask the provider for the state, which happens after a microtask. */
  const untilProviderAsked = () => Promise.resolve();

  /**
   * Creates a provider that answers state requests synchronously with the
   * given result, and records calls to both functions.
   */
  const createProvider = (allSelected = false) => ({
    isAllSelected: sinon.spy(() => allSelected),
    setAllSelected: sinon.spy(),
  });

  beforeEach(async () => {
    comboBox = fixtureSync(`<vaadin-multi-select-combo-box select-all-button-visible></vaadin-multi-select-combo-box>`);
    await nextRender();
    changeSpy = sinon.spy();
    comboBox.addEventListener('change', changeSpy);
  });

  describe('single page', () => {
    const items = ['Apple', 'Banana', 'Lemon', 'Orange'];
    let provider;

    beforeEach(() => {
      comboBox.dataProvider = getDataProvider(items);
      provider = createProvider();
      comboBox.selectAllProvider = provider;
    });

    it('should not render button before items are loaded', () => {
      expect(getSelectAllButton(comboBox)).to.be.null;
    });

    it('should render button once the items are loaded', () => {
      comboBox.opened = true;
      expect(getSelectAllButton(comboBox)).to.be.ok;
    });

    it('should compute the label from the loaded items', () => {
      comboBox.selectedItems = [...items];
      comboBox.opened = true;
      expect(getLabel()).to.equal('Deselect all');
    });

    it('should not ask the provider for the state', async () => {
      comboBox.opened = true;
      comboBox.selectedItems = [...items];
      setInputValue(comboBox, 'an');
      await nextRender();
      expect(provider.isAllSelected).to.not.be.called;
    });

    it('should select all items without calling the provider', () => {
      comboBox.opened = true;
      clickButton();
      expect(comboBox.selectedItems).to.deep.equal(items);
      expect(provider.setAllSelected).to.not.be.called;
      expect(changeSpy).to.be.calledOnce;
    });

    it('should deselect all items without calling the provider', () => {
      comboBox.selectedItems = [...items];
      comboBox.opened = true;
      clickButton();
      expect(comboBox.selectedItems).to.deep.equal([]);
      expect(provider.setAllSelected).to.not.be.called;
    });

    it('should select only filtered items', () => {
      comboBox.opened = true;
      setInputValue(comboBox, 'an');
      clickButton();
      expect(comboBox.selectedItems).to.deep.equal(['Banana', 'Orange']);
    });
  });

  describe('multiple pages', () => {
    const items = Array.from({ length: 100 }, (_, i) => `Item ${i}`);

    beforeEach(() => {
      comboBox.pageSize = 10;
      comboBox.dataProvider = getDataProvider(items);
    });

    describe('provider', () => {
      beforeEach(() => {
        comboBox.opened = true;
      });

      it('should not render button when selectAllProvider is not set', () => {
        expect(getSelectAllButton(comboBox)).to.be.null;
      });

      it('should not render button when the provider does not implement isAllSelected', () => {
        comboBox.selectAllProvider = { setAllSelected: () => {} };
        expect(getSelectAllButton(comboBox)).to.be.null;
      });

      it('should not render button when the provider does not implement setAllSelected', () => {
        comboBox.selectAllProvider = { isAllSelected: () => false };
        expect(getSelectAllButton(comboBox)).to.be.null;
      });

      it('should render button once the provider has returned the state', async () => {
        comboBox.selectAllProvider = createProvider();
        expect(getSelectAllButton(comboBox)).to.be.null;
        await nextRender();
        expect(getSelectAllButton(comboBox)).to.be.ok;
      });

      it('should not render button when the provider returns undefined', () => {
        comboBox.selectAllProvider = { isAllSelected: () => undefined, setAllSelected: () => {} };
        expect(getSelectAllButton(comboBox)).to.be.null;
      });

      it('should not render button when the provider returns null', () => {
        comboBox.selectAllProvider = { isAllSelected: () => null, setAllSelected: () => {} };
        expect(getSelectAllButton(comboBox)).to.be.null;
      });

      it('should remove button when the provider is cleared', async () => {
        comboBox.selectAllProvider = createProvider();
        await nextRender();
        comboBox.selectAllProvider = null;
        expect(getSelectAllButton(comboBox)).to.be.null;
      });
    });

    describe('state', () => {
      let provider;

      beforeEach(() => {
        provider = createProvider();
        comboBox.selectAllProvider = provider;
      });

      it('should not ask the provider while closed', async () => {
        await nextRender();
        expect(provider.isAllSelected).to.not.be.called;
      });

      it('should ask the provider once the items are loaded', async () => {
        comboBox.opened = true;
        await untilProviderAsked();
        expect(provider.isAllSelected).to.be.calledOnce;
        expect(provider.isAllSelected.firstCall.args[0]).to.deep.equal({ filter: '' });
      });

      it('should use selectAll label when not all items are selected', async () => {
        await open();
        expect(getLabel()).to.equal('Select all');
      });

      it('should use deselectAll label when all items are selected', async () => {
        comboBox.selectAllProvider = createProvider(true);
        await open();
        expect(getLabel()).to.equal('Deselect all');
      });

      it('should not ask the provider again while nothing has changed', async () => {
        await open();
        comboBox.requestUpdate();
        await nextRender();
        expect(provider.isAllSelected).to.be.calledOnce;
      });

      it('should ask the provider again with the new filter once its items are loaded', async () => {
        await open();
        setInputValue(comboBox, '1');
        await untilProviderAsked();
        expect(provider.isAllSelected).to.be.calledTwice;
        expect(provider.isAllSelected.lastCall.args[0]).to.deep.equal({ filter: '1' });
      });

      it('should use filtered labels when a filter is set', async () => {
        await open();
        setInputValue(comboBox, 'Item');
        await nextRender();
        expect(getLabel()).to.equal('Select filtered');

        comboBox.selectAllProvider = createProvider(true);
        await nextRender();
        expect(getLabel()).to.equal('Deselect filtered');
      });

      it('should ask the provider again when selected items change', async () => {
        await open();
        comboBox.selectedItems = ['Item 0'];
        await untilProviderAsked();
        expect(provider.isAllSelected).to.be.calledTwice;
      });

      it('should ask the provider again when the provider changes', async () => {
        await open();
        const otherProvider = createProvider(true);
        comboBox.selectAllProvider = otherProvider;
        await untilProviderAsked();
        expect(otherProvider.isAllSelected).to.be.calledOnce;
        await nextRender();
        expect(getLabel()).to.equal('Deselect all');
      });

      it('should ask the provider again when the number of items changes', async () => {
        await open();
        comboBox.dataProvider = getDataProvider(items.slice(0, 50));
        await untilProviderAsked();
        expect(provider.isAllSelected).to.be.calledTwice;
      });

      it('should not ask the provider for a selection change while closed', async () => {
        await open();
        comboBox.opened = false;
        comboBox.selectedItems = ['Item 0'];
        await nextRender();
        expect(provider.isAllSelected).to.be.calledOnce;
      });

      it('should ask the provider when opened after a selection change', async () => {
        await open();
        comboBox.opened = false;
        comboBox.selectedItems = ['Item 0'];
        comboBox.opened = true;
        await untilProviderAsked();
        expect(provider.isAllSelected).to.be.calledTwice;
      });

      it('should not ask the provider when loading another page', async () => {
        await open();
        comboBox.__dataProviderController.ensureFlatIndexLoaded(50);
        expect(comboBox.filteredItems.filter((item) => typeof item === 'string').length).to.be.above(10);
        await nextRender();
        expect(provider.isAllSelected).to.be.calledOnce;
      });

      it('should compute the state locally when all filtered items are loaded', async () => {
        await open();
        comboBox.selectedItems = ['Item 99'];
        setInputValue(comboBox, '99');
        expect(getLabel()).to.equal('Deselect filtered');
        await nextRender();
        expect(provider.isAllSelected).to.not.be.calledWithMatch({ filter: '99' });
      });

      it('should switch back to the provider when the filter is widened', async () => {
        await open();
        comboBox.selectedItems = ['Item 99'];
        setInputValue(comboBox, '99');
        setInputValue(comboBox, '');
        await nextRender();
        expect(getLabel()).to.equal('Select all');
      });

      it('should not render the button when readonly', () => {
        comboBox.readonly = true;
        comboBox.opened = true;
        expect(getSelectAllButton(comboBox)).to.be.null;
      });
    });

    describe('async state', () => {
      let provider, resolveState, rejectState;

      beforeEach(async () => {
        provider = {
          isAllSelected: sinon.spy(() => {
            return new Promise((resolve, reject) => {
              resolveState = resolve;
              rejectState = reject;
            });
          }),
          setAllSelected: sinon.spy(),
        };
        comboBox.selectAllProvider = provider;
        comboBox.opened = true;
        await untilProviderAsked();
      });

      it('should not render button before the first state is received', () => {
        expect(getSelectAllButton(comboBox)).to.be.null;
      });

      it('should render button once the state is received', async () => {
        resolveState(true);
        await nextRender();
        expect(getLabel()).to.equal('Deselect all');
      });

      it('should keep the previous label while waiting for the state', async () => {
        resolveState(true);
        await nextRender();
        setInputValue(comboBox, '1');
        expect(getLabel()).to.equal('Deselect filtered');
      });

      it('should ignore clicks while waiting for the state', async () => {
        resolveState(false);
        await nextRender();
        comboBox.selectedItems = ['Item 0'];
        clickButton();
        expect(provider.setAllSelected).to.not.be.called;
      });

      it('should set aria-disabled on the button while waiting for the state', async () => {
        resolveState(false);
        await nextRender();
        expect(getSelectAllButton(comboBox).hasAttribute('aria-disabled')).to.be.false;

        comboBox.selectedItems = ['Item 0'];
        expect(getSelectAllButton(comboBox).getAttribute('aria-disabled')).to.equal('true');

        resolveState(false);
        await nextRender();
        expect(getSelectAllButton(comboBox).hasAttribute('aria-disabled')).to.be.false;
      });

      it('should hide the button when the provider resolves to undefined', async () => {
        resolveState(false);
        await nextRender();
        comboBox.selectedItems = ['Item 0'];
        resolveState(undefined);
        await nextRender();
        expect(getSelectAllButton(comboBox)).to.be.null;
      });

      it('should ask the provider again when the selection changes while a request is pending', async () => {
        comboBox.selectedItems = ['Item 0'];
        await untilProviderAsked();
        expect(provider.isAllSelected).to.be.calledTwice;
      });

      it('should ignore an outdated result and ask again', async () => {
        const resolveOutdated = resolveState;
        comboBox.selectedItems = ['Item 0'];
        await untilProviderAsked();
        resolveOutdated(true);
        await nextRender();
        expect(getSelectAllButton(comboBox)).to.be.null;
        expect(provider.isAllSelected).to.be.calledTwice;

        resolveState(false);
        await nextRender();
        expect(getLabel()).to.equal('Select all');
      });

      it('should not ask again after the provider rejects until something changes', async () => {
        rejectState(new Error('failed'));
        await nextRender();
        comboBox.requestUpdate();
        await nextRender();
        expect(provider.isAllSelected).to.be.calledOnce;
        expect(getSelectAllButton(comboBox)).to.be.null;

        comboBox.selectedItems = ['Item 0'];
        await untilProviderAsked();
        expect(provider.isAllSelected).to.be.calledTwice;
      });

      it('should handle the provider throwing synchronously', async () => {
        comboBox.selectAllProvider = {
          isAllSelected: sinon.spy(() => {
            throw new Error('failed');
          }),
          setAllSelected: () => {},
        };
        await nextRender();
        expect(getSelectAllButton(comboBox)).to.be.null;
        comboBox.selectedItems = ['Item 0'];
        await untilProviderAsked();
        expect(comboBox.selectAllProvider.isAllSelected).to.be.calledTwice;
      });
    });

    describe('clicking', () => {
      let provider;

      beforeEach(async () => {
        provider = createProvider();
        comboBox.selectAllProvider = provider;
        await open();
      });

      it('should call setAllSelected with filter and selected', () => {
        clickButton();
        expect(provider.setAllSelected).to.be.calledOnce;
        expect(provider.setAllSelected.firstCall.args[0]).to.deep.equal({ filter: '', selected: true });
      });

      it('should call setAllSelected with the current filter', async () => {
        setInputValue(comboBox, 'Item');
        await nextRender();
        clickButton();
        expect(provider.setAllSelected.firstCall.args[0]).to.deep.equal({ filter: 'Item', selected: true });
      });

      it('should call setAllSelected with selected set to false when all items are selected', async () => {
        comboBox.selectAllProvider = createProvider(true);
        await nextRender();
        clickButton();
        expect(comboBox.selectAllProvider.setAllSelected.firstCall.args[0]).to.deep.equal({
          filter: '',
          selected: false,
        });
      });

      it('should not change selected items', () => {
        clickButton();
        expect(comboBox.selectedItems).to.deep.equal([]);
      });

      it('should not fire change event', () => {
        clickButton();
        expect(changeSpy).to.not.be.called;
      });

      it('should ask the provider for the state once the selection was applied', async () => {
        comboBox.selectAllProvider = {
          isAllSelected: sinon.spy(() => comboBox.selectedItems.length === items.length),
          setAllSelected: () => {
            comboBox.selectedItems = [...items];
          },
        };
        await nextRender();
        clickButton();
        await nextRender();
        expect(comboBox.selectAllProvider.isAllSelected).to.be.calledTwice;
        expect(getLabel()).to.equal('Deselect all');
      });

      it('should not call setAllSelected when all filtered items are loaded', () => {
        setInputValue(comboBox, '99');
        clickButton();
        expect(provider.setAllSelected).to.not.be.called;
        expect(comboBox.selectedItems).to.deep.equal(['Item 99']);
        expect(changeSpy).to.be.calledOnce;
      });
    });

    describe('pending setAllSelected', () => {
      let provider, resolveSelection, rejectSelection, validatedSpy, region, clock;

      before(() => {
        region = document.querySelector('[aria-live]');
      });

      beforeEach(async () => {
        provider = {
          isAllSelected: sinon.spy(() => false),
          setAllSelected: sinon.spy(() => {
            return new Promise((resolve, reject) => {
              resolveSelection = resolve;
              rejectSelection = reject;
            });
          }),
        };
        comboBox.selectAllProvider = provider;
        await open();
        validatedSpy = sinon.spy();
        comboBox.addEventListener('validated', validatedSpy);
        clock = sinon.useFakeTimers({ shouldClearNativeTimers: true });
      });

      afterEach(() => {
        clock.restore();
      });

      it('should ignore clicks while pending', async () => {
        clickButton();
        await clock.tickAsync(0);
        clickButton();
        expect(provider.setAllSelected).to.be.calledOnce;
      });

      it('should set aria-disabled instead of disabled on the button while pending', async () => {
        clickButton();
        await clock.tickAsync(0);
        expect(getSelectAllButton(comboBox).hasAttribute('disabled')).to.be.false;
        expect(getSelectAllButton(comboBox).getAttribute('aria-disabled')).to.equal('true');

        resolveSelection();
        await clock.tickAsync(0);
        expect(getSelectAllButton(comboBox).hasAttribute('aria-disabled')).to.be.false;
      });

      it('should ask the provider for the state when the selection changes while pending', async () => {
        clickButton();
        comboBox.selectedItems = [...items];
        await clock.tickAsync(0);
        expect(provider.isAllSelected).to.be.calledTwice;
      });

      it('should update the label from the provider once the selection was applied', async () => {
        provider.isAllSelected = sinon.spy(() => comboBox.selectedItems.length === items.length);
        clickButton();
        comboBox.selectedItems = [...items];
        resolveSelection();
        await clock.tickAsync(0);
        expect(getLabel()).to.equal('Deselect all');
      });

      it('should keep ignoring clicks until the selection was applied', async () => {
        clickButton();
        comboBox.selectedItems = [...items];
        await clock.tickAsync(0);
        clickButton();
        expect(provider.setAllSelected).to.be.calledOnce;

        resolveSelection();
        await clock.tickAsync(0);
        clickButton();
        expect(provider.setAllSelected).to.be.calledTwice;
      });

      it('should announce the total once resolved', async () => {
        clickButton();
        comboBox.selectedItems = [...items];
        resolveSelection();
        await clock.tickAsync(150);
        expect(region.textContent).to.equal('100 items selected');
      });

      it('should announce cleared selection once resolved', async () => {
        comboBox.selectedItems = [...items];
        comboBox.selectAllProvider = { ...provider, isAllSelected: () => true };
        await clock.tickAsync(0);
        clickButton();
        comboBox.selectedItems = [];
        resolveSelection();
        await clock.tickAsync(150);
        expect(region.textContent).to.equal('Selection cleared');
      });

      it('should validate once resolved', async () => {
        clickButton();
        expect(validatedSpy).to.not.be.called;
        resolveSelection();
        await clock.tickAsync(0);
        expect(validatedSpy).to.be.calledOnce;
      });

      it('should accept clicks again once resolved', async () => {
        clickButton();
        resolveSelection();
        await clock.tickAsync(0);
        clickButton();
        expect(provider.setAllSelected).to.be.calledTwice;
      });

      it('should not announce or validate when rejected', async () => {
        region.textContent = '';
        clickButton();
        rejectSelection(new Error('failed'));
        await clock.tickAsync(150);
        expect(region.textContent).to.equal('');
        expect(validatedSpy).to.not.be.called;
      });

      it('should accept clicks again when rejected', async () => {
        clickButton();
        rejectSelection(new Error('failed'));
        await clock.tickAsync(0);
        clickButton();
        expect(provider.setAllSelected).to.be.calledTwice;
      });

      it('should handle setAllSelected throwing synchronously', async () => {
        comboBox.selectAllProvider = {
          isAllSelected: () => false,
          setAllSelected: sinon.spy(() => {
            throw new Error('failed');
          }),
        };
        await clock.tickAsync(0);
        clickButton();
        await clock.tickAsync(0);
        clickButton();
        expect(comboBox.selectAllProvider.setAllSelected).to.be.calledTwice;
      });

      it('should announce the total when setAllSelected returns synchronously', async () => {
        comboBox.selectAllProvider = {
          isAllSelected: () => false,
          setAllSelected: () => {
            comboBox.selectedItems = ['Item 0', 'Item 1'];
          },
        };
        await clock.tickAsync(0);
        clickButton();
        await clock.tickAsync(150);
        expect(region.textContent).to.equal('2 items selected');
        expect(validatedSpy).to.be.calledOnce;
      });

      it('should not announce when the element is detached before resolved', async () => {
        region.textContent = '';
        clickButton();
        comboBox.remove();
        resolveSelection();
        await clock.tickAsync(150);
        expect(region.textContent).to.equal('');
      });
    });
  });

  describe('loading', () => {
    const items = Array.from({ length: 100 }, (_, i) => `Item ${i}`);
    let provider, clock;

    beforeEach(() => {
      clock = sinon.useFakeTimers({ shouldClearNativeTimers: true });
      provider = createProvider();
      comboBox.pageSize = 10;
      comboBox.dataProvider = getAsyncDataProvider(items);
      comboBox.selectAllProvider = provider;
      comboBox.opened = true;
    });

    afterEach(() => {
      clock.restore();
    });

    it('should not ask the provider while loading', async () => {
      expect(comboBox.loading).to.be.true;
      await untilProviderAsked();
      expect(provider.isAllSelected).to.not.be.called;
    });

    it('should ask the provider once loading has finished', async () => {
      await clock.tickAsync(0);
      expect(comboBox.loading).to.be.false;
      expect(provider.isAllSelected).to.be.calledOnce;
      await clock.tickAsync(0);
      expect(getSelectAllButton(comboBox)).to.be.ok;
    });

    it('should keep rendering the button while loading a filtered page', async () => {
      await clock.tickAsync(0);
      setInputValue(comboBox, '1');
      expect(comboBox.loading).to.be.true;
      expect(getSelectAllButton(comboBox)).to.be.ok;
      expect(getSelectAllButton(comboBox).hasAttribute('disabled')).to.be.false;
    });

    it('should set aria-disabled on the button while loading', async () => {
      await clock.tickAsync(0);
      setInputValue(comboBox, '1');
      expect(getSelectAllButton(comboBox).getAttribute('aria-disabled')).to.equal('true');

      await clock.tickAsync(0);
      expect(getSelectAllButton(comboBox).hasAttribute('aria-disabled')).to.be.false;
    });

    it('should ignore clicks while loading a filtered page', async () => {
      await clock.tickAsync(0);
      setInputValue(comboBox, '1');
      clickButton();
      expect(provider.setAllSelected).to.not.be.called;
    });

    it('should ask the provider again once the filtered page is loaded', async () => {
      await clock.tickAsync(0);
      setInputValue(comboBox, '1');
      await untilProviderAsked();
      expect(provider.isAllSelected).to.be.calledOnce;
      await clock.tickAsync(0);
      expect(provider.isAllSelected).to.be.calledTwice;
      expect(provider.isAllSelected.lastCall.args[0]).to.deep.equal({ filter: '1' });
    });

    it('should call setAllSelected once loading has finished', async () => {
      await clock.tickAsync(0);
      clickButton();
      expect(provider.setAllSelected).to.be.calledOnce;
    });

    it('should select filtered items locally once the filtered page is loaded', async () => {
      await clock.tickAsync(0);
      setInputValue(comboBox, '99');
      await clock.tickAsync(0);
      clickButton();
      expect(provider.setAllSelected).to.not.be.called;
      expect(comboBox.selectedItems).to.deep.equal(['Item 99']);
    });
  });
});

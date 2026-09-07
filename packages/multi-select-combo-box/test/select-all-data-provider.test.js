import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-multi-select-combo-box.js';
import { getAsyncDataProvider, getDataProvider, getSelectAllButton, setInputValue } from './helpers.js';

describe('select all with data provider', () => {
  let comboBox, changeSpy;

  const getLabel = () => getSelectAllButton(comboBox).textContent.trim();

  const clickButton = () => getSelectAllButton(comboBox).click();

  beforeEach(async () => {
    comboBox = fixtureSync(`<vaadin-multi-select-combo-box select-all-button-visible></vaadin-multi-select-combo-box>`);
    await nextRender();
    changeSpy = sinon.spy();
    comboBox.addEventListener('change', changeSpy);
  });

  describe('single page', () => {
    const items = ['Apple', 'Banana', 'Lemon', 'Orange'];

    beforeEach(() => {
      comboBox.dataProvider = getDataProvider(items);
      comboBox.selectAllCallback = sinon.spy();
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

    it('should select all items without calling the callback', () => {
      comboBox.opened = true;
      clickButton();
      expect(comboBox.selectedItems).to.deep.equal(items);
      expect(comboBox.selectAllCallback).to.not.be.called;
      expect(changeSpy).to.be.calledOnce;
    });

    it('should deselect all items without calling the callback', () => {
      comboBox.selectedItems = [...items];
      comboBox.opened = true;
      clickButton();
      expect(comboBox.selectedItems).to.deep.equal([]);
      expect(comboBox.selectAllCallback).to.not.be.called;
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
      comboBox.opened = true;
    });

    describe('state', () => {
      it('should not render button when selectAllState is not set', () => {
        comboBox.selectAllCallback = () => {};
        expect(getSelectAllButton(comboBox)).to.be.null;
      });

      it('should not render button when selectAllCallback is not set', () => {
        comboBox.selectAllState = 'none';
        expect(getSelectAllButton(comboBox)).to.be.null;
      });

      it('should render button when both selectAllState and selectAllCallback are set', () => {
        comboBox.selectAllCallback = () => {};
        comboBox.selectAllState = 'none';
        expect(getSelectAllButton(comboBox)).to.be.ok;
      });

      it('should remove button when selectAllState is cleared', () => {
        comboBox.selectAllCallback = () => {};
        comboBox.selectAllState = 'none';
        comboBox.selectAllState = null;
        expect(getSelectAllButton(comboBox)).to.be.null;
      });

      describe('rendered', () => {
        beforeEach(() => {
          comboBox.selectAllCallback = () => {};
          comboBox.selectAllState = 'none';
        });

        it('should use selectAll label for none state', () => {
          expect(getLabel()).to.equal('Select all');
        });

        it('should use deselectAll label for all state', () => {
          comboBox.selectAllState = 'all';
          expect(getLabel()).to.equal('Deselect all');
        });

        it('should use filtered labels when a filter is set', () => {
          setInputValue(comboBox, '1');
          expect(getLabel()).to.equal('Select filtered');

          comboBox.selectAllState = 'all';
          expect(getLabel()).to.equal('Deselect filtered');
        });

        it('should ignore selected items when computing the label', () => {
          comboBox.selectedItems = ['Item 0'];
          expect(getLabel()).to.equal('Select all');
        });

        it('should switch to computing the label locally when all filtered items are loaded', () => {
          comboBox.selectedItems = ['Item 99'];
          setInputValue(comboBox, '99');
          expect(getLabel()).to.equal('Deselect filtered');
        });

        it('should switch back to selectAllState when the filter is widened', () => {
          comboBox.selectedItems = ['Item 99'];
          setInputValue(comboBox, '99');
          setInputValue(comboBox, '');
          expect(getLabel()).to.equal('Select all');
        });
      });
    });

    describe('clicking', () => {
      let callback;

      beforeEach(() => {
        callback = sinon.spy();
        comboBox.selectAllCallback = callback;
        comboBox.selectAllState = 'none';
      });

      it('should call the callback with filter and selected', () => {
        clickButton();
        expect(callback).to.be.calledOnce;
        expect(callback.firstCall.args[0]).to.deep.equal({ filter: '', selected: true });
      });

      it('should call the callback with the current filter', () => {
        setInputValue(comboBox, '1');
        clickButton();
        expect(callback.firstCall.args[0]).to.deep.equal({ filter: '1', selected: true });
      });

      it('should call the callback with selected set to false when all items are selected', () => {
        comboBox.selectAllState = 'all';
        clickButton();
        expect(callback.firstCall.args[0]).to.deep.equal({ filter: '', selected: false });
      });

      it('should not change selected items', () => {
        clickButton();
        expect(comboBox.selectedItems).to.deep.equal([]);
      });

      it('should not fire change event', () => {
        clickButton();
        expect(changeSpy).to.not.be.called;
      });

      it('should keep the label from selectAllState', async () => {
        clickButton();
        await nextRender();
        expect(getLabel()).to.equal('Select all');
      });

      it('should update the label when the callback updates selectAllState synchronously', () => {
        comboBox.selectAllCallback = () => {
          comboBox.selectAllState = 'all';
        };
        clickButton();
        expect(getLabel()).to.equal('Deselect all');
      });

      it('should not call the callback when all filtered items are loaded', () => {
        setInputValue(comboBox, '99');
        clickButton();
        expect(callback).to.not.be.called;
        expect(comboBox.selectedItems).to.deep.equal(['Item 99']);
        expect(changeSpy).to.be.calledOnce;
      });
    });

    describe('pending callback', () => {
      let callback, resolveCallback, rejectCallback, validatedSpy, region, clock;

      before(() => {
        region = document.querySelector('[aria-live]');
      });

      beforeEach(() => {
        callback = sinon.spy(() => {
          return new Promise((resolve, reject) => {
            resolveCallback = resolve;
            rejectCallback = reject;
          });
        });
        comboBox.selectAllCallback = callback;
        comboBox.selectAllState = 'none';
        validatedSpy = sinon.spy();
        comboBox.addEventListener('validated', validatedSpy);
        clock = sinon.useFakeTimers({ shouldClearNativeTimers: true });
      });

      afterEach(() => {
        clock.restore();
      });

      it('should ignore clicks while the callback is pending', async () => {
        clickButton();
        await clock.tickAsync(0);
        clickButton();
        expect(callback).to.be.calledOnce;
      });

      it('should not set disabled attribute on the button while pending', async () => {
        clickButton();
        await clock.tickAsync(0);
        expect(getSelectAllButton(comboBox).hasAttribute('disabled')).to.be.false;
      });

      it('should announce the total after the callback resolves', async () => {
        clickButton();
        comboBox.selectedItems = [...items];
        comboBox.selectAllState = 'all';
        resolveCallback();
        await clock.tickAsync(150);
        expect(region.textContent).to.equal('100 items selected');
      });

      it('should announce cleared selection after the callback resolves', async () => {
        comboBox.selectedItems = [...items];
        comboBox.selectAllState = 'all';
        clickButton();
        comboBox.selectedItems = [];
        comboBox.selectAllState = 'none';
        resolveCallback();
        await clock.tickAsync(150);
        expect(region.textContent).to.equal('Selection cleared');
      });

      it('should validate after the callback resolves', async () => {
        clickButton();
        expect(validatedSpy).to.not.be.called;
        resolveCallback();
        await clock.tickAsync(0);
        expect(validatedSpy).to.be.calledOnce;
      });

      it('should accept clicks again after the callback resolves', async () => {
        clickButton();
        resolveCallback();
        await clock.tickAsync(0);
        clickButton();
        expect(callback).to.be.calledTwice;
      });

      it('should not announce or validate when the callback rejects', async () => {
        region.textContent = '';
        clickButton();
        rejectCallback(new Error('failed'));
        await clock.tickAsync(150);
        expect(region.textContent).to.equal('');
        expect(validatedSpy).to.not.be.called;
      });

      it('should accept clicks again when the callback rejects', async () => {
        clickButton();
        rejectCallback(new Error('failed'));
        await clock.tickAsync(0);
        clickButton();
        expect(callback).to.be.calledTwice;
      });

      it('should handle a callback throwing synchronously', async () => {
        comboBox.selectAllCallback = sinon.spy(() => {
          throw new Error('failed');
        });
        clickButton();
        await clock.tickAsync(0);
        clickButton();
        expect(comboBox.selectAllCallback).to.be.calledTwice;
      });

      it('should announce the total when the callback returns synchronously', async () => {
        comboBox.selectAllCallback = () => {
          comboBox.selectedItems = ['Item 0', 'Item 1'];
        };
        clickButton();
        await clock.tickAsync(150);
        expect(region.textContent).to.equal('2 items selected');
        expect(validatedSpy).to.be.calledOnce;
      });

      it('should not announce when the element is detached before the callback resolves', async () => {
        region.textContent = '';
        clickButton();
        comboBox.remove();
        resolveCallback();
        await clock.tickAsync(150);
        expect(region.textContent).to.equal('');
      });
    });
  });

  describe('loading', () => {
    const items = Array.from({ length: 100 }, (_, i) => `Item ${i}`);
    let callback, clock;

    beforeEach(() => {
      clock = sinon.useFakeTimers({ shouldClearNativeTimers: true });
      callback = sinon.spy();
      comboBox.pageSize = 10;
      comboBox.dataProvider = getAsyncDataProvider(items);
      comboBox.selectAllCallback = callback;
      comboBox.selectAllState = 'none';
      comboBox.opened = true;
    });

    afterEach(() => {
      clock.restore();
    });

    it('should render button while loading', () => {
      expect(comboBox.loading).to.be.true;
      expect(getSelectAllButton(comboBox)).to.be.ok;
      expect(getSelectAllButton(comboBox).hasAttribute('disabled')).to.be.false;
    });

    it('should ignore clicks while loading', () => {
      clickButton();
      expect(callback).to.not.be.called;
    });

    it('should call the callback once loading has finished', async () => {
      await clock.tickAsync(0);
      expect(comboBox.loading).to.be.false;
      clickButton();
      expect(callback).to.be.calledOnce;
    });

    it('should ignore clicks while loading a filtered page', async () => {
      await clock.tickAsync(0);
      setInputValue(comboBox, '99');
      expect(comboBox.loading).to.be.true;
      clickButton();
      expect(callback).to.not.be.called;
      expect(comboBox.selectedItems).to.deep.equal([]);
    });

    it('should select filtered items locally once the filtered page is loaded', async () => {
      await clock.tickAsync(0);
      setInputValue(comboBox, '99');
      await clock.tickAsync(0);
      clickButton();
      expect(callback).to.not.be.called;
      expect(comboBox.selectedItems).to.deep.equal(['Item 99']);
    });
  });
});

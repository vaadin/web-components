import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { setInputValue } from './helpers.js';

const TEMPLATES = {
  'vaadin-combo-box': `
    <vaadin-combo-box></vaadin-combo-box>
  `,
  'vaadin-combo-box-light': `
    <vaadin-combo-box-light>
      <vaadin-text-field></vaadin-text-field>
    </vaadin-combo-box-light>
  `,
};

['vaadin-combo-box', 'vaadin-combo-box-light'].forEach((tag) => {
  describe(`data provider filtering - ${tag}`, () => {
    let comboBox;

    describe('basic', () => {
      beforeEach(async () => {
        comboBox = fixtureSync(TEMPLATES[tag]);
        await nextRender();

        comboBox.dataProvider = sinon.spy((params, callback) => {
          const items = ['Item 1', 'Item 2', 'Item 3'];
          const filteredItems = items.filter((item) => item.includes(params.filter));
          callback(filteredItems, filteredItems.length);
        });
        comboBox.opened = true;
      });

      it('should make request with empty filter when opened', () => {
        const params = comboBox.dataProvider.lastCall.args[0];
        expect(params.filter).to.equal('');
      });

      it('should make request with entered filter on filter change', () => {
        comboBox.dataProvider.resetHistory();
        setInputValue(comboBox, 'Item');
        expect(comboBox.dataProvider).to.be.called;
        const params = comboBox.dataProvider.lastCall.args[0];
        expect(params.filter).to.equal('Item');
      });

      it('should make request with empty filter on value change', () => {
        setInputValue(comboBox, 'Item');
        comboBox.dataProvider.resetHistory();
        comboBox.value = 'Item 2';
        const params = comboBox.dataProvider.lastCall.args[0];
        expect(params.filter).to.equal('');
      });

      it('should clear filter on value clear', () => {
        setInputValue(comboBox, 'Item');
        comboBox.value = 'Item 1';
        comboBox.value = '';
        expect(comboBox.filter).to.equal('');
      });

      it('should clear filter on opened change', () => {
        setInputValue(comboBox, 'Item');
        comboBox.opened = false;
        expect(comboBox.filter).to.equal('');
      });

      it('should make request with empty filter after partial filter & cancel & reopen', () => {
        setInputValue(comboBox, 'It');
        comboBox.dataProvider.resetHistory();
        comboBox.cancel();
        comboBox.opened = true;
        const params = comboBox.dataProvider.lastCall.args[0];
        expect(params.filter).to.equal('');
      });
    });

    describe('async data provider', () => {
      beforeEach(async () => {
        comboBox = fixtureSync(TEMPLATES[tag]);
        await nextRender();

        comboBox.dataProvider = sinon.spy(async (params, callback) => {
          const items = ['Item 1', 'Item 2', 'Item 3'];
          const filteredItems = items.filter((item) => item.includes(params.filter));
          await aTimeout(0);
          callback(filteredItems, filteredItems.length);
        });
        comboBox.opened = true;
        await aTimeout(0);
      });

      it('should make request with empty filter when opened', () => {
        expect(comboBox.dataProvider).to.be.calledOnce;
        const params = comboBox.dataProvider.firstCall.args[0];
        expect(params.filter).to.equal('');
      });

      it('should make request with entered filter on filter change', async () => {
        comboBox.dataProvider.resetHistory();
        setInputValue(comboBox, 'Item');
        await aTimeout(0);
        expect(comboBox.dataProvider).to.be.calledOnce;
        const params = comboBox.dataProvider.firstCall.args[0];
        expect(params.filter).to.equal('Item');
      });
    });

    describe('dropdown behaviour', () => {
      let openedSpy;

      beforeEach(async () => {
        comboBox = fixtureSync(TEMPLATES[tag]);
        await nextRender();

        comboBox.dataProvider = sinon.spy((_params, callback) => {
          const items = ['Item 1', 'Item 2', 'Item 3'];
          const filteredItems = items.filter((item) => item.includes(comboBox.filter));
          callback(filteredItems, filteredItems.length);
        });
        comboBox.opened = true;
        comboBox.dataProvider.resetHistory();

        openedSpy = sinon.spy();
        comboBox.addEventListener('vaadin-combo-box-dropdown-opened', openedSpy);
      });

      it('should not toggle between opened and closed when filtering', () => {
        // Filter for something that should return results
        comboBox.filter = 'Item';
        // Verify data provider has been called
        expect(comboBox.dataProvider).to.be.calledOnce;
        // Dropdown should not have been closed and re-opened
        expect(openedSpy).to.be.not.called;
      });

      it('should not toggle between opened and closed when setting a value', () => {
        // Filter for something that should return results
        comboBox.filter = 'Item';
        // Set a value
        comboBox.value = 'Item 1';
        // Dropdown should not have been closed and re-opened
        expect(openedSpy).to.be.not.called;
      });

      it('should close when there are no items after filtering', () => {
        // Filter for something that doesn't exist
        comboBox.filter = 'doesnotexist';
        // Verify data provider has been called
        expect(comboBox.dataProvider).to.be.calledOnce;
        // Dropdown should close
        expect(comboBox.$.overlay.opened).to.be.false;
      });
    });
  });
});

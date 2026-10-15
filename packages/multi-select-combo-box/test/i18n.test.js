import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-multi-select-combo-box.js';

describe('i18n', () => {
  describe('announcements', () => {
    let comboBox, region, clock;

    before(() => {
      region = document.querySelector('[aria-live]');
    });

    beforeEach(async () => {
      comboBox = fixtureSync(`<vaadin-multi-select-combo-box></vaadin-multi-select-combo-box>`);
      comboBox.items = ['Apple', 'Banana', 'Lemon', 'Orange'];
      await nextRender();
      clock = sinon.useFakeTimers({ shouldClearNativeTimers: true });
    });

    afterEach(() => {
      clock.restore();
    });

    it('should use default i18n messages', () => {
      comboBox.__selectItem('Apple');
      clock.tick(150);
      expect(region.textContent).to.equal('Apple added to selection 1 items selected');

      comboBox.__removeItem('Apple');
      clock.tick(150);
      expect(region.textContent).to.equal('Apple removed from selection 0 items selected');

      comboBox.clear();
      clock.tick(150);
      expect(region.textContent).to.equal('Selection cleared');
    });

    it('should use custom i18n messages', () => {
      comboBox.i18n = {
        cleared: 'Custom cleared message',
        selected: 'custom selected',
        deselected: 'custom deselected',
        total: 'Custom total: {count} selected items',
      };

      comboBox.__selectItem('Apple');
      clock.tick(150);
      expect(region.textContent).to.equal('Apple custom selected Custom total: 1 selected items');

      comboBox.__removeItem('Apple');
      clock.tick(150);
      expect(region.textContent).to.equal('Apple custom deselected Custom total: 0 selected items');

      comboBox.clear();
      clock.tick(150);
      expect(region.textContent).to.equal('Custom cleared message');
    });

    it('should fall back to defaults when custom messages are missing', () => {
      comboBox.i18n = {
        selected: 'custom selected',
      };

      comboBox.__selectItem('Apple');
      clock.tick(150);
      expect(region.textContent).to.equal('Apple custom selected 1 items selected');

      comboBox.__removeItem('Apple');
      clock.tick(150);
      expect(region.textContent).to.equal('Apple removed from selection 0 items selected');

      comboBox.clear();
      clock.tick(150);
      expect(region.textContent).to.equal('Selection cleared');
    });
  });
});

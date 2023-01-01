import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../src/vaadin-combo-box.js';
import { RangeDataProvider } from '../src/vaadin-combo-box-range-data-provider.js';

describe('range data provider', () => {
  let comboBox, rangeDataProvider;

  beforeEach(() => {
    comboBox = fixtureSync(`<vaadin-combo-box></vaadin-combo-box>`);
    rangeDataProvider = new RangeDataProvider(comboBox, () => {}, { maxRangeSize: 5 });
  });

  describe('adjustRangeToIncludePage', () => {
    it('should init a range on first page request', () => {
      rangeDataProvider.adjustRangeToIncludePage(0);
      expect(rangeDataProvider.range).to.eql([0, 0]);
    });

    it('should extend the range up while sequentially requesting pages up', () => {
      for (let i = 0; i < 5; i++) {
        rangeDataProvider.adjustRangeToIncludePage(i);
        expect(rangeDataProvider.range).to.eql([0, i]);
      }
    });

    it('should extend the range down while sequentially requesting pages down', () => {
      for (let i = 10; i > 5; i--) {
        rangeDataProvider.adjustRangeToIncludePage(i);
        expect(rangeDataProvider.range).to.eql([i, 10]);
      }
    });

    it('should keep the range within limits while sequentially requesting pages up', () => {
      for (let i = 0; i < 5; i++) {
        rangeDataProvider.adjustRangeToIncludePage(i);
      }

      rangeDataProvider.adjustRangeToIncludePage(5);
      expect(rangeDataProvider.range).to.eql([1, 5]);
    });

    it('should keep the range within limits while sequentially requesting pages down', () => {
      for (let i = 10; i > 5; i--) {
        rangeDataProvider.adjustRangeToIncludePage(i);
      }

      rangeDataProvider.adjustRangeToIncludePage(5);
      expect(rangeDataProvider.range).to.eql([5, 9]);
    });

    it('should reset the range when skipping over pages up', () => {
      rangeDataProvider.adjustRangeToIncludePage(0);
      rangeDataProvider.adjustRangeToIncludePage(10);
      expect(rangeDataProvider.range).to.eql([10, 10]);
    });

    it('should reset the range when skipping over pages down', () => {
      rangeDataProvider.adjustRangeToIncludePage(10);
      rangeDataProvider.adjustRangeToIncludePage(0);
      expect(rangeDataProvider.range).to.eql([0, 0]);
    });
  });
});

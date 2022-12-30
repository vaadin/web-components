import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../src/vaadin-combo-box.js';
import { DataRangeProvider } from '../src/vaadin-combo-box-range-data-provider.js';

describe('range data provider', () => {
  let comboBox, dataRangeProvider;

  beforeEach(() => {
    comboBox = fixtureSync(`<vaadin-combo-box></vaadin-combo-box>`);
    dataRangeProvider = new DataRangeProvider(comboBox, () => {}, { maxRangeSize: 5 });
  });

  describe('adjustRangeToIncludePage', () => {
    it('should init a range on first page request', () => {
      dataRangeProvider.adjustRangeToIncludePage(0);
      expect(dataRangeProvider.range).to.eql([0, 0]);
    });

    it('should extend the range up while sequentially requesting pages up', () => {
      for (let i = 0; i <= 5; i++) {
        dataRangeProvider.adjustRangeToIncludePage(i);
        expect(dataRangeProvider.range).to.eql([0, i]);
      }
    });

    it('should extend the range down while sequentially requesting pages down', () => {
      for (let i = 10; i >= 5; i--) {
        dataRangeProvider.adjustRangeToIncludePage(i);
        expect(dataRangeProvider.range).to.eql([i, 10]);
      }
    });

    it('should keep the range within limits while sequentially requesting pages up', () => {
      for (let i = 0; i <= 5; i++) {
        dataRangeProvider.adjustRangeToIncludePage(i);
      }

      dataRangeProvider.adjustRangeToIncludePage(6);
      expect(dataRangeProvider.range).to.eql([1, 6]);
    });

    it('should keep the range within limits while sequentially requesting pages down', () => {
      for (let i = 10; i >= 5; i--) {
        dataRangeProvider.adjustRangeToIncludePage(i);
      }

      dataRangeProvider.adjustRangeToIncludePage(4);
      expect(dataRangeProvider.range).to.eql([4, 9]);
    });

    it('should reset the range when skipping over pages up', () => {
      dataRangeProvider.adjustRangeToIncludePage(0);
      dataRangeProvider.adjustRangeToIncludePage(10);
      expect(dataRangeProvider.range).to.eql([10, 10]);
    });

    it('should reset the range when skipping over pages down', () => {
      dataRangeProvider.adjustRangeToIncludePage(10);
      dataRangeProvider.adjustRangeToIncludePage(0);
      expect(dataRangeProvider.range).to.eql([0, 0]);
    });
  });
});

import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../src/vaadin-combo-box.js';
import { DataRangeProvider } from '../src/vaadin-combo-box-range-data-provider.js';

describe('range data provider', () => {
  let comboBox, dataRangeProvider;

  beforeEach(() => {
    comboBox = fixtureSync(`<vaadin-combo-box></vaadin-combo-box>`);
    dataRangeProvider = new DataRangeProvider(comboBox, () => {}, { maxRangeSize: 50 });
  });

  describe('adjustRangeToInclude', () => {
    it('should set an initial range on first page request', () => {
      dataRangeProvider.adjustRangeToInclude(0);
      expect(dataRangeProvider.range).to.eql([0, 0]);
    });

    it('should extend the range up while requesting more pages up', () => {
      dataRangeProvider.adjustRangeToInclude(0);
      expect(dataRangeProvider.range).to.eql([0, 0]);

      dataRangeProvider.adjustRangeToInclude(1);
      expect(dataRangeProvider.range).to.eql([0, 1]);

      dataRangeProvider.adjustRangeToInclude(10);
      expect(dataRangeProvider.range).to.eql([0, 10]);
    });

    it('should keep the range within limits while requesting more pages up', () => {
      dataRangeProvider.adjustRangeToInclude(0);
      expect(dataRangeProvider.range).to.eql([0, 0]);

      dataRangeProvider.adjustRangeToInclude(50);
      expect(dataRangeProvider.range).to.eql([0, 50]);

      dataRangeProvider.adjustRangeToInclude(51);
      expect(dataRangeProvider.range).to.eql([1, 51]);

      dataRangeProvider.adjustRangeToInclude(100);
      expect(dataRangeProvider.range).to.eql([50, 100]);
    });

    it('should extend the range down while requesting more pages down', () => {
      dataRangeProvider.adjustRangeToInclude(100);
      expect(dataRangeProvider.range).to.eql([100, 100]);

      dataRangeProvider.adjustRangeToInclude(99);
      expect(dataRangeProvider.range).to.eql([99, 100]);

      dataRangeProvider.adjustRangeToInclude(80);
      expect(dataRangeProvider.range).to.eql([80, 100]);
    });

    it('should keep the range within limits while requesting more pages down', () => {
      dataRangeProvider.adjustRangeToInclude(100);
      expect(dataRangeProvider.range).to.eql([100, 100]);

      dataRangeProvider.adjustRangeToInclude(50);
      expect(dataRangeProvider.range).to.eql([50, 100]);

      dataRangeProvider.adjustRangeToInclude(49);
      expect(dataRangeProvider.range).to.eql([49, 99]);

      dataRangeProvider.adjustRangeToInclude(0);
      expect(dataRangeProvider.range).to.eql([0, 50]);
    });
  });
});

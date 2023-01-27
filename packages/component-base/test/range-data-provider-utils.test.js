import { expect } from '@esm-bundle/chai';
import { adjustRangeToIncludePage } from '../src/range-data-provider-utils.js';

const MAX_RANGE_SIZE = 5;

describe('range-data-provider-utils', () => {
  let range;

  describe('adjustRangeToIncludePage', () => {
    it('should init a range on first page request', () => {
      range = adjustRangeToIncludePage(range, 0, MAX_RANGE_SIZE);
      expect(range).to.eql([0, 0]);
    });

    it('should extend the range up while sequentially requesting pages up', () => {
      for (let i = 0; i < 5; i++) {
        range = adjustRangeToIncludePage(range, i, MAX_RANGE_SIZE);
        expect(range).to.eql([0, i]);
      }
    });

    it('should extend the range down while sequentially requesting pages down', () => {
      for (let i = 10; i > 5; i--) {
        range = adjustRangeToIncludePage(range, i, MAX_RANGE_SIZE);
        expect(range).to.eql([i, 10]);
      }
    });

    it('should keep the range within limits while sequentially requesting pages up', () => {
      for (let i = 0; i < 5; i++) {
        range = adjustRangeToIncludePage(range, i, MAX_RANGE_SIZE);
      }

      range = adjustRangeToIncludePage(range, 5, MAX_RANGE_SIZE);
      expect(range).to.eql([1, 5]);
    });

    it('should keep the range within limits while sequentially requesting pages down', () => {
      for (let i = 10; i > 5; i--) {
        range = adjustRangeToIncludePage(range, i, MAX_RANGE_SIZE);
      }

      range = adjustRangeToIncludePage(range, 5, MAX_RANGE_SIZE);
      expect(range).to.eql([5, 9]);
    });

    it('should reset the range when skipping over pages up', () => {
      range = adjustRangeToIncludePage(range, 0, MAX_RANGE_SIZE);
      range = adjustRangeToIncludePage(range, 10, MAX_RANGE_SIZE);
      expect(range).to.eql([10, 10]);
    });

    it('should reset the range when skipping over pages down', () => {
      range = adjustRangeToIncludePage(range, 10, MAX_RANGE_SIZE);
      range = adjustRangeToIncludePage(range, 0, MAX_RANGE_SIZE);
      expect(range).to.eql([0, 0]);
    });
  });
});

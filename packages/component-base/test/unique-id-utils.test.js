import { expect } from '@esm-bundle/chai';
import { generateUniqueId, resetUniqueId } from '../src/unique-id-utils.js';

describe('unique-id-utils', () => {
  describe('generateUniqueId', () => {
    it('should generate a unique integer id on every call', () => {
      expect(generateUniqueId()).to.equal(0);
      expect(generateUniqueId()).to.equal(1);
    });
  });

  describe('resetUniqueId', () => {
    beforeEach(() => {
      resetUniqueId();
    });

    it('should reset the unique id counter', () => {
      expect(generateUniqueId()).to.equal(0);
      expect(generateUniqueId()).to.equal(1);
      resetUniqueId();
      expect(generateUniqueId()).to.equal(0);
      expect(generateUniqueId()).to.equal(1);
    });
  });
});

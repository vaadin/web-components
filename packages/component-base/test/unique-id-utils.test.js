import { expect } from '@esm-bundle/chai';
import { generateUniqueId, resetUniqueId } from '../src/unique-id-utils.js';

describe('unique-id-utils', () => {
  describe('generateUniqueId', () => {
    it('should generate a unique integer id on every call', () => {
      expect(generateUniqueId()).to.equal(0);
      expect(generateUniqueId()).to.equal(1);
    });
  });

  describe('generateIdForKey', () => {
    it('should use separate counter for each provided key', () => {
      expect(generateUniqueId('foo')).to.equal(0);
      expect(generateUniqueId('bar')).to.equal(0);

      expect(generateUniqueId('foo')).to.equal(1);
      expect(generateUniqueId('bar')).to.equal(1);
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

    it('should reset counters for all keys', () => {
      expect(generateUniqueId('foo')).to.equal(0);
      expect(generateUniqueId('foo')).to.equal(1);
      expect(generateUniqueId('bar')).to.equal(0);
      expect(generateUniqueId('bar')).to.equal(1);

      resetUniqueId();

      expect(generateUniqueId('foo')).to.equal(0);
      expect(generateUniqueId('foo')).to.equal(1);
      expect(generateUniqueId('bar')).to.equal(1);
      expect(generateUniqueId('bar')).to.equal(1);
    });
  });
});

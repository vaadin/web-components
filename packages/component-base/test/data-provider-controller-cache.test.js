import { expect } from '@vaadin/chai-plugins';
import { Cache } from '../src/data-provider-controller/cache.js';

const PLACEHOLDER = Symbol('PLACEHOLDER');

describe('DataProviderController - Cache', () => {
  let cache;
  let expandedItems = [];

  function isExpanded(item) {
    return expandedItems.includes(item);
  }

  describe('default', () => {
    beforeEach(() => {
      cache = new Cache({ isExpanded }, 50, 500);
    });

    it('should have size', () => {
      expect(cache.size).to.equal(500);
    });

    it('should have pageSize', () => {
      expect(cache.pageSize).to.equal(50);
    });

    it('should have flatSize', () => {
      expect(cache.flatSize).to.equal(500);
    });

    it('should have empty items', () => {
      expect(cache.items).to.have.lengthOf(0);
    });

    it('should have empty subCaches', () => {
      expect(cache.subCaches).to.have.lengthOf(0);
    });

    it('should not have parentCache', () => {
      expect(cache.parentCache).to.be.undefined;
    });

    it('should not have parentCacheIndex', () => {
      expect(cache.parentCacheIndex).to.be.undefined;
    });

    it('should not have parentItem', () => {
      expect(cache.parentItem).to.be.undefined;
    });

    it('should not be in loading state', () => {
      expect(cache.isLoading).to.be.false;
    });
  });

  describe('with placeholder', () => {
    beforeEach(() => {
      cache = new Cache({ isExpanded, placeholder: PLACEHOLDER }, 2, 20);
    });

    it('should have items filled with placeholders', () => {
      expect(cache.items).to.have.lengthOf(20);
      expect(cache.items.every((item) => item === PLACEHOLDER)).to.be.true;
    });
  });

  describe('setPage', () => {
    beforeEach(() => {
      cache = new Cache({ isExpanded }, 2, 20);
    });

    it('should insert items at the correct position for page 0', () => {
      cache.setPage(0, ['Item 0', 'Item 1']);
      expect(cache.items).to.have.lengthOf(2);
      expect(cache.items[0]).to.equal('Item 0');
      expect(cache.items[1]).to.equal('Item 1');
    });

    it('should insert items at the correct position for page 1', () => {
      cache.setPage(1, ['Item 2', 'Item 3']);
      expect(cache.items).to.have.lengthOf(4);
      expect(cache.items[2]).to.equal('Item 2');
      expect(cache.items[3]).to.equal('Item 3');
    });

    it('should discard items that exceed the size bounds', () => {
      cache.setPage(9, ['Item 18', 'Item 19', 'Item 20']);
      expect(cache.items).to.have.lengthOf(20);
      expect(cache.items[18]).to.equal('Item 18');
      expect(cache.items[19]).to.equal('Item 19');
      expect(cache.items[20]).to.be.undefined;
    });
  });

  describe('createSubCache', () => {
    beforeEach(() => {
      cache = new Cache({ isExpanded }, 50, 500);
      cache.setPage(0, ['Item 0']);
    });

    it('should create a sub-cache for the given item index', () => {
      const subCache = cache.createSubCache(0);
      expect(subCache.size).to.equal(0);
      expect(subCache.pageSize).to.equal(50);
      expect(subCache.flatSize).to.equal(0);
      expect(subCache.parentItem).to.equal('Item 0');
      expect(subCache.parentCache).to.equal(cache);
      expect(subCache.parentCacheIndex).to.equal(0);
    });
  });

  describe('subCaches', () => {
    let subCache0, subCache1;

    beforeEach(() => {
      cache = new Cache({ isExpanded }, 50, 500);
      // Add a sub-cache for an item at the index 20.
      subCache0 = cache.createSubCache(20);
      // Add a sub-cache for an item at the index 10.
      subCache1 = cache.createSubCache(10);
    });

    it('should return sub-caches in the order of their associated items', () => {
      expect(cache.subCaches).to.have.lengthOf(2);
      expect(cache.subCaches[0]).to.equal(subCache1);
      expect(cache.subCaches[1]).to.equal(subCache0);
    });
  });

  describe('removeSubCache', () => {
    let subCache0, subCache1;

    beforeEach(() => {
      cache = new Cache({ isExpanded }, 50, 500);
      subCache0 = cache.createSubCache(0);
      subCache1 = cache.createSubCache(1);
    });

    it('should remove the sub-cache for the given item index', () => {
      expect(cache.subCaches[0]).to.equal(subCache0);
      cache.removeSubCache(0);
      expect(cache.subCaches).to.have.lengthOf(1);
      expect(cache.subCaches[0]).to.equal(subCache1);
    });
  });

  describe('removeSubCaches', () => {
    beforeEach(() => {
      cache = new Cache({ isExpanded }, 50, 500);
      cache.createSubCache(0);
      cache.createSubCache(1);
    });

    it('should remove all the sub-caches', () => {
      cache.removeSubCaches();
      expect(cache.subCaches).to.have.lengthOf(0);
    });
  });

  describe('getSubCache', () => {
    let subCache;

    beforeEach(() => {
      cache = new Cache({ isExpanded }, 50, 500);
      subCache = cache.createSubCache(0);
    });

    it('should return the sub-cache for the given item index', () => {
      expect(cache.getSubCache(0)).to.equal(subCache);
    });

    it('should return undefined if the sub-cache does not exist', () => {
      expect(cache.getSubCache(1)).to.be.undefined;
    });

    it('should return undefined if the sub-cache has been removed', () => {
      cache.removeSubCache(0);
      expect(cache.getSubCache(0)).to.be.undefined;
    });
  });

  describe('isLoading', () => {
    let subCache;

    beforeEach(() => {
      cache = new Cache({ isExpanded }, 50, 500);
      subCache = cache.createSubCache(0);
    });

    it('should return true when the cache has pending requests', () => {
      cache.pendingRequests[0] = (_items, _size) => {};
      expect(cache.isLoading).to.be.true;
    });

    it('should return true when one of the sub-caches has pending requests', () => {
      subCache.pendingRequests[0] = (_items, _size) => {};
      expect(cache.isLoading).to.be.true;
    });

    it('should return true if not all the pending requests has been resolved', () => {
      cache.pendingRequests[0] = (_items, _size) => {};
      subCache.pendingRequests[0] = (_items, _size) => {};
      delete cache.pendingRequests[0];
      expect(cache.isLoading).to.be.true;
    });

    it('should return false after all the pending requests have been resolved', () => {
      cache.pendingRequests[0] = (_items, _size) => {};
      subCache.pendingRequests[0] = (_items, _size) => {};
      delete cache.pendingRequests[0];
      delete subCache.pendingRequests[0];
      expect(cache.isLoading).to.be.false;
    });

    it('should return false if the sub-cache with pending requests has been removed', () => {
      subCache.pendingRequests[0] = (_items, _size) => {};
      cache.removeSubCache(0);
      expect(cache.isLoading).to.be.false;
    });
  });

  describe('size', () => {
    beforeEach(() => {
      cache = new Cache({ isExpanded }, 2, 20);
    });

    it('should remove exceeding pending requests when decreasing size', () => {
      cache.pendingRequests[8] = (_items, _size) => {};
      cache.pendingRequests[9] = (_items, _size) => {};
      cache.size = 18;
      expect(cache.pendingRequests[8]).to.be.not.undefined;
      expect(cache.pendingRequests[9]).to.be.undefined;
    });

    it('should remove exceeding items when decreasing size', () => {
      cache.setPage(0, ['Item 0', 'Item 1']);
      cache.setPage(1, ['Item 2', 'Item 3']);
      cache.size = 1;
      expect(cache.items).to.have.lengthOf(1);
      expect(cache.items[0]).to.equal('Item 0');
    });
  });

  describe('size with placeholder', () => {
    beforeEach(() => {
      cache = new Cache({ isExpanded, placeholder: PLACEHOLDER }, 2, 20);
    });

    it('should add more placeholders when increasing size', () => {
      cache.size = 22;
      expect(cache.items).to.have.lengthOf(22);
      expect(cache.items.every((item) => item === PLACEHOLDER)).to.be.true;
    });

    it('should remove exceeding placeholders when decreasing size', () => {
      cache.size = 18;
      expect(cache.items).to.have.lengthOf(18);
      expect(cache.items.every((item) => item === PLACEHOLDER)).to.be.true;
    });
  });

  describe('flatSize', () => {
    beforeEach(() => {
      cache = new Cache({ isExpanded }, 50, 500);
      cache.setPage(0, ['Item 0', 'Item 1']);
      const subCache0 = cache.createSubCache(0);
      subCache0.size = 50;
      const subCache1 = cache.createSubCache(1);
      subCache1.size = 100;
      subCache1.setPage(0, ['Item 1-0']);
      const subCache1SubCache0 = subCache1.createSubCache(0);
      subCache1SubCache0.size = 200;
    });

    it('should include expanded sub-caches after recalculation', () => {
      expandedItems = ['Item 0', 'Item 1', 'Item 1-0'];
      cache.recalculateFlatSize();
      expect(cache.flatSize).to.equal(850);
    });

    it('should exclude collapsed sub-caches after recalculation', () => {
      expandedItems = ['Item 0'];
      cache.recalculateFlatSize();
      expect(cache.flatSize).to.equal(550);
    });
  });

  describe('getFlatIndex', () => {
    let subCache0, subCache1;

    beforeEach(() => {
      cache = new Cache({ isExpanded }, 50, 500);
      cache.setPage(0, ['Item 0', 'Item 1', 'Item 2']);
      subCache0 = cache.createSubCache(0);
      subCache0.size = 100;
      subCache1 = cache.createSubCache(1);
      subCache1.size = 200;
      expandedItems = ['Item 0'];
      cache.recalculateFlatSize();
    });

    it('should include expanded sub-caches that precede the given index', () => {
      expect(cache.getFlatIndex(1)).to.equal(101);
    });

    it('should exclude collapsed sub-caches that precede the given index', () => {
      expect(cache.getFlatIndex(2)).to.equal(102);
    });
  });
});

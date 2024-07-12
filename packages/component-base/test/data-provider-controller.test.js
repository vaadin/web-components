import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import '@vaadin/testing-helpers';
import { Cache } from '../src/data-provider-controller/cache.js';
import { DataProviderController } from '../src/data-provider-controller/data-provider-controller.js';
import { createDataProvider } from './data-provider-controller-helpers.js';

const PLACEHOLDER = Symbol('PLACEHOLDER');

describe('DataProviderController', () => {
  let host, controller;

  let expandedItems = [];

  function isExpanded(item) {
    return expandedItems.includes(item);
  }

  beforeEach(() => {
    host = document.createElement('div');
  });

  describe('default', () => {
    let dataProvider;

    beforeEach(() => {
      dataProvider = (_params, callback) => callback([], 0);

      controller = new DataProviderController(host, {
        pageSize: 50,
        isExpanded,
        dataProvider,
      });
    });

    it('should not have size', () => {
      expect(controller.size).to.be.undefined;
    });

    it('should have pageSize', () => {
      expect(controller.pageSize).to.equal(50);
    });

    it('should have dataProvider', () => {
      expect(controller.dataProvider).to.equal(dataProvider);
    });

    it('should have flatSize', () => {
      expect(controller.flatSize).to.equal(0);
    });

    it('should not have placeholder', () => {
      expect(controller.placeholder).to.be.undefined;
    });

    it('should not have isPlaceholder', () => {
      expect(controller.isPlaceholder).to.be.undefined;
    });

    it('should have rootCache', () => {
      expect(controller.rootCache).to.be.instanceOf(Cache);
    });

    it('should have empty rootCache items', () => {
      expect(controller.rootCache.items).to.have.lengthOf(0);
    });

    it('should not have rootCache size', () => {
      expect(controller.rootCache.size).to.be.undefined;
    });

    it('should have rootCache pageSize', () => {
      expect(controller.rootCache.pageSize).to.equal(50);
    });

    it('should not have rootCache parentCache', () => {
      expect(controller.rootCache.parentCache).to.be.undefined;
    });

    it('should not have rootCache parentCacheIndex', () => {
      expect(controller.rootCache.parentCacheIndex).to.be.undefined;
    });

    it('should not be in loading state', () => {
      expect(controller.isLoading()).to.be.false;
    });
  });

  describe('with size', () => {
    beforeEach(() => {
      controller = new DataProviderController(host, {
        size: 500,
        pageSize: 50,
        isExpanded,
        dataProvider: (_params, callback) => callback([], 0),
      });
    });

    it('should have rootCache size', () => {
      expect(controller.rootCache.size).to.equal(500);
    });

    it('should have empty rootCache items', () => {
      expect(controller.rootCache.items).to.have.lengthOf(0);
    });
  });

  describe('with dataProviderParams', () => {
    let dataProviderParams;

    beforeEach(() => {
      dataProviderParams = () => ({ filter: 'bar' });

      controller = new DataProviderController(host, {
        pageSize: 50,
        isExpanded,
        dataProvider: (_params, callback) => callback([], 0),
        dataProviderParams,
      });
    });

    it('should have dataProviderParams', () => {
      expect(controller.dataProviderParams).to.equal(dataProviderParams);
    });

    it('should pass dataProviderParams to dataProvider', () => {
      const dataProviderSpy = sinon.spy(controller, 'dataProvider');
      controller.loadFirstPage();
      expect(dataProviderSpy).to.be.calledOnce;
      expect(dataProviderSpy.args[0][0]).to.eql({ page: 0, pageSize: 50, parentItem: undefined, filter: 'bar' });
    });
  });

  describe('clearing cache', () => {
    beforeEach(() => {
      controller = new DataProviderController(host, {
        size: 500,
        pageSize: 50,
        isExpanded,
        dataProvider: (_params, callback) => callback([], 0),
      });
    });

    it('should create a new cache', () => {
      const { rootCache } = controller;
      controller.clearCache();
      expect(controller.rootCache).to.not.equal(rootCache);
    });

    it('should set size for the new cache', () => {
      controller.clearCache();
      expect(controller.rootCache.size).to.equal(500);
    });

    it('should set pageSize for the new cache', () => {
      controller.clearCache();
      expect(controller.rootCache.pageSize).to.equal(50);
    });
  });

  describe('changing pageSize', () => {
    beforeEach(() => {
      controller = new DataProviderController(host, {
        pageSize: 50,
        isExpanded,
        dataProvider: (_params, callback) => callback([], 0),
      });
    });

    it('should set the new pageSize', () => {
      controller.setPageSize(10);
      expect(controller.pageSize).to.equal(10);
    });

    it('should set the new rootCache pageSize', () => {
      controller.setPageSize(10);
      expect(controller.rootCache.pageSize).to.equal(10);
    });

    it('should clear the cache', () => {
      const spy = sinon.spy(controller, 'clearCache');
      controller.setPageSize(10);
      expect(spy.calledOnce).to.be.true;
    });

    it('should pass the new pageSize to dataProvider when requesting data', () => {
      const dataProviderSpy = sinon.spy(controller, 'dataProvider');
      controller.setPageSize(10);
      controller.loadFirstPage();
      expect(dataProviderSpy).to.be.calledOnce;
      expect(dataProviderSpy.args[0][0]).to.eql({ page: 0, pageSize: 10, parentItem: undefined });
    });
  });

  describe('changing dataProvider', () => {
    beforeEach(() => {
      controller = new DataProviderController(host, {
        pageSize: 50,
        isExpanded,
        dataProvider: (_params, callback) => callback([], 0),
      });
    });

    it('should set the new dataProvider', () => {
      const dataProvider = (_params, callback) => callback([], 0);
      controller.setDataProvider(dataProvider);
      expect(controller.dataProvider).to.equal(dataProvider);
    });

    it('should clear the cache', () => {
      const spy = sinon.spy(controller, 'clearCache');
      controller.setDataProvider((_params, callback) => callback([], 0));
      expect(spy.calledOnce).to.be.true;
    });

    it('should request data using the new dataProvider', () => {
      controller.setDataProvider((_params, callback) => callback([], 0));
      const dataProviderSpy = sinon.spy(controller, 'dataProvider');
      controller.loadFirstPage();
      expect(dataProviderSpy).to.be.calledOnce;
    });
  });

  describe('recalculating flatSize', () => {
    beforeEach(() => {
      controller = new DataProviderController(host, {
        pageSize: 2,
        isExpanded,
        dataProvider: createDataProvider({ size: 10 }),
      });

      expandedItems = ['Item-0', 'Item-0-0'];

      controller.ensureFlatIndexLoaded(0);
      controller.ensureFlatIndexHierarchy(0);
      controller.ensureFlatIndexHierarchy(1);
      /**
       * .....................
       * 0: Item-0
       * 1:     Item-0-0
       * 2:        Item-0-0-0
       * 3:        Item-0-0-1
       * .....................
       */
    });

    it('should exclude collapsed sub-caches from flatSize', () => {
      expandedItems = [];
      controller.recalculateFlatSize();
      expect(controller.flatSize).to.equal(10);
    });

    it('should include expanded sub-caches in flatSize', () => {
      expandedItems = [];
      controller.recalculateFlatSize();
      expandedItems = ['Item-0', 'Item-0-0'];
      controller.recalculateFlatSize();
      expect(controller.flatSize).to.equal(30);
    });
  });

  describe('getFlatIndexContext', () => {
    let rootCache, subCache, subCacheSubCache;

    beforeEach(() => {
      controller = new DataProviderController(host, {
        pageSize: 2,
        isExpanded,
        dataProvider: createDataProvider({ size: 4 }),
      });

      expandedItems = ['Item-0', 'Item-0-0'];

      controller.ensureFlatIndexLoaded(0);
      controller.ensureFlatIndexHierarchy(0);
      controller.ensureFlatIndexHierarchy(1);
      /**
       * .....................
       * 0:  Item-0
       * 1:     Item-0-0
       * 2:         Item-0-0-0
       * 3:         Item-0-0-1
       * 4:         not loaded
       * 5:         not loaded
       * 6:     Item-0-1
       * 7:     not loaded
       * 8:     not loaded
       * 9:  Item-1
       * 10: not loaded
       * .....................
       */

      rootCache = controller.rootCache;
      subCache = rootCache.getSubCache(0);
      subCacheSubCache = subCache.getSubCache(0);
    });

    it('should return context for flat index corresponding to index 0 at level 0', () => {
      const context = controller.getFlatIndexContext(0);
      expect(context).to.include({ level: 0, index: 0, page: 0, item: 'Item-0', cache: rootCache });
    });

    it('should return context for flat index corresponding to index 0 at level 1', () => {
      const context = controller.getFlatIndexContext(1);
      expect(context).to.include({ level: 1, index: 0, page: 0, item: 'Item-0-0', cache: subCache });
    });

    it('should return context for flat index corresponding to index 0 at level 2', () => {
      const context = controller.getFlatIndexContext(2);
      expect(context).to.include({ level: 2, index: 0, page: 0, item: 'Item-0-0-0', cache: subCacheSubCache });
    });

    it('should return context for flat index corresponding to index 2 at level 2 (not loaded)', () => {
      const context = controller.getFlatIndexContext(4);
      expect(context).to.include({ level: 2, index: 2, page: 1, item: undefined, cache: subCacheSubCache });
    });

    it('should return context for flat index corresponding to index 1 at level 1', () => {
      const context = controller.getFlatIndexContext(6);
      expect(context).to.include({ level: 1, index: 1, page: 0, item: 'Item-0-1', cache: subCache });
    });

    it('should return context for flat index corresponding to index 2 at level 1 (not loaded)', () => {
      const context = controller.getFlatIndexContext(7);
      expect(context).to.include({ level: 1, index: 2, page: 1, item: undefined, cache: subCache });
    });

    it('should return context for flat index corresponding to index 1 at level 0', () => {
      const context = controller.getFlatIndexContext(9);
      expect(context).to.include({ level: 0, index: 1, page: 0, item: 'Item-1', cache: rootCache });
    });

    it('should return context for flat index corresponding to index 2 at level 0 (not loaded)', () => {
      const context = controller.getFlatIndexContext(10);
      expect(context).to.include({ level: 0, index: 2, page: 1, item: undefined, cache: rootCache });
    });
  });

  describe('getItemContext', () => {
    let rootCache, subCache0, subCache0SubCache0, subCache0SubCache1;

    beforeEach(() => {
      controller = new DataProviderController(host, {
        pageSize: 1,
        isExpanded: ({ id }) => {
          return !!expandedItems.find((item) => item.id === id);
        },
        getItemId: ({ id }) => id,
        dataProvider: createDataProvider({
          size: 3,
          generator: (parentItem, i) => {
            return { id: `${parentItem?.id ?? 'Item'}-${i}`, verified: true };
          },
        }),
      });

      expandedItems = [{ id: 'Item-0' }, { id: 'Item-0-0' }, { id: 'Item-0-1' }];

      controller.ensureFlatIndexLoaded(0);
      controller.ensureFlatIndexHierarchy(0);
      controller.ensureFlatIndexHierarchy(1);
      controller.ensureFlatIndexLoaded(3);
      controller.ensureFlatIndexLoaded(5);
      controller.ensureFlatIndexHierarchy(5);
      controller.ensureFlatIndexLoaded(10);
      /**
       * .....................
       * 0:  Item-0
       * 1:     Item-0-0
       * 2:         Item-0-0-0
       * 3:         Item-0-0-1
       * 4:         not loaded
       * 5:     Item-0-1
       * 6:         Item-0-1-0
       * 7:         not loaded
       * 8:         not loaded
       * 9:     not loaded
       * 10: Item-1
       * 11: not loaded
       * .....................
       */

      rootCache = controller.rootCache;
      subCache0 = rootCache.getSubCache(0);
      subCache0SubCache0 = subCache0.getSubCache(0);
      subCache0SubCache1 = subCache0.getSubCache(1);
    });

    it('should return context for item with flat index 0 (level 0)', () => {
      const context = controller.getItemContext({ id: 'Item-0' });
      expect(context).to.eql({
        level: 0,
        index: 0,
        page: 0,
        item: { id: 'Item-0', verified: true },
        flatIndex: 0,
        cache: rootCache,
        subCache: subCache0,
      });
    });

    it('should return context for item with flat index 1 (level 1)', () => {
      const context = controller.getItemContext({ id: 'Item-0-0' });
      expect(context).to.eql({
        level: 1,
        index: 0,
        page: 0,
        item: { id: 'Item-0-0', verified: true },
        flatIndex: 1,
        cache: subCache0,
        subCache: subCache0SubCache0,
      });
    });

    it('should return context for item with flat index 2 (level 2)', () => {
      const context = controller.getItemContext({ id: 'Item-0-0-0' });
      expect(context).to.eql({
        level: 2,
        index: 0,
        page: 0,
        item: { id: 'Item-0-0-0', verified: true },
        flatIndex: 2,
        cache: subCache0SubCache0,
        subCache: undefined,
      });
    });

    it('should return context for item with flat index 3 (level 2)', () => {
      const context = controller.getItemContext({ id: 'Item-0-0-1' });
      expect(context).to.eql({
        level: 2,
        index: 1,
        page: 1,
        item: { id: 'Item-0-0-1', verified: true },
        flatIndex: 3,
        cache: subCache0SubCache0,
        subCache: undefined,
      });
    });

    it('should return undefined for not loaded item with flat index 4 (level 2)', () => {
      const context = controller.getItemContext({ id: 'Item-0-0-2' });
      expect(context).to.be.undefined;
    });

    it('should return context for item with flat index 5 (level 1)', () => {
      const context = controller.getItemContext({ id: 'Item-0-1' });
      expect(context).to.eql({
        level: 1,
        index: 1,
        page: 1,
        item: { id: 'Item-0-1', verified: true },
        flatIndex: 5,
        cache: subCache0,
        subCache: subCache0SubCache1,
      });
    });

    it('should return context for item with flat index 6 (level 2)', () => {
      const context = controller.getItemContext({ id: 'Item-0-1-0' });
      expect(context).to.eql({
        level: 2,
        index: 0,
        page: 0,
        item: { id: 'Item-0-1-0', verified: true },
        flatIndex: 6,
        cache: subCache0SubCache1,
        subCache: undefined,
      });
    });

    it('should return undefined for not loaded item with flat index 9 (level 1)', () => {
      const context = controller.getItemContext({ id: 'Item-0-2' });
      expect(context).to.be.undefined;
    });

    it('should return context for item with flat index 10 (level 0)', () => {
      const context = controller.getItemContext({ id: 'Item-1' });
      expect(context).to.eql({
        level: 0,
        index: 1,
        page: 1,
        item: { id: 'Item-1', verified: true },
        flatIndex: 10,
        cache: rootCache,
        subCache: undefined,
      });
    });

    it('should return undefined for not loaded item with flat index 11 (level 0)', () => {
      const context = controller.getItemContext({ id: 'Item-2' });
      expect(context).to.be.undefined;
    });
  });

  describe('getFlatIndexByPath', () => {
    beforeEach(() => {
      controller = new DataProviderController(host, {
        pageSize: 3,
        isExpanded,
        dataProvider: createDataProvider({ size: 3 }),
      });

      expandedItems = ['Item-0', 'Item-0-0', 'Item-0-2', 'Item-2', 'Item-2-0'];

      controller.ensureFlatIndexLoaded(0);
      controller.ensureFlatIndexHierarchy(0);
      controller.ensureFlatIndexHierarchy(1);
      controller.ensureFlatIndexHierarchy(6);
      controller.ensureFlatIndexHierarchy(11);
      controller.ensureFlatIndexHierarchy(12);
      /**
       * .....................
       * 0:  Item-0
       * 1:     Item-0-0
       * 2:         Item-0-0-0
       * 3:         Item-0-0-1
       * 4:         Item-0-0-2
       * 5:     Item-0-1
       * 6:     Item-0-2
       * 7:         Item-0-2-0
       * 8:         Item-0-2-1
       * 9:         Item-0-2-2
       * 10: Item-1
       * 11: Item-2
       * 12:    Item-2-0
       * 13:        Item-2-0-0
       * 14:        Item-2-0-1
       * 15:        Item-2-0-2
       * 16:    Item-2-1
       * 17:    Item-2-2
       * .....................
       */
    });

    it('should return flat index for path [0]', () => {
      expect(controller.getFlatIndexByPath([0])).to.equal(0);
    });

    it('should return flat index for path [1]', () => {
      expect(controller.getFlatIndexByPath([1])).to.equal(10);
    });

    it('should return flat index for path [0, 0]', () => {
      expect(controller.getFlatIndexByPath([0, 0])).to.equal(1);
    });

    it('should return flat index for path [0, 1]', () => {
      expect(controller.getFlatIndexByPath([0, 1])).to.equal(5);
    });

    it('should return flat index for path [0, 0, 0]', () => {
      expect(controller.getFlatIndexByPath([0, 0, 0])).to.equal(2);
    });

    it('should return flat index for path [0, 0, 1]', () => {
      expect(controller.getFlatIndexByPath([0, 0, 1])).to.equal(3);
    });

    it('should return flat index for path [Infinity]', () => {
      expect(controller.getFlatIndexByPath([Infinity])).to.equal(11);
    });

    it('should return flat index for path [Infinity, 0]', () => {
      expect(controller.getFlatIndexByPath([Infinity, 0])).to.equal(12);
    });

    it('should return flat index for path [0, Infinity]', () => {
      expect(controller.getFlatIndexByPath([0, Infinity])).to.equal(6);
    });

    it('should return flat index for path [Infinity, 0, 0]', () => {
      expect(controller.getFlatIndexByPath([Infinity, 0, 0])).to.equal(13);
    });

    it('should return flat index for path [0, Infinity, 0]', () => {
      expect(controller.getFlatIndexByPath([0, Infinity, 0])).to.equal(7);
    });

    it('should return flat index for path [0, 0, Infinity]', () => {
      expect(controller.getFlatIndexByPath([0, 0, Infinity])).to.equal(4);
    });
  });
});

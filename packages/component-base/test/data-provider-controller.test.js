import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { Cache } from '../src/data-provider-controller/cache.js';
import { DataProviderController } from '../src/data-provider-controller/data-provider-controller.js';

describe('DataProviderController', () => {
  let host, controller;

  const expandedItems = [];

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

    it('should have rootCache', () => {
      expect(controller.rootCache).to.be.instanceOf(Cache);
    });

    it('should have rootCache size', () => {
      expect(controller.rootCache.size).to.equal(0);
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

    it('should have size', () => {
      expect(controller.size).to.equal(500);
    });

    it('should have rootCache size', () => {
      expect(controller.rootCache.size).to.equal(500);
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
  });

  describe('clearCache', () => {
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

  describe('setSize', () => {
    beforeEach(() => {
      controller = new DataProviderController(host, {
        pageSize: 50,
        isExpanded,
        dataProvider: (_params, callback) => callback([], 0),
      });
    });

    it('should update size', () => {
      controller.setSize(100);
      expect(controller.size).to.equal(100);
    });

    it('should update rootCache size', () => {
      controller.setSize(100);
      expect(controller.rootCache.size).to.equal(100);
    });

    it('should recalculate flatSize', () => {
      controller.setSize(100);
      expect(controller.flatSize).to.equal(100);
    });
  });

  describe('setPageSize', () => {
    beforeEach(() => {
      controller = new DataProviderController(host, {
        pageSize: 50,
        isExpanded,
        dataProvider: (_params, callback) => callback([], 0),
      });
    });

    it('should update pageSize', () => {
      controller.setPageSize(10);
      expect(controller.pageSize).to.equal(10);
    });

    it('should update rootCache pageSize', () => {
      controller.setPageSize(10);
      expect(controller.rootCache.pageSize).to.equal(10);
    });

    it('should clear the cache', () => {
      const spy = sinon.spy(controller, 'clearCache');
      controller.setPageSize(10);
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe('setDataProvider', () => {
    beforeEach(() => {
      controller = new DataProviderController(host, {
        pageSize: 50,
        isExpanded,
        dataProvider: (_params, callback) => callback([], 0),
      });
    });

    it('should update dataProvider', () => {
      const dataProvider = (_params, callback) => callback([], 0);
      controller.setDataProvider(dataProvider);
      expect(controller.dataProvider).to.equal(dataProvider);
    });

    it('should clear the cache', () => {
      const spy = sinon.spy(controller, 'clearCache');
      controller.setDataProvider((_params, callback) => callback([], 0));
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe('recalculateFlatSize', () => {
    beforeEach(() => {
      controller = new DataProviderController(host, {
        pageSize: 50,
        isExpanded,
        dataProvider: (_params, callback) => callback([], 0),
      });
    });

    it('should delegate the call to rootCache', () => {
      const spy = sinon.spy(controller.rootCache, 'recalculateFlatSize');
      controller.recalculateFlatSize();
      expect(spy.calledOnce).to.be.true;
    });
  });
});

import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import '@vaadin/testing-helpers';
import { Cache } from '../src/data-provider-controller/cache.js';
import { DataProviderController } from '../src/data-provider-controller/data-provider-controller.js';
import { createDataProvider } from './data-provider-controller-helpers.js';

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

  describe('changing size', () => {
    beforeEach(() => {
      controller = new DataProviderController(host, {
        pageSize: 50,
        isExpanded,
        dataProvider: (_params, callback) => callback([], 0),
      });
    });

    it('should set the new size', () => {
      controller.setSize(100);
      expect(controller.size).to.equal(100);
    });

    it('should set the new rootCache size', () => {
      controller.setSize(100);
      expect(controller.rootCache.size).to.equal(100);
    });

    it('should recalculate flatSize', () => {
      controller.setSize(100);
      expect(controller.flatSize).to.equal(100);
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
});

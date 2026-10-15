import { expect } from '@vaadin/chai-plugins';
import { aTimeout } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/testing-helpers';
import { DataProviderController } from '../src/data-provider-controller/data-provider-controller.js';
import { createDataProvider } from './data-provider-controller-helpers.js';

describe('DataProviderController - data loading', () => {
  let host, controller, dataProviderSpy;
  let expandedItems = [];

  function isExpanded(item) {
    return expandedItems.includes(item);
  }

  beforeEach(() => {
    host = document.createElement('div');
  });

  describe('loadFirstPage', () => {
    beforeEach(() => {
      controller = new DataProviderController(host, {
        pageSize: 2,
        dataProvider: createDataProvider({ size: 10, async: true }),
      });

      dataProviderSpy = sinon.spy(controller, 'dataProvider');
    });

    it('should request first page', () => {
      controller.loadFirstPage();
      expect(dataProviderSpy).to.be.calledOnce;
      expect(dataProviderSpy.args[0][0]).to.eql({ page: 0, pageSize: 2, parentItem: undefined });
      expect(dataProviderSpy.args[0][1]).to.be.a('function');
    });

    it('should set loading state to true when page is requested', () => {
      controller.loadFirstPage();
      expect(controller.isLoading()).to.be.true;
    });

    it('should add items to the cache when page is received', async () => {
      controller.loadFirstPage();
      await aTimeout(0);
      expect(controller.rootCache.items).to.have.lengthOf(2);
      expect(controller.rootCache.items).to.eql(['Item-0', 'Item-1']);
    });

    it('should update size for the cache when page is received', async () => {
      controller.loadFirstPage();
      await aTimeout(0);
      expect(controller.rootCache.size).to.equal(10);
    });

    it('should recalculate flatSize when page is received', async () => {
      controller.loadFirstPage();
      await aTimeout(0);
      expect(controller.flatSize).to.equal(10);
    });

    it('should set loading state to false when page is received', async () => {
      controller.loadFirstPage();
      await aTimeout(0);
      expect(controller.isLoading()).to.be.false;
    });

    it('should not request first page if it is already loading', () => {
      controller.loadFirstPage();
      controller.loadFirstPage();
      expect(dataProviderSpy).to.be.calledOnce;
    });

    it('should request first page again even if it is already loaded', async () => {
      controller.loadFirstPage();
      await aTimeout(0);
      dataProviderSpy.resetHistory();
      controller.loadFirstPage();
      expect(dataProviderSpy).to.be.calledOnce;
    });
  });

  describe('ensureFlatIndexLoaded', () => {
    beforeEach(() => {
      controller = new DataProviderController(host, {
        pageSize: 2,
        isExpanded,
        dataProvider: createDataProvider({ size: 10, async: true }),
      });

      dataProviderSpy = sinon.spy(controller, 'dataProvider');
    });

    it('should request page 0 when called with index 0', () => {
      controller.ensureFlatIndexLoaded(0);
      expect(dataProviderSpy).to.be.calledOnce;
      expect(dataProviderSpy.args[0][0]).to.eql({ page: 0, pageSize: 2, parentItem: undefined });
    });

    it('should request page 0 when called with index 1', () => {
      controller.ensureFlatIndexLoaded(1);
      expect(dataProviderSpy).to.be.calledOnce;
      expect(dataProviderSpy.args[0][0]).to.eql({ page: 0, pageSize: 2, parentItem: undefined });
    });

    it('should request page 1 when called with index 2', () => {
      controller.ensureFlatIndexLoaded(2);
      expect(dataProviderSpy).to.be.calledOnce;
      expect(dataProviderSpy.args[0][0]).to.eql({ page: 1, pageSize: 2, parentItem: undefined });
    });

    it('should not request page if it is already loading', () => {
      controller.ensureFlatIndexLoaded(0);
      controller.ensureFlatIndexLoaded(1);
      controller.ensureFlatIndexLoaded(0);
      controller.ensureFlatIndexLoaded(1);
      expect(dataProviderSpy).to.be.calledOnce;
      expect(dataProviderSpy.args[0][0]).to.eql({ page: 0, pageSize: 2, parentItem: undefined });
    });

    it('should not request page if the corresponding item is already loaded', async () => {
      controller.ensureFlatIndexLoaded(0);
      await aTimeout(0);
      dataProviderSpy.resetHistory();
      controller.ensureFlatIndexLoaded(0);
      expect(dataProviderSpy).to.be.not.called;
    });

    it('should add items to the root cache when page is received', async () => {
      controller.ensureFlatIndexLoaded(0);
      await aTimeout(0);
      expect(controller.rootCache.items).eql(['Item-0', 'Item-1']);
    });

    it('should update size for the root cache when page is received', async () => {
      controller.ensureFlatIndexLoaded(0);
      await aTimeout(0);
      expect(controller.rootCache.size).to.equal(10);
    });
  });

  describe('ensureFlatIndexHierarchy', () => {
    beforeEach(() => {
      controller = new DataProviderController(host, {
        pageSize: 2,
        isExpanded,
        dataProvider: createDataProvider({ size: 10, async: true }),
      });

      dataProviderSpy = sinon.spy(controller, 'dataProvider');
    });

    describe('index is not loaded', () => {
      it('should not create a sub-cache', () => {
        controller.ensureFlatIndexHierarchy(0);
        expect(controller.rootCache.subCaches).to.have.lengthOf(0);
      });

      it('should not request data', () => {
        controller.ensureFlatIndexHierarchy(0);
        expect(dataProviderSpy).to.be.not.called;
      });
    });

    describe('index is loaded but not expanded', () => {
      beforeEach(async () => {
        controller.ensureFlatIndexLoaded(0);
        await aTimeout(0);
        dataProviderSpy.resetHistory();
      });

      it('should not create a sub-cache', () => {
        controller.ensureFlatIndexHierarchy(0);
        expect(controller.rootCache.subCaches).to.have.lengthOf(0);
      });

      it('should not request data', () => {
        controller.ensureFlatIndexHierarchy(0);
        expect(dataProviderSpy).to.be.not.called;
      });
    });

    describe('index is loaded and expanded', () => {
      beforeEach(async () => {
        expandedItems = ['Item-0'];
        controller.ensureFlatIndexLoaded(0);
        await aTimeout(0);
        dataProviderSpy.resetHistory();
      });

      it('should create a sub-cache', () => {
        controller.ensureFlatIndexHierarchy(0);
        const subCache = controller.rootCache.getSubCache(0);
        expect(subCache).to.exist;
        expect(subCache.parentItem).to.equal('Item-0');
        expect(subCache.parentCache).to.equal(controller.rootCache);
      });

      it('should request first page for the sub-cache', () => {
        controller.ensureFlatIndexHierarchy(0);
        expect(dataProviderSpy).to.be.calledOnce;
        expect(dataProviderSpy.args[0][0]).to.eql({ page: 0, pageSize: 2, parentItem: 'Item-0' });
      });

      it('should add items to the sub-cache when first page is received', async () => {
        controller.ensureFlatIndexHierarchy(0);
        await aTimeout(0);
        const subCache = controller.rootCache.getSubCache(0);
        expect(subCache.items).to.have.lengthOf(2);
        expect(subCache.items).to.eql(['Item-0-0', 'Item-0-1']);
      });

      it('should update size for the sub-cache when first page is received', async () => {
        controller.ensureFlatIndexHierarchy(0);
        await aTimeout(0);
        const subCache = controller.rootCache.getSubCache(0);
        expect(subCache.size).to.equal(10);
      });
    });

    describe('ensureFlatIndexLoaded', () => {
      beforeEach(async () => {
        expandedItems = ['Item-0'];
        controller.ensureFlatIndexLoaded(0);
        await aTimeout(0);
        controller.ensureFlatIndexHierarchy(0);
        await aTimeout(0);
        dataProviderSpy.resetHistory();

        /**
         * .....................
         * 0: Item-0
         * 1:     Item-0-0
         * 2:     Item-0-1
         * 3:     not loaded
         * .....................
         * 11: Item-1
         * .....................
         */
      });

      it('should not request page for sub-level indexes that are already loaded', () => {
        controller.ensureFlatIndexLoaded(1);
        controller.ensureFlatIndexLoaded(2);
        expect(dataProviderSpy).to.be.not.called;
      });

      it('should request page for sub-level index that is not yet loaded', () => {
        controller.ensureFlatIndexLoaded(3);
        expect(dataProviderSpy).to.be.calledOnce;
        expect(dataProviderSpy.args[0][0]).to.eql({ page: 1, pageSize: 2, parentItem: 'Item-0' });
      });

      it('should set loading state to true when page is requested', () => {
        controller.ensureFlatIndexLoaded(3);
        expect(controller.isLoading()).to.be.true;
      });

      it('should add items to the sub-cache when page is received', async () => {
        controller.ensureFlatIndexLoaded(3);
        await aTimeout(0);
        const subCache = controller.rootCache.getSubCache(0);
        expect(subCache.items).to.have.lengthOf(4);
        expect(subCache.items).to.eql(['Item-0-0', 'Item-0-1', 'Item-0-2', 'Item-0-3']);
      });

      it('should set loading state to false when page is received', async () => {
        controller.ensureFlatIndexLoaded(3);
        await aTimeout(0);
        expect(controller.isLoading()).to.be.false;
      });
    });
  });
});

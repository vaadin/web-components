import { expect } from '@esm-bundle/chai';
import { aTimeout } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/testing-helpers';
import { DataProviderController } from '../src/data-provider-controller/data-provider-controller.js';

function createDataProvider({ size }) {
  const items = Array.from({ length: size }, (_, i) => `Item ${i}`);

  return ({ page, pageSize }, callback) => {
    const startIndex = page * pageSize;
    const pageItems = items.splice(startIndex, pageSize);
    setTimeout(() => callback(pageItems, size));
  };
}

describe('DataProviderController - data loading', () => {
  let host, controller, dataProviderSpy;

  beforeEach(() => {
    host = document.createElement('div');
  });

  describe('loadFirstPage', () => {
    beforeEach(() => {
      controller = new DataProviderController(host, {
        pageSize: 2,
        dataProvider: createDataProvider({ size: 10 }),
      });

      dataProviderSpy = sinon.spy(controller, 'dataProvider');
    });

    it('should request the first page', () => {
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
      expect(controller.rootCache.items).to.eql(['Item 0', 'Item 1']);
    });

    it('should update size for the cache when page is received', async () => {
      controller.loadFirstPage();
      await aTimeout(0);
      expect(controller.rootCache.size).to.equal(10);
    });

    it('should recalculate effectiveSize when page is received', async () => {
      controller.loadFirstPage();
      await aTimeout(0);
      expect(controller.effectiveSize).to.equal(10);
    });

    it('should set loading state to false when page is received', async () => {
      controller.loadFirstPage();
      await aTimeout(0);
      expect(controller.isLoading()).to.be.false;
    });

    it('should not request the first page if it is already loading', () => {
      controller.loadFirstPage();
      controller.loadFirstPage();
      expect(dataProviderSpy).to.be.calledOnce;
    });

    it('should request the first page again even if it is already loaded', async () => {
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
        dataProvider: createDataProvider({ size: 10 }),
      });

      dataProviderSpy = sinon.spy(controller, 'dataProvider');
    });

    describe('root cache index', () => {});

    it('should request a root index', () => {});
  });

  describe('ensureFlatIndexHierarchy', () => {});
});

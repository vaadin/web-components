import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-grid.js';
import { flushGrid } from './helpers.js';

describe('deprecated API', () => {
  let grid;

  beforeEach(() => {
    sinon.stub(console, 'warn');

    grid = fixtureSync(`
      <vaadin-grid size="2">
        <vaadin-grid-column></vaadin-grid-column>
      </vaadin-grid>
    `);
    grid.dataProvider = ({ parentItem }, callback) => {
      if (parentItem) {
        callback([`${parentItem}-0`, `${parentItem}-1`], 2);
      } else {
        callback(['Item 0', 'Item 1'], 2);
      }
    };
    grid.expandedItems = ['Item 0'];
    flushGrid(grid);
  });

  afterEach(() => {
    console.warn.restore();
  });

  describe('_loadPage', () => {
    it('should delegate the call to dataProviderController', () => {
      const spy = sinon.spy(grid._dataProviderController, '__loadCachePage');
      grid._loadPage(0, grid._dataProviderController.rootCache);
      expect(spy).to.be.calledOnce;
      expect(spy).to.be.calledWith(grid._dataProviderController.rootCache, 0);
    });

    it('should warn about the property being deprecated', () => {
      grid._loadPage(0, grid._dataProviderController.rootCache);
      expect(console.warn).to.be.calledOnce;
      expect(console.warn).to.be.calledWith(
        '<vaadin-grid> The `_loadPage` method is deprecated and will be removed in Vaadin 25.',
      );
    });
  });

  describe('_effectiveSize', () => {
    it('should return the flattened size', () => {
      expect(grid._effectiveSize).to.equal(4);
    });

    it('should warn about the property being deprecated', () => {
      const result = grid._effectiveSize; // eslint-disable-line @typescript-eslint/no-unused-vars
      expect(console.warn).to.be.calledOnce;
      expect(console.warn).to.be.calledWith(
        '<vaadin-grid> The `_effectiveSize` property is deprecated and will be removed in Vaadin 25.',
      );
    });
  });

  describe('_cache', () => {
    it('should return the root cache', () => {
      expect(grid._cache).to.equal(grid._dataProviderController.rootCache);
    });

    it('should warn about the property being deprecated', () => {
      const result = grid._cache; // eslint-disable-line @typescript-eslint/no-unused-vars
      expect(console.warn).to.be.calledOnce;
      expect(console.warn).to.be.calledWith(
        '<vaadin-grid> The `_cache` property is deprecated and will be removed in Vaadin 25.',
      );
    });
  });

  describe('_cache effectiveSize', () => {
    it('should return the flattened size', () => {
      expect(grid._cache.effectiveSize).to.equal(4);
    });

    it('should warn about the property being deprecated', () => {
      const result = grid._cache.effectiveSize; // eslint-disable-line @typescript-eslint/no-unused-vars
      expect(console.warn).to.be.calledTwice;
      expect(console.warn.lastCall).to.be.calledWith(
        '<vaadin-grid> The `effectiveSize` property of ItemCache is deprecated and will be removed in Vaadin 25.',
      );
    });
  });

  describe('_cache getItemForIndex', () => {
    it('should return the item for the given index', () => {
      expect(grid._cache.getItemForIndex(1)).to.equal('Item 0-0');
    });

    it('should warn about the method being deprecated', () => {
      grid._cache.getItemForIndex(1);
      expect(console.warn).to.be.calledTwice;
      expect(console.warn.lastCall).to.be.calledWith(
        '<vaadin-grid> The `getItemForIndex` method of ItemCache is deprecated and will be removed in Vaadin 25.',
      );
    });
  });

  describe('_cache updateSize', () => {
    it('should call recalculateFlatSize', () => {
      const spy = sinon.spy(grid._cache, 'recalculateFlatSize');
      grid._cache.updateSize();
      expect(spy).to.be.calledOnce;
    });

    it('should warn about the method being deprecated', () => {
      grid._cache.updateSize();
      expect(console.warn).to.be.calledTwice;
      expect(console.warn.lastCall).to.be.calledWith(
        '<vaadin-grid> The `updateSize` method of ItemCache is deprecated and will be removed in Vaadin 25.',
      );
    });
  });

  describe('_cache getCacheAndIndex', () => {
    it('should return the cache and scaled index for the given index', () => {
      const { cache, scaledIndex } = grid._cache.getCacheAndIndex(1);
      expect(cache).to.equal(grid._dataProviderController.rootCache.subCaches[0]);
      expect(scaledIndex).to.equal(0);
    });

    it('should warn about the method being deprecated', () => {
      grid._cache.getCacheAndIndex(1);
      expect(console.warn).to.be.calledTwice;
      expect(console.warn.lastCall).to.be.calledWith(
        '<vaadin-grid> The `getCacheAndIndex` method of ItemCache is deprecated and will be removed in Vaadin 25.',
      );
    });
  });

  describe('_cache ensureSubCacheForScaledIndex', () => {
    it('should create a sub-cache for the given index and request the first page', () => {
      grid._cache.ensureSubCacheForScaledIndex(1);
      const subCache = grid._dataProviderController.rootCache.getSubCache(1);
      expect(subCache).to.exist;
      expect(subCache.items).to.eql(['Item 1-0', 'Item 1-1']);
    });

    it('should warn about the method being deprecated', () => {
      grid._cache.ensureSubCacheForScaledIndex(1);
      expect(console.warn).to.be.calledTwice;
      expect(console.warn.lastCall).to.be.calledWith(
        '<vaadin-grid> The `ensureSubCacheForScaledIndex` method of ItemCache is deprecated and will be removed in Vaadin 25.',
      );
    });
  });

  describe('_cache grid', () => {
    it('should return the grid instance', () => {
      expect(grid._cache.grid).to.equal(grid);
    });

    it('should warn about the property being deprecated', () => {
      const result = grid._cache.grid; // eslint-disable-line @typescript-eslint/no-unused-vars
      expect(console.warn).to.be.calledTwice;
      expect(console.warn.lastCall).to.be.calledWith(
        '<vaadin-grid> The `grid` property of ItemCache is deprecated and will be removed in Vaadin 25.',
      );
    });
  });

  describe('_cache itemCaches', () => {
    it('should return an object with sub-caches by index', () => {
      const { itemCaches } = grid._cache;
      expect(itemCaches[0]).to.equal(grid._dataProviderController.rootCache.getSubCache(0));
    });

    it('should warn about the property being deprecated', () => {
      const result = grid._cache.itemCaches; // eslint-disable-line @typescript-eslint/no-unused-vars
      expect(console.warn).to.be.calledTwice;
      expect(console.warn.lastCall).to.be.calledWith(
        '<vaadin-grid> The `itemCaches` property of ItemCache is deprecated and will be removed in Vaadin 25.',
      );
    });
  });
});

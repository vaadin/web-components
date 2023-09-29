import { expect } from '@esm-bundle/chai';
import { DataProviderController } from '../src/data-provider-controller/data-provider-controller.js';
import { createDataProvider } from './data-provider-controller-helpers.js';

describe('DataProviderController - flat index', () => {
  let host, controller;

  let expandedItems = [];

  function isExpanded(item) {
    return expandedItems.includes(item);
  }

  beforeEach(() => {
    host = document.createElement('div');
  });

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
     * 2:         Item-0-0-0
     * 3:         Item-0-0-1
     * 4:         not loaded
     * .....................
     * 12:    Item-0-1
     * 13:    not loaded
     * .....................
     * 21: Item-1
     * 22: not loaded
     * .....................
     */
  });

  it('should return context for index 0 = item 0 at level 0', () => {
    const context = controller.getFlatIndexContext(0);
    expect(context).to.include({
      cache: controller.rootCache,
      level: 0,
      index: 0,
      page: 0,
      item: 'Item-0',
    });
  });

  it('should return context for index 1 = item 0 at level 1', () => {
    const context = controller.getFlatIndexContext(1);
    expect(context).to.include({
      cache: controller.rootCache.getSubCache(0),
      level: 1,
      index: 0,
      page: 0,
      item: 'Item-0-0',
    });
  });

  it('should return context for index 2 = item 0 at level 2', () => {
    const context = controller.getFlatIndexContext(2);
    expect(context).to.include({
      cache: controller.rootCache.getSubCache(0).getSubCache(0),
      level: 2,
      index: 0,
      page: 0,
      item: 'Item-0-0-0',
    });
  });

  it('should return context for index 4 = not loaded item 2 at level 2', () => {
    const context = controller.getFlatIndexContext(4);
    expect(context).to.include({
      cache: controller.rootCache.getSubCache(0).getSubCache(0),
      level: 2,
      index: 2,
      page: 1,
      item: undefined,
    });
  });

  it('should return context for index 12 = item 1 at level 2', () => {
    const context = controller.getFlatIndexContext(12);
    expect(context).to.include({
      cache: controller.rootCache.getSubCache(0),
      level: 1,
      index: 1,
      page: 0,
      item: 'Item-0-1',
    });
  });

  it('should return context for index 13 = not loaded item 2 at level 1', () => {
    const context = controller.getFlatIndexContext(13);
    expect(context).to.include({
      cache: controller.rootCache.getSubCache(0),
      level: 1,
      index: 2,
      page: 1,
      item: undefined,
    });
  });

  it('should return context for index 21 = item 1 at level 0', () => {
    const context = controller.getFlatIndexContext(21);
    expect(context).to.include({
      cache: controller.rootCache,
      level: 0,
      index: 1,
      page: 0,
      item: 'Item-1',
    });
  });

  it('should return context for index 22 = not loaded item 2 at level 0', () => {
    const context = controller.getFlatIndexContext(22);
    expect(context).to.include({
      cache: controller.rootCache,
      level: 0,
      index: 2,
      page: 1,
      item: undefined,
    });
  });
});

import { expect } from '@vaadin/chai-plugins';
import '@vaadin/testing-helpers';
import { DataProviderController } from '../src/data-provider-controller/data-provider-controller.js';

describe('DataProviderController - data callbacks', () => {
  let host, controller, dataProviderCallback;

  beforeEach(() => {
    host = document.createElement('div');

    controller = new DataProviderController(host, {
      pageSize: 2,
      dataProvider: (_params, callback) => {
        dataProviderCallback = callback;
      },
    });
  });

  it('should ignore data from re-invoked callbacks', () => {
    controller.loadFirstPage();
    dataProviderCallback(['Item-0', 'Item-1'], 2);
    dataProviderCallback(['Item-2'], 1);
    expect(controller.rootCache.size).to.equal(2);
    expect(controller.rootCache.items).to.eql(['Item-0', 'Item-1']);
  });

  it('should ignore data from callbacks created before cache clear', () => {
    controller.loadFirstPage();
    controller.clearCache();
    dataProviderCallback(['Item-0', 'Item-1'], 2);
    expect(controller.rootCache.size).to.be.undefined;
    expect(controller.rootCache.items).to.have.lengthOf(0);
  });
});

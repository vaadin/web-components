import { expect } from '@vaadin/chai-plugins';
import { aTimeout } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { DataProviderController } from '../src/data-provider-controller/data-provider-controller.js';
import { createDataProvider } from './data-provider-controller-helpers.js';

describe('DataProviderController - events', () => {
  let host, controller, pageRequestedSpy, pageReceivedSpy, pageLoadedSpy;

  beforeEach(() => {
    host = document.createElement('div');

    controller = new DataProviderController(host, {
      pageSize: 2,
      dataProvider: createDataProvider({ size: 10, async: true }),
    });

    pageRequestedSpy = sinon.spy();
    controller.addEventListener('page-requested', pageRequestedSpy);
    pageReceivedSpy = sinon.spy();
    controller.addEventListener('page-received', pageReceivedSpy);
    pageLoadedSpy = sinon.spy();
    controller.addEventListener('page-loaded', pageLoadedSpy);
  });

  it('should fire page-requested event when a page request is made', () => {
    controller.loadFirstPage();
    expect(pageRequestedSpy).to.be.calledOnce;
  });

  it('should fire page-received event when page items are received', async () => {
    controller.loadFirstPage();
    expect(pageReceivedSpy).to.be.not.called;
    await aTimeout(0);
    expect(pageReceivedSpy).to.be.calledOnce;
  });

  it('should fire page-loaded event when a page request is completed', async () => {
    controller.loadFirstPage();
    expect(pageLoadedSpy).to.be.not.called;
    await aTimeout(0);
    expect(pageLoadedSpy).to.be.calledOnce;
  });

  it('should fire page-loaded event after page-received event', async () => {
    controller.loadFirstPage();
    await aTimeout(0);
    expect(pageLoadedSpy).to.be.calledAfter(pageReceivedSpy);
  });

  it('should be in loading state when page-requested event is fired', () => {
    controller.addEventListener('page-requested', () => {
      expect(controller.isLoading()).to.be.true;
    });

    controller.loadFirstPage();
  });

  it('should have flatSize recalculated when page-received event is fired', async () => {
    controller.addEventListener('page-received', () => {
      expect(controller.flatSize).to.equal(10);
    });

    controller.loadFirstPage();
    await aTimeout(0);
  });

  it('should have page items added when page-received event is fired', async () => {
    controller.addEventListener('page-received', () => {
      expect(controller.rootCache.items).to.have.lengthOf(2);
      expect(controller.rootCache.items).to.eql(['Item-0', 'Item-1']);
    });

    controller.loadFirstPage();
    await aTimeout(0);
  });

  it('should be in loading state when page-received event is fired', async () => {
    controller.addEventListener('page-received', () => {
      expect(controller.isLoading()).to.be.true;
    });

    controller.loadFirstPage();
    await aTimeout(0);
  });

  it('should not be in loading state when page-loaded is fired', async () => {
    controller.addEventListener('page-loaded', () => {
      expect(controller.isLoading()).to.be.false;
    });

    controller.loadFirstPage();
    await aTimeout(0);
  });
});

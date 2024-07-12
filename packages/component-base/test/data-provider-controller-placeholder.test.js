import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import '@vaadin/testing-helpers';
import { DataProviderController } from '../src/data-provider-controller/data-provider-controller.js';
import { createDataProvider } from './data-provider-controller-helpers.js';

class Placeholder {}

class CustomPlaceholder extends Placeholder {}

describe('DataProviderController - placeholder', () => {
  let host, controller, placeholder, dataProviderSpy;

  describe('default', () => {
    beforeEach(() => {
      host = document.createElement('div');

      placeholder = new Placeholder();

      controller = new DataProviderController(host, {
        size: 10,
        pageSize: 2,
        placeholder,
        dataProvider: createDataProvider({ size: 10, async: true }),
      });

      dataProviderSpy = sinon.spy(controller, 'dataProvider');
    });

    it('should have placeholder', () => {
      expect(controller.placeholder).to.equal(placeholder);
    });

    it('should have rootCache items filled with placeholders', () => {
      expect(controller.rootCache.items).to.have.lengthOf(10);
      expect(controller.rootCache.items.every((item) => item === placeholder)).to.be.true;
    });

    it('should request data when encountering the controller placeholder instance', () => {
      controller.ensureFlatIndexLoaded(0);
      expect(dataProviderSpy).to.have.callCount(1);

      controller.ensureFlatIndexLoaded(1);
      expect(dataProviderSpy).to.have.callCount(1);

      controller.ensureFlatIndexLoaded(2);
      expect(dataProviderSpy).to.have.callCount(2);

      controller.ensureFlatIndexLoaded(3);
      expect(dataProviderSpy).to.have.callCount(2);
    });

    it('should not request data when encountering a different placeholder instance', () => {
      controller.rootCache.items[0] = new CustomPlaceholder();
      controller.ensureFlatIndexLoaded(0);
      expect(dataProviderSpy).to.have.callCount(0);
    });
  });

  describe('custom equality function', () => {
    beforeEach(() => {
      host = document.createElement('div');

      controller = new DataProviderController(host, {
        size: 10,
        pageSize: 2,
        placeholder: new Placeholder(),
        isPlaceholder: (item) => item instanceof Placeholder,
        dataProvider: createDataProvider({ size: 10, async: true }),
      });

      dataProviderSpy = sinon.spy(controller, 'dataProvider');
    });

    it('should request data when encountering any placeholder instance', () => {
      controller.rootCache.items[0] = new CustomPlaceholder();

      controller.ensureFlatIndexLoaded(0);
      expect(dataProviderSpy).to.have.callCount(1);

      controller.ensureFlatIndexLoaded(2);
      expect(dataProviderSpy).to.have.callCount(2);
    });
  });
});

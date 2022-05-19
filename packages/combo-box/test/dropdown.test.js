import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-combo-box.js';
import '../src/vaadin-combo-box-overlay.js';
import { makeItems } from './helpers.js';

describe('overlay', () => {
  let overlay;

  beforeEach(() => {
    overlay = fixtureSync(`<vaadin-combo-box-overlay></vaadin-combo-box-overlay>`);
  });

  it('should not show the overlay when closed', () => {
    overlay.opened = false;

    expect(window.getComputedStyle(overlay).display).to.eql('none');
  });

  it('should show the overlay when opened', () => {
    overlay.opened = true;

    expect(window.getComputedStyle(overlay).display).not.to.eql('none');
  });

  describe('loader part', () => {
    let loader;

    beforeEach(() => {
      loader = overlay.shadowRoot.querySelector('[part~="loader"]');
    });

    it('should be present in overlay', () => {
      expect(loader).to.not.be.null;
    });

    it('should be in overlay part', () => {
      expect(loader.parentNode.getAttribute('part')).to.include('overlay');
    });

    it('should be before content part', () => {
      expect(loader.nextElementSibling.getAttribute('part')).to.include('content');
    });
  });

  describe('with data provider', () => {
    let comboBox, dropdown;
    let dataProviderSpy;
    let openedChangedSpy;

    beforeEach(() => {
      dataProviderSpy = sinon.spy((params, callback) => {
        const items = makeItems(10);
        const filteredItems = items.filter((item) => item.includes(params.filter));
        callback(filteredItems, filteredItems.length);
      });

      comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
      dropdown = comboBox.$.dropdown;
      comboBox.dataProvider = dataProviderSpy;
      comboBox.opened = true;

      openedChangedSpy = sinon.spy(dropdown, '_openedChanged');
    });

    it.skip('should not toggle between opened and closed when filtering', () => {
      dataProviderSpy.resetHistory();
      // Filter for something that should return results
      comboBox.filter = 'item';
      // Verify data provider has been called
      expect(dataProviderSpy.calledOnce).to.be.true;
      // Overlay opened state should not change during fetching data
      expect(openedChangedSpy.called).to.be.false;
    });

    it.skip('should not toggle between opened and closed when setting a value', () => {
      dataProviderSpy.resetHistory();
      // Set a value
      comboBox.value = 'item 1';
      // Verify data provider has been called
      expect(dataProviderSpy.calledOnce).to.be.true;
      // Overlay opened state should not change during fetching data
      expect(openedChangedSpy.called).to.be.false;
    });

    it('should eventually close when there are no items', async () => {
      dataProviderSpy.resetHistory();
      // Filter for something that doesn't exist
      comboBox.filter = 'doesnotexist';
      // Verify data provider has been called
      expect(dataProviderSpy.calledOnce).to.be.true;
      // Overlay should close
      expect(openedChangedSpy.called).to.be.true;
      expect(dropdown._overlayOpened).to.be.false;
    });
  });
});

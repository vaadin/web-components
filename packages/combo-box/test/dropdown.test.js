import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../src/vaadin-combo-box.js';
import '../src/vaadin-combo-box-overlay.js';

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
});

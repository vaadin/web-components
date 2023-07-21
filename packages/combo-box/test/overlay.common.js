import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';

describe('overlay', () => {
  let overlay;

  beforeEach(async () => {
    overlay = fixtureSync(`<vaadin-combo-box-overlay></vaadin-combo-box-overlay>`);
    await nextRender();
  });

  it('should not show the overlay when closed', async () => {
    overlay.opened = false;
    await nextUpdate(overlay);
    expect(window.getComputedStyle(overlay).display).to.eql('none');
  });

  it('should show the overlay when opened', async () => {
    overlay.opened = true;
    await nextUpdate(overlay);
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

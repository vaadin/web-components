import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../vaadin-master-detail-layout.js';

window.Vaadin ||= {};
window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.masterDetailLayoutComponent = true;

describe('vaadin-master-detail-layout', () => {
  let layout;

  beforeEach(async () => {
    layout = fixtureSync(`
      <vaadin-master-detail-layout>
        <div>Master</div>
        <div slot="detail">Detail</div>
      </vaadin-master-detail-layout>
    `);
    await nextFrame();
  });

  describe('custom element definition', () => {
    it('should be defined in custom element registry', () => {
      expect(customElements.get('vaadin-master-detail-layout')).to.be.ok;
    });

    it('should have a valid localName', () => {
      expect(layout.localName).to.equal('vaadin-master-detail-layout');
    });

    it('should have display grid', () => {
      expect(getComputedStyle(layout).display).to.equal('grid');
    });
  });

  describe('has-detail', () => {
    it('should set has-detail when detail content is provided', () => {
      expect(layout.hasAttribute('has-detail')).to.be.true;
    });

    it('should remove has-detail when detail is removed', async () => {
      layout.querySelector('[slot="detail"]').remove();
      await nextFrame();
      expect(layout.hasAttribute('has-detail')).to.be.false;
    });
  });

  describe('expand', () => {
    it('should be set to both by default', () => {
      expect(layout.expand).to.equal('both');
    });

    it('should reflect expand property to attribute', () => {
      layout.expand = 'master';
      expect(layout.getAttribute('expand')).to.equal('master');
    });
  });
});

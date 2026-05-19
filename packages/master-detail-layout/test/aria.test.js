import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../src/vaadin-master-detail-layout.js';
import './helpers/master-content.js';
import './helpers/detail-content.js';
import { onceResized } from './helpers.js';

describe('ARIA', () => {
  let layout, master, detail;

  beforeEach(async () => {
    layout = fixtureSync(`
      <vaadin-master-detail-layout master-size="300px" detail-size="300px" style="width: 400px;">
        <master-content></master-content>
        <detail-content slot="detail"></detail-content>
      </vaadin-master-detail-layout>
    `);
    await onceResized(layout);
    master = layout.shadowRoot.querySelector('[part="master"]');
    detail = layout.shadowRoot.querySelector('[part="detail"]');
  });

  it('should set role="dialog" on detail in overlay mode', () => {
    expect(layout.hasAttribute('overlay')).to.be.true;
    expect(detail.getAttribute('role')).to.equal('dialog');
  });

  it('should remove role="dialog" when switching from overlay to split mode', async () => {
    layout.style.width = '800px';
    await onceResized(layout);
    expect(detail.hasAttribute('role')).to.be.false;
  });

  it('should set aria-modal on detail with page containment', async () => {
    layout.overlayContainment = 'page';
    await onceResized(layout);
    expect(detail.getAttribute('aria-modal')).to.equal('true');
  });

  it('should not set aria-modal on detail with layout containment', () => {
    expect(detail.hasAttribute('aria-modal')).to.be.false;
  });

  it('should set inert on master with layout containment', () => {
    expect(master.hasAttribute('inert')).to.be.true;
  });

  it('should not set inert on master with page containment', async () => {
    layout.overlayContainment = 'page';
    await onceResized(layout);
    expect(master.hasAttribute('inert')).to.be.false;
  });

  it('should not set inert on master when detail is removed', async () => {
    layout.querySelector('[slot="detail"]').remove();
    await onceResized(layout);
    expect(master.hasAttribute('inert')).to.be.false;
  });

  describe('detail placeholder', () => {
    let placeholder;

    beforeEach(async () => {
      layout.style.width = '800px';
      placeholder = document.createElement('div');
      placeholder.setAttribute('slot', 'detail-placeholder');
      layout.appendChild(placeholder);
      await onceResized(layout);
    });

    it('should toggle detail placeholder visibility based on detail presence', async () => {
      expect(getComputedStyle(layout.$.detailPlaceholder).visibility).to.equal('hidden');

      layout.querySelector('[slot="detail"]').remove();
      await onceResized(layout);

      expect(getComputedStyle(layout.$.detailPlaceholder).visibility).to.equal('visible');
    });
  });
});

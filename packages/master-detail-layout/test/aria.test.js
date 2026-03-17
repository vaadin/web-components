import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../src/vaadin-master-detail-layout.js';
import './helpers/master-content.js';
import './helpers/detail-content.js';
import { onceResized } from './helpers.js';

window.Vaadin ||= {};
window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.masterDetailLayoutComponent = true;

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

  it('should set role to dialog on the detail part in overlay mode', () => {
    expect(layout.hasAttribute('overflow')).to.be.true;
    expect(detail.getAttribute('role')).to.equal('dialog');
  });

  it('should remove role when overflow is resolved', async () => {
    layout.style.width = '800px';
    await onceResized(layout);
    expect(detail.hasAttribute('role')).to.be.false;
  });

  it('should set role to dialog on the detail part with overlaySize 100%', async () => {
    layout.overlaySize = '100%';
    await onceResized(layout);
    expect(detail.getAttribute('role')).to.equal('dialog');
  });

  it('should set aria-modal on the detail part with viewport overlay containment', async () => {
    layout.overlayContainment = 'viewport';
    await onceResized(layout);
    expect(detail.getAttribute('aria-modal')).to.equal('true');
  });

  it('should not set aria-modal with layout-contained overlay mode', () => {
    expect(detail.hasAttribute('aria-modal')).to.be.false;
  });

  it('should set inert on the master part with layout-contained overlay', () => {
    expect(master.hasAttribute('inert')).to.be.true;
  });

  it('should not set inert on the master part with viewport overlay containment', async () => {
    layout.overlayContainment = 'viewport';
    await onceResized(layout);
    expect(master.hasAttribute('inert')).to.be.false;
  });

  it('should not set inert on the master part when detail is removed', async () => {
    layout.querySelector('[slot="detail"]').remove();
    await onceResized(layout);
    expect(master.hasAttribute('inert')).to.be.false;
  });
});

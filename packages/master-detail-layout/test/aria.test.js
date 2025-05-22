import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-master-detail-layout.js';
import './helpers/master-content.js';
import './helpers/detail-content.js';

window.Vaadin ||= {};
window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.masterDetailLayoutComponent = true;

describe('ARIA', () => {
  let layout, master, detail;

  beforeEach(async () => {
    layout = fixtureSync(`
      <vaadin-master-detail-layout>
        <master-content></master-content>
        <detail-content slot="detail"></detail-content>
      </vaadin-master-detail-layout>
    `);
    await nextRender();
    master = layout.shadowRoot.querySelector('[part="master"]');
    detail = layout.shadowRoot.querySelector('[part="detail"]');
  });

  it('should set role to dialog on the detail part in the drawer mode', () => {
    layout.forceOverlay = true;
    expect(detail.getAttribute('role')).to.equal('dialog');

    layout.forceOverlay = false;
    expect(detail.hasAttribute('role')).to.be.false;
  });

  it('should set role to dialog on the detail part in the stack mode', () => {
    layout.forceOverlay = true;
    layout.stackOverlay = true;
    expect(detail.getAttribute('role')).to.equal('dialog');

    layout.forceOverlay = false;

    expect(detail.hasAttribute('role')).to.be.false;
  });

  it('should set aria-model on the detail part with the viewport containment', () => {
    layout.forceOverlay = true;
    layout.containment = 'viewport';
    expect(detail.getAttribute('aria-modal')).to.equal('true');

    layout.containment = 'layout';
    expect(detail.hasAttribute('aria-modal')).to.be.false;
  });

  it('should set inert on the master part with the layout containment', () => {
    layout.forceOverlay = true;
    layout.containment = 'layout';
    expect(master.hasAttribute('inert')).to.be.true;

    layout.containment = 'viewport';
    expect(master.hasAttribute('inert')).to.be.false;
  });

  it('should not set inert on the master part with the detail removed', async () => {
    layout.forceOverlay = true;
    layout.containment = 'layout';

    const detailContent = layout.querySelector('[slot="detail"]');
    detailContent.remove();
    await nextRender();

    expect(master.hasAttribute('inert')).to.be.false;

    layout.appendChild(detailContent);
    await nextRender();

    expect(master.hasAttribute('inert')).to.be.true;
  });
});

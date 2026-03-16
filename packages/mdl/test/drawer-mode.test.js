import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextResize } from '@vaadin/testing-helpers';

window.Vaadin ||= {};
window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.masterDetailLayoutComponent = true;

import '../vaadin-master-detail-layout.js';

describe('drawer mode', () => {
  let layout, detail, backdrop;

  beforeEach(async () => {
    layout = fixtureSync(`
      <vaadin-master-detail-layout master-size="300px" detail-size="300px" style="width: 400px;">
        <div>Master</div>
        <div slot="detail">Detail</div>
      </vaadin-master-detail-layout>
    `);
    await nextRender();
    await nextResize(layout);
    detail = layout.shadowRoot.querySelector('[part="detail"]');
    backdrop = layout.shadowRoot.querySelector('[part="backdrop"]');
  });

  it('should use absolute positioning and show backdrop in drawer mode', () => {
    expect(layout.hasAttribute('overflow')).to.be.true;
    expect(getComputedStyle(detail).position).to.equal('absolute');
    expect(getComputedStyle(backdrop).display).to.equal('block');
  });

  it('should set detail width to detailSize in drawer mode', () => {
    expect(getComputedStyle(detail).width).to.equal('300px');
  });

  it('should update detail width when detailSize changes in drawer mode', async () => {
    layout.detailSize = '600px';
    await nextRender();
    expect(getComputedStyle(detail).width).to.equal('600px');
  });

  it('should switch to drawer mode when detail is added to a narrow layout', async () => {
    const detailContent = layout.querySelector('[slot="detail"]');
    detailContent.remove();
    await nextRender();
    expect(layout.hasAttribute('overflow')).to.be.false;

    layout.appendChild(detailContent);
    await nextRender();
    expect(layout.hasAttribute('overflow')).to.be.true;
    expect(getComputedStyle(detail).position).to.equal('absolute');
  });
});

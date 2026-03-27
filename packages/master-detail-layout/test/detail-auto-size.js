import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-master-detail-layout.js';
import { onceResized } from './helpers.js';

window.Vaadin ||= {};
window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.masterDetailLayoutComponent = true;

describe('detail auto size', () => {
  let layout;

  beforeEach(async () => {
    layout = fixtureSync(`
      <vaadin-master-detail-layout>
        <div>Master</div>
        <div slot="detail">Detail</div>
      </vaadin-master-detail-layout>
    `);
    await onceResized(layout);
  });

  describe('recalculateLayout', () => {
    it('should not be called when masterSize and detailSize are provided initially', async () => {
      const newLayout = fixtureSync(`
        <vaadin-master-detail-layout master-size="200px" detail-size="200px">
          <div>Master</div>
          <div slot="detail">Detail</div>
        </vaadin-master-detail-layout>
      `);
      const spy = sinon.spy(newLayout, 'recalculateLayout');
      await onceResized(newLayout);
      expect(spy).to.not.be.called;
    });

    it('should be called when masterSize is changed after initial render', () => {
      const spy = sinon.spy(layout, 'recalculateLayout');
      layout.masterSize = '200px';
      layout.masterSize = '300px';
      expect(spy).to.be.calledOnce;
    });

    it('should be called when detailSize is changed after initial render', () => {
      const spy = sinon.spy(layout, 'recalculateLayout');
      layout.detailSize = '200px';
      layout.detailSize = '300px';
      expect(spy).to.be.calledOnce;
    });
  });
});

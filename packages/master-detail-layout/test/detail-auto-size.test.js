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

  describe('basic', () => {
    beforeEach(async () => {
      layout = fixtureSync(`
        <vaadin-master-detail-layout>
          <div>Master</div>
          <div slot="detail">Detail</div>
        </vaadin-master-detail-layout>
      `);
      await onceResized(layout);
    });

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

    it('should not throw when called on a disconnected element', () => {
      layout.parentElement.removeChild(layout);
      expect(() => layout.recalculateLayout()).to.not.throw();
    });
  });

  describe('nested layouts', () => {
    let outer, middle, inner;

    function getCachedSize(layout) {
      return layout.style.getPropertyValue('--_detail-cached-size');
    }

    beforeEach(async () => {
      outer = fixtureSync(`
        <vaadin-master-detail-layout style="width: 1200px;" master-size="100px" expand="both">
          <div>Outer Master</div>
          <vaadin-master-detail-layout slot="detail" master-size="100px">
            <div>Middle Master</div>
            <vaadin-master-detail-layout slot="detail" master-size="100px">
              <div>Inner Master</div>
              <div slot="detail" style="width: 100px;">Inner Detail</div>
            </vaadin-master-detail-layout>
          </vaadin-master-detail-layout>
        </vaadin-master-detail-layout>
      `);
      middle = outer.querySelector('vaadin-master-detail-layout');
      inner = middle.querySelector('vaadin-master-detail-layout');
      await onceResized(outer);
      await onceResized(middle);
      await onceResized(inner);
    });

    it('should cache detail intrinsic size plus border at each level', () => {
      // Inner: 100px detail content + 1px border = 101px
      expect(getCachedSize(inner)).to.equal('101px');
      // Middle: inner layout min-content (100px master + 101px detail) + 1px border = 202px
      expect(getCachedSize(middle)).to.equal('202px');
      // Outer: middle layout min-content (100px master + 202px detail) + 1px border = 303px
      expect(getCachedSize(outer)).to.equal('303px');
    });

    it('should not cache detail size when detailSize is explicitly set', async () => {
      outer.detailSize = '300px';
      await onceResized(outer);
      expect(getCachedSize(outer)).to.equal('');
    });

    describe('recalculateLayout', () => {
      it('should update cached sizes on ancestors after detail content changes', () => {
        inner.querySelector('[slot="detail"]').style.width = '200px';
        inner.recalculateLayout();

        expect(getCachedSize(inner)).to.equal('201px');
        expect(getCachedSize(middle)).to.equal('302px');
        expect(getCachedSize(outer)).to.equal('403px');
      });

      it('should toggle overlay on ancestors when detail content outgrows or fits available space', () => {
        // Outer: 100px master + 303px detail = 403px, host is 1200px → no overlay
        expect(outer.hasAttribute('overlay')).to.be.false;

        // Grow inner detail so outer needs 100px + 1103px = 1203px > 1200px
        inner.querySelector('[slot="detail"]').style.width = '1000px';
        inner.recalculateLayout();
        expect(outer.hasAttribute('overlay')).to.be.true;

        // Shrink back so outer needs 100px + 303px = 403px < 1200px
        inner.querySelector('[slot="detail"]').style.width = '100px';
        inner.recalculateLayout();
        expect(outer.hasAttribute('overlay')).to.be.false;
      });
    });
  });
});

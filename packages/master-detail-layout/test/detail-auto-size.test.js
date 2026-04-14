import { expect } from '@vaadin/chai-plugins';
import { defineCE, fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-master-detail-layout.js';
import { css, html, LitElement } from 'lit';
import { onceResized } from './helpers.js';

window.Vaadin ||= {};
window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.masterDetailLayoutComponent = true;

describe('detail auto size', () => {
  let layout;

  function getCachedSize(layout) {
    return layout.style.getPropertyValue('--_detail-cached-size');
  }

  describe('basic', () => {
    let spy;

    beforeEach(async () => {
      layout = fixtureSync(`
        <vaadin-master-detail-layout master-size="200px" detail-size="200px" orientation="horizontal">
          <div>Master</div>
          <div slot="detail">Detail</div>
        </vaadin-master-detail-layout>
      `);
      spy = sinon.spy(layout, 'recalculateLayout');
      await onceResized(layout);
    });

    it('should not be called when masterSize, detailSize and orientation are provided initially', () => {
      expect(spy).to.not.be.called;
    });

    it('should be called when masterSize is changed after initial render', () => {
      layout.masterSize = '200px';
      layout.masterSize = '300px';
      expect(spy).to.be.calledOnce;
    });

    it('should be called when detailSize is changed after initial render', () => {
      layout.detailSize = '200px';
      layout.detailSize = '300px';
      expect(spy).to.be.calledOnce;
    });

    it('should be called when orientation is changed after initial render', () => {
      layout.orientation = 'vertical';
      expect(spy).to.be.calledOnce;
    });

    it('should not throw when called on a disconnected element', () => {
      layout.parentElement.removeChild(layout);
      expect(() => layout.recalculateLayout()).to.not.throw();
    });
  });

  describe('Lit element detail', () => {
    const detailElementTag = defineCE(
      class extends LitElement {
        static get styles() {
          return css`
            :host {
              display: block;
            }

            div {
              width: 200px;
            }
          `;
        }

        render() {
          return html`<div>Detail</div>`;
        }
      },
    );

    beforeEach(async () => {
      layout = fixtureSync(`
        <vaadin-master-detail-layout master-size="100px">
          <div>Master</div>
        </vaadin-master-detail-layout>
      `);
      await onceResized(layout);
    });

    it('should measure correct detail size for a Lit element set via _setDetail', async () => {
      await layout._setDetail(document.createElement(detailElementTag));
      await onceResized(layout);
      expect(getCachedSize(layout)).to.equal('201px');
    });

    it('should measure correct detail size for a Lit element set via _setDetail without transition', async () => {
      await layout._setDetail(document.createElement(detailElementTag), true);
      await onceResized(layout);
      expect(getCachedSize(layout)).to.equal('201px');
    });
  });

  describe('nested layouts', () => {
    let outer, middle, inner;

    const shadowElement = defineCE(
      class extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({ mode: 'open' });
          this.shadowRoot.appendChild(this.querySelector('template').content.cloneNode(true));
        }
      },
    );

    beforeEach(() => {
      outer = fixtureSync(`
        <vaadin-master-detail-layout style="width: 1200px;" master-size="100px" expand="both">
          <div>Outer Master</div>

          <vaadin-master-detail-layout slot="detail" master-size="100px">
            <div>Middle Master</div>

            <${shadowElement} slot="detail">
              <template>
                <vaadin-master-detail-layout master-size="100px">
                  <div>Inner Master</div>

                  <div slot="detail" style="width: 100px;">Inner Detail</div>
                </vaadin-master-detail-layout>
              </template>
            </${shadowElement}>
          </vaadin-master-detail-layout>
        </vaadin-master-detail-layout>
      `);
      middle = outer.querySelector('vaadin-master-detail-layout');
      inner = middle.querySelector('[slot="detail"]').shadowRoot.querySelector('vaadin-master-detail-layout');
    });

    it('should cache detail intrinsic size plus border at each level', async () => {
      await nextFrame();

      // Inner: 100px detail content + 1px border = 101px
      expect(getCachedSize(inner)).to.equal('101px');
      // Middle: inner layout min-content (100px master + 101px detail) + 1px border = 202px
      expect(getCachedSize(middle)).to.equal('202px');
      // Outer: middle layout min-content (100px master + 202px detail) + 1px border = 303px
      expect(getCachedSize(outer)).to.equal('303px');
    });

    it('should not cache detail size when detailSize is explicitly set', async () => {
      outer.detailSize = '300px';
      await nextFrame();
      expect(getCachedSize(outer)).to.equal('');
    });

    describe('recalculateLayout', () => {
      let outerSpy, middleSpy, innerSpy;

      beforeEach(async () => {
        outerSpy = sinon.spy(outer, 'recalculateLayout');
        middleSpy = sinon.spy(middle, 'recalculateLayout');
        innerSpy = sinon.spy(inner, 'recalculateLayout');
        await nextFrame();
      });

      it('should be called on deepest layout during initialization', () => {
        expect(outerSpy).to.not.be.called;
        expect(middleSpy).to.not.be.called;
        expect(innerSpy).to.be.calledOnce;
      });

      it('should update cached sizes on ancestors after detail content changes', () => {
        inner.querySelector('[slot="detail"]').style.width = '200px';
        inner.recalculateLayout();
        expect(getCachedSize(inner)).to.equal('201px');
        expect(getCachedSize(middle)).to.equal('302px');
        expect(getCachedSize(outer)).to.equal('403px');

        inner.querySelector('[slot="detail"]').style.width = '100px';
        inner.recalculateLayout();
        expect(getCachedSize(inner)).to.equal('101px');
        expect(getCachedSize(middle)).to.equal('202px');
        expect(getCachedSize(outer)).to.equal('303px');
      });

      it('should toggle overlay on ancestors when detail content outgrows or fits available space', () => {
        // Grow inner detail so outer needs 100px + 1103px = 1203px > 1200px
        inner.querySelector('[slot="detail"]').style.width = '1000px';
        inner.recalculateLayout();
        expect(middle.hasAttribute('overlay')).to.be.true;
        expect(outer.hasAttribute('overlay')).to.be.true;

        // Shrink back so outer needs 100px + 303px = 403px < 1200px
        inner.querySelector('[slot="detail"]').style.width = '100px';
        inner.recalculateLayout();
        expect(middle.hasAttribute('overlay')).to.be.false;
        expect(outer.hasAttribute('overlay')).to.be.false;
      });
    });
  });
});

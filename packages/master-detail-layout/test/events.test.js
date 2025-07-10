import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouse } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-master-detail-layout.js';
import './helpers/master-content.js';
import './helpers/detail-content.js';

window.Vaadin ||= {};
window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.masterDetailLayoutComponent = true;

describe('events', () => {
  let layout;

  describe('default', () => {
    beforeEach(async () => {
      layout = fixtureSync(`
        <vaadin-master-detail-layout>
          <master-content></master-content>
          <detail-content slot="detail"></detail-content>
        </vaadin-master-detail-layout>
      `);
      await nextRender();
    });

    describe('backdrop click', () => {
      let spy;

      beforeEach(() => {
        layout.forceOverlay = true;

        spy = sinon.spy();
        layout.addEventListener('backdrop-click', spy);
      });

      afterEach(async () => {
        await resetMouse();
      });

      it('should fire backdrop-click event on backdrop click in drawer mode', async () => {
        const backdrop = layout.shadowRoot.querySelector('[part="backdrop"]');
        const bounds = backdrop.getBoundingClientRect();
        await sendMouse({ type: 'click', position: [bounds.x + 10, bounds.y + 10] });
        expect(spy).to.be.calledOnce;
      });

      it('should not fire backdrop-click event on detail content click in drawer mode', async () => {
        const detail = layout.querySelector('[slot="detail"]');
        const bounds = detail.getBoundingClientRect();
        await sendMouse({ type: 'click', position: [bounds.x + 10, bounds.y + 10] });
        expect(spy).to.not.be.called;
      });
    });

    describe('Escape press', () => {
      let detail, focusable;

      beforeEach(() => {
        detail = layout.querySelector('[slot="detail"]');
        focusable = detail.shadowRoot.querySelector('input');
      });

      it('should fire detail-escape-press event on pressing Escape in split mode', async () => {
        const spy = sinon.spy();
        layout.addEventListener('detail-escape-press', spy);

        focusable.focus();
        await sendKeys({ press: 'Escape' });

        expect(spy).to.be.calledOnce;
      });

      it('should fire detail-escape-press event on pressing Escape in drawer mode', async () => {
        layout.forceOverlay = true;

        const spy = sinon.spy();
        layout.addEventListener('detail-escape-press', spy);

        focusable.focus();
        await sendKeys({ press: 'Escape' });

        expect(spy).to.be.calledOnce;
      });

      it('should fire detail-escape-press event on pressing Escape in stack mode', async () => {
        layout.forceOverlay = true;
        layout.stackOverlay = true;

        const spy = sinon.spy();
        layout.addEventListener('detail-escape-press', spy);

        focusable.focus();
        await sendKeys({ press: 'Escape' });

        expect(spy).to.be.calledOnce;
      });
    });
  });

  describe('nested', () => {
    let layout, nested;

    beforeEach(async () => {
      layout = fixtureSync(`
        <vaadin-master-detail-layout>
          <div>Master</div>
          <vaadin-master-detail-layout slot="detail">
            <div>Nested master</div>
            <div slot="detail">
              <input />
            </div>
          </vaadin-master-detail-layout>
        </vaadin-master-detail-layout>
      `);
      await nextRender();
      nested = layout.querySelector('[slot="detail"]');
    });

    it('should not fire detail-escape-press event on parent layout from nested detail', async () => {
      const parentSpy = sinon.spy();
      const nestedSpy = sinon.spy();

      layout.addEventListener('detail-escape-press', parentSpy);
      nested.addEventListener('detail-escape-press', nestedSpy);

      const focusable = nested.querySelector('input');
      focusable.focus();

      await sendKeys({ press: 'Escape' });

      expect(nestedSpy).to.be.calledOnce;
      expect(parentSpy).to.be.not.called;
    });
  });
});

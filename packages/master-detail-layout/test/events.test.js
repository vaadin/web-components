import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouseToElement } from '@vaadin/test-runner-commands';
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
    afterEach(async () => {
      await resetMouse();
    });

    it('should fire backdrop-click event on backdrop click in overlay mode', async () => {
      layout.forceOverlay = true;

      const spy = sinon.spy();
      layout.addEventListener('backdrop-click', spy);

      const backdrop = layout.shadowRoot.querySelector('[part="backdrop"]');
      await sendMouseToElement({ type: 'click', element: backdrop });

      expect(spy).to.be.calledOnce;
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

    it('should fire detail-escape-press event on pressing Escape in overlay mode', async () => {
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

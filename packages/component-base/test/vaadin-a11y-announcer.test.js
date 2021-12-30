import { expect } from '@esm-bundle/chai';
import { fire, fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ControllerMixin } from '../src/controller-mixin.js';
import { A11yAnnouncer, A11yAnnouncerController } from '../src/vaadin-a11y-announcer.js';

customElements.define(
  'a11y-announcer-element',
  class FocusTrapElement extends ControllerMixin(PolymerElement) {
    static get template() {
      return html`<slot></slot>`;
    }
  }
);

describe('a11y announcer', () => {
  let element, announcer, controller;

  beforeEach(() => {
    element = fixtureSync(`<a11y-announcer-element>Error</a11y-announcer-element>`);
    controller = new A11yAnnouncerController(element);
    element.addController(controller);
    announcer = document.querySelector('vaadin-a11y-announcer');
  });

  describe('announcer element', () => {
    let createSpy;

    before(() => {
      createSpy = sinon.spy(document, 'createElement');
    });

    after(() => {
      createSpy.restore();
    });

    it('should create announcer element instance and add it to body', () => {
      expect(announcer).to.be.an.instanceOf(A11yAnnouncer);
      expect(announcer.parentNode).to.equal(document.body);
    });

    it('should store reference to the announcer element instance', () => {
      expect(A11yAnnouncer.instance).to.equal(announcer);
    });

    it('should re-use existing instance when adding another element', () => {
      const clone = document.createElement('a11y-announcer-element');
      clone.addController(new A11yAnnouncerController(clone));
      element.parentNode.appendChild(clone);
      expect(createSpy.withArgs('vaadin-a11y-announcer').calledOnce).to.be.true;
    });
  });

  describe('announce() method', () => {
    let announceSpy;

    beforeEach(() => {
      announceSpy = sinon.spy(announcer, 'announce');
    });

    afterEach(() => {
      announceSpy.restore();
    });

    it('should be called on the instance when controller announce() is called', () => {
      controller.announce(element.textContent);
      expect(announceSpy.calledOnce).to.be.true;
      expect(announceSpy.firstCall.args[0]).to.equal(element.textContent);
    });

    it('should be called on the instance on vaadin-a11y-announce event', () => {
      fire(element, 'vaadin-a11y-announce', { text: 'Test' });
      expect(announceSpy.calledOnce).to.be.true;
      expect(announceSpy.firstCall.args[0]).to.equal('Test');
    });
  });

  describe('vaadin-a11y-announce event', () => {
    let eventSpy;

    beforeEach(() => {
      eventSpy = sinon.spy();
      document.addEventListener('vaadin-a11y-announce', eventSpy);
    });

    afterEach(() => {
      document.removeEventListener('vaadin-a11y-announce', eventSpy);
    });

    it('should dispatch bubbling event when controller announce() is called', () => {
      controller.announce(element.textContent);
      expect(eventSpy.calledOnce).to.be.true;
      const event = eventSpy.firstCall.args[0];
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;
    });

    it('should contain text passed to controller announce() as event detail', () => {
      controller.announce(element.textContent);
      expect(eventSpy.firstCall.args[0].detail.text).to.equal(element.textContent);
    });
  });

  describe('mode', () => {
    let region;

    before(() => {
      region = announcer.shadowRoot.querySelector('div');
    });

    it('should set announcer mode property to polite by default', () => {
      expect(announcer.mode).to.equal('polite');
    });

    it('should set aria-live attribute to polite by default', () => {
      expect(region.getAttribute('aria-live')).to.equal('polite');
    });

    it('should update aria-live attribute when mode changes', () => {
      announcer.mode = 'assertive';
      expect(region.getAttribute('aria-live')).to.equal('assertive');
    });
  });

  describe('timeout', () => {
    let region;
    let clock;

    before(() => {
      region = announcer.shadowRoot.querySelector('div');
    });

    beforeEach(() => {
      clock = sinon.useFakeTimers();
    });

    afterEach(() => {
      clock.restore();
    });

    it('should set announcer timeout property to 150 by default', () => {
      expect(announcer.timeout).to.equal(150);
    });

    it('should update region text content after the timeout', () => {
      controller.announce('Test');
      expect(region.textContent).to.equal('');

      clock.tick(150);
      expect(region.textContent).to.equal('Test');
    });
  });
});

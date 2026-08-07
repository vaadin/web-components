import { expect } from '@vaadin/chai-plugins';
import { enterKeyDown, escKeyDown, fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './fixtures/mock-overlay.js';

describe('Esc', () => {
  describe('single overlay', () => {
    let overlay;

    beforeEach(async () => {
      overlay = fixtureSync('<mock-overlay>overlay content</mock-overlay>');
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
    });

    afterEach(() => {
      overlay.opened = false;
    });

    it('should close on Esc', () => {
      escKeyDown(document.body);

      expect(overlay.opened).to.be.false;
    });

    it('should fire the vaadin-overlay-escape-press event on Esc', () => {
      const spy = sinon.spy();
      overlay.addEventListener('vaadin-overlay-escape-press', spy);

      escKeyDown(document.body);

      expect(spy.calledOnce).to.be.true;
    });

    it('should not fire the vaadin-overlay-escape-press event on other key press', () => {
      const spy = sinon.spy();
      overlay.addEventListener('vaadin-overlay-escape-press', spy);

      enterKeyDown(document.body);

      expect(spy.called).to.be.false;
    });

    it('should not close on Esc if the event was prevented', () => {
      overlay.addEventListener('vaadin-overlay-escape-press', (e) => e.preventDefault());

      escKeyDown(document.body);

      expect(overlay.opened).to.be.true;
    });

    it('should not close on Esc if the keydown event was prevented', () => {
      overlay.addEventListener('keydown', (e) => e.preventDefault());

      escKeyDown(overlay);

      expect(overlay.opened).to.be.true;
    });

    it('should not fire the vaadin-overlay-escape-press event if keydown was prevented', () => {
      const spy = sinon.spy();
      overlay.addEventListener('vaadin-overlay-escape-press', spy);
      overlay.addEventListener('keydown', (e) => e.preventDefault());

      enterKeyDown(overlay);

      expect(spy.called).to.be.false;
    });
  });

  describe('multiple modal overlays', () => {
    let parent, overlay1, overlay2, overlay3, spy;

    beforeEach(async () => {
      parent = fixtureSync(`
        <div>
          <mock-overlay>overlay1</mock-overlay>
          <mock-overlay>overlay2</mock-overlay>
          <mock-overlay>overlay3</mock-overlay>
        </div>
      `);
      [overlay1, overlay2, overlay3] = parent.children;
      await nextRender();

      spy = sinon.spy();
      overlay1.addEventListener('vaadin-overlay-escape-press', spy);
    });

    afterEach(() => {
      overlay1.opened = false;
      overlay2.opened = false;
      overlay3.opened = false;
    });

    it('should fire the vaadin-overlay-escape-press if it is the only overlay opened', () => {
      overlay1.opened = true;
      escKeyDown(document.body);
      expect(spy.called).to.be.true;
    });

    it('should not fire the vaadin-overlay-escape-press if there is a recent overlay opened', () => {
      overlay1.opened = true;

      overlay2.opened = true;

      escKeyDown(document.body);
      expect(spy.called).to.be.false;
    });
  });

  describe('multiple modeless overlays', () => {
    let parent, modeless1, modeless2;

    beforeEach(async () => {
      parent = fixtureSync(`
        <div id="parent">
          <mock-overlay modeless>
            overlay1
            <input />
          </mock-overlay>
          <mock-overlay modeless>
            overlay2
            <input />
          </mock-overlay>
        </div>
      `);
      [modeless1, modeless2] = parent.children;
      await nextRender();
    });

    afterEach(() => {
      modeless1.opened = false;
      modeless2.opened = false;
    });

    it('should not fire the vaadin-overlay-escape-press if the overlay does not contain focus', () => {
      const spy = sinon.spy();
      modeless1.addEventListener('vaadin-overlay-escape-press', spy);

      modeless1.opened = true;

      escKeyDown(document.body);
      expect(spy.called).to.be.false;
    });

    it('should not fire the vaadin-overlay-escape-press if the overlay contains focus', () => {
      const spy = sinon.spy();
      modeless1.addEventListener('vaadin-overlay-escape-press', spy);

      modeless1.opened = true;

      const input = modeless1.querySelector('input');
      input.focus();

      escKeyDown(input);
      expect(spy.called).to.be.true;
    });

    it('should fire the vaadin-overlay-escape-press if the overlay is the frontmost one', () => {
      const spy = sinon.spy();
      modeless1.addEventListener('vaadin-overlay-escape-press', spy);

      modeless1.opened = true;

      modeless2.opened = true;
      modeless1.bringToFront();

      const input = modeless1.querySelector('input');
      input.focus();

      escKeyDown(input);
      expect(spy.called).to.be.true;
    });

    it('should not fire the vaadin-overlay-escape-press if the overlay is not the frontmost', () => {
      const spy = sinon.spy();
      modeless1.addEventListener('vaadin-overlay-escape-press', spy);

      modeless1.opened = true;
      modeless2.opened = true;

      const input = modeless2.querySelector('input');
      input.focus();

      escKeyDown(input);
      expect(spy.called).to.be.false;
    });
  });
});

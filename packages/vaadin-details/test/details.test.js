import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@open-wc/testing-helpers';
import { keyboardEventFor, keyDownOn } from '@polymer/iron-test-helpers/mock-interactions.js';
import '../vaadin-details.js';

describe('vaadin-details', () => {
  let details, toggle, content;

  beforeEach(() => {
    details = fixtureSync(`
      <vaadin-details>
        <div slot="summary">Summary</div>
        <input>
      </vaadin-details>
    `);
    toggle = details.focusElement;
    content = details._collapsible;
  });

  describe('custom element definition', () => {
    it('should define a custom element with proper tag name', () => {
      expect(customElements.get('vaadin-details')).to.be.ok;
    });

    it('should have a valid version number', () => {
      expect(details.constructor.version).to.match(/^(\d+\.)?(\d+\.)?(\d+)(-(alpha|beta)\d+)?$/);
    });
  });

  describe('toggle button', () => {
    it('should have summary slot inside toggle button', () => {
      const slot = toggle.querySelector('slot[name="summary"]');
      expect(slot).to.be.ok;
      expect(slot.assignedNodes()[0].textContent).to.equal('Summary');
    });

    it('should have disabled attribute when disabled is true', () => {
      details.disabled = true;
      expect(toggle.hasAttribute('disabled')).to.equal(true);
    });
  });

  describe('opened', () => {
    it('should set opened to false by default', () => {
      expect(details.opened).to.be.false;
    });

    it('should reflect opened property to attribute', () => {
      details.opened = true;
      expect(details.hasAttribute('opened')).to.be.true;
    });

    it('should update opened on toggle button click', () => {
      toggle.click();
      expect(details.opened).to.be.true;

      toggle.click();
      expect(details.opened).to.be.false;
    });

    it('should update opened on toggle button enter', () => {
      keyDownOn(toggle, 13, [], 'Enter');
      expect(details.opened).to.be.true;

      keyDownOn(toggle, 13, [], 'Enter');
      expect(details.opened).to.be.false;
    });

    it('should update opened on toggle button space', () => {
      keyDownOn(toggle, 32, [], ' ');
      expect(details.opened).to.be.true;

      keyDownOn(toggle, 32, [], ' ');
      expect(details.opened).to.be.false;
    });

    it('should not update opened on arrow down key', () => {
      keyDownOn(toggle, 40, [], 'ArrowDown');
      expect(details.opened).to.be.false;
    });

    it('should hide the content when opened is false', () => {
      const style = getComputedStyle(content);
      expect(style.display).to.equal('none');
      expect(style.overflow).to.equal('hidden');
      expect(style.maxHeight).to.equal('0px');
    });

    it('should show the content when `opened` is true', () => {
      details.opened = true;
      const style = getComputedStyle(content);
      expect(style.display).to.equal('block');
      expect(style.overflow).to.equal('visible');
      expect(style.maxHeight).to.equal('none');
    });

    it('should dispatch opened-changed event when opened changes', () => {
      const spy = sinon.spy();
      details.addEventListener('opened-changed', spy);
      toggle.click();
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe('ARIA roles', () => {
    it('should set role="button" on the toggle button', () => {
      expect(toggle.getAttribute('role')).to.equal('button');
    });

    it('should set role="heading" on the toggle button wrapper', () => {
      expect(toggle.parentElement.getAttribute('role')).to.equal('heading');
    });

    it('should set aria-expanded on toggle button to false by default', () => {
      expect(toggle.getAttribute('aria-expanded')).to.equal('false');
    });

    it('should set aria-expanded on toggle button to true when opened', () => {
      details.opened = true;
      expect(toggle.getAttribute('aria-expanded')).to.equal('true');
    });

    it('should set aria-hidden on the content to true by default', () => {
      expect(content.getAttribute('aria-hidden')).to.equal('true');
    });

    it('should set aria-hidden on the content to false when opened', () => {
      details.opened = true;
      expect(content.getAttribute('aria-hidden')).to.equal('false');
    });
  });

  describe('keyboard events', () => {
    let input;

    beforeEach(() => {
      input = details.querySelector('input');
    });

    it('should stop Shift + Tab on the content from propagating to the host', () => {
      const event = keyboardEventFor('keydown', 9, 'shift', 'Tab');
      const spy = sinon.spy(event, 'stopPropagation');
      input.dispatchEvent(event);
      expect(spy.called).to.be.true;
    });

    it('should not stop Tab on the content from propagating to the host', () => {
      const event = keyboardEventFor('keydown', 9, [], 'Tab');
      const spy = sinon.spy(event, 'stopPropagation');
      input.dispatchEvent(event);
      expect(spy.called).to.be.false;
    });
  });
});

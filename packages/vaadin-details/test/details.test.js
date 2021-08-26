import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync, keyboardEventFor, keyDownOn } from '@vaadin/testing-helpers';
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
    let tagName;

    beforeEach(() => {
      tagName = details.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
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

  describe('unique IDs', () => {
    const idRegex = /^vaadin-details-content-\d+$/;
    let container, details, contents, buttons;

    beforeEach(() => {
      container = fixtureSync(`
        <div>
          <vaadin-details>
            <div slot="summary">Summary</div>
            <input>
          </vaadin-details>
          <vaadin-details>
            <div slot="summary">Summary</div>
            <input>
          </vaadin-details>
        </div>
      `);
      details = Array.from(container.querySelectorAll('vaadin-details'));
      contents = details.map((el) => el._collapsible);
      buttons = details.map((el) => el.focusElement);
    });

    it('should set unique id on the content', () => {
      const detailsId1 = contents[0].id;
      const detailsId2 = contents[1].id;
      expect(idRegex.test(detailsId1)).to.be.true;
      expect(idRegex.test(detailsId2)).to.be.true;
      expect(detailsId1).to.not.equal(detailsId2);
    });

    it('should set aria-controls on toggle button', () => {
      const aria1 = buttons[0].getAttribute('aria-controls');
      const aria2 = buttons[1].getAttribute('aria-controls');
      expect(idRegex.test(aria1)).to.be.true;
      expect(idRegex.test(aria2)).to.be.true;
      expect(aria1).to.not.equal(aria2);
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

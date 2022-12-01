import { expect } from '@esm-bundle/chai';
import { fixtureSync, keyDownOn } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-details.js';

describe('vaadin-details', () => {
  let details, toggle, content;

  beforeEach(() => {
    details = fixtureSync(`
      <vaadin-details>
        <vaadin-details-summary slot="summary">Summary</vaadin-details-summary>
        <div>
          <input type="text" />
        </div>
      </vaadin-details>
    `);
    toggle = details._toggleElement;
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

  describe('summary', () => {
    it('should have unnamed slot inside the summary element', () => {
      const slot = toggle.shadowRoot.querySelector('slot');
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

    // TODO: implement new mechanism for setting ID
    it.skip('should set aria-controls on toggle button', () => {
      const idRegex = /^vaadin-details-content-\d+$/;
      expect(idRegex.test(toggle.getAttribute('aria-controls'))).to.be.true;
    });
  });

  // TODO: implement new mechanism for setting ID
  describe.skip('unique IDs', () => {
    const idRegex = /^vaadin-details-content-\d+$/;
    let container, details;

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
      details = container.querySelectorAll('vaadin-details');
    });

    it('should set unique id on the content', () => {
      const detailsId1 = details[0]._collapsible.id;
      const detailsId2 = details[1]._collapsible.id;
      expect(idRegex.test(detailsId1)).to.be.true;
      expect(idRegex.test(detailsId2)).to.be.true;
      expect(detailsId1).to.not.equal(detailsId2);
    });
  });
});

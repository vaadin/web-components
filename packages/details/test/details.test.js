import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import '../vaadin-details.js';

describe('vaadin-details', () => {
  let details;

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      details = fixtureSync('<vaadin-details></vaadin-details>');
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
    let contentPart, contentNode;

    beforeEach(() => {
      details = fixtureSync(`
        <vaadin-details>
          <div>Content</div>
        </vaadin-details>
      `);
      contentPart = details.shadowRoot.querySelector('[part="content"]');
      contentNode = details.querySelector('div');
    });

    it('should set opened to false by default', () => {
      expect(details.opened).to.be.false;
    });

    it('should reflect opened property to attribute', () => {
      details.opened = true;
      expect(details.hasAttribute('opened')).to.be.true;
    });

    it('should hide the content when opened is false', () => {
      expect(getComputedStyle(contentPart).display).to.equal('none');
    });

    it('should show the content when `opened` is true', () => {
      details.opened = true;
      expect(getComputedStyle(contentPart).display).to.equal('block');
    });

    it('should set aria-hidden on the slotted element to true by default', () => {
      expect(contentNode.getAttribute('aria-hidden')).to.equal('true');
    });

    it('should set aria-hidden on the slotted element to false when opened', () => {
      details.opened = true;
      expect(contentNode.getAttribute('aria-hidden')).to.equal('false');
    });
  });

  ['default', 'custom'].forEach((type) => {
    const fixtures = {
      default: `
        <vaadin-details summary="Summary">
          <div>Content</div>
        </vaadin-details>
      `,
      custom: `
        <vaadin-details>
          <vaadin-details-summary slot="summary">Summary</vaadin-details-summary>
          <div>Content</div>
        </vaadin-details>
      `,
    };

    let summary;

    describe(`${type} summary`, () => {
      beforeEach(() => {
        details = fixtureSync(fixtures[type]);
        summary = details.querySelector('[slot="summary"]');
      });

      it(`should update opened on ${type} summary click`, () => {
        summary.click();
        expect(details.opened).to.be.true;

        summary.click();
        expect(details.opened).to.be.false;
      });

      it(`should update opened on ${type} summary Enter`, async () => {
        summary.focus();

        await sendKeys({ press: 'Enter' });
        expect(details.opened).to.be.true;

        await sendKeys({ press: 'Enter' });
        expect(details.opened).to.be.false;
      });

      it(`should update opened on ${type} summary Space`, async () => {
        summary.focus();

        await sendKeys({ press: 'Space' });
        expect(details.opened).to.be.true;

        await sendKeys({ press: 'Space' });
        expect(details.opened).to.be.false;
      });

      it(`should not update opened on ${type} summary Arrow Down`, async () => {
        summary.focus();
        await sendKeys({ press: 'ArrowDown' });
        expect(details.opened).to.be.false;
      });

      it(`should fire opened-changed event on ${type} summary click`, () => {
        const spy = sinon.spy();
        details.addEventListener('opened-changed', spy);
        summary.click();
        expect(spy.calledOnce).to.be.true;
      });

      it(`should toggle aria-expanded on ${type} summary click`, () => {
        summary.click();
        expect(summary.getAttribute('aria-expanded')).to.equal('true');

        summary.click();
        expect(summary.getAttribute('aria-expanded')).to.equal('false');
      });

      it(`should set aria-controls attribute on ${type} summary`, () => {
        const idRegex = /^content-vaadin-details-\d+$/u;
        expect(idRegex.test(summary.getAttribute('aria-controls'))).to.be.true;
      });

      it(`should propagate disabled attribute to ${type} summary`, () => {
        details.disabled = true;
        expect(summary.hasAttribute('disabled')).to.be.true;

        details.disabled = false;
        expect(summary.hasAttribute('disabled')).to.be.false;
      });
    });
  });

  describe('unique IDs', () => {
    const idRegex = /^content-vaadin-details-\d+$/u;
    let container, details;

    beforeEach(() => {
      container = fixtureSync(`
        <div>
          <vaadin-details summary="Summary 1">
            <div>Content 1</div>
          </vaadin-details>
          <vaadin-details summary="Summary 2">
            <div>Content 2</div>
          </vaadin-details>
        </div>
      `);
      details = container.querySelectorAll('vaadin-details');
    });

    it('should set unique id on the content', () => {
      const detailsId1 = details[0].querySelector('div').id;
      const detailsId2 = details[1].querySelector('div').id;
      expect(idRegex.test(detailsId1)).to.be.true;
      expect(idRegex.test(detailsId2)).to.be.true;
      expect(detailsId1).to.not.equal(detailsId2);
    });
  });
});

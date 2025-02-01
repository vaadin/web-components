import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { click, fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-details.js';

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

    beforeEach(async () => {
      details = fixtureSync(`
        <vaadin-details>
          <div>Content</div>
        </vaadin-details>
      `);
      await nextRender();
      contentPart = details.shadowRoot.querySelector('[part="content"]');
      contentNode = details.querySelector('div');
    });

    it('should set opened to false by default', () => {
      expect(details.opened).to.be.false;
    });

    it('should reflect opened property to attribute', async () => {
      details.opened = true;
      await nextUpdate(details);
      expect(details.hasAttribute('opened')).to.be.true;
    });

    it('should hide the content when opened is false', () => {
      expect(getComputedStyle(contentPart).display).to.equal('none');
    });

    it('should show the content when `opened` is true', async () => {
      details.opened = true;
      await nextUpdate(details);
      expect(getComputedStyle(contentPart).display).to.equal('block');
    });

    it('should set aria-hidden on the slotted element to true by default', () => {
      expect(contentNode.getAttribute('aria-hidden')).to.equal('true');
    });

    it('should set aria-hidden on the slotted element to false when opened', async () => {
      details.opened = true;
      await nextUpdate(details);
      expect(contentNode.getAttribute('aria-hidden')).to.equal('false');
    });

    it('should not close when a content is clicked', async () => {
      details.opened = true;
      await nextUpdate(details);
      contentNode.click();
      expect(details.opened).to.be.true;
    });
  });

  ['default', 'custom', 'component'].forEach((type) => {
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
      component: `
        <vaadin-details>
          <vaadin-details-summary slot="summary"><div>Summary<div></vaadin-details-summary>
          <div>Content</div>
        </vaadin-details>
      `,
    };

    let summary;

    describe(`${type} summary`, () => {
      beforeEach(async () => {
        details = fixtureSync(fixtures[type]);
        await nextRender();
        summary = details.querySelector('[slot="summary"]');
      });

      it(`should toggle opened on ${type} summary click`, async () => {
        summary.click();
        await nextUpdate(details);
        expect(details.opened).to.be.true;

        summary.click();
        await nextUpdate(details);
        expect(details.opened).to.be.false;
      });

      it(`should not update opened on ${type} summary click when disabled`, async () => {
        details.disabled = true;
        await nextUpdate(details);

        click(summary);
        await nextUpdate(details);
        expect(details.opened).to.be.false;
      });

      it(`should toggle opened on ${type} summary child click`, async () => {
        const child = summary.firstChild;
        if (child.nodeType === Node.ELEMENT_NODE) {
          child.click();
          await nextUpdate(details);
          expect(details.opened).to.be.true;

          child.click();
          await nextUpdate(details);
          expect(details.opened).to.be.false;
        }
      });

      it(`should toggle opened on ${type} summary Enter`, async () => {
        summary.focus();

        await sendKeys({ press: 'Enter' });
        expect(details.opened).to.be.true;

        await sendKeys({ press: 'Enter' });
        expect(details.opened).to.be.false;
      });

      it(`should toggle opened on ${type} summary Space`, async () => {
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

      it(`should fire opened-changed event on ${type} summary click`, async () => {
        const spy = sinon.spy();
        details.addEventListener('opened-changed', spy);
        summary.click();
        await nextUpdate(details);
        expect(spy.calledOnce).to.be.true;
      });

      it(`should toggle aria-expanded on ${type} summary click`, async () => {
        summary.click();
        await nextUpdate(details);
        expect(summary.getAttribute('aria-expanded')).to.equal('true');

        summary.click();
        await nextUpdate(details);
        expect(summary.getAttribute('aria-expanded')).to.equal('false');
      });

      it(`should propagate disabled attribute to ${type} summary`, async () => {
        details.disabled = true;
        await nextUpdate(details);
        expect(summary.hasAttribute('disabled')).to.be.true;

        details.disabled = false;
        await nextUpdate(details);
        expect(summary.hasAttribute('disabled')).to.be.false;
      });

      it(`should propagate theme attribute to ${type} summary`, async () => {
        details.setAttribute('theme', 'filled');
        await nextUpdate(details);
        expect(summary.getAttribute('theme')).to.equal('filled');

        details.removeAttribute('theme');
        await nextUpdate(details);
        expect(summary.hasAttribute('theme')).to.be.false;
      });
    });
  });

  describe('unique IDs', () => {
    const idRegex = /^content-vaadin-details-\d+$/u;
    let container, details;

    beforeEach(async () => {
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
      await nextRender();
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

  describe('link', () => {
    let link;

    beforeEach(async () => {
      details = fixtureSync(`
        <vaadin-details>
          <vaadin-details-summary slot="summary">
            Toggle
            <a href="#">Link</a>
          </vaadin-details-summary>
          <div>Content</div>
        </vaadin-details>
      `);
      await nextRender();
      link = details.querySelector('a');
    });

    it('should not toggle opened state on link click', () => {
      link.click();
      expect(details.opened).to.be.false;
    });
  });
});

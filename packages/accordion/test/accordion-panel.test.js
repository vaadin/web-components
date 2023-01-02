import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import '../vaadin-accordion-panel.js';

describe('vaadin-accordion-panel', () => {
  let panel;

  describe('opened', () => {
    let contentPart, contentNode;

    beforeEach(async () => {
      panel = fixtureSync(`
        <vaadin-accordion-panel>
          <div>Content</div>
        </vaadin-accordion-panel>
      `);
      await nextRender();
      contentPart = panel.shadowRoot.querySelector('[part="content"]');
      contentNode = panel.querySelector('div');
    });

    it('should set opened to false by default', () => {
      expect(panel.opened).to.be.false;
    });

    it('should reflect opened property to attribute', () => {
      panel.opened = true;
      expect(panel.hasAttribute('opened')).to.be.true;
    });

    it('should hide the content when opened is false', () => {
      expect(getComputedStyle(contentPart).display).to.equal('none');
    });

    it('should show the content when opened is true', () => {
      panel.opened = true;
      expect(getComputedStyle(contentPart).display).to.equal('block');
    });

    it('should set aria-hidden on the slotted element to true by default', () => {
      expect(contentNode.getAttribute('aria-hidden')).to.equal('true');
    });

    it('should set aria-hidden on the slotted element to false when opened', () => {
      panel.opened = true;
      expect(contentNode.getAttribute('aria-hidden')).to.equal('false');
    });
  });

  ['default', 'custom'].forEach((type) => {
    const fixtures = {
      default: `
        <vaadin-accordion-panel summary="Summary">
          <div>Content</div>
        </vaadin-accordion-panel>
      `,
      custom: `
        <vaadin-accordion-panel>
          <vaadin-accordion-heading slot="summary">Summary</vaadin-accordion-heading>
          <div>Content</div>
        </vaadin-accordion-panel>
      `,
    };

    let heading;

    describe(`${type} summary`, () => {
      let toggle;

      beforeEach(async () => {
        panel = fixtureSync(fixtures[type]);
        await nextRender();
        heading = panel.querySelector('[slot="summary"]');
        toggle = heading.shadowRoot.querySelector('button');
      });

      it(`should toggle opened on ${type} heading button click`, () => {
        toggle.click();
        expect(panel.opened).to.be.true;

        toggle.click();
        expect(panel.opened).to.be.false;
      });

      it(`should toggle opened on ${type} heading button Enter`, async () => {
        toggle.focus();

        await sendKeys({ press: 'Enter' });
        expect(panel.opened).to.be.true;

        await sendKeys({ press: 'Enter' });
        expect(panel.opened).to.be.false;
      });

      it(`should toggle opened on ${type} heading button Space`, async () => {
        toggle.focus();

        await sendKeys({ press: 'Space' });
        expect(panel.opened).to.be.true;

        await sendKeys({ press: 'Space' });
        expect(panel.opened).to.be.false;
      });

      it(`should not update opened on ${type} heading button Arrow Down`, async () => {
        toggle.focus();
        await sendKeys({ press: 'ArrowDown' });
        expect(panel.opened).to.be.false;
      });

      it(`should fire opened-changed event on ${type} heading button click`, () => {
        const spy = sinon.spy();
        panel.addEventListener('opened-changed', spy);
        toggle.click();
        expect(spy.calledOnce).to.be.true;
      });

      it(`should update aria-expanded on ${type} heading button click`, () => {
        toggle.click();
        expect(toggle.getAttribute('aria-expanded')).to.equal('true');

        toggle.click();
        expect(toggle.getAttribute('aria-expanded')).to.equal('false');
      });

      it(`should propagate disabled attribute to ${type} heading`, () => {
        panel.disabled = true;
        expect(heading.hasAttribute('disabled')).to.be.true;

        panel.disabled = false;
        expect(heading.hasAttribute('disabled')).to.be.false;
      });
    });
  });
});

import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/text-field/src/vaadin-text-field.js';
import { AiFieldMarker } from '../src/vaadin-ai-field-marker.js';

const DEFAULT_MESSAGE = 'This value was filled in by an AI based on the input you provided';

describe('ai field marker', () => {
  let field;

  beforeEach(async () => {
    field = fixtureSync(`<vaadin-text-field label="Name" value="AI value"></vaadin-text-field>`);
    await nextRender();
  });

  describe('mark', () => {
    let marker;

    beforeEach(async () => {
      marker = AiFieldMarker.mark(field);
      await nextRender();
    });

    it('should inject the marker into the field shadow root', () => {
      expect(field.shadowRoot.querySelector('vaadin-ai-field-marker')).to.equal(marker);
    });

    it('should set the has-ai-marker attribute on the field', () => {
      expect(field.hasAttribute('has-ai-marker')).to.be.true;
    });

    it('should inject the host highlight styles into the field shadow root', () => {
      expect(field.shadowRoot.querySelector('style[data-ai-field-marker]')).to.exist;
    });

    it('should render an accessible badge button', () => {
      const badge = marker.shadowRoot.querySelector('[part="badge"]');
      expect(badge).to.exist;
      expect(badge.localName).to.equal('button');
      expect(badge.getAttribute('aria-label')).to.equal('Filled in by AI');
    });

    it('should render the default message in the popover', () => {
      const message = marker.shadowRoot.querySelector('[part="message"]');
      expect(message.textContent).to.equal(DEFAULT_MESSAGE);
    });

    it('should render an accessible revert control', () => {
      const button = marker.shadowRoot.querySelector('[part="revert-button"]');
      expect(button).to.exist;
      expect(button.localName).to.equal('button');
    });

    it('should describe the field input for screen readers', () => {
      expect(field.inputElement.getAttribute('aria-description')).to.equal(DEFAULT_MESSAGE);
    });

    it('should be idempotent', () => {
      const again = AiFieldMarker.mark(field);
      expect(again).to.equal(marker);
      expect(field.shadowRoot.querySelectorAll('vaadin-ai-field-marker')).to.have.lengthOf(1);
    });

    it('should open the popover on badge click', async () => {
      const popover = marker.shadowRoot.querySelector('vaadin-popover');
      marker.shadowRoot.querySelector('[part="badge"]').click();
      await nextRender();
      expect(popover.opened).to.be.true;
    });

    it('should return null for a field without a shadow root', () => {
      expect(AiFieldMarker.mark(document.createElement('input'))).to.be.null;
    });
  });

  describe('options', () => {
    it('should override message, revert text and additional content', async () => {
      const marker = AiFieldMarker.mark(field, {
        message: 'Custom message',
        revertText: 'Undo',
        additionalContent: 'Extracted from the uploaded document',
      });
      await nextRender();
      expect(marker.shadowRoot.querySelector('[part="message"]').textContent).to.equal('Custom message');
      expect(marker.shadowRoot.querySelector('[part="revert-button"]').textContent).to.equal('Undo');
      expect(marker.shadowRoot.querySelector('[part="additional-content"]').textContent).to.equal(
        'Extracted from the uploaded document',
      );
    });

    it('should not override an application-provided aria-description', () => {
      field.inputElement.setAttribute('aria-description', 'app provided');
      AiFieldMarker.mark(field);
      expect(field.inputElement.getAttribute('aria-description')).to.equal('app provided');
    });
  });

  describe('revert', () => {
    let marker;
    let revertButton;

    beforeEach(async () => {
      marker = AiFieldMarker.mark(field);
      await nextRender();
      revertButton = marker.shadowRoot.querySelector('[part="revert-button"]');
    });

    it('should fire ai-field-revert from the field when revert is activated', () => {
      const spy = sinon.spy();
      field.addEventListener('ai-field-revert', spy);
      revertButton.click();
      expect(spy.calledOnce).to.be.true;
    });

    it('should carry the captured value in the event detail', () => {
      const spy = sinon.spy();
      field.addEventListener('ai-field-revert', spy);
      revertButton.click();
      expect(spy.firstCall.args[0].detail.value).to.equal('AI value');
    });

    it('should bubble out of the field', () => {
      const spy = sinon.spy();
      document.addEventListener('ai-field-revert', spy);
      revertButton.click();
      document.removeEventListener('ai-field-revert', spy);
      expect(spy.calledOnce).to.be.true;
    });

    it('should not restore the value itself', () => {
      revertButton.click();
      // The host restores the value; the marker only fires the event.
      expect(field.value).to.equal('AI value');
    });

    it('should close the popover on revert', async () => {
      const popover = marker.shadowRoot.querySelector('vaadin-popover');
      marker.shadowRoot.querySelector('[part="badge"]').click();
      await nextRender();
      expect(popover.opened).to.be.true;

      revertButton.click();
      await nextUpdate(popover);
      expect(popover.opened).to.be.false;
    });
  });

  describe('unmark', () => {
    beforeEach(async () => {
      AiFieldMarker.mark(field);
      await nextRender();
    });

    it('should remove the marker element', () => {
      AiFieldMarker.unmark(field);
      expect(field.shadowRoot.querySelector('vaadin-ai-field-marker')).to.not.exist;
    });

    it('should remove the has-ai-marker attribute', () => {
      AiFieldMarker.unmark(field);
      expect(field.hasAttribute('has-ai-marker')).to.be.false;
    });

    it('should remove the injected host styles', () => {
      AiFieldMarker.unmark(field);
      expect(field.shadowRoot.querySelector('style[data-ai-field-marker]')).to.not.exist;
    });

    it('should remove the aria-description from the input', () => {
      AiFieldMarker.unmark(field);
      expect(field.inputElement.hasAttribute('aria-description')).to.be.false;
    });

    it('should be a no-op for an unmarked field', () => {
      const other = fixtureSync(`<vaadin-text-field></vaadin-text-field>`);
      expect(() => AiFieldMarker.unmark(other)).to.not.throw();
    });
  });
});

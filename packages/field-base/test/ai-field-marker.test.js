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

    it('should describe the field input for screen readers via aria-describedby', () => {
      const ids = (field.inputElement.getAttribute('aria-describedby') || '').split(' ');
      const descId = ids.find((id) => id.startsWith('ai-field-marker-'));
      expect(descId, 'aria-describedby should reference the AI description node').to.be.ok;
      const descNode = field.querySelector(`#${descId}`);
      expect(descNode).to.exist;
      expect(descNode.textContent).to.equal(DEFAULT_MESSAGE);
    });

    it('should render the description node via an injected slot', () => {
      const descId = (field.inputElement.getAttribute('aria-describedby') || '')
        .split(' ')
        .find((id) => id.startsWith('ai-field-marker-'));
      const descNode = field.querySelector(`#${descId}`);
      // assignedSlot is non-null only when the node is matched to a slot and
      // therefore rendered (not left as unslotted, unrendered light DOM).
      expect(descNode.assignedSlot).to.exist;
      expect(descNode.assignedSlot.name).to.equal('ai-field-marker-description');
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

    it('should keep the field helper description alongside the AI description', async () => {
      const helperField = fixtureSync(
        `<vaadin-text-field label="Name" helper-text="Keep it short"></vaadin-text-field>`,
      );
      await nextRender();
      const helperIds = helperField.inputElement.getAttribute('aria-describedby').split(' ');

      AiFieldMarker.mark(helperField);
      const ids = helperField.inputElement.getAttribute('aria-describedby').split(' ');

      // Every original (helper) id is preserved...
      helperIds.forEach((id) => expect(ids).to.include(id));
      // ...and the AI description id is appended.
      expect(ids.some((id) => id.startsWith('ai-field-marker-'))).to.be.true;
    });
  });

  describe('setDefaults', () => {
    afterEach(() => {
      // Restore built-in defaults so global state does not leak between tests.
      AiFieldMarker.setDefaults({ message: DEFAULT_MESSAGE, revertText: 'Revert', badgeLabel: 'Filled in by AI' });
    });

    it('should apply globally configured texts to subsequently marked fields', async () => {
      AiFieldMarker.setDefaults({
        message: 'Tämä arvo on tekoälyn täyttämä',
        revertText: 'Kumoa',
        badgeLabel: 'Tekoälyn täyttämä',
      });

      const marker = AiFieldMarker.mark(field);
      await nextRender();

      expect(marker.shadowRoot.querySelector('[part="message"]').textContent).to.equal(
        'Tämä arvo on tekoälyn täyttämä',
      );
      expect(marker.shadowRoot.querySelector('[part="revert-button"]').textContent).to.equal('Kumoa');
      expect(marker.shadowRoot.querySelector('[part="badge"]').getAttribute('aria-label')).to.equal(
        'Tekoälyn täyttämä',
      );
    });

    it('should let per-field options override the global defaults', async () => {
      AiFieldMarker.setDefaults({ message: 'Global default' });

      const marker = AiFieldMarker.mark(field, { message: 'Per-field override' });
      await nextRender();

      expect(marker.shadowRoot.querySelector('[part="message"]').textContent).to.equal('Per-field override');
    });

    it('should only change the provided keys', async () => {
      AiFieldMarker.setDefaults({ message: 'Only message changed' });

      const marker = AiFieldMarker.mark(field);
      await nextRender();

      expect(marker.shadowRoot.querySelector('[part="message"]').textContent).to.equal('Only message changed');
      // revertText was not configured, so it stays the built-in default.
      expect(marker.shadowRoot.querySelector('[part="revert-button"]').textContent).to.equal('Revert');
    });
  });

  describe('custom popover content', () => {
    it('should forward field popover content into the popover content slot', async () => {
      const custom = document.createElement('div');
      custom.textContent = 'Custom content';
      custom.slot = 'ai-field-marker-popover-content';
      field.appendChild(custom);

      const marker = AiFieldMarker.mark(field);
      await nextRender();

      // Step 1: the field child is assigned to the marker's forwarding slot,
      // which lives in the field's shadow tree as a light child of the marker.
      const forwardingSlot = custom.assignedSlot;
      expect(forwardingSlot, 'field content should be slotted').to.exist;
      expect(forwardingSlot.localName).to.equal('slot');
      expect(forwardingSlot.getAttribute('name')).to.equal('ai-field-marker-popover-content');
      expect(forwardingSlot.parentNode).to.equal(marker);

      // Step 2: the forwarding slot is itself assigned to the popover-content
      // slot inside the marker's shadow (so the content reaches the popover).
      const popoverSlot = forwardingSlot.assignedSlot;
      expect(popoverSlot, 'forwarding slot should reach the popover slot').to.exist;
      expect(popoverSlot.getAttribute('name')).to.equal('ai-field-marker-popover-content');
      expect(popoverSlot.getRootNode()).to.equal(marker.shadowRoot);
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

    it('should remove the AI description from aria-describedby and the DOM', () => {
      const ids = (field.inputElement.getAttribute('aria-describedby') || '').split(' ');
      const descId = ids.find((id) => id.startsWith('ai-field-marker-'));

      AiFieldMarker.unmark(field);

      const after = field.inputElement.getAttribute('aria-describedby') || '';
      expect(after).to.not.contain('ai-field-marker-');
      expect(field.querySelector(`#${descId}`)).to.not.exist;
    });

    it('should be a no-op for an unmarked field', () => {
      const other = fixtureSync(`<vaadin-text-field></vaadin-text-field>`);
      expect(() => AiFieldMarker.unmark(other)).to.not.throw();
    });
  });
});

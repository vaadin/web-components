import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/custom-field/src/vaadin-custom-field.js';
import '@vaadin/text-field/src/vaadin-text-field.js';
import { AiFieldMarker } from '../src/vaadin-ai-field-marker.js';

const DEFAULT_MESSAGE = 'This field value was modified by AI.';
const DEFAULT_BADGE_LABEL = 'AI-provided value';
const DEFAULT_BADGE_TOOLTIP = 'Field value modified by AI.\nClick for details';

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

    it('should slot the marker into the field via an injected slot', () => {
      expect(field.querySelector('vaadin-ai-field-marker')).to.equal(marker);
      expect(marker.assignedSlot).to.exist;
      expect(marker.assignedSlot.name).to.equal('ai-field-marker');
      expect(marker.assignedSlot.getRootNode()).to.equal(field.shadowRoot);
    });

    it('should adopt the highlight styles into the field shadow root', () => {
      expect(field.shadowRoot.adoptedStyleSheets).to.have.length.above(0);
    });

    it('should adopt the marker styles into the field root node', () => {
      expect(field.getRootNode().adoptedStyleSheets).to.have.length.above(0);
    });

    it('should render an accessible badge button', () => {
      const badge = marker.querySelector('[part="badge"]');
      expect(badge).to.exist;
      expect(badge.localName).to.equal('button');
      expect(badge.getAttribute('aria-label')).to.equal(DEFAULT_BADGE_LABEL);
    });

    it('should render a badge tooltip', () => {
      const badge = marker.querySelector('[part="badge"]');
      const tooltip = marker.querySelector('vaadin-tooltip');
      expect(tooltip.getAttribute('for')).to.equal(badge.id);
      expect(tooltip.getAttribute('text')).to.equal(DEFAULT_BADGE_TOOLTIP);
    });

    it('should render the default message in the popover', () => {
      const message = marker.querySelector('[part="message"]');
      expect(message.textContent).to.equal(DEFAULT_MESSAGE);
    });

    it('should render an accessible revert control', () => {
      const button = marker.querySelector('[part="revert-button"]');
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

    it('should render the description node inside the slotted marker', () => {
      const descId = (field.inputElement.getAttribute('aria-describedby') || '')
        .split(' ')
        .find((id) => id.startsWith('ai-field-marker-'));
      const descNode = field.querySelector(`#${descId}`);
      // The node lives inside the marker, which is assigned to the injected
      // slot and therefore rendered (not left as unslotted, unrendered light DOM).
      expect(marker.contains(descNode)).to.be.true;
      expect(marker.assignedSlot).to.exist;
    });

    it('should be idempotent', () => {
      const again = AiFieldMarker.mark(field);
      expect(again).to.equal(marker);
      expect(field.querySelectorAll('vaadin-ai-field-marker')).to.have.lengthOf(1);
      expect(field.shadowRoot.querySelectorAll('slot[name="ai-field-marker"]')).to.have.lengthOf(1);
    });

    it('should open the popover on badge click', async () => {
      const popover = marker.querySelector('vaadin-popover');
      marker.querySelector('[part="badge"]').click();
      await nextRender();
      expect(popover.opened).to.be.true;
    });

    it('should return null for a field without a shadow root', () => {
      expect(AiFieldMarker.mark(document.createElement('input'))).to.be.null;
    });
  });

  describe('options', () => {
    it('should override message, revert text, badge tooltip and additional content', async () => {
      const marker = AiFieldMarker.mark(field, {
        message: 'Custom message',
        revertText: 'Undo',
        badgeTooltip: 'Open AI details',
        additionalContent: 'Extracted from the uploaded document',
      });
      await nextRender();
      expect(marker.querySelector('[part="message"]').textContent).to.equal('Custom message');
      expect(marker.querySelector('[part="revert-button"]').textContent).to.equal('Undo');
      expect(marker.querySelector('vaadin-tooltip').getAttribute('text')).to.equal('Open AI details');
      expect(marker.querySelector('[part="additional-content"]').textContent).to.equal(
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
      AiFieldMarker.setDefaults({
        message: DEFAULT_MESSAGE,
        revertText: 'Revert',
        badgeLabel: DEFAULT_BADGE_LABEL,
        badgeTooltip: DEFAULT_BADGE_TOOLTIP,
      });
    });

    it('should apply globally configured texts to subsequently marked fields', async () => {
      AiFieldMarker.setDefaults({
        message: 'Tämä arvo on tekoälyn täyttämä',
        revertText: 'Kumoa',
        badgeLabel: 'Tekoälyn täyttämä',
        badgeTooltip: 'Avaa tekoälyn tiedot',
      });

      const marker = AiFieldMarker.mark(field);
      await nextRender();

      expect(marker.querySelector('[part="message"]').textContent).to.equal('Tämä arvo on tekoälyn täyttämä');
      expect(marker.querySelector('[part="revert-button"]').textContent).to.equal('Kumoa');
      expect(marker.querySelector('[part="badge"]').getAttribute('aria-label')).to.equal('Tekoälyn täyttämä');
      expect(marker.querySelector('vaadin-tooltip').getAttribute('text')).to.equal('Avaa tekoälyn tiedot');
    });

    it('should let per-field options override the global defaults', async () => {
      AiFieldMarker.setDefaults({ message: 'Global default' });

      const marker = AiFieldMarker.mark(field, { message: 'Per-field override' });
      await nextRender();

      expect(marker.querySelector('[part="message"]').textContent).to.equal('Per-field override');
    });

    it('should only change the provided keys', async () => {
      AiFieldMarker.setDefaults({ message: 'Only message changed' });

      const marker = AiFieldMarker.mark(field);
      await nextRender();

      expect(marker.querySelector('[part="message"]').textContent).to.equal('Only message changed');
      // revertText was not configured, so it stays the built-in default.
      expect(marker.querySelector('[part="revert-button"]').textContent).to.equal('Revert');
    });
  });

  describe('custom popover content', () => {
    it('should render custom content appended to the popover', async () => {
      const marker = AiFieldMarker.mark(field);
      await nextRender();

      // The marker renders in the field's light DOM, so a framework (e.g.
      // Flow) can add popover content by appending it to the popover element.
      const popover = field.querySelector('vaadin-ai-field-marker > vaadin-popover');
      expect(popover).to.exist;

      const custom = document.createElement('div');
      custom.textContent = 'Custom content';
      popover.appendChild(custom);

      marker.querySelector('[part="badge"]').click();
      await nextRender();

      // The content stays in place and is slotted into the popover overlay.
      expect(custom.assignedSlot, 'custom content should be slotted').to.exist;
      expect(custom.assignedSlot.getRootNode().host.localName).to.equal('vaadin-popover');
    });
  });

  describe('revert', () => {
    let marker;
    let revertButton;

    beforeEach(async () => {
      marker = AiFieldMarker.mark(field);
      await nextRender();
      revertButton = marker.querySelector('[part="revert-button"]');
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
      const popover = marker.querySelector('vaadin-popover');
      marker.querySelector('[part="badge"]').click();
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
      expect(field.querySelector('vaadin-ai-field-marker')).to.not.exist;
    });

    it('should remove the injected marker slot', () => {
      AiFieldMarker.unmark(field);
      expect(field.shadowRoot.querySelector('slot[name="ai-field-marker"]')).to.not.exist;
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

  describe('working state', () => {
    describe('startWorking', () => {
      beforeEach(() => {
        AiFieldMarker.startWorking(field);
      });

      it('should set the ai-working attribute on the field', () => {
        expect(field.hasAttribute('ai-working')).to.be.true;
      });

      it('should make the field read-only on the client', () => {
        expect(field.readonly).to.be.true;
      });

      it('should not change the field value', () => {
        expect(field.value).to.equal('AI value');
      });

      it('should be idempotent', () => {
        AiFieldMarker.startWorking(field);

        AiFieldMarker.stopWorking(field);
        expect(field.hasAttribute('ai-working')).to.be.false;
        expect(field.readonly).to.be.false;
      });

      it('should be a no-op for a field without a shadow root', () => {
        const input = document.createElement('input');
        expect(() => AiFieldMarker.startWorking(input)).to.not.throw();
        expect(input.hasAttribute('ai-working')).to.be.false;
      });
    });

    describe('stopWorking', () => {
      beforeEach(() => {
        AiFieldMarker.startWorking(field);
        AiFieldMarker.stopWorking(field);
      });

      it('should remove the ai-working attribute', () => {
        expect(field.hasAttribute('ai-working')).to.be.false;
      });

      it('should restore the client read-only state', () => {
        expect(field.readonly).to.be.false;
      });

      it('should keep a read-only state that was set before startWorking', () => {
        field.readonly = true;

        AiFieldMarker.startWorking(field);
        AiFieldMarker.stopWorking(field);

        expect(field.readonly).to.be.true;
      });

      it('should be a no-op for a field not in the working state', () => {
        const other = fixtureSync(`<vaadin-text-field></vaadin-text-field>`);
        expect(() => AiFieldMarker.stopWorking(other)).to.not.throw();
      });
    });

    describe('custom field', () => {
      let customField;
      let inputs;

      beforeEach(async () => {
        // vaadin-custom-field does not propagate readonly to its inputs, so
        // the working state must lock and restore them individually.
        customField = fixtureSync(`
          <vaadin-custom-field label="License plate">
            <vaadin-text-field></vaadin-text-field>
            <vaadin-text-field readonly></vaadin-text-field>
          </vaadin-custom-field>
        `);
        await nextRender();
        inputs = customField.inputs;
      });

      it('should make the inputs read-only on startWorking', () => {
        AiFieldMarker.startWorking(customField);
        expect(inputs.every((input) => input.readonly)).to.be.true;
      });

      it('should restore each input read-only state on stopWorking', () => {
        AiFieldMarker.startWorking(customField);
        AiFieldMarker.stopWorking(customField);
        expect(inputs[0].readonly).to.be.false;
        expect(inputs[1].readonly).to.be.true;
      });
    });
  });
});

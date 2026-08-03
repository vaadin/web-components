import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/custom-field/src/vaadin-custom-field.js';
import '@vaadin/text-field/src/vaadin-text-field.js';
import { AiFieldMarker } from '../src/vaadin-ai-field-marker.js';

const DEFAULT_MESSAGE = 'This field value was modified by AI.';
const DEFAULT_REVERT_TEXT = 'Revert Value';
const DEFAULT_BADGE_LABEL = 'AI-provided value';
const DEFAULT_BADGE_TOOLTIP = 'Field value modified by AI.\nClick for details';

/**
 * Creates a marker with the given properties and appends it to the field,
 * the way a host application marks a field as AI-filled.
 */
function mark(field, properties = {}) {
  const marker = document.createElement('vaadin-ai-field-marker');
  Object.assign(marker, properties);
  field.appendChild(marker);
  return marker;
}

/**
 * A minimal field that gives `focus()` and a host click a component-specific
 * meaning, the way date-picker and multi-select-combo-box open their overlay.
 * The marker must not trigger either of those.
 */
class FocusSensitiveField extends HTMLElement {
  constructor() {
    super();
    this.openedOnFocus = false;
    this.openedOnClick = false;
    this.attachShadow({ mode: 'open' });
    this._input = document.createElement('input');
    this.shadowRoot.append(this._input);
    this.addEventListener('click', () => {
      this.openedOnClick = true;
    });
  }

  get focusElement() {
    return this._input;
  }

  get inputElement() {
    return this._input;
  }

  focus() {
    this.openedOnFocus = true;
    this._input.focus();
  }
}

customElements.define('focus-sensitive-field', FocusSensitiveField);

describe('ai field marker', () => {
  let field;

  beforeEach(async () => {
    field = fixtureSync(`<vaadin-text-field label="Name" value="AI value"></vaadin-text-field>`);
    await nextRender();
  });

  describe('mark', () => {
    let marker;

    beforeEach(async () => {
      marker = mark(field);
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
      expect(tooltip.text).to.equal(DEFAULT_BADGE_TOOLTIP);
    });

    it('should assign the generated content to named slots in the shadow root', () => {
      ['badge', 'tooltip', 'message', 'actions'].forEach((slotName) => {
        const slot = marker.shadowRoot.querySelector(`slot[name="${slotName}"]`);
        expect(slot, `${slotName} slot should exist`).to.exist;
        expect(slot.assignedElements()).to.have.lengthOf(1);
      });
    });

    it('should render the popover in the shadow root wrapping the content slots', () => {
      const popover = marker.shadowRoot.querySelector('vaadin-popover');
      expect(popover).to.exist;
      expect(popover.target).to.equal(marker.querySelector('[part="badge"]'));
      expect(popover.querySelector('slot[name="message"]')).to.exist;
      expect(popover.querySelector('slot:not([name])')).to.exist;
      expect(popover.querySelector('slot[name="actions"]')).to.exist;
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

    it('should not duplicate the injected slot when re-added', async () => {
      marker.remove();
      field.appendChild(marker);
      await nextRender();

      expect(field.querySelectorAll('vaadin-ai-field-marker')).to.have.lengthOf(1);
      expect(field.shadowRoot.querySelectorAll('slot[name="ai-field-marker"]')).to.have.lengthOf(1);
      expect(marker.assignedSlot).to.exist;
    });

    it('should open the popover on badge click', async () => {
      const popover = marker.shadowRoot.querySelector('vaadin-popover');
      marker.querySelector('[part="badge"]').click();
      await nextRender();
      expect(popover.opened).to.be.true;
    });

    it('should not render for a parent without a shadow root', async () => {
      const container = fixtureSync(`<div></div>`);
      const other = mark(container);
      await nextRender();
      const badge = other.querySelector('[part="badge"]');
      expect(badge.assignedSlot).to.be.null;
      expect(badge.checkVisibility()).to.be.false;
    });
  });

  describe('properties', () => {
    it('should override message, revert text and badge tooltip', async () => {
      const marker = mark(field, {
        message: 'Custom message',
        revertText: 'Undo',
        badgeTooltip: 'Open AI details',
      });
      await nextRender();
      expect(marker.querySelector('[part="message"]').textContent).to.equal('Custom message');
      expect(marker.querySelector('[part="revert-button"]').textContent).to.equal('Undo');
      expect(marker.querySelector('vaadin-tooltip').text).to.equal('Open AI details');
    });

    it('should update the description node when the message changes', async () => {
      const marker = mark(field);
      await nextRender();

      marker.message = 'Refreshed';
      await nextUpdate(marker);

      const descId = (field.inputElement.getAttribute('aria-describedby') || '')
        .split(' ')
        .find((id) => id.startsWith('ai-field-marker-'));
      expect(field.querySelector(`#${descId}`).textContent).to.equal('Refreshed');
    });

    it('should keep the field helper description alongside the AI description', async () => {
      const helperField = fixtureSync(
        `<vaadin-text-field label="Name" helper-text="Keep it short"></vaadin-text-field>`,
      );
      await nextRender();
      const helperIds = helperField.inputElement.getAttribute('aria-describedby').split(' ');

      mark(helperField);
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
        revertText: DEFAULT_REVERT_TEXT,
        badgeLabel: DEFAULT_BADGE_LABEL,
        badgeTooltip: DEFAULT_BADGE_TOOLTIP,
      });
    });

    it('should apply globally configured texts to subsequently created markers', async () => {
      AiFieldMarker.setDefaults({
        message: 'Tämä arvo on tekoälyn täyttämä',
        revertText: 'Kumoa',
        badgeLabel: 'Tekoälyn täyttämä',
        badgeTooltip: 'Avaa tekoälyn tiedot',
      });

      const marker = mark(field);
      await nextRender();

      expect(marker.querySelector('[part="message"]').textContent).to.equal('Tämä arvo on tekoälyn täyttämä');
      expect(marker.querySelector('[part="revert-button"]').textContent).to.equal('Kumoa');
      expect(marker.querySelector('[part="badge"]').getAttribute('aria-label')).to.equal('Tekoälyn täyttämä');
      expect(marker.querySelector('vaadin-tooltip').text).to.equal('Avaa tekoälyn tiedot');
    });

    it('should let per-marker properties override the global defaults', async () => {
      AiFieldMarker.setDefaults({ message: 'Global default' });

      const marker = mark(field, { message: 'Per-field override' });
      await nextRender();

      expect(marker.querySelector('[part="message"]').textContent).to.equal('Per-field override');
    });

    it('should only change the provided keys', async () => {
      AiFieldMarker.setDefaults({ message: 'Only message changed' });

      const marker = mark(field);
      await nextRender();

      expect(marker.querySelector('[part="message"]').textContent).to.equal('Only message changed');
      // revertText was not configured, so it stays the built-in default.
      expect(marker.querySelector('[part="revert-button"]').textContent).to.equal(DEFAULT_REVERT_TEXT);
    });
  });

  describe('custom popover content', () => {
    let marker;

    beforeEach(async () => {
      marker = mark(field);
      await nextRender();
    });

    it('should slot content appended to the marker into the popover', () => {
      // The default slot is how a framework (e.g. Flow) adds custom popover
      // content: elements appended to the marker are slotted into the
      // popover, staying children of the marker.
      const custom = document.createElement('div');
      marker.appendChild(custom);

      expect(custom.parentElement).to.equal(marker);
      const slot = custom.assignedSlot;
      expect(slot, 'custom content should be slotted').to.exist;
      expect(slot.parentElement).to.equal(marker.shadowRoot.querySelector('vaadin-popover'));
      // Between the explanation and the revert control.
      expect(slot.previousElementSibling).to.equal(marker.shadowRoot.querySelector('slot[name="message"]'));
      expect(slot.nextElementSibling).to.equal(marker.shadowRoot.querySelector('slot[name="actions"]'));
    });

    it('should show the custom content in the popover overlay', async () => {
      const custom = document.createElement('div');
      custom.textContent = 'Custom content';
      marker.appendChild(custom);
      await nextRender();

      marker.querySelector('[part="badge"]').click();
      await nextRender();

      expect(custom.checkVisibility()).to.be.true;
    });

    it('should keep the custom content when other properties change', async () => {
      const custom = document.createElement('img');
      marker.appendChild(custom);
      await nextRender();

      marker.message = 'Refreshed';
      await nextUpdate(marker);

      expect(custom.parentElement).to.equal(marker);
      expect(custom.assignedSlot).to.exist;
    });
  });

  describe('revert', () => {
    let marker;
    let revertButton;

    beforeEach(async () => {
      marker = mark(field);
      await nextRender();
      revertButton = marker.querySelector('[part="revert-button"]');
    });

    it('should fire ai-field-revert from the field when revert is activated', () => {
      const spy = sinon.spy();
      field.addEventListener('ai-field-revert', spy);
      revertButton.click();
      expect(spy).to.be.calledOnce;
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
      expect(spy).to.be.calledOnce;
    });

    it('should not restore the value itself', () => {
      revertButton.click();
      // The host restores the value; the marker only fires the event.
      expect(field.value).to.equal('AI value');
    });

    it('should close the popover on revert', async () => {
      const popover = marker.shadowRoot.querySelector('vaadin-popover');
      marker.querySelector('[part="badge"]').click();
      await nextRender();
      expect(popover.opened).to.be.true;

      revertButton.click();
      await nextUpdate(popover);
      expect(popover.opened).to.be.false;
    });

    it('should move focus to the field input', () => {
      // The popover restores focus to the badge, which the host may remove on
      // revert, so the marker moves focus to the field first.
      revertButton.click();
      expect(field.inputElement.matches(':focus')).to.be.true;
      expect(field.hasAttribute('focused')).to.be.true;
    });

    it('should not force the focus-ring on the field', () => {
      // Focusing the input directly leaves the focus-ring to the field's own
      // keyboard-vs-pointer detection; a host focus() would force it on.
      revertButton.click();
      expect(field.hasAttribute('focus-ring')).to.be.false;
    });
  });

  describe('revert on a field with focus and click semantics', () => {
    let sensitiveField;
    let marker;

    beforeEach(async () => {
      sensitiveField = fixtureSync(`<focus-sensitive-field></focus-sensitive-field>`);
      marker = mark(sensitiveField);
      await nextRender();
    });

    it('should not run the field focus() side effects on revert', () => {
      marker.querySelector('[part="revert-button"]').click();
      expect(sensitiveField.openedOnFocus).to.be.false;
      expect(sensitiveField.inputElement.matches(':focus')).to.be.true;
    });

    it('should not let a badge click reach the field', () => {
      marker.querySelector('[part="badge"]').click();
      expect(sensitiveField.openedOnClick).to.be.false;
    });

    it('should not let a popover click reach the field', async () => {
      marker.querySelector('[part="badge"]').click();
      await nextRender();

      marker.querySelector('[part="revert-button"]').click();
      expect(sensitiveField.openedOnClick).to.be.false;
    });
  });

  describe('click containment', () => {
    // The marker and its popover content live in the field's light DOM, so
    // without containment their clicks reach the field host. Fields that open
    // an overlay on host click (date-picker, multi-select-combo-box) would act
    // on them as if the field itself had been clicked.
    let marker;
    let spy;

    beforeEach(async () => {
      marker = mark(field);
      await nextRender();
      spy = sinon.spy();
      field.addEventListener('click', spy);
    });

    it('should not propagate badge clicks to the field', () => {
      marker.querySelector('[part="badge"]').click();
      expect(spy).to.not.be.called;
    });

    it('should not propagate popover clicks to the field', async () => {
      marker.querySelector('[part="badge"]').click();
      await nextRender();

      marker.querySelector('[part="revert-button"]').click();
      expect(spy).to.not.be.called;
    });

    it('should not propagate description node clicks to the field', () => {
      // The marker also holds the hidden aria-describedby node.
      const descId = (field.inputElement.getAttribute('aria-describedby') || '')
        .split(' ')
        .find((id) => id.startsWith('ai-field-marker-'));
      marker.querySelector(`#${descId}`).click();
      expect(spy).to.not.be.called;
    });

    it('should still let clicks on the field itself through', () => {
      field.inputElement.click();
      expect(spy).to.be.calledOnce;
    });

    it('should still open the popover on badge click', async () => {
      // Containment must not block the popover's own click trigger, which is
      // bound on the badge inside the marker.
      marker.querySelector('[part="badge"]').click();
      await nextRender();
      expect(marker.shadowRoot.querySelector('vaadin-popover').opened).to.be.true;
    });
  });

  describe('remove', () => {
    let marker;

    beforeEach(async () => {
      marker = mark(field);
      await nextRender();
    });

    it('should remove the marker element', () => {
      marker.remove();
      expect(field.querySelector('vaadin-ai-field-marker')).to.not.exist;
    });

    it('should remove the injected marker slot', () => {
      marker.remove();
      expect(field.shadowRoot.querySelector('slot[name="ai-field-marker"]')).to.not.exist;
    });

    it('should remove the AI description from aria-describedby and the DOM', () => {
      const ids = (field.inputElement.getAttribute('aria-describedby') || '').split(' ');
      const descId = ids.find((id) => id.startsWith('ai-field-marker-'));

      marker.remove();

      const after = field.inputElement.getAttribute('aria-describedby') || '';
      expect(after).to.not.contain('ai-field-marker-');
      expect(field.querySelector(`#${descId}`)).to.not.exist;
    });

    it('should mark the field again when re-added', async () => {
      marker.remove();
      field.appendChild(marker);
      await nextRender();

      expect(marker.assignedSlot).to.exist;
      expect(field.inputElement.getAttribute('aria-describedby')).to.contain('ai-field-marker-');
    });

    it('should be a no-op for a marker that was never added', () => {
      const other = document.createElement('vaadin-ai-field-marker');
      expect(() => other.remove()).to.not.throw();
    });
  });

  describe('working state', () => {
    let clock;

    afterEach(() => {
      if (clock) {
        clock.restore();
        clock = null;
      }
    });

    it('should apply the working state when added with working set', () => {
      mark(field, { working: true });
      expect(field.hasAttribute('ai-working')).to.be.true;
      expect(field.readonly).to.be.true;
    });

    it('should do nothing for a parent without a shadow root', async () => {
      const container = fixtureSync(`<div></div>`);
      const marker = mark(container, { working: true });
      await nextRender();
      expect(container.hasAttribute('ai-working')).to.be.false;
      expect(marker.working).to.be.true;
    });

    describe('working set after adding', () => {
      let marker;

      beforeEach(async () => {
        marker = mark(field);
        await nextRender();
        marker.working = true;
        await nextUpdate(marker);
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

      it('should re-apply the working state when re-added while working', async () => {
        marker.remove();
        expect(field.hasAttribute('ai-working')).to.be.false;
        expect(field.readonly).to.be.false;

        field.appendChild(marker);
        await nextRender();
        expect(field.hasAttribute('ai-working')).to.be.true;
        expect(field.readonly).to.be.true;
      });

      it('should restore the field when removed while working', () => {
        marker.remove();
        expect(field.hasAttribute('ai-working')).to.be.false;
        expect(field.readonly).to.be.false;
      });
    });

    describe('working cleared', () => {
      let marker;

      beforeEach(async () => {
        marker = mark(field, { working: true });
        await nextRender();
        clock = sinon.useFakeTimers({ shouldClearNativeTimers: true, toFake: ['setTimeout', 'clearTimeout'] });
        marker.working = false;
        await nextUpdate(marker);
      });

      it('should remove the ai-working attribute', () => {
        expect(field.hasAttribute('ai-working')).to.be.false;
      });

      it('should restore the client read-only state after the shimmer wind-down', async () => {
        expect(field.readonly).to.be.true;
        await clock.tickAsync(500);
        expect(field.readonly).to.be.false;
      });

      it('should keep a read-only state that was set before working', async () => {
        await clock.tickAsync(500);
        field.readonly = true;

        marker.working = true;
        await nextUpdate(marker);
        marker.working = false;
        await nextUpdate(marker);
        await clock.tickAsync(500);

        expect(field.readonly).to.be.true;
      });
    });

    describe('already marked field', () => {
      // A new AI request replaces the value the existing marker annotates, so
      // the badge and glow are stale for the duration. They stay hidden while
      // the field carries [ai-working] and come back when `working` is set to
      // `false`, which leaves the mark usable when a fill is cancelled or
      // fails.
      let marker;
      let badge;

      beforeEach(async () => {
        marker = mark(field);
        await nextRender();
        badge = marker.querySelector('[part="badge"]');
      });

      it('should hide the marker while the AI is working', async () => {
        expect(badge.checkVisibility(), 'badge should start out visible').to.be.true;

        marker.working = true;
        await nextUpdate(marker);

        expect(getComputedStyle(marker).display).to.equal('none');
        expect(badge.checkVisibility()).to.be.false;
      });

      it('should keep the marker in the DOM while the AI is working', async () => {
        marker.working = true;
        await nextUpdate(marker);
        expect(field.querySelector('vaadin-ai-field-marker')).to.equal(marker);
      });

      it('should hide an open popover while the AI is working', async () => {
        badge.click();
        await nextRender();
        const overlay = marker.shadowRoot
          .querySelector('vaadin-popover')
          .shadowRoot.querySelector('vaadin-popover-overlay');
        expect(overlay.checkVisibility(), 'popover should start out showing').to.be.true;

        marker.working = true;
        await nextRender();

        expect(overlay.checkVisibility()).to.be.false;
      });

      it('should show the marker again when working ends', async () => {
        marker.working = true;
        await nextUpdate(marker);
        marker.working = false;
        await nextUpdate(marker);

        expect(getComputedStyle(marker).display).to.equal('contents');
        expect(badge.checkVisibility()).to.be.true;
      });

      it('should keep the mark usable when a fill never lands', async () => {
        marker.working = true;
        await nextUpdate(marker);
        marker.working = false;
        await nextUpdate(marker);

        const spy = sinon.spy();
        field.addEventListener('ai-field-revert', spy);
        marker.querySelector('[part="revert-button"]').click();
        expect(spy.firstCall.args[0].detail.value).to.equal('AI value');
      });

      it('should update the mark for the new value', async () => {
        marker.working = true;
        await nextUpdate(marker);

        marker.message = 'Filled again by AI';
        marker.working = false;
        await nextUpdate(marker);

        expect(field.querySelectorAll('vaadin-ai-field-marker')).to.have.lengthOf(1);
        expect(field.shadowRoot.querySelectorAll('slot[name="ai-field-marker"]')).to.have.lengthOf(1);
        expect(marker.querySelector('[part="message"]').textContent).to.equal('Filled again by AI');
      });
    });

    describe('custom field', () => {
      let customField;
      let inputs;
      let marker;

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
        clock = sinon.useFakeTimers({ shouldClearNativeTimers: true, toFake: ['setTimeout', 'clearTimeout'] });
        marker = mark(customField, { working: true });
      });

      it('should make the inputs read-only while working', () => {
        expect(inputs.every((input) => input.readonly)).to.be.true;
      });

      it('should restore each input read-only state when working ends', async () => {
        marker.working = false;
        await nextUpdate(marker);
        await clock.tickAsync(500);
        expect(inputs[0].readonly).to.be.false;
        expect(inputs[1].readonly).to.be.true;
      });
    });
  });
});

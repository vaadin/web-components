import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/custom-field/src/vaadin-custom-field.js';
import '@vaadin/text-field/src/vaadin-text-field.js';
import '../src/vaadin-ai-field-marker.js';

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

    it('should upgrade the generated tooltip', () => {
      const tooltipClass = customElements.get('vaadin-tooltip');
      expect(tooltipClass, 'vaadin-tooltip should be registered').to.exist;
      expect(marker.querySelector('vaadin-tooltip')).to.be.instanceOf(tooltipClass);
    });

    it('should adopt the marker keyframes into the field shadow root', () => {
      const hasKeyframes = field.shadowRoot.adoptedStyleSheets.some((sheet) =>
        [...sheet.cssRules].some((rule) => rule.cssText.includes('--vaadin-ai-marker-slide')),
      );
      expect(hasKeyframes).to.be.true;
    });

    it('should render the badge and revert controls as non-submitting buttons', () => {
      expect(marker.querySelector('[part="badge"]').type).to.equal('button');
      expect(marker.querySelector('[part="revert-button"]').type).to.equal('button');
    });

    it('should render the revert control inside the actions part', () => {
      expect(marker.querySelector('[part="actions"] > [part="revert-button"]')).to.exist;
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

  describe('popover', () => {
    let marker;
    let popover;

    beforeEach(async () => {
      marker = mark(field);
      await nextRender();
      popover = marker.shadowRoot.querySelector('vaadin-popover');
    });

    it('should label the popover dialog with the badge label', () => {
      expect(popover.getAttribute('aria-label')).to.equal(DEFAULT_BADGE_LABEL);
    });

    it('should position the popover against the field end top corner', () => {
      expect(popover.position).to.equal('end-top');
    });

    it('should use the arrow theme for the popover overlay', () => {
      const overlay = popover.shadowRoot.querySelector('vaadin-popover-overlay');
      expect(overlay.getAttribute('theme')).to.contain('arrow');
    });

    it('should lay out the popover content as a column', async () => {
      marker.querySelector('[part="badge"]').click();
      await nextRender();

      const overlay = popover.shadowRoot.querySelector('vaadin-popover-overlay');
      const content = overlay.shadowRoot.querySelector('[part="content"]');
      expect(getComputedStyle(content).flexDirection).to.equal('column');
    });

    it('should move focus into the popover on open', async () => {
      const overlay = popover.shadowRoot.querySelector('vaadin-popover-overlay');
      const opened = oneEvent(overlay, 'vaadin-overlay-open');
      marker.querySelector('[part="badge"]').click();
      await opened;

      expect(marker.contains(document.activeElement), 'focus should move into the popover').to.be.true;
    });

    it('should keep the description slot outside the popover', () => {
      expect(popover.querySelector('slot[name="description"]')).to.be.null;
      expect(marker.shadowRoot.querySelector('slot[name="description"]')).to.exist;
    });
  });

  describe('input description', () => {
    it('should update the description node when the message changes', async () => {
      const marker = mark(field);
      await nextRender();

      marker.i18n = { message: 'Refreshed' };
      await nextUpdate(marker);

      const descId = (field.inputElement.getAttribute('aria-describedby') || '')
        .split(' ')
        .find((id) => id.startsWith('ai-field-marker-'));
      expect(field.querySelector(`#${descId}`).textContent).to.equal('Refreshed');
    });

    it('should assign the description node to its own slot', async () => {
      const marker = mark(field);
      await nextRender();

      const descNode = marker.querySelector('span[id^="ai-field-marker-"]');
      expect(descNode.assignedSlot).to.exist;
      // Not the default slot, which would show the node in the popover.
      expect(descNode.assignedSlot.name).to.equal('description');
    });

    it('should visually hide the description node', async () => {
      const marker = mark(field);
      await nextRender();

      const descNode = marker.querySelector('span[id^="ai-field-marker-"]');
      expect(getComputedStyle(descNode).position).to.equal('absolute');
      expect(getComputedStyle(descNode).width).to.equal('1px');
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

  describe('i18n', () => {
    it('should return the default texts from the i18n property', () => {
      const marker = document.createElement('vaadin-ai-field-marker');
      expect(marker.i18n.message).to.equal(DEFAULT_MESSAGE);
      expect(marker.i18n.revert).to.equal(DEFAULT_REVERT_TEXT);
      expect(marker.i18n.badgeLabel).to.equal(DEFAULT_BADGE_LABEL);
      expect(marker.i18n.badgeTooltip).to.equal(DEFAULT_BADGE_TOOLTIP);
    });

    it('should apply localized texts to the marker', async () => {
      const marker = mark(field, {
        i18n: {
          message: 'Tämä arvo on tekoälyn täyttämä',
          revert: 'Kumoa',
          badgeLabel: 'Tekoälyn täyttämä',
          badgeTooltip: 'Avaa tekoälyn tiedot',
        },
      });
      await nextRender();

      expect(marker.querySelector('[part="message"]').textContent).to.equal('Tämä arvo on tekoälyn täyttämä');
      expect(marker.querySelector('[part="revert-button"]').textContent).to.equal('Kumoa');
      expect(marker.querySelector('[part="badge"]').getAttribute('aria-label')).to.equal('Tekoälyn täyttämä');
      expect(marker.querySelector('vaadin-tooltip').text).to.equal('Avaa tekoälyn tiedot');
    });

    it('should apply localized texts set after adding the marker', async () => {
      const marker = mark(field);
      await nextRender();

      marker.i18n = { revert: 'Kumoa' };
      await nextUpdate(marker);

      expect(marker.querySelector('[part="revert-button"]').textContent).to.equal('Kumoa');
    });

    it('should keep the default texts for keys not provided', async () => {
      const marker = mark(field, { i18n: { message: 'Only message changed' } });
      await nextRender();

      expect(marker.querySelector('[part="message"]').textContent).to.equal('Only message changed');
      // revert was not configured, so it stays the built-in default.
      expect(marker.querySelector('[part="revert-button"]').textContent).to.equal(DEFAULT_REVERT_TEXT);
      expect(marker.querySelector('[part="badge"]').getAttribute('aria-label')).to.equal(DEFAULT_BADGE_LABEL);
      expect(marker.querySelector('vaadin-tooltip').text).to.equal(DEFAULT_BADGE_TOOLTIP);
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

    it('should compose the revert event through shadow roots', async () => {
      // A field can live inside another component's shadow root; the revert
      // event must still reach document-level listeners.
      const host = fixtureSync(`<div></div>`);
      const root = host.attachShadow({ mode: 'open' });
      const shadowField = document.createElement('vaadin-text-field');
      root.appendChild(shadowField);
      await nextRender();

      const shadowMarker = mark(shadowField);
      await nextRender();

      const spy = sinon.spy();
      document.addEventListener('ai-field-revert', spy);
      shadowMarker.querySelector('[part="revert-button"]').click();
      document.removeEventListener('ai-field-revert', spy);
      expect(spy).to.be.calledOnce;
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

    it('should not accumulate description nodes when re-added', async () => {
      marker.remove();
      field.appendChild(marker);
      await nextRender();

      expect(marker.querySelectorAll('[slot="description"]')).to.have.lengthOf(1);
    });

    it('should not control the field after removal', async () => {
      marker.remove();

      marker.working = true;
      await nextUpdate(marker);

      expect(field.hasAttribute('ai-working')).to.be.false;
      expect(field.readonly).to.be.false;
    });

    it('should stop tracking document direction when removed', async () => {
      marker.remove();

      document.documentElement.setAttribute('dir', 'rtl');
      await nextRender();
      const dir = marker.getAttribute('dir');
      document.documentElement.removeAttribute('dir');
      await nextRender();

      expect(dir).to.be.null;
    });

    it('should skip the update work for a marker removed right after adding', async () => {
      const rejectionSpy = sinon.spy();
      window.addEventListener('unhandledrejection', rejectionSpy);

      // Removing the marker before its scheduled update runs must not make
      // that update fail on the missing field.
      const other = mark(field);
      other.remove();
      await nextUpdate(other);
      await aTimeout(10);

      window.removeEventListener('unhandledrejection', rejectionSpy);
      expect(rejectionSpy).to.not.be.called;
    });

    it('should render the marker again when re-added after an update', async () => {
      marker.remove();
      // An update while detached renders the empty fallback.
      marker.i18n = { message: 'Updated while detached' };
      await nextUpdate(marker);

      field.appendChild(marker);
      await nextRender();

      expect(marker.querySelector('[part="badge"]').assignedSlot).to.exist;
    });
  });

  describe('announcements', () => {
    let clock;
    let region;

    before(() => {
      region = document.querySelector('body > [aria-live]');
    });

    beforeEach(() => {
      clock = sinon.useFakeTimers({ shouldClearNativeTimers: true, toFake: ['setTimeout', 'clearTimeout'] });
    });

    afterEach(() => {
      clock.restore();
    });

    it('should announce the message with the field label when marked', async () => {
      const marker = mark(field, { i18n: { message: 'Filled by AI' } });
      await nextUpdate(marker);

      clock.tick(150);
      expect(region.textContent).to.equal('Name: Filled by AI');
    });

    it('should announce the message again when a fill lands', async () => {
      const marker = mark(field, { i18n: { message: 'Refill' } });
      await nextUpdate(marker);
      clock.tick(150);
      region.textContent = '';

      marker.working = true;
      await nextUpdate(marker);
      marker.working = false;
      await nextUpdate(marker);
      clock.tick(150);

      expect(region.textContent).to.contain('Refill');
    });

    it('should announce only once per mark', async () => {
      const marker = mark(field, { i18n: { message: 'Once' } });
      await nextUpdate(marker);
      clock.tick(150);
      region.textContent = '';

      // An unrelated update must not repeat the announcement.
      marker.i18n = { message: 'Once', badgeTooltip: 'Updated tooltip' };
      await nextUpdate(marker);
      clock.tick(150);

      expect(region.textContent).to.not.contain('Once');
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

    it('should have working set to false by default', () => {
      const marker = document.createElement('vaadin-ai-field-marker');
      expect(marker.working).to.be.false;
    });

    it('should apply the working state when added with working set', () => {
      mark(field, { working: true });
      expect(field.hasAttribute('ai-working')).to.be.true;
      expect(field.readonly).to.be.true;
    });

    it('should set the working state via attribute', () => {
      const marker = document.createElement('vaadin-ai-field-marker');
      marker.setAttribute('working', '');
      field.appendChild(marker);
      expect(field.hasAttribute('ai-working')).to.be.true;
    });

    it('should do nothing for a parent without a shadow root', async () => {
      const container = fixtureSync(`<div></div>`);
      const marker = mark(container, { working: true });
      await nextRender();
      expect(container.hasAttribute('ai-working')).to.be.false;
      expect(marker.working).to.be.true;
    });

    describe('field without a value property', () => {
      let valuelessField;

      beforeEach(async () => {
        valuelessField = fixtureSync(`<focus-sensitive-field></focus-sensitive-field>`);
        await nextRender();
      });

      it('should apply the working state without throwing', async () => {
        expect(() => mark(valuelessField, { working: true })).to.not.throw();
        await nextRender();
        expect(valuelessField.hasAttribute('ai-working')).to.be.true;
      });

      it('should not define a value property on the field', async () => {
        mark(valuelessField, { working: true });
        await nextRender();
        expect('value' in valuelessField).to.be.false;
      });
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

      it('should keep the field read-only when working restarts during the wind-down', async () => {
        marker.working = true;
        await nextUpdate(marker);

        // The restore scheduled by the previous working state must not unlock
        // the field while the AI is working again.
        await clock.tickAsync(500);
        expect(field.readonly).to.be.true;
      });

      it('should restore the read-only state after working restarts during the wind-down', async () => {
        marker.working = true;
        await nextUpdate(marker);
        marker.working = false;
        await nextUpdate(marker);
        await clock.tickAsync(500);

        expect(field.readonly).to.be.false;
      });

      it('should not restore the read-only state after the marker is removed', async () => {
        marker.remove();
        field.readonly = true;

        await clock.tickAsync(500);
        expect(field.readonly).to.be.true;
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

    describe('value set delay', () => {
      let marker;

      beforeEach(async () => {
        marker = mark(field);
        await nextRender();
        clock = sinon.useFakeTimers({ shouldClearNativeTimers: true, toFake: ['setTimeout', 'clearTimeout'] });
        marker.working = true;
        await nextUpdate(marker);
      });

      it('should delay a value set on the field while working', async () => {
        field.value = 'Delayed value';
        expect(field.value).to.equal('AI value');

        await clock.tickAsync(500);
        expect(field.value).to.equal('Delayed value');
      });

      it('should only apply the last value set while working', async () => {
        field.value = 'One';
        await clock.tickAsync(300);
        field.value = 'Two';

        // The first set was superseded, so nothing lands at its deadline.
        await clock.tickAsync(200);
        expect(field.value).to.equal('AI value');

        await clock.tickAsync(300);
        expect(field.value).to.equal('Two');
      });

      it('should keep delaying value sets when working restarts', async () => {
        field.value = 'One';
        await clock.tickAsync(200);

        marker.working = false;
        await nextUpdate(marker);
        marker.working = true;
        await nextUpdate(marker);

        field.value = 'Two';

        // The set from the previous working session was superseded, so
        // nothing lands at its deadline.
        await clock.tickAsync(300);
        expect(field.value).to.equal('AI value');

        await clock.tickAsync(200);
        expect(field.value).to.equal('Two');
      });

      it('should carry the newly filled value in the revert event', async () => {
        field.value = 'New AI value';
        await clock.tickAsync(500);

        marker.working = false;
        await nextUpdate(marker);

        const spy = sinon.spy();
        field.addEventListener('ai-field-revert', spy);
        marker.querySelector('[part="revert-button"]').click();
        expect(spy.firstCall.args[0].detail.value).to.equal('New AI value');
      });

      it('should carry a value filled in the same batch in the revert event', async () => {
        // The host fills the value and clears the working state together, so
        // the fill is still held back when the marker re-captures it.
        field.value = 'New AI value';
        marker.working = false;
        await nextUpdate(marker);
        await clock.tickAsync(500);

        const spy = sinon.spy();
        field.addEventListener('ai-field-revert', spy);
        marker.querySelector('[part="revert-button"]').click();
        expect(spy.firstCall.args[0].detail.value).to.equal('New AI value');
      });

      it('should still apply a value set queued before working ended', async () => {
        field.value = 'AI filled';
        marker.working = false;
        await nextUpdate(marker);

        expect(field.value).to.equal('AI value');
        await clock.tickAsync(500);
        expect(field.value).to.equal('AI filled');
      });

      it('should stop delaying value sets when working ends', async () => {
        marker.working = false;
        await nextUpdate(marker);
        await clock.tickAsync(500);

        field.value = 'Host value';
        expect(field.value).to.equal('Host value');
      });

      it('should restore the field value accessor when working ends', async () => {
        marker.working = false;
        await nextUpdate(marker);
        expect(Object.getOwnPropertyDescriptor(field, 'value')).to.not.exist;
      });

      it('should apply a queued value set when the marker is removed', () => {
        field.value = 'Last value';
        marker.remove();
        expect(field.value).to.equal('Last value');
      });

      it('should restore the field value accessor when the marker is removed', () => {
        marker.remove();
        expect(Object.getOwnPropertyDescriptor(field, 'value')).to.not.exist;
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

        marker.i18n = { message: 'Filled again by AI' };
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

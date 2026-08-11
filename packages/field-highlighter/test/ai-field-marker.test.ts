import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
import { aTimeout, fixtureSync, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/custom-field/src/vaadin-custom-field.js';
import '@vaadin/radio-group/src/vaadin-radio-group.js';
import '@vaadin/text-field/src/vaadin-text-field.js';
import '../src/vaadin-ai-field-marker.js';
import type { CustomField } from '@vaadin/custom-field/src/vaadin-custom-field.js';
import type { Popover } from '@vaadin/popover/src/vaadin-popover.js';
import type { RadioGroup } from '@vaadin/radio-group/src/vaadin-radio-group.js';
import type { TextField } from '@vaadin/text-field/src/vaadin-text-field.js';
import type { Tooltip } from '@vaadin/tooltip/src/vaadin-tooltip.js';
// @ts-ignore - applyInstanceStyles is not exported with types
import { applyInstanceStyles } from '@vaadin/vaadin-themable-mixin/src/css-utils.js';
import { AiFieldMarker } from '../src/vaadin-ai-field-marker.js';

const DEFAULT_MESSAGE = 'This field value was modified by AI.';
const DEFAULT_REVERT_TEXT = 'Revert Value';
const DEFAULT_BADGE_LABEL = 'AI-provided value';
const DEFAULT_BADGE_TOOLTIP = 'Field value modified by AI.\nClick for details';

/**
 * Creates a marker with the given properties and appends it to the field,
 * the way a host application marks a field as AI-filled.
 */
function mark(field: HTMLElement, properties: Partial<AiFieldMarker> = {}): AiFieldMarker {
  const marker = document.createElement('vaadin-ai-field-marker');
  Object.assign(marker, properties);
  field.appendChild(marker);
  return marker;
}

/**
 * How many style sheets define the animation names the marker uses in the
 * given root, counting every way the styles can get there, so that a second
 * marker adding its own copy can be told apart from reusing the existing one.
 */
function countMarkerKeyframes(root: ShadowRoot): number {
  const sheets = [
    ...root.adoptedStyleSheets,
    ...[...root.querySelectorAll('style')]
      .map((style) => style.sheet)
      .filter((sheet): sheet is CSSStyleSheet => sheet !== null),
  ];
  return sheets.filter((sheet) =>
    [...sheet.cssRules].some((rule) => rule instanceof CSSKeyframesRule && rule.name.startsWith('--vaadin-ai-')),
  ).length;
}

/** Whether the animation names the marker uses resolve in the given root. */
function hasMarkerKeyframes(root: ShadowRoot): boolean {
  return countMarkerKeyframes(root) > 0;
}

/**
 * A minimal field that gives `focus()` and a host click a component-specific
 * meaning, the way date-picker and multi-select-combo-box open their overlay.
 * The marker must not trigger either of those.
 */
class FocusSensitiveField extends HTMLElement {
  openedOnFocus = false;

  openedOnClick = false;

  _input: HTMLInputElement;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._input = document.createElement('input');
    this.shadowRoot!.append(this._input);
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

/**
 * A field that exposes none of the elements the marker can describe: no
 * `ariaTarget`, no `inputElement` and no `focusElement`.
 */
class BareShadowField extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
}

customElements.define('bare-shadow-field', BareShadowField);

/**
 * A field that exposes `value` without a setter, so its assignments can not be
 * held back.
 */
class GetterValueField extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  get value() {
    return 'fixed value';
  }
}

customElements.define('getter-value-field', GetterValueField);

/** A field that keeps its value in an own property instead of an accessor. */
class OwnValueField extends HTMLElement {
  value = 'own value';

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
}

customElements.define('own-value-field', OwnValueField);

/**
 * A field that exposes a focusable element but no input element, and that has
 * another tabbable element (such as a prefix control) ahead of it.
 */
class FocusElementField extends HTMLElement {
  _prefix: HTMLButtonElement;

  _button: HTMLButtonElement;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._prefix = document.createElement('button');
    this._button = document.createElement('button');
    this.shadowRoot!.append(this._prefix, this._button);
  }

  get focusElement() {
    return this._button;
  }
}

customElements.define('focus-element-field', FocusElementField);

// A composite field can ship under its own tag name, the way a framework
// provides a field derived from custom-field.
customElements.define('derived-custom-field', class extends customElements.get('vaadin-custom-field')! {});

describe('ai field marker', () => {
  let field: TextField;

  beforeEach(async () => {
    field = fixtureSync(`<vaadin-text-field label="Name" value="AI value"></vaadin-text-field>`);
    await nextRender();
  });

  it('should export the marker class under its tag name', () => {
    expect(customElements.get('vaadin-ai-field-marker')).to.equal(AiFieldMarker);
  });

  describe('mark', () => {
    let marker: AiFieldMarker;

    beforeEach(async () => {
      marker = mark(field);
      await nextRender();
    });

    it('should slot the marker into the field via an injected slot', () => {
      expect(field.querySelector('vaadin-ai-field-marker')).to.equal(marker);
      expect(marker.assignedSlot).to.exist;
      expect(marker.assignedSlot!.name).to.equal('ai-field-marker');
      expect(marker.assignedSlot!.getRootNode()).to.equal(field.shadowRoot);
    });

    it('should add the marker animations to the field shadow root', () => {
      expect(hasMarkerKeyframes(field.shadowRoot!)).to.be.true;
    });

    it('should keep the marker animations when the field re-adopts its styles', () => {
      // The themable infrastructure replaces adoptedStyleSheets wholesale, for
      // instance when a Lumo stylesheet loads or the theme changes.
      applyInstanceStyles(field);

      expect(hasMarkerKeyframes(field.shadowRoot!)).to.be.true;
    });

    it('should apply the marker styles in the field root node', () => {
      expect(getComputedStyle(field).position).to.equal('relative');
    });

    it('should keep the marker styles when the field root node re-adopts its stylesheets', async () => {
      // A field nested in another component's shadow root: the themable
      // infrastructure replaces that root's adoptedStyleSheets wholesale, for
      // instance when a Lumo stylesheet loads or the theme changes.
      const wrapper = fixtureSync<HTMLElement>(`<div></div>`);
      const root = wrapper.attachShadow({ mode: 'open' });
      const nestedField = document.createElement('vaadin-text-field');
      root.appendChild(nestedField);
      await nextRender();
      mark(nestedField);
      await nextRender();

      root.adoptedStyleSheets = [];

      expect(getComputedStyle(nestedField).position).to.equal('relative');
    });

    it('should render an accessible badge button', () => {
      const badge = marker.querySelector<HTMLButtonElement>('.badge')!;
      expect(badge).to.exist;
      expect(badge.localName).to.equal('button');
      expect(badge.getAttribute('aria-label')).to.equal(DEFAULT_BADGE_LABEL);
    });

    it('should render a badge tooltip', () => {
      const badge = marker.querySelector<HTMLButtonElement>('.badge')!;
      const tooltip: Tooltip = marker.querySelector('vaadin-tooltip')!;
      expect(tooltip.getAttribute('for')).to.equal(badge.id);
      expect(tooltip.text).to.equal(DEFAULT_BADGE_TOOLTIP);
    });

    it('should upgrade the generated tooltip', () => {
      const tooltipClass = customElements.get('vaadin-tooltip');
      expect(tooltipClass, 'vaadin-tooltip should be registered').to.exist;
      expect(marker.querySelector('vaadin-tooltip')).to.be.instanceOf(tooltipClass);
    });

    it('should render the badge and revert controls as non-submitting buttons', () => {
      expect(marker.querySelector<HTMLButtonElement>('.badge')!.type).to.equal('button');
      expect(marker.querySelector<HTMLButtonElement>('.actions > button')!.type).to.equal('button');
    });

    it('should render the revert control inside the actions container', () => {
      expect(marker.querySelector<HTMLButtonElement>('.actions > button')).to.exist;
    });

    it('should render the generated content as light-DOM children', () => {
      ['.badge', 'vaadin-tooltip', 'vaadin-popover'].forEach((selector) => {
        const piece = marker.querySelector(selector);
        expect(piece, `${selector} should be rendered`).to.exist;
        expect(piece!.parentElement).to.equal(marker);
      });
    });

    it('should render the popover in the light DOM wrapping the content', () => {
      const popover = marker.querySelector('vaadin-popover')!;
      expect(popover).to.exist;
      expect(popover.parentElement).to.equal(marker);
      expect(popover.target).to.equal(marker.querySelector<HTMLButtonElement>('.badge'));
      // The explanation comes before the revert control.
      const message = popover.querySelector('.message')!;
      expect(message.nextElementSibling).to.equal(popover.querySelector('.actions'));
    });

    it('should render the default message in the popover', () => {
      const message = marker.querySelector('.message')!;
      expect(message.textContent).to.equal(DEFAULT_MESSAGE);
    });

    it('should render an accessible revert control', () => {
      const button = marker.querySelector<HTMLButtonElement>('.actions > button')!;
      expect(button).to.exist;
      expect(button.localName).to.equal('button');
    });

    it('should describe the field input for screen readers via aria-describedby', () => {
      const ids = (field.inputElement.getAttribute('aria-describedby') || '').split(' ');
      const descId = ids.find((id) => id.startsWith('ai-field-marker-'));
      expect(descId, 'aria-describedby should reference the AI description node').to.be.ok;
      const descNode = field.querySelector<HTMLElement>(`#${descId}`)!;
      expect(descNode).to.exist;
      expect(descNode.textContent).to.equal(DEFAULT_MESSAGE);
    });

    it('should render the description node inside the slotted marker', () => {
      const descId = (field.inputElement.getAttribute('aria-describedby') || '')
        .split(' ')
        .find((id) => id.startsWith('ai-field-marker-'));
      const descNode = field.querySelector<HTMLElement>(`#${descId}`)!;
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
      expect(field.shadowRoot!.querySelectorAll('slot[name="ai-field-marker"]')).to.have.lengthOf(1);
      expect(marker.assignedSlot).to.exist;
    });

    it('should open the popover on badge click', async () => {
      const popover = marker.querySelector('vaadin-popover')!;
      marker.querySelector<HTMLButtonElement>('.badge')!.click();
      await nextRender();
      expect(popover.opened).to.be.true;
    });

    it('should not render for a parent without a shadow root', async () => {
      const container = fixtureSync<HTMLElement>(`<div></div>`);
      const other = mark(container);
      await nextRender();
      expect(other.querySelector('.badge')).to.not.exist;
    });

    it('should not render when added without a parent element', async () => {
      // A node added directly to a shadow root has no parent element.
      const host = fixtureSync<HTMLElement>(`<div></div>`);
      const root = host.attachShadow({ mode: 'open' });
      const other = document.createElement('vaadin-ai-field-marker');

      expect(() => root.appendChild(other)).to.not.throw();
      await nextRender();
      expect(other.querySelector('.badge')).to.not.exist;
    });

    it('should not wait for a definition for a parent that is not a custom element', async () => {
      const rejectionSpy = sinon.spy();
      window.addEventListener('unhandledrejection', rejectionSpy);

      const container = fixtureSync<HTMLElement>(`<div></div>`);
      mark(container);
      await nextRender();
      await aTimeout(10);

      window.removeEventListener('unhandledrejection', rejectionSpy);
      expect(rejectionSpy).to.not.be.called;
    });
  });

  describe('multiple markers', () => {
    // A field can carry more than one marker; the pieces injected into its
    // shadow root are shared and must live as long as the last marker.
    let first: AiFieldMarker;
    let second: AiFieldMarker;

    beforeEach(async () => {
      first = mark(field);
      second = mark(field);
      await nextRender();
    });

    it('should inject the slot and the animations only once', () => {
      expect(field.shadowRoot!.querySelectorAll('slot[name="ai-field-marker"]')).to.have.lengthOf(1);
      expect(countMarkerKeyframes(field.shadowRoot!)).to.equal(1);
    });

    it('should keep the injected slot and animations for the remaining marker', () => {
      first.remove();

      expect(second.assignedSlot).to.exist;
      expect(hasMarkerKeyframes(field.shadowRoot!)).to.be.true;
    });

    it('should remove the injected animations with the last marker', () => {
      first.remove();
      second.remove();

      expect(hasMarkerKeyframes(field.shadowRoot!)).to.be.false;
    });
  });

  describe('popover', () => {
    let marker: AiFieldMarker;
    let popover: Popover;

    beforeEach(async () => {
      marker = mark(field);
      await nextRender();
      popover = marker.querySelector('vaadin-popover')!;
    });

    it('should label the popover dialog with the badge label', () => {
      expect(popover.getAttribute('aria-label')).to.equal(DEFAULT_BADGE_LABEL);
    });

    it('should position the popover against the field end top corner', () => {
      expect(popover.position).to.equal('end-top');
    });

    it('should use the arrow theme for the popover overlay', () => {
      const overlay = popover.shadowRoot!.querySelector('vaadin-popover-overlay')!;
      expect(overlay.getAttribute('theme')).to.contain('arrow');
    });

    it('should lay out the popover content as a column', async () => {
      marker.querySelector<HTMLButtonElement>('.badge')!.click();
      await nextRender();

      const overlay = popover.shadowRoot!.querySelector('vaadin-popover-overlay')!;
      const content = overlay.shadowRoot!.querySelector('[part="content"]')!;
      expect(getComputedStyle(content).flexDirection).to.equal('column');
    });

    it('should move focus into the popover on open', async () => {
      const overlay = popover.shadowRoot!.querySelector('vaadin-popover-overlay')!;
      const opened = oneEvent(overlay, 'vaadin-overlay-open');
      marker.querySelector<HTMLButtonElement>('.badge')!.click();
      await opened;

      expect(marker.contains(document.activeElement), 'focus should move into the popover').to.be.true;
    });

    it('should keep the description outside the popover', () => {
      const descNode = marker.querySelector('.description')!;
      expect(popover.contains(descNode)).to.be.false;
    });

    it('should close the popover when focus leaves the marker', async () => {
      // A click-triggered popover only closes on outside pointer interaction
      // or Esc, so tabbing on to the next field — where an outside click never
      // happens — would otherwise leave the dialog open, and popovers of
      // several marked fields could pile up.
      const overlay = popover.shadowRoot!.querySelector('vaadin-popover-overlay')!;
      const opened = oneEvent(overlay, 'vaadin-overlay-open');
      marker.querySelector<HTMLButtonElement>('.badge')!.click();
      await opened;
      expect(marker.contains(document.activeElement), 'focus should move into the popover').to.be.true;

      const outsideInput = fixtureSync<HTMLInputElement>(`<input />`);
      outsideInput.focus();
      await nextRender();

      expect(popover.opened).to.be.false;
    });

    it('should keep the popover open while focus moves within the marker', async () => {
      const overlay = popover.shadowRoot!.querySelector('vaadin-popover-overlay')!;
      const opened = oneEvent(overlay, 'vaadin-overlay-open');
      marker.querySelector<HTMLButtonElement>('.badge')!.click();
      await opened;

      marker.querySelector<HTMLButtonElement>('.actions > button')!.focus();
      await nextRender();

      expect(popover.opened).to.be.true;
    });

    describe('click outside the popover', () => {
      let otherField: TextField;

      beforeEach(async () => {
        otherField = fixtureSync(`<vaadin-text-field label="Other"></vaadin-text-field>`);
        await nextRender();

        const overlay = popover.shadowRoot!.querySelector('vaadin-popover-overlay')!;
        const opened = oneEvent(overlay, 'vaadin-overlay-open');
        marker.querySelector<HTMLButtonElement>('.badge')!.click();
        await opened;
      });

      afterEach(async () => {
        await resetMouse();
      });

      it('should focus the field input clicked while the popover is open', async () => {
        await sendMouseToElement({ type: 'click', element: field.inputElement });
        await nextRender();
        // The popover overlay defers restoring focus to the badge.
        await aTimeout(0);

        expect(popover.opened).to.be.false;
        expect(field.inputElement.matches(':focus')).to.be.true;
      });

      it('should focus another field input clicked while the popover is open', async () => {
        await sendMouseToElement({ type: 'click', element: otherField.inputElement });
        await nextRender();
        await aTimeout(0);

        expect(popover.opened).to.be.false;
        expect(otherField.inputElement.matches(':focus')).to.be.true;
      });
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
      expect(field.querySelector<HTMLElement>(`#${descId}`)!.textContent).to.equal('Refreshed');
    });

    it('should keep the description node out of the Lit-managed content', async () => {
      const marker = mark(field);
      await nextRender();

      const descNode = marker.querySelector('span[id^="ai-field-marker-"]')!;
      // An update while marked must not clear the manually added node.
      marker.i18n = { message: 'Refreshed' };
      await nextUpdate(marker);
      expect(descNode.parentElement).to.equal(marker);
    });

    it('should visually hide the description node', async () => {
      const marker = mark(field);
      await nextRender();

      const descNode = marker.querySelector('span[id^="ai-field-marker-"]')!;
      expect(getComputedStyle(descNode).position).to.equal('absolute');
      expect(getComputedStyle(descNode).width).to.equal('1px');
    });

    it('should keep the description node hidden under conflicting document styles', async () => {
      // A user stylesheet rule that happens to match the description node with
      // a higher specificity must not make the screen-reader text visible.
      const conflictingStyle = document.createElement('style');
      conflictingStyle.textContent = 'vaadin-ai-field-marker span.description { position: static; }';
      document.head.appendChild(conflictingStyle);

      try {
        const marker = mark(field);
        await nextRender();

        const descNode = marker.querySelector('span[id^="ai-field-marker-"]')!;
        expect(getComputedStyle(descNode).position).to.equal('absolute');
      } finally {
        conflictingStyle.remove();
      }
    });

    it('should link the description to a field that has no input element', async () => {
      // Group and composite fields expose neither inputElement nor
      // focusElement; they point at the element carrying their own
      // descriptions through ariaTarget.
      const customField = fixtureSync<CustomField>(`
        <vaadin-custom-field label="License plate">
          <vaadin-text-field></vaadin-text-field>
        </vaadin-custom-field>
      `);
      await nextRender();

      const marker = mark(customField);
      await nextRender();

      const descNode = marker.querySelector('span[id^="ai-field-marker-"]')!;
      expect(descNode).to.exist;
      expect(customField.getAttribute('aria-describedby')).to.contain(descNode.id);
    });

    it('should keep the field helper description alongside the AI description', async () => {
      const helperField = fixtureSync<TextField>(
        `<vaadin-text-field label="Name" helper-text="Keep it short"></vaadin-text-field>`,
      );
      await nextRender();
      const helperIds = helperField.inputElement.getAttribute('aria-describedby')!.split(' ');

      mark(helperField);
      const ids = helperField.inputElement.getAttribute('aria-describedby')!.split(' ');

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

      expect(marker.querySelector('.message')!.textContent).to.equal('Tämä arvo on tekoälyn täyttämä');
      expect(marker.querySelector<HTMLButtonElement>('.actions > button')!.textContent).to.equal('Kumoa');
      expect(marker.querySelector<HTMLButtonElement>('.badge')!.getAttribute('aria-label')).to.equal(
        'Tekoälyn täyttämä',
      );
      expect(marker.querySelector('vaadin-tooltip')!.text).to.equal('Avaa tekoälyn tiedot');
    });

    it('should apply localized texts set after adding the marker', async () => {
      const marker = mark(field);
      await nextRender();

      marker.i18n = { revert: 'Kumoa' };
      await nextUpdate(marker);

      expect(marker.querySelector<HTMLButtonElement>('.actions > button')!.textContent).to.equal('Kumoa');
    });

    it('should keep the default texts for keys not provided', async () => {
      const marker = mark(field, { i18n: { message: 'Only message changed' } });
      await nextRender();

      expect(marker.querySelector('.message')!.textContent).to.equal('Only message changed');
      // revert was not configured, so it stays the built-in default.
      expect(marker.querySelector<HTMLButtonElement>('.actions > button')!.textContent).to.equal(DEFAULT_REVERT_TEXT);
      expect(marker.querySelector<HTMLButtonElement>('.badge')!.getAttribute('aria-label')).to.equal(
        DEFAULT_BADGE_LABEL,
      );
      expect(marker.querySelector('vaadin-tooltip')!.text).to.equal(DEFAULT_BADGE_TOOLTIP);
    });
  });

  describe('confidence', () => {
    let marker: AiFieldMarker;

    function getConfidenceNode(host: HTMLElement = field): HTMLSpanElement | null {
      return host.querySelector(':scope > [slot="helper"].ai-confidence');
    }

    beforeEach(async () => {
      marker = mark(field, { confidence: 'low' });
      await nextRender();
    });

    it('should render the confidence indicator into the field helper slot', () => {
      const node = getConfidenceNode()!;
      expect(node).to.exist;
      expect(node.textContent).to.equal('Low confidence');
      expect(node.assignedSlot).to.exist;
      expect(node.assignedSlot!.name).to.equal('helper');
      expect(node.assignedSlot!.getRootNode()).to.equal(field.shadowRoot);
    });

    it('should have the confidence level as a class name', () => {
      expect(getConfidenceNode()!.classList.contains('ai-confidence-low')).to.be.true;
    });

    it('should set the ai-confidence attribute on the field', () => {
      expect(field.getAttribute('ai-confidence')).to.equal('low');
    });

    it('should show the helper text section for a field without a helper', () => {
      const helperPart = field.shadowRoot!.querySelector('[part="helper-text"]')!;
      expect(getComputedStyle(helperPart).display).to.not.equal('none');
    });

    describe('has-helper', () => {
      it('should set has-helper on the field while the indicator is shown', () => {
        expect(field.hasAttribute('has-helper')).to.be.true;
      });

      it('should toggle has-helper when the confidence is set and cleared', async () => {
        marker.confidence = null;
        await nextUpdate(marker);
        expect(field.hasAttribute('has-helper')).to.be.false;

        marker.confidence = 'high';
        await nextUpdate(marker);
        expect(field.hasAttribute('has-helper')).to.be.true;
      });

      it('should remove has-helper when the marker is removed', async () => {
        marker.remove();
        await nextRender();

        expect(field.hasAttribute('has-helper')).to.be.false;
      });

      it('should not set has-helper while the AI is working', async () => {
        marker.working = true;
        await nextUpdate(marker);
        expect(field.hasAttribute('has-helper')).to.be.false;

        marker.working = false;
        await nextUpdate(marker);
        expect(field.hasAttribute('has-helper')).to.be.true;
      });

      it('should keep has-helper for a field that has a helper of its own', async () => {
        field.helperText = 'Keep it short';
        await nextRender();

        marker.confidence = null;
        await nextUpdate(marker);

        expect(field.hasAttribute('has-helper')).to.be.true;
      });

      it('should re-assert has-helper when the field drops it', async () => {
        field.helperText = 'Keep it short';
        await nextRender();

        // Clearing the helper makes the field recompute the attribute from its
        // own helper content, which does not include the indicator.
        field.helperText = '';
        await nextRender();

        expect(field.hasAttribute('has-helper')).to.be.true;
      });

      it('should stop re-asserting has-helper once the indicator is gone', async () => {
        marker.confidence = null;
        await nextUpdate(marker);

        field.helperText = 'Keep it short';
        await nextRender();
        field.helperText = '';
        await nextRender();

        expect(field.hasAttribute('has-helper')).to.be.false;
      });
    });

    it('should update the indicator when the confidence changes', async () => {
      marker.confidence = 'high';
      await nextUpdate(marker);

      const node = getConfidenceNode()!;
      expect(node.classList.contains('ai-confidence-high')).to.be.true;
      expect(node.classList.contains('ai-confidence-low')).to.be.false;
      expect(node.textContent).to.equal('High confidence');
      expect(field.getAttribute('ai-confidence')).to.equal('high');
    });

    it('should remove the indicator when the confidence is cleared', async () => {
      marker.confidence = null;
      await nextUpdate(marker);

      expect(getConfidenceNode()).to.be.null;
      expect(field.hasAttribute('ai-confidence')).to.be.false;
    });

    it('should remove the indicator when the marker is removed', async () => {
      marker.remove();
      await nextRender();

      expect(getConfidenceNode()).to.be.null;
      expect(field.hasAttribute('ai-confidence')).to.be.false;
    });

    it('should render the indicator when confidence is set after adding', async () => {
      const plainField = fixtureSync<TextField>(`<vaadin-text-field label="Name"></vaadin-text-field>`);
      await nextRender();
      const plainMarker = mark(plainField);
      await nextRender();
      expect(getConfidenceNode(plainField)).to.be.null;

      plainMarker.confidence = 'medium';
      await nextUpdate(plainMarker);

      const node = getConfidenceNode(plainField)!;
      expect(node.textContent).to.equal('Medium confidence');
      expect(plainField.getAttribute('ai-confidence')).to.equal('medium');
    });

    it('should render the indicator again when the marker is re-added', async () => {
      marker.remove();
      await nextRender();
      field.appendChild(marker);
      await nextRender();

      expect(getConfidenceNode()).to.exist;
      expect(field.getAttribute('ai-confidence')).to.equal('low');
    });

    it('should keep the field helper text alongside the indicator', async () => {
      field.helperText = 'Keep it short';
      await nextRender();

      const helper = field.querySelector(':scope > [slot="helper"]:not(.ai-confidence)')!;
      expect(helper.textContent).to.equal('Keep it short');
      expect(helper.assignedSlot).to.exist;
      expect(getConfidenceNode()!.assignedSlot).to.exist;
    });

    it('should not evict an existing field helper', async () => {
      const helperField = fixtureSync<TextField>(
        `<vaadin-text-field label="Name" helper-text="Keep it short"></vaadin-text-field>`,
      );
      await nextRender();
      const helper = helperField.querySelector(':scope > [slot="helper"]')!;

      mark(helperField, { confidence: 'high' });
      await nextRender();

      expect(helper.isConnected).to.be.true;
      expect(helper.assignedSlot).to.exist;
      expect(getConfidenceNode(helperField)).to.exist;
    });

    describe('order', () => {
      let helperField: TextField;

      /** The helper slot content in rendered order. */
      function getHelperNodes(host: HTMLElement = helperField): Element[] {
        return [...host.querySelectorAll(':scope > [slot="helper"]')];
      }

      beforeEach(async () => {
        helperField = fixtureSync<TextField>(
          `<vaadin-text-field label="Name" helper-text="Keep it short"></vaadin-text-field>`,
        );
        await nextRender();
      });

      it('should render the indicator before an existing field helper', async () => {
        mark(helperField, { confidence: 'low' });
        await nextRender();

        expect(getHelperNodes()[0]).to.equal(getConfidenceNode(helperField));
        expect(getHelperNodes().map((node) => node.textContent)).to.eql(['Low confidence', 'Keep it short']);
      });

      it('should render the indicator before a helper added after marking', async () => {
        const plainField = fixtureSync<TextField>(`<vaadin-text-field label="Name"></vaadin-text-field>`);
        await nextRender();
        mark(plainField, { confidence: 'low' });
        await nextRender();

        plainField.helperText = 'Keep it short';
        await nextRender();

        expect(getHelperNodes(plainField).map((node) => node.textContent)).to.eql(['Low confidence', 'Keep it short']);
      });

      it('should render the indicator before a custom slotted helper', async () => {
        const customHelper = document.createElement('span');
        customHelper.setAttribute('slot', 'helper');
        customHelper.textContent = 'Custom helper';
        helperField.appendChild(customHelper);
        await nextRender();

        mark(helperField, { confidence: 'low' });
        await nextRender();

        expect(getHelperNodes()[0]).to.equal(getConfidenceNode(helperField));
      });

      it('should keep the indicator first when the field is marked again', async () => {
        mark(helperField, { confidence: 'low' }).remove();
        // Re-marking right away is what a host does when a new AI fill starts.
        mark(helperField, { confidence: 'high' });
        await nextRender();

        expect(getHelperNodes().map((node) => node.textContent)).to.eql(['High confidence', 'Keep it short']);
      });

      it('should keep the indicator first across consecutive AI fills', async () => {
        // A host filling the same field twice: unmark, re-mark as working,
        // then let the fill land.
        for (const confidence of ['low', 'high'] as const) {
          helperField.querySelector('vaadin-ai-field-marker')?.remove();
          const marker = mark(helperField, { confidence, working: true });
          await nextRender();
          marker.working = false;
          await nextUpdate(marker);
        }

        expect(getHelperNodes().map((node) => node.textContent)).to.eql(['High confidence', 'Keep it short']);
      });
    });

    it('should describe the field input via aria-describedby', () => {
      const ids = field.inputElement.getAttribute('aria-describedby')!.split(' ');
      expect(ids).to.include(getConfidenceNode()!.id);
    });

    it('should remove the indicator description when the confidence is cleared', async () => {
      const nodeId = getConfidenceNode()!.id;
      marker.confidence = null;
      await nextUpdate(marker);

      expect(field.inputElement.getAttribute('aria-describedby') || '').to.not.contain(nodeId);
    });

    it('should hide the indicator while the AI is working', async () => {
      marker.working = true;
      await nextUpdate(marker);

      expect(getComputedStyle(getConfidenceNode()!).display).to.equal('none');
    });

    it('should apply localized confidence texts', async () => {
      marker.i18n = { confidence: { low: 'Matala luottamus' } };
      await nextUpdate(marker);

      expect(getConfidenceNode()!.textContent).to.equal('Matala luottamus');
    });

    it('should keep the default texts for levels not provided', async () => {
      marker.i18n = { confidence: { high: 'Korkea luottamus' } };
      await nextUpdate(marker);

      expect(getConfidenceNode()!.textContent).to.equal('Low confidence');
    });
  });

  describe('revert', () => {
    let marker: AiFieldMarker;
    let revertButton: HTMLButtonElement;

    beforeEach(async () => {
      marker = mark(field);
      await nextRender();
      revertButton = marker.querySelector<HTMLButtonElement>('.actions > button')!;
    });

    it('should fire ai-field-revert from the field when revert is activated', () => {
      const spy = sinon.spy();
      (field as HTMLElement).addEventListener('ai-field-revert', spy);
      revertButton.click();
      expect(spy).to.be.calledOnce;
    });

    it('should carry the captured value in the event detail', () => {
      const spy = sinon.spy();
      (field as HTMLElement).addEventListener('ai-field-revert', spy);
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
      const popover = marker.querySelector('vaadin-popover')!;
      marker.querySelector<HTMLButtonElement>('.badge')!.click();
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

    it('should do nothing when revert is activated after the marker was removed', () => {
      // The host may remove the marker on revert, which leaves the popover
      // content around for the duration of its closing animation.
      const errorSpy = sinon.spy();
      window.addEventListener('error', errorSpy);
      const revertSpy = sinon.spy();
      (field as HTMLElement).addEventListener('ai-field-revert', revertSpy);

      marker.remove();
      revertButton.click();

      window.removeEventListener('error', errorSpy);
      expect(errorSpy).to.not.be.called;
      expect(revertSpy).to.not.be.called;
    });

    it('should compose the revert event through shadow roots', async () => {
      // A field can live inside another component's shadow root; the revert
      // event must still reach document-level listeners.
      const host = fixtureSync<HTMLElement>(`<div></div>`);
      const root = host.attachShadow({ mode: 'open' });
      const shadowField = document.createElement('vaadin-text-field');
      root.appendChild(shadowField);
      await nextRender();

      const shadowMarker = mark(shadowField);
      await nextRender();

      const spy = sinon.spy();
      document.addEventListener('ai-field-revert', spy);
      shadowMarker.querySelector<HTMLButtonElement>('.actions > button')!.click();
      document.removeEventListener('ai-field-revert', spy);
      expect(spy).to.be.calledOnce;
    });
  });

  describe('revert on a field with focus and click semantics', () => {
    let sensitiveField: FocusSensitiveField;
    let marker: AiFieldMarker;

    beforeEach(async () => {
      sensitiveField = fixtureSync(`<focus-sensitive-field></focus-sensitive-field>`);
      marker = mark(sensitiveField);
      await nextRender();
    });

    it('should not run the field focus() side effects on revert', () => {
      marker.querySelector<HTMLButtonElement>('.actions > button')!.click();
      expect(sensitiveField.openedOnFocus).to.be.false;
      expect(sensitiveField.inputElement.matches(':focus')).to.be.true;
    });

    it('should not let a badge click reach the field', () => {
      marker.querySelector<HTMLButtonElement>('.badge')!.click();
      expect(sensitiveField.openedOnClick).to.be.false;
    });

    it('should not let a popover click reach the field', async () => {
      marker.querySelector<HTMLButtonElement>('.badge')!.click();
      await nextRender();

      marker.querySelector<HTMLButtonElement>('.actions > button')!.click();
      expect(sensitiveField.openedOnClick).to.be.false;
    });
  });

  describe('revert on a field with no input element', () => {
    // A field can expose a focusable element without exposing an input, in
    // which case focus must still land on that element.
    let focusField: FocusElementField;
    let marker: AiFieldMarker;

    beforeEach(async () => {
      focusField = fixtureSync(`<focus-element-field></focus-element-field>`);
      marker = mark(focusField);
      await nextRender();
    });

    it('should move focus to the field focus element on revert', () => {
      marker.querySelector<HTMLButtonElement>('.actions > button')!.click();
      // Not just to the first tabbable element the field happens to contain.
      expect(focusField.focusElement.matches(':focus')).to.be.true;
    });
  });

  describe('revert on a radio group', () => {
    // A group field exposes neither a focusElement nor an inputElement, and
    // the group host itself is not focusable: focus must land on one of the
    // slotted radio inputs instead of being dropped on the body.
    let group: RadioGroup;
    let marker: AiFieldMarker;

    beforeEach(async () => {
      group = fixtureSync(`
        <vaadin-radio-group label="Options">
          <vaadin-radio-button value="one" label="One"></vaadin-radio-button>
          <vaadin-radio-button value="two" label="Two"></vaadin-radio-button>
        </vaadin-radio-group>
      `);
      await nextRender();
      marker = mark(group);
      await nextRender();
    });

    it('should move focus into the group on revert', () => {
      marker.querySelector<HTMLButtonElement>('.actions > button')!.click();
      expect(group.contains(document.activeElement)).to.be.true;
    });

    it('should not focus the marker content on revert', () => {
      // The marker's own badge and popover are also tabbable field content.
      marker.querySelector<HTMLButtonElement>('.actions > button')!.click();
      expect(marker.contains(document.activeElement)).to.be.false;
    });
  });

  describe('click containment', () => {
    // The marker and its popover content live in the field's light DOM, so
    // without containment their clicks reach the field host. Fields that open
    // an overlay on host click (date-picker, multi-select-combo-box) would act
    // on them as if the field itself had been clicked.
    let marker: AiFieldMarker;
    let spy: sinon.SinonSpy;

    beforeEach(async () => {
      marker = mark(field);
      await nextRender();
      spy = sinon.spy();
      field.addEventListener('click', spy);
    });

    it('should not propagate badge clicks to the field', () => {
      marker.querySelector<HTMLButtonElement>('.badge')!.click();
      expect(spy).to.not.be.called;
    });

    it('should not propagate popover clicks to the field', async () => {
      marker.querySelector<HTMLButtonElement>('.badge')!.click();
      await nextRender();

      marker.querySelector<HTMLButtonElement>('.actions > button')!.click();
      expect(spy).to.not.be.called;
    });

    it('should not propagate description node clicks to the field', () => {
      // The marker also holds the hidden aria-describedby node.
      const descId = (field.inputElement.getAttribute('aria-describedby') || '')
        .split(' ')
        .find((id) => id.startsWith('ai-field-marker-'));
      marker.querySelector<HTMLElement>(`#${descId}`)!.click();
      expect(spy).to.not.be.called;
    });

    it('should still let clicks on the field itself through', () => {
      field.inputElement.click();
      expect(spy).to.be.calledOnce;
    });

    it('should still open the popover on badge click', async () => {
      // Containment must not block the popover's own click trigger, which is
      // bound on the badge inside the marker.
      marker.querySelector<HTMLButtonElement>('.badge')!.click();
      await nextRender();
      expect(marker.querySelector('vaadin-popover')!.opened).to.be.true;
    });
  });

  describe('remove', () => {
    let marker: AiFieldMarker;

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
      expect(field.shadowRoot!.querySelector('slot[name="ai-field-marker"]')).to.not.exist;
    });

    it('should remove the AI description from aria-describedby and the DOM', () => {
      const ids = (field.inputElement.getAttribute('aria-describedby') || '').split(' ');
      const descId = ids.find((id) => id.startsWith('ai-field-marker-'));

      marker.remove();

      const after = field.inputElement.getAttribute('aria-describedby') || '';
      expect(after).to.not.contain('ai-field-marker-');
      expect(field.querySelector<HTMLElement>(`#${descId}`)).to.not.exist;
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

    it('should stop rendering when moved to a parent without a shadow root', async () => {
      expect(marker.querySelector('vaadin-popover'), 'popover should start out rendered').to.exist;

      const container = fixtureSync<HTMLElement>(`<div></div>`);
      container.appendChild(marker);
      await nextRender();

      expect(marker.querySelector('vaadin-popover')).to.not.exist;
      expect(marker.querySelector('.badge')).to.not.exist;
    });

    it('should not accumulate description nodes when re-added', async () => {
      marker.remove();
      field.appendChild(marker);
      await nextRender();

      expect(marker.querySelectorAll('.description')).to.have.lengthOf(1);
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

      expect(marker.querySelector('.badge')).to.exist;
    });
  });

  describe('moved to another field', () => {
    it('should capture the value of the field it was moved to', async () => {
      const otherField = fixtureSync<TextField>(`<vaadin-text-field value="Other value"></vaadin-text-field>`);
      await nextRender();
      const marker = mark(field, { working: true });
      await nextRender();

      marker.remove();
      otherField.appendChild(marker);
      await nextRender();

      const spy = sinon.spy();
      (otherField as HTMLElement).addEventListener('ai-field-revert', spy);
      marker.querySelector<HTMLButtonElement>('.actions > button')!.click();

      expect(spy.firstCall.args[0].detail.value).to.equal('Other value');
    });

    describe('to a field with no described element', () => {
      // The marker keeps no state of the field it was attached to before, so a
      // field that provides none of its own can not end up with the previous
      // field's state.
      let bareField: BareShadowField;
      let marker: AiFieldMarker;

      beforeEach(async () => {
        bareField = fixtureSync(`<bare-shadow-field></bare-shadow-field>`);
        marker = mark(field);
        await nextRender();
        marker.remove();
        bareField.appendChild(marker);
        await nextRender();
      });

      it('should not mark the previous field input busy', async () => {
        marker.working = true;
        await nextUpdate(marker);

        expect(field.inputElement.hasAttribute('aria-busy')).to.be.false;
      });

      it('should not describe the previous field again when removed', () => {
        expect(() => marker.remove()).to.not.throw();
        expect(field.inputElement.getAttribute('aria-describedby') || '').to.not.contain('ai-field-marker-');
      });
    });
  });

  describe('announcements', () => {
    let clock: sinon.SinonFakeTimers;
    let region: Element;

    before(() => {
      region = document.querySelector('body > [aria-live]')!;
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

    it('should announce only the message for a field without a label', async () => {
      const unlabeled = fixtureSync<TextField>(`<vaadin-text-field></vaadin-text-field>`);
      const marker = mark(unlabeled, { i18n: { message: 'Unlabeled' } });
      await nextUpdate(marker);

      clock.tick(150);
      expect(region.textContent).to.equal('Unlabeled');
    });

    it('should not announce when working is set and cleared in the same update', async () => {
      const marker = mark(field, { i18n: { message: 'Batched' } });
      await nextUpdate(marker);
      clock.tick(150);
      region.textContent = '';

      // No fill ever started, so there is no new value to announce.
      marker.working = true;
      marker.working = false;
      await nextUpdate(marker);
      clock.tick(150);

      expect(region.textContent).to.not.contain('Batched');
    });

    it('should not announce again on an unrelated update during the wind-down', async () => {
      const marker = mark(field, { i18n: { message: 'Wind down' } });
      await nextUpdate(marker);
      marker.working = true;
      await nextUpdate(marker);
      marker.working = false;
      await nextUpdate(marker);
      clock.tick(150);
      region.textContent = '';

      // The read-only restore is still pending, so the marker is still in the
      // state the end of a fill leaves behind.
      marker.i18n = { message: 'Wind down', badgeTooltip: 'Updated tooltip' };
      await nextUpdate(marker);
      clock.tick(150);

      expect(region.textContent).to.not.contain('Wind down');
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
    let clock: sinon.SinonFakeTimers | null = null;

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
      expect(field.inputElement.getAttribute('aria-busy')).to.equal('true');
    });

    it('should set the working state via attribute', () => {
      const marker = document.createElement('vaadin-ai-field-marker');
      marker.setAttribute('working', '');
      field.appendChild(marker);
      expect(field.hasAttribute('ai-working')).to.be.true;
    });

    it('should mark the field once it is upgraded', async () => {
      // The marker can be attached before the field's own module has loaded,
      // so the parent has no shadow root yet.
      const lateField = fixtureSync<HTMLElement>(`<late-upgraded-field></late-upgraded-field>`);
      const marker = mark(lateField);
      await nextRender();
      expect(marker.assignedSlot, 'field is not upgraded yet').to.not.exist;

      customElements.define(
        'late-upgraded-field',
        class extends HTMLElement {
          constructor() {
            super();
            this.attachShadow({ mode: 'open' });
          }
        },
      );
      await nextRender();

      expect(marker.assignedSlot).to.exist;
      expect(marker.assignedSlot!.name).to.equal('ai-field-marker');
      expect(marker.querySelector('.badge')).to.exist;
    });

    it('should not mark a field that is upgraded without a shadow root', async () => {
      const rejectionSpy = sinon.spy();
      window.addEventListener('unhandledrejection', rejectionSpy);

      const lateField = fixtureSync<HTMLElement>(`<shadowless-late-field></shadowless-late-field>`);
      const marker = mark(lateField);
      await nextRender();

      customElements.define('shadowless-late-field', class extends HTMLElement {});
      await nextRender();
      await aTimeout(10);

      window.removeEventListener('unhandledrejection', rejectionSpy);
      expect(rejectionSpy).to.not.be.called;
      expect(marker.querySelector('.badge')).to.not.exist;
    });

    it('should mark the field only once when re-added before it is upgraded', async () => {
      const lateField = fixtureSync<HTMLElement>(`<reappended-late-field></reappended-late-field>`);
      const marker = mark(lateField);
      await nextRender();

      // Each connect while the field is not yet upgraded waits for its
      // definition separately; the field must still be marked only once.
      marker.remove();
      lateField.appendChild(marker);
      await nextRender();

      customElements.define(
        'reappended-late-field',
        class extends HTMLElement {
          _input = document.createElement('input');

          constructor() {
            super();
            this.attachShadow({ mode: 'open' });
            this.shadowRoot!.append(this._input);
          }

          get inputElement() {
            return this._input;
          }
        },
      );
      await nextRender();

      expect(marker.querySelectorAll('.description')).to.have.lengthOf(1);
      const describedBy = lateField.shadowRoot!.querySelector('input')!.getAttribute('aria-describedby')!;
      expect(describedBy.split(' ').filter((id) => id.startsWith('ai-field-marker-'))).to.have.lengthOf(1);
    });

    it('should do nothing for a parent without a shadow root', async () => {
      const container = fixtureSync<HTMLElement>(`<div></div>`);
      const marker = mark(container, { working: true });
      await nextRender();
      expect(container.hasAttribute('ai-working')).to.be.false;
      expect(marker.working).to.be.true;
    });

    describe('field without a described element', () => {
      // A field that exposes neither an ariaTarget, an inputElement nor a
      // focusElement gets no AI description, and nothing that hangs off it.
      let bareField: BareShadowField;

      beforeEach(async () => {
        bareField = fixtureSync(`<bare-shadow-field></bare-shadow-field>`);
        await nextRender();
      });

      it('should mark the field without a description node', async () => {
        let marker!: AiFieldMarker;
        expect(() => {
          marker = mark(bareField);
        }).to.not.throw();
        await nextRender();

        expect(marker.querySelector('.description')).to.not.exist;
        expect(marker.querySelector('.badge')).to.exist;
      });

      it('should enter the working state without throwing', async () => {
        expect(() => mark(bareField, { working: true })).to.not.throw();
        await nextRender();

        expect(bareField.hasAttribute('ai-working')).to.be.true;
      });

      it('should leave the working state without throwing', async () => {
        const marker = mark(bareField, { working: true });
        await nextRender();

        expect(() => marker.remove()).to.not.throw();
        expect(bareField.hasAttribute('ai-working')).to.be.false;
      });
    });

    describe('field with a read-only value accessor', () => {
      // Without a setter there is nothing to hold assignments back with, so
      // the field's own accessor is left alone.
      let getterField: GetterValueField;

      beforeEach(async () => {
        getterField = fixtureSync(`<getter-value-field></getter-value-field>`);
        await nextRender();
      });

      it('should not intercept the field value accessor', async () => {
        mark(getterField, { working: true });
        await nextRender();

        expect(Object.getOwnPropertyDescriptor(getterField, 'value')).to.not.exist;
        expect(getterField.value).to.equal('fixed value');
      });
    });

    describe('field with an own value property', () => {
      // A field that keeps its value in an own property has no accessor to
      // intercept, so the marker must leave the property alone.
      let ownValueField: OwnValueField;

      beforeEach(async () => {
        ownValueField = fixtureSync(`<own-value-field></own-value-field>`);
        await nextRender();
      });

      it('should keep a value property the field owns itself', async () => {
        const marker = mark(ownValueField, { working: true });
        await nextRender();
        clock = sinon.useFakeTimers({ shouldClearNativeTimers: true, toFake: ['setTimeout', 'clearTimeout'] });

        marker.working = false;
        await nextUpdate(marker);
        await clock.tickAsync(500);

        expect(ownValueField.value).to.equal('own value');
      });
    });

    describe('field without a value property', () => {
      let valuelessField: FocusSensitiveField;

      beforeEach(async () => {
        valuelessField = fixtureSync(`<focus-sensitive-field></focus-sensitive-field>`);
        await nextRender();
      });

      it('should apply the working state without throwing', async () => {
        expect(() => mark(valuelessField, { working: true })).to.not.throw();
        await nextRender();
        expect(valuelessField.hasAttribute('ai-working')).to.be.true;
      });

      it('should carry an undefined value in the revert event', async () => {
        const marker = mark(valuelessField, { working: true });
        await nextRender();
        clock = sinon.useFakeTimers({ shouldClearNativeTimers: true, toFake: ['setTimeout', 'clearTimeout'] });
        marker.working = false;
        await nextUpdate(marker);
        await clock.tickAsync(500);

        const spy = sinon.spy();
        valuelessField.addEventListener('ai-field-revert', spy);
        marker.querySelector<HTMLButtonElement>('.actions > button')!.click();
        expect(spy).to.be.calledOnce;
        expect(spy.firstCall.args[0].detail.value).to.be.undefined;
      });

      it('should not define a value property on the field', async () => {
        mark(valuelessField, { working: true });
        await nextRender();
        expect('value' in valuelessField).to.be.false;
      });
    });

    describe('working set after adding', () => {
      let marker: AiFieldMarker;

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

      it('should mark the field input busy for assistive technology', () => {
        // The shimmer alone is only visual, so the input carries aria-busy
        // for the duration of the working state.
        expect(field.inputElement.getAttribute('aria-busy')).to.equal('true');
      });

      it('should remove aria-busy when removed while working', () => {
        marker.remove();
        expect(field.inputElement.hasAttribute('aria-busy')).to.be.false;
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

      it('should keep the original read-only state when working is re-set in one update', async () => {
        clock = sinon.useFakeTimers({ shouldClearNativeTimers: true, toFake: ['setTimeout', 'clearTimeout'] });

        // Both changes land in the same update: the working state is entered
        // again while the field is locked, and must not take the lock itself
        // as the read-only state to restore.
        marker.working = false;
        marker.working = true;
        await nextUpdate(marker);

        marker.working = false;
        await nextUpdate(marker);
        await clock.tickAsync(500);

        expect(field.readonly).to.be.false;
      });
    });

    describe('working cleared', () => {
      let marker: AiFieldMarker;

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

      it('should remove aria-busy right away, not after the wind-down', () => {
        expect(field.inputElement.hasAttribute('aria-busy')).to.be.false;
      });

      it('should restore the client read-only state after the shimmer wind-down', async () => {
        expect(field.readonly).to.be.true;
        await clock!.tickAsync(500);
        expect(field.readonly).to.be.false;
      });

      it('should keep the field read-only when working restarts during the wind-down', async () => {
        marker.working = true;
        await nextUpdate(marker);

        // The restore scheduled by the previous working state must not unlock
        // the field while the AI is working again.
        await clock!.tickAsync(500);
        expect(field.readonly).to.be.true;
      });

      it('should restore the read-only state after working restarts during the wind-down', async () => {
        marker.working = true;
        await nextUpdate(marker);
        marker.working = false;
        await nextUpdate(marker);
        await clock!.tickAsync(500);

        expect(field.readonly).to.be.false;
      });

      it('should not restore the read-only state after the marker is removed', async () => {
        marker.remove();
        field.readonly = true;

        await clock!.tickAsync(500);
        expect(field.readonly).to.be.true;
      });

      it('should keep a read-only state that was set before working', async () => {
        await clock!.tickAsync(500);
        field.readonly = true;

        marker.working = true;
        await nextUpdate(marker);
        marker.working = false;
        await nextUpdate(marker);
        await clock!.tickAsync(500);

        expect(field.readonly).to.be.true;
      });
    });

    describe('value set delay', () => {
      let marker: AiFieldMarker;

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

        await clock!.tickAsync(500);
        expect(field.value).to.equal('Delayed value');
      });

      it('should only apply the last value set while working', async () => {
        field.value = 'One';
        await clock!.tickAsync(300);
        field.value = 'Two';

        // The first set was superseded, so nothing lands at its deadline.
        await clock!.tickAsync(200);
        expect(field.value).to.equal('AI value');

        await clock!.tickAsync(300);
        expect(field.value).to.equal('Two');
      });

      it('should keep delaying value sets when working restarts', async () => {
        field.value = 'One';
        await clock!.tickAsync(200);

        marker.working = false;
        await nextUpdate(marker);
        marker.working = true;
        await nextUpdate(marker);

        field.value = 'Two';

        // The set from the previous working session was superseded, so
        // nothing lands at its deadline.
        await clock!.tickAsync(300);
        expect(field.value).to.equal('AI value');

        await clock!.tickAsync(200);
        expect(field.value).to.equal('Two');
      });

      it('should carry the newly filled value in the revert event', async () => {
        field.value = 'New AI value';
        await clock!.tickAsync(500);

        marker.working = false;
        await nextUpdate(marker);

        const spy = sinon.spy();
        (field as HTMLElement).addEventListener('ai-field-revert', spy);
        marker.querySelector<HTMLButtonElement>('.actions > button')!.click();
        expect(spy.firstCall.args[0].detail.value).to.equal('New AI value');
      });

      it('should carry a value filled in the same batch in the revert event', async () => {
        // The host fills the value and clears the working state together, so
        // the fill is still held back when the marker re-captures it.
        field.value = 'New AI value';
        marker.working = false;
        await nextUpdate(marker);
        await clock!.tickAsync(500);

        const spy = sinon.spy();
        (field as HTMLElement).addEventListener('ai-field-revert', spy);
        marker.querySelector<HTMLButtonElement>('.actions > button')!.click();
        expect(spy.firstCall.args[0].detail.value).to.equal('New AI value');
      });

      it('should still apply a value set queued before working ended', async () => {
        field.value = 'AI filled';
        marker.working = false;
        await nextUpdate(marker);

        expect(field.value).to.equal('AI value');
        await clock!.tickAsync(500);
        expect(field.value).to.equal('AI filled');
      });

      it('should stop delaying value sets when working ends', async () => {
        marker.working = false;
        await nextUpdate(marker);
        await clock!.tickAsync(500);

        field.value = 'Host value';
        expect(field.value).to.equal('Host value');
      });

      it('should restore the field value accessor after the shimmer wind-down', async () => {
        marker.working = false;
        await nextUpdate(marker);
        await clock!.tickAsync(500);
        expect(Object.getOwnPropertyDescriptor(field, 'value')).to.not.exist;
      });

      it('should not overwrite a value set during the wind-down with a queued value', async () => {
        // The AI fill is still queued when working ends; a newer value the
        // host sets during the shimmer wind-down must supersede it instead of
        // being clobbered when the queued value reaches its deadline.
        field.value = 'AI filled';
        marker.working = false;
        await nextUpdate(marker);

        field.value = 'Host value';
        await clock!.tickAsync(500);
        expect(field.value).to.equal('Host value');

        await clock!.tickAsync(500);
        expect(field.value).to.equal('Host value');
      });

      it('should keep delaying value sets after a queued value lands', async () => {
        field.value = 'One';
        await clock!.tickAsync(500);
        expect(field.value).to.equal('One');

        field.value = 'Two';
        expect(field.value, 'a set after the first landing should still be delayed').to.equal('One');

        await clock!.tickAsync(500);
        expect(field.value).to.equal('Two');
      });

      it('should not let a superseded deadline apply a later value set early', async () => {
        field.value = 'One';
        await clock!.tickAsync(500);

        // A value set during the wind-down lands when the wind-down finishes,
        // ahead of its own deadline.
        marker.working = false;
        await nextUpdate(marker);
        await clock!.tickAsync(100);
        field.value = 'Two';
        await clock!.tickAsync(400);
        expect(field.value).to.equal('Two');

        marker.working = true;
        await nextUpdate(marker);
        field.value = 'Three';

        // The deadline of the value that already landed has passed by now, and
        // must not carry the newly set value with it.
        await clock!.tickAsync(150);
        expect(field.value).to.equal('Two');

        await clock!.tickAsync(350);
        expect(field.value).to.equal('Three');
      });

      it('should apply a queued value set when the marker is removed', () => {
        field.value = 'Last value';
        marker.remove();
        expect(field.value).to.equal('Last value');
      });

      it('should apply a queued value set when the marker is removed during the wind-down', async () => {
        field.value = 'Last value';
        marker.working = false;
        await nextUpdate(marker);

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
      let marker: AiFieldMarker;
      let badge: HTMLButtonElement;

      beforeEach(async () => {
        marker = mark(field);
        await nextRender();
        badge = marker.querySelector<HTMLButtonElement>('.badge')!;
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
        const overlay = marker.querySelector('vaadin-popover')!.shadowRoot!.querySelector('vaadin-popover-overlay')!;
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
        (field as HTMLElement).addEventListener('ai-field-revert', spy);
        marker.querySelector<HTMLButtonElement>('.actions > button')!.click();
        expect(spy.firstCall.args[0].detail.value).to.equal('AI value');
      });

      it('should update the mark for the new value', async () => {
        marker.working = true;
        await nextUpdate(marker);

        marker.i18n = { message: 'Filled again by AI' };
        marker.working = false;
        await nextUpdate(marker);

        expect(field.querySelectorAll('vaadin-ai-field-marker')).to.have.lengthOf(1);
        expect(field.shadowRoot!.querySelectorAll('slot[name="ai-field-marker"]')).to.have.lengthOf(1);
        expect(marker.querySelector('.message')!.textContent).to.equal('Filled again by AI');
      });
    });

    describe('custom field', () => {
      let customField: CustomField;
      let inputs: TextField[];
      let marker: AiFieldMarker;

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
        inputs = customField.inputs as TextField[];
        clock = sinon.useFakeTimers({ shouldClearNativeTimers: true, toFake: ['setTimeout', 'clearTimeout'] });
        marker = mark(customField, { working: true });
      });

      it('should make the inputs read-only while working', () => {
        expect(inputs.every((input) => input.readonly)).to.be.true;
      });

      it('should restore each input read-only state when working ends', async () => {
        marker.working = false;
        await nextUpdate(marker);
        await clock!.tickAsync(500);
        expect(inputs[0].readonly).to.be.false;
        expect(inputs[1].readonly).to.be.true;
      });
    });

    describe('custom field with native inputs', () => {
      let customField: CustomField;
      let inputs: HTMLInputElement[];
      let marker: AiFieldMarker;

      beforeEach(async () => {
        // A custom field also accepts native inputs, which spell the
        // client-side read-only property `readOnly` instead of `readonly`.
        customField = fixtureSync(`
          <vaadin-custom-field label="License plate">
            <input type="text" />
            <input type="text" readonly />
          </vaadin-custom-field>
        `);
        await nextRender();
        inputs = customField.inputs as HTMLInputElement[];
        clock = sinon.useFakeTimers({ shouldClearNativeTimers: true, toFake: ['setTimeout', 'clearTimeout'] });
        marker = mark(customField, { working: true });
      });

      it('should make the native inputs read-only while working', () => {
        expect(inputs.every((input) => input.readOnly)).to.be.true;
      });

      it('should restore each native input read-only state when working ends', async () => {
        marker.working = false;
        await nextUpdate(marker);
        await clock!.tickAsync(500);
        expect(inputs[0].readOnly).to.be.false;
        expect(inputs[1].readOnly).to.be.true;
      });
    });

    describe('composite field under another tag name', () => {
      let derivedField: CustomField;
      let inputs: TextField[];
      let marker: AiFieldMarker;

      beforeEach(async () => {
        derivedField = fixtureSync(`
          <derived-custom-field label="License plate">
            <vaadin-text-field></vaadin-text-field>
            <vaadin-text-field readonly></vaadin-text-field>
          </derived-custom-field>
        `);
        await nextRender();
        inputs = derivedField.inputs as TextField[];
        clock = sinon.useFakeTimers({ shouldClearNativeTimers: true, toFake: ['setTimeout', 'clearTimeout'] });
        marker = mark(derivedField, { working: true });
      });

      it('should make the inputs read-only while working', () => {
        expect(inputs.every((input) => input.readonly)).to.be.true;
      });

      it('should restore each input read-only state when working ends', async () => {
        marker.working = false;
        await nextUpdate(marker);
        await clock!.tickAsync(500);
        expect(inputs[0].readonly).to.be.false;
        expect(inputs[1].readonly).to.be.true;
      });
    });
  });
});

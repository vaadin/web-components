/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/popover/src/vaadin-popover.js';
import '@vaadin/tooltip/src/vaadin-tooltip.js';
import { html, LitElement, nothing } from 'lit';
import { announce } from '@vaadin/a11y-base/src/announce.js';
import { getDeepActiveElement, getTabbableElements, isKeyboardActive } from '@vaadin/a11y-base/src/focus-utils.js';
import { registerCSSProperty } from '@vaadin/component-base/src/css-utils.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { addValuesToAttribute, removeValuesFromAttribute } from '@vaadin/component-base/src/dom-utils.js';
import { I18nMixin } from '@vaadin/component-base/src/i18n-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { SlotStylesMixin } from '@vaadin/component-base/src/slot-styles-mixin.js';
import { generateUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import { aiFieldMarkerHostStyles, aiFieldMarkerStyles } from './styles/vaadin-ai-field-marker-base-styles.js';

const DEFAULT_I18N = {
  message: 'This field value was modified by AI.',
  revert: 'Revert Value',
  badgeLabel: 'AI-provided value',
  badgeTooltip: 'Field value modified by AI.\nClick for details',
  confidence: {
    low: 'Low confidence',
    medium: 'Medium confidence',
    high: 'High confidence',
  },
};

// Half of the 1s working shimmer slide (`--vaadin-ai-field-marker-slide` in
// the base styles), so that held-back values land — and the read-only lock
// lifts — in the middle of a slide instead of at its edge.
const HALF_WORKING_SLIDE_MS = 500;

const MARKER_SLOT = 'ai-field-marker';

/** Marks the `<style>` element the marker injects into a field's shadow root. */
const MARKER_STYLE_ATTRIBUTE = 'ai-field-marker-styles';

// The position the shimmer's mask is at, animated by the marker's keyframes.
// Registered here rather than with an @property rule in the marker stylesheet,
// which is injected into the field's root node: a registration only takes effect
// at document scope, and that root node is a shadow root for a field nested
// inside another component.
registerCSSProperty({
  name: '--vaadin-ai-field-marker-mask-pos',
  syntax: '<length-percentage>',
  inherits: false,
  initialValue: '0px',
});

/**
 * Adds the marker's keyframes to the field's own shadow root, where the
 * animation names used by the `::part()` rules above have to resolve, since
 * keyframes are looked up in the tree scope of the animated element.
 *
 * Injected as a `<style>` element rather than an adopted stylesheet because the
 * themable infrastructure replaces `adoptedStyleSheets` wholesale — on a Lumo
 * stylesheet load or a theme switch — which would silently drop the keyframes
 * and leave the field's input masked but never animating.
 *
 * @param {HTMLElement} field
 */
function injectMarkerHostStyles(field) {
  if (field.shadowRoot.querySelector(`style[${MARKER_STYLE_ATTRIBUTE}]`)) {
    return;
  }

  const style = document.createElement('style');
  style.setAttribute(MARKER_STYLE_ATTRIBUTE, '');
  style.textContent = aiFieldMarkerHostStyles.cssText;
  field.shadowRoot.appendChild(style);
}

/**
 * Holds back value assignments on a field, so that the value an AI fills in
 * lands halfway through the marker's slide animation instead of instantly.
 *
 * While installed, the field's own `value` accessor is replaced with one that
 * queues an assignment and applies it after the delay; a further assignment
 * supersedes a queued one. Uninstalling restores the field's own accessor and
 * applies a queued assignment right away, since it carries the value the
 * marker was working on and nothing may land after the accessor is restored —
 * a late-landing value would overwrite one the host has set since.
 */
class DelayedFieldValue {
  /** The intercepted accessor, found on the field's prototype chain. */
  #descriptor;

  #field;

  #delay;

  #timer = null;

  /** The queued value, while `#timer` is pending. */
  #queuedValue;

  /** Whether the field's own `value` accessor is currently replaced. */
  #installed = false;

  constructor(field, delay) {
    this.#field = field;
    this.#delay = delay;

    let descriptor = null;
    for (let proto = Object.getPrototypeOf(field); proto && !descriptor; proto = Object.getPrototypeOf(proto)) {
      descriptor = Object.getOwnPropertyDescriptor(proto, 'value');
    }
    this.#descriptor = descriptor?.get && descriptor.set ? descriptor : null;
  }

  /**
   * Whether the field exposes a `value` accessor that can be intercepted.
   * Without one there is nothing to delegate to, and defining an own `value`
   * would make `'value' in field` report a value the field does not have.
   *
   * @return {boolean}
   */
  get supported() {
    return this.#descriptor != null;
  }

  /**
   * The value the field ends up with: a queued value while one is pending,
   * otherwise the field's current value. Reading `field.value` instead would
   * return the value that the queued assignment is about to replace.
   *
   * @return {unknown}
   */
  get latestValue() {
    return this.#timer != null ? this.#queuedValue : this.#field.value;
  }

  /** Starts holding back value assignments. Keeps a queued assignment. */
  install() {
    const field = this.#field;
    if (!this.supported || Object.getOwnPropertyDescriptor(field, 'value')) {
      return;
    }

    const descriptor = this.#descriptor;
    Object.defineProperty(field, 'value', {
      configurable: true,
      get: () => descriptor.get.call(field),
      set: (value) => {
        this.#queuedValue = value;
        clearTimeout(this.#timer);
        this.#timer = setTimeout(() => this.#flush(), this.#delay);
      },
    });
    this.#installed = true;
  }

  /** Restores the field's own accessor, applying a queued value right away. */
  uninstall() {
    // Only remove an own property that this instance defined, so that a field
    // keeping its value in an own property instead of an accessor — which
    // `install()` leaves alone — does not lose it.
    if (this.#installed) {
      delete this.#field.value;
      this.#installed = false;
    }
    this.#flush();
  }

  /**
   * Applies a queued value right away. Applied through the intercepted
   * accessor, so an installed hold-back stays in place for further
   * assignments — this is also how a queued value lands on its deadline.
   */
  #flush() {
    if (this.#timer == null) {
      return;
    }

    clearTimeout(this.#timer);
    this.#timer = null;
    const value = this.#queuedValue;
    this.#queuedValue = null;
    this.#descriptor.set.call(this.#field, value);
  }
}

/**
 * An element used internally by Vaadin. Not intended to be used separately.
 *
 * Annotates a field as AI-filled: appended as a direct child of the field,
 * it slots itself into the field via a slot injected into the field's shadow
 * root, draws an "AI" badge anchored to the field, and offers a popover that
 * explains the AI fill and lets the user revert the value.
 *
 * The marker manages the annotation through its own lifecycle: adding it to
 * the field marks the field, removing it clears the mark:
 *
 * ```js
 * const marker = document.createElement('vaadin-ai-field-marker');
 * marker.i18n = { message: 'Filled based on the uploaded document.' };
 * field.appendChild(marker);
 * // ...
 * marker.remove();
 * ```
 *
 * While an AI fill is in progress, set the `working` property to show an
 * "AI is working" shimmer on the field along with a client-side read-only
 * guard. An existing mark is hidden for the duration, since the value it
 * annotates is about to be replaced; setting `working` back to `false`
 * brings it back, so a cancelled or failed fill leaves the mark intact.
 *
 * The pieces that construct the marker — the badge, its tooltip and the
 * popover with the explanation and the revert control — are rendered
 * directly into the marker's light DOM, so that document-level themes
 * and user stylesheets can reach them.
 *
 * Set the `confidence` property to show the confidence level of the filled
 * value (`low`, `medium` or `high`) as an indicator in the field's helper
 * text section, alongside a helper the field itself may have.
 *
 * ### Styling
 *
 * The following state attributes are set on the field element for styling:
 *
 * Attribute       | Description
 * ----------------|-------------
 * `ai-working`    | Set while an AI is working on the field.
 * `ai-confidence` | Set while a confidence level is shown, with the level as the value.
 *
 * The confidence indicator is rendered into the field's light DOM as a
 * `<span>` with the `confidence` class name and the level (`low`, `medium`
 * or `high`) as an additional class name.
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                                  |
 * :----------------------------------------------------|
 * `--vaadin-ai-field-marker-badge-icon-color`          |
 * `--vaadin-ai-field-marker-confidence-high-color`     |
 * `--vaadin-ai-field-marker-confidence-low-color`      |
 * `--vaadin-ai-field-marker-confidence-medium-color`   |
 * `--vaadin-ai-field-marker-mask-pos`                  |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} ai-field-revert - Fired from the field element when the user activates the revert control. The host restores the value.
 *
 * @customElement vaadin-ai-field-marker
 * @extends HTMLElement
 * @private
 */
class AiFieldMarker extends SlotStylesMixin(I18nMixin(DirMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-ai-field-marker';
  }

  static get defaultI18n() {
    return DEFAULT_I18N;
  }

  static get properties() {
    return {
      /**
       * Whether an AI is currently working on the field. While `true`, the
       * field shows an "AI is working" shimmer and is made read-only on the
       * client so the user cannot edit a value the AI is about to overwrite;
       * only the client-side `readonly` state is touched, and setting the
       * property back to `false` restores it. The marker badge is hidden for
       * the duration, since the value it annotates is about to be replaced.
       * For assistive technology, the field is marked with `aria-busy`.
       */
      working: {
        type: Boolean,
        value: false,
      },

      /**
       * The confidence level of the AI-filled value, shown as an indicator
       * in the field's helper text section. Possible values are `low`,
       * `medium` and `high`; when not set, no indicator is shown. The
       * indicator texts can be localized with the `i18n` property.
       */
      confidence: {
        type: String,
        value: null,
      },
    };
  }

  /**
   * The field the marker annotates: its parent element. Set while the marker
   * is connected to a field with a shadow root.
   */
  #field = null;

  /**
   * The hidden description node added to the marker's light DOM and linked
   * to the field's input via `aria-describedby`.
   */
  #descNode = null;

  /** The element whose `aria-describedby` references the description node. */
  #describedElement = null;

  /** The field value captured for the revert event detail. */
  #capturedValue;

  /**
   * The confidence indicator added to the field's light DOM and rendered
   * in the field's helper text section. Set while `confidence` is set on
   * a marked field.
   */
  #confidenceNode = null;

  /**
   * While in the working state, the elements whose client-side `readonly`
   * state was overridden — the field itself and, for a `vaadin-custom-field`,
   * its inputs — with their original values, so leaving the working state can
   * restore them. `null` once the state has been restored.
   */
  #lockedElements = null;

  /**
   * The pending restore of the captured read-only state, scheduled when the
   * working state ends so the field stays locked for the shimmer wind-down.
   * Non-`null` only while winding down.
   */
  #restoreTimer = null;

  /** Set when the AI-fill announcement should be made on the next update. */
  #announcePending = false;

  /**
   * Holds back the field's value assignments while working. Kept across
   * working states, so a new assignment supersedes a still-queued one.
   */
  #valueDelay = null;

  /**
   * Stable badge id: generating it in render() would re-target the tooltip
   * and popover on every re-render.
   */
  #badgeId = `vaadin-ai-field-marker-${generateUniqueId()}`;

  constructor() {
    super();

    // The marker and its popover content live in the field's light DOM, so a
    // click on the badge or inside the popover bubbles to the field host.
    // Fields that open their overlay on any host click (date-picker,
    // multi-select-combo-box) would act on it as if the field itself had been
    // clicked. Keep marker clicks to the marker. The popover and tooltip bind
    // their listeners on the badge, which is a descendant, so they still fire
    // before this bubble-phase listener.
    this.addEventListener('click', (event) => event.stopPropagation());

    // Close the popover when focus moves on, e.g. by tabbing to the next
    // field: a click-triggered popover only closes itself on outside pointer
    // interaction or Esc, so popovers of several marked fields could pile up.
    // Where focus ended up is read only once the transition has settled — mid
    // transition the document has no focused element, which the popover
    // overlay reads as focus not having left it (see
    // OverlayFocusMixin._shouldRestoreFocus) and restores focus to the badge,
    // stealing it from the input the user clicked.
    this.addEventListener('focusout', () => {
      setTimeout(() => {
        if (!this.contains(getDeepActiveElement())) {
          this.#closePopover();
        }
      });
    });
  }

  /**
   * Render into the light DOM instead of a shadow root: the themes can only
   * reach a nested Vaadin component (the tooltip, the popover) there, since
   * Aura selects components by tag name at document scope and has no way
   * into another component's shadow root. The tooltip and popover target the
   * badge by id, which resolves in the light-DOM scope shared by all three.
   *
   * @protected
   * @override
   */
  createRenderRoot() {
    return this;
  }

  /**
   * The object used to localize this component. To change the default
   * localization, replace this with an object that provides all properties, or
   * just the individual properties you want to change.
   *
   * The object has the following JSON structure and default values:
   *
   * ```
   * {
   *   // The message shown in the popover explaining the AI fill.
   *   message: 'This field value was modified by AI.',
   *   // The label of the revert control.
   *   revert: 'Revert Value',
   *   // The accessible label of the badge button and the popover dialog.
   *   badgeLabel: 'AI-provided value',
   *   // The tooltip text of the badge button.
   *   badgeTooltip: 'Field value modified by AI.\nClick for details',
   *   // The texts of the confidence indicator.
   *   confidence: {
   *     low: 'Low confidence',
   *     medium: 'Medium confidence',
   *     high: 'High confidence'
   *   }
   * }
   * ```
   *
   * @return {!Object}
   */
  get i18n() {
    return super.i18n;
  }

  set i18n(value) {
    super.i18n = value;
  }

  /**
   * Override getter from `SlotStylesMixin` to insert the marker styles into
   * the field's root node — the marker's own root node, since the marker is
   * a child of the field — so the badge, popover and working-shimmer styles
   * apply to the field.
   *
   * `SlotStylesMixin` inserts them as a `<style>` element rather than an
   * adopted stylesheet, which matters here: the themable infrastructure
   * replaces `adoptedStyleSheets` wholesale — on a Lumo stylesheet load or a
   * theme switch — which, for a field nested in another component's shadow
   * root, would silently drop the marker styles.
   *
   * @protected
   * @override
   * @return {string[]}
   */
  get slotStyles() {
    return [aiFieldMarkerStyles.cssText];
  }

  /**
   * Marks the parent field as AI-filled: injects the highlight + badge +
   * popover into the field's shadow root, announces the change to screen
   * readers, and associates the explanation with the field's input.
   * Does nothing when the parent is not a field with a shadow root.
   *
   * @protected
   * @override
   */
  connectedCallback() {
    super.connectedCallback();

    const parent = this.parentElement;
    if (parent?.shadowRoot) {
      this.#field = parent;
    }

    // Render now that the field is known: PolylitMixin's synchronous render on
    // first connect ran before it was resolved, and on a reconnect no property
    // change schedules an update. Requested even without a field, so that moving
    // the marker to a parent that is not one clears the previous field's UI.
    this.requestUpdate();

    if (this.#field) {
      this.#markField();
    } else {
      this.#markWhenUpgraded(parent);
    }
  }

  /**
   * Removes the AI-filled annotation from the field the marker was attached
   * to: clears the working state (restoring the field's client-side
   * read-only state), the input description and the injected slot.
   *
   * @protected
   * @override
   */
  disconnectedCallback() {
    super.disconnectedCallback();

    const field = this.#field;
    if (!field) {
      return;
    }

    this.#stopWorking(true);

    this.#removeConfidenceNode();

    if (this.#descNode) {
      removeValuesFromAttribute(this.#describedElement, 'aria-describedby', this.#descNode.id);
      this.#descNode.remove();
      this.#descNode = null;
      this.#describedElement = null;
    }

    // Remove the injected slot and styles unless another marker still uses them.
    if (!field.querySelector(`:scope > ${AiFieldMarker.is}`)) {
      field.shadowRoot.querySelector(`slot[name="${MARKER_SLOT}"]`)?.remove();
      field.shadowRoot.querySelector(`style[${MARKER_STYLE_ATTRIBUTE}]`)?.remove();
    }

    this.#field = null;
    this.#valueDelay = null;
  }

  /**
   * @protected
   * @override
   */
  updated(props) {
    super.updated(props);

    // Keep the hidden field description in sync with the current message.
    if (props.has('__effectiveI18n') && this.#descNode) {
      this.#descNode.textContent = this.__effectiveI18n.message;
    }

    const field = this.#field;
    if (!field) {
      return;
    }

    if (props.has('confidence') || props.has('__effectiveI18n')) {
      this.#updateConfidence();
    }

    if (props.has('working')) {
      if (this.working) {
        this.#startWorking();
      } else if (this.#lockedElements) {
        this.#stopWorking();
        // The fill landed: the marker now annotates the current value, so
        // re-capture it for the revert event and announce the mark again.
        this.#capturedValue = this.#annotatedValue();
        this.#announcePending = true;
      }
    }

    // Announce after the update so the announcement reflects a message set in
    // the same batch as the append or the `working` toggle.
    if (this.#announcePending && !this.working) {
      this.#announcePending = false;
      const { message } = this.__effectiveI18n;
      const { label } = field;
      announce(label ? `${label}: ${message}` : message);
    }
  }

  /** @protected */
  render() {
    if (!this.#field) {
      return nothing;
    }

    const { message, revert, badgeLabel, badgeTooltip } = this.__effectiveI18n;
    // Safari leaves buttons out of the tab order unless they set a tabindex.
    return html`
      <button id="${this.#badgeId}" class="badge" type="button" tabindex="0" aria-label="${badgeLabel}"></button>
      <vaadin-tooltip for="${this.#badgeId}" text="${badgeTooltip}"></vaadin-tooltip>
      <vaadin-popover for="${this.#badgeId}" aria-label="${badgeLabel}" autofocus theme="arrow" position="end-top">
        <p class="message">${message}</p>
        <div class="actions">
          <button type="button" tabindex="0" @click="${this.#onRevert}">${revert}</button>
        </div>
      </vaadin-popover>
    `;
  }

  /**
   * Waits for the parent's custom element definition to load and marks it then,
   * for a marker attached before the field was upgraded — at which point it had
   * no shadow root to inject the marker into.
   *
   * @param {HTMLElement} parent
   */
  #markWhenUpgraded(parent) {
    const tagName = parent?.localName;
    if (!tagName || !tagName.includes('-') || customElements.get(tagName)) {
      return;
    }

    customElements.whenDefined(tagName).then(() => {
      // The marker may have been moved or removed while the field was loading,
      // or already marked by a callback an earlier connect to the same parent
      // left waiting.
      if (!this.isConnected || this.#field || this.parentElement !== parent || !parent.shadowRoot) {
        return;
      }

      this.#field = parent;
      this.requestUpdate();
      this.#markField();
    });
  }

  /**
   * Injects the marker into the resolved field and describes it as AI-filled.
   */
  #markField() {
    const field = this.#field;

    injectMarkerHostStyles(field);

    // Create a slot for the marker element inside the field's own shadow
    // root (unless a previous marker already left one) and assign the marker
    // to it, so the marker renders although the field defines no such slot.
    if (!field.shadowRoot.querySelector(`slot[name="${MARKER_SLOT}"]`)) {
      const markerSlot = document.createElement('slot');
      markerSlot.setAttribute('name', MARKER_SLOT);
      field.shadowRoot.appendChild(markerSlot);
    }
    this.slot = MARKER_SLOT;

    // Add a hidden description node in the field's light DOM (so its id
    // resolves in the described element's scope) and append its id to that
    // element's aria-describedby. Appending — rather than using
    // aria-description, which a screen reader ignores when aria-describedby is
    // present — lets the field's own helper/error description and the AI note
    // both get read.
    //
    // `ariaTarget` is where the field puts its own descriptions, and is the
    // only one of the three for group and composite fields, which expose
    // neither an input nor a focus element.
    const describedElement = field.ariaTarget || field.inputElement || field.focusElement;
    if (describedElement) {
      const descNode = document.createElement('span');
      descNode.id = `ai-field-marker-${generateUniqueId()}`;
      descNode.className = 'description sr-only';
      descNode.textContent = this.__effectiveI18n.message;
      // Insert before Lit's rendered content so the node stays outside the
      // range Lit manages (and may clear) in the light-DOM render root.
      this.insertBefore(descNode, this.firstChild);
      addValuesToAttribute(describedElement, 'aria-describedby', descNode.id);
      this.#descNode = descNode;
      this.#describedElement = describedElement;
    }

    // Apply the confidence indicator directly: on a reconnect no property
    // change triggers updated(), which handles the first connect.
    this.#updateConfidence();

    // Capture the AI-filled value so the revert event can carry it.
    this.#capturedValue = this.#annotatedValue();

    if (this.working) {
      // Apply the working state directly: on a reconnect no `working`
      // property change triggers updated(), which handles the first connect.
      this.#startWorking();
    } else {
      this.#announcePending = true;
    }
  }

  /**
   * The field value the mark annotates. A value the AI has already set but
   * that the working state still holds back counts as the annotated one, since
   * it is the value the field ends up showing.
   *
   * @return {unknown} the annotated value, or `undefined` for a field that has
   *   no value at all
   */
  #annotatedValue() {
    const field = this.#field;
    return this.#valueDelay ? this.#valueDelay.latestValue : field.value;
  }

  /**
   * Syncs the confidence indicator in the field's helper text section with
   * the `confidence` property: a `<span>` slotted into the field's helper
   * slot, with the level as a class name and the localized level text as
   * content. The field carries the level in its `ai-confidence` attribute,
   * which also keeps the helper text section visible for a field that has
   * no helper of its own.
   */
  #updateConfidence() {
    const field = this.#field;
    if (!field) {
      return;
    }

    const level = this.confidence;
    if (!level) {
      this.#removeConfidenceNode();
      return;
    }

    if (!this.#confidenceNode) {
      const node = document.createElement('span');
      node.setAttribute('slot', 'helper');
      // Hide the indicator from the field's helper slot controller, which
      // would otherwise evict the field's own helper element in favor of
      // the indicator. The browser still renders it in the helper slot.
      node.setAttribute('data-slot-ignore', '');
      node.id = `ai-field-marker-confidence-${generateUniqueId()}`;
      field.appendChild(node);
      if (this.#describedElement) {
        addValuesToAttribute(this.#describedElement, 'aria-describedby', node.id);
      }
      this.#confidenceNode = node;
    }

    this.#confidenceNode.className = `confidence ${level}`;
    this.#confidenceNode.textContent = this.__effectiveI18n.confidence[level] ?? '';
    field.setAttribute('ai-confidence', level);
  }

  /** Removes the confidence indicator and the field's `ai-confidence` attribute. */
  #removeConfidenceNode() {
    const node = this.#confidenceNode;
    if (!node) {
      return;
    }

    if (this.#describedElement) {
      removeValuesFromAttribute(this.#describedElement, 'aria-describedby', node.id);
    }
    node.remove();
    this.#confidenceNode = null;
    this.#field.removeAttribute('ai-confidence');
  }

  /**
   * Enters the "AI is working" state: shows the shimmer and makes the field
   * read-only on the client so the user cannot edit a value the AI is about
   * to overwrite. Idempotent — keeps the state captured on entry.
   */
  #startWorking() {
    const field = this.#field;
    if (!field || (this.#lockedElements && this.#restoreTimer == null)) {
      return;
    }

    this.#valueDelay ??= new DelayedFieldValue(field, HALF_WORKING_SLIDE_MS);
    this.#valueDelay.install();

    if (this.#restoreTimer != null) {
      // The previous working state is still winding down. Cancel its restore
      // and keep the read-only state it captured: the elements are locked right
      // now, so capturing again would take the lock itself as the original.
      clearTimeout(this.#restoreTimer);
      this.#restoreTimer = null;
    } else {
      // A composite field does not propagate `readonly` to its inputs, so they
      // are locked (and restored) individually alongside the field. Recognized
      // by the `inputs` array rather than by tag name, which also covers a
      // composite field shipped under its own tag name.
      const locked = [field, ...(Array.isArray(field.inputs) ? field.inputs : [])];
      this.#lockedElements = locked.map((element) => {
        // A composite field also accepts native inputs, which spell the
        // property `readOnly`.
        const property = 'readonly' in element ? 'readonly' : 'readOnly';
        return { element, property, value: element[property] };
      });
    }

    field.setAttribute('ai-working', '');
    // Expose the working state to assistive technology on the same element
    // that carries the AI description: the shimmer alone is only visual.
    this.#describedElement?.setAttribute('aria-busy', 'true');
    this.#lockedElements.forEach(({ element, property }) => {
      element[property] = true;
    });
  }

  /**
   * Leaves the "AI is working" state: removes the shimmer and restores the
   * field's previous client-side read-only state. A no-op when not working.
   *
   * @param {boolean} immediate restore the read-only state right away instead
   *   of after the shimmer wind-down (used on disconnect)
   */
  #stopWorking(immediate = false) {
    const field = this.#field;

    if (this.#restoreTimer != null) {
      // Already winding down. Finish it now when the marker is going away, so
      // the restore cannot overwrite a read-only state set after this point
      // and a value still queued from the working state cannot land after it.
      if (immediate) {
        this.#restoreLockedElements();
      }
      return;
    }

    if (!this.#lockedElements) {
      return;
    }

    field.removeAttribute('ai-working');
    this.#describedElement?.removeAttribute('aria-busy');

    // The value hold-back stays installed for the wind-down: a queued value
    // still lands on its own deadline, and a value the host sets before the
    // wind-down finishes supersedes a queued one instead of being overwritten
    // by it when its deadline passes. The restore then lifts the hold-back.
    if (immediate) {
      this.#restoreLockedElements();
    } else {
      this.#restoreTimer = setTimeout(() => this.#restoreLockedElements(), HALF_WORKING_SLIDE_MS);
    }
  }

  /**
   * Restores the read-only state captured when the working state was entered
   * and stops holding back the field's value assignments, applying a value
   * still queued at this point right away — rather than on its deadline, after
   * the marker stopped controlling the field.
   */
  #restoreLockedElements() {
    clearTimeout(this.#restoreTimer);
    this.#restoreTimer = null;

    this.#valueDelay.uninstall();

    const locked = this.#lockedElements;
    this.#lockedElements = null;
    locked.forEach(({ element, property, value }) => {
      element[property] = value;
    });
  }

  /** Closes the marker's popover, if rendered. */
  #closePopover() {
    const popover = this.querySelector(':scope > vaadin-popover');
    if (popover) {
      popover.opened = false;
    }
  }

  #onRevert() {
    // Return focus to the field before closing the popover. The popover
    // targets the badge for focus restoration, but the host may remove the
    // marker on revert, which would drop focus to the body. Moving focus to
    // the field first makes the overlay skip its own restore — it only
    // restores while focus is still inside the overlay (see
    // OverlayFocusMixin._shouldRestoreFocus).
    //
    // Focus the field's own focusable element rather than calling focus() on
    // the host: a host focus() can carry component-specific semantics that a
    // revert must not trigger — date-picker opens its overlay on focus while
    // it has no usable text input (fullscreen, iOS, or no i18n.parseDate).
    //
    // The revert control can be activated by pointer as well as by keyboard,
    // so the focus ring is left to the current interaction modality instead of
    // being forced on, which is what a bare focus() does on a Vaadin field.
    const field = this.#field;
    if (field) {
      const focusTarget = field.focusElement || field.inputElement || getTabbableElements(field)[0] || field;
      focusTarget.focus({ focusVisible: isKeyboardActive() });
    }

    this.#closePopover();

    if (field) {
      field.dispatchEvent(
        new CustomEvent('ai-field-revert', {
          bubbles: true,
          composed: true,
          detail: { value: this.#capturedValue },
        }),
      );
    }
  }
}

defineCustomElement(AiFieldMarker);

export { AiFieldMarker };

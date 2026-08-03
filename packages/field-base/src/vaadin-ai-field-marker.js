/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/popover/src/vaadin-popover.js';
import '@vaadin/tooltip/src/vaadin-tooltip.js';
import { html, LitElement, nothing } from 'lit';
import { announce } from '@vaadin/a11y-base/src/announce.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { addValuesToAttribute, removeValuesFromAttribute } from '@vaadin/component-base/src/dom-utils.js';
import { I18nMixin } from '@vaadin/component-base/src/i18n-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';
import { generateUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import {
  aiFieldMarkerHostStyles,
  aiFieldMarkerShadowStyles,
  aiFieldMarkerStyles,
} from './styles/vaadin-ai-field-marker-base-styles.js';

const DEFAULT_I18N = {
  message: 'This field value was modified by AI.',
  revert: 'Revert Value',
  badgeLabel: 'AI-provided value',
  badgeTooltip: 'Field value modified by AI.\nClick for details',
};

const POPOVER_TRIGGER = ['click'];

const MARKER_SLOT = 'ai-field-marker';

const markerStyles = new CSSStyleSheet();
markerStyles.replaceSync(aiFieldMarkerStyles);

const markerHostStyles = new CSSStyleSheet();
markerHostStyles.replaceSync(aiFieldMarkerHostStyles);

/**
 * Adopts the marker stylesheets into the field's root node and shadow root,
 * so the badge, popover and working-shimmer styles apply to the field.
 *
 * @param {HTMLElement} field
 */
function adoptMarkerStyles(field) {
  if (!field.getRootNode().adoptedStyleSheets.includes(markerStyles)) {
    field.getRootNode().adoptedStyleSheets.push(markerStyles);
  }

  if (!field.shadowRoot.adoptedStyleSheets.includes(markerHostStyles)) {
    field.shadowRoot.adoptedStyleSheets.push(markerHostStyles);
  }
}

/**
 * Holds back value assignments on a field, so that the value an AI fills in
 * lands halfway through the marker's slide animation instead of instantly.
 *
 * While installed, the field's own `value` accessor is replaced with one that
 * queues an assignment and applies it after the delay; a further assignment
 * supersedes a queued one. Uninstalling restores the field's own accessor but
 * leaves a queued assignment on its deadline, since it carries the value the
 * marker was working on. Call `flush()` to apply it right away instead.
 */
class DelayedFieldValue {
  /** The intercepted accessor, found on the field's prototype chain. */
  #descriptor;

  #field;

  #delay;

  #timer = null;

  /** The queued value, while `#timer` is pending. */
  #queuedValue;

  constructor(field, delay) {
    this.#field = field;
    this.#delay = delay;

    let proto = Object.getPrototypeOf(field);
    let descriptor;
    while (proto && !(descriptor = Object.getOwnPropertyDescriptor(proto, 'value'))) {
      proto = Object.getPrototypeOf(proto);
    }
    this.#descriptor = descriptor && descriptor.get && descriptor.set ? descriptor : null;
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
        this.#timer = setTimeout(() => this.flush(), this.#delay);
      },
    });
  }

  /** Restores the field's own accessor, leaving a queued value on its deadline. */
  uninstall() {
    if (Object.getOwnPropertyDescriptor(this.#field, 'value')) {
      delete this.#field.value;
    }
  }

  /** Applies a queued value right away, and stops holding back assignments. */
  flush() {
    if (this.#timer == null) {
      this.uninstall();
      return;
    }

    clearTimeout(this.#timer);
    this.#timer = null;
    const value = this.#queuedValue;
    this.#queuedValue = undefined;
    this.uninstall();
    this.#field.value = value;
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
 * The parts that construct the marker — the badge, its tooltip, the popover
 * message and actions — are generated as light-DOM children assigned to
 * named slots. The popover itself renders in the marker's shadow root,
 * wrapping the content slots, so that content appended to the marker is
 * slotted into the popover — shown between the explanation and the revert
 * control. This default slot is the integration point for frameworks (e.g.
 * Flow) that provide custom popover content as server-side elements.
 *
 * @fires {CustomEvent} ai-field-revert - Fired from the field element when the user activates the revert control. The host restores the value.
 *
 * @customElement vaadin-ai-field-marker
 * @extends HTMLElement
 * @private
 */
export class AiFieldMarker extends I18nMixin(DirMixin(PolylitMixin(LitElement))) {
  static get is() {
    return 'vaadin-ai-field-marker';
  }

  static get styles() {
    return aiFieldMarkerShadowStyles;
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
       */
      working: {
        type: Boolean,
        value: false,
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

  #badgeController;

  #tooltipController;

  #messageController;

  #actionsController;

  /** The revert button, updated from the `revertText` property. */
  #revertButton;

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

    // The parts are generated as light-DOM children assigned to named slots,
    // so frameworks (e.g. Flow) can reach them without piercing a shadow
    // root. The tooltip targets the badge by id, which resolves in the
    // light-DOM scope shared by both; the popover renders in the shadow root
    // and targets the badge through its `target` property instead.
    const badgeId = `vaadin-ai-marker-${generateUniqueId()}`;

    this.#badgeController = new SlotController(this, 'badge', 'button', {
      observe: false,
      initializer: (badge) => {
        badge.id = badgeId;
        badge.setAttribute('part', 'badge');
        badge.type = 'button';
      },
    });
    this.addController(this.#badgeController);

    this.#tooltipController = new SlotController(this, 'tooltip', 'vaadin-tooltip', {
      observe: false,
      initializer: (tooltip) => {
        tooltip.setAttribute('for', badgeId);
      },
    });
    this.addController(this.#tooltipController);

    this.#messageController = new SlotController(this, 'message', 'p', {
      observe: false,
      initializer: (message) => {
        message.setAttribute('part', 'message');
      },
    });
    this.addController(this.#messageController);

    this.#actionsController = new SlotController(this, 'actions', 'div', {
      observe: false,
      initializer: (actions) => {
        actions.setAttribute('part', 'actions');

        const revertButton = document.createElement('button');
        revertButton.type = 'button';
        revertButton.setAttribute('part', 'revert-button');
        revertButton.addEventListener('click', () => this.#onRevert());
        this.#revertButton = revertButton;
        actions.appendChild(revertButton);
      },
    });
    this.addController(this.#actionsController);
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
   *   badgeTooltip: 'Field value modified by AI.\nClick for details'
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
   * Marks the parent field as AI-filled: injects the highlight + badge +
   * popover into the field's shadow root, announces the change to screen
   * readers, and associates the explanation with the field's input.
   * Does nothing when the parent is not a field with a shadow root.
   *
   * @protected
   * @override
   */
  connectedCallback() {
    // Resolve the field before super: PolylitMixin renders synchronously on
    // connect, and render() must already know the field to render the popover
    // and the slots for the generated content.
    const parent = this.parentElement;
    if (parent && parent.shadowRoot) {
      this.#field = parent;
    }

    super.connectedCallback();

    const field = this.#field;
    if (!field) {
      return;
    }

    adoptMarkerStyles(field);

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
      descNode.slot = 'description';
      descNode.textContent = this.__effectiveI18n.message;
      descNode.style.cssText =
        'position:absolute;width:1px;height:1px;margin:-1px;padding:0;border:0;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;';
      this.appendChild(descNode);
      addValuesToAttribute(describedElement, 'aria-describedby', descNode.id);
      this.#descNode = descNode;
      this.#describedElement = describedElement;
    }

    // Capture the AI-filled value so the revert event can carry it.
    this.#capturedValue = this.#annotatedValue();

    if (this.working) {
      // Apply the working state directly: on a reconnect no `working`
      // property change triggers updated(), which handles the first connect.
      this.#startWorking();
    } else {
      this.#announcePending = true;
    }

    // Re-render on reconnect, when no property change schedules an update.
    this.requestUpdate();
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

    if (this.#descNode) {
      removeValuesFromAttribute(this.#describedElement, 'aria-describedby', this.#descNode.id);
      this.#descNode.remove();
      this.#descNode = null;
      this.#describedElement = null;
    }

    // Remove the injected slot unless another marker still uses it.
    const markerSlot = field.shadowRoot.querySelector(`slot[name="${MARKER_SLOT}"]`);
    if (markerSlot && !field.querySelector(`:scope > ${AiFieldMarker.is}`)) {
      markerSlot.remove();
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

    // Apply the localized texts to the generated content.
    if (props.has('__effectiveI18n')) {
      const { message, revert, badgeLabel, badgeTooltip } = this.__effectiveI18n;
      this.#messageController.node.textContent = message;
      // Keep the hidden field description in sync with the current message.
      if (this.#descNode) {
        this.#descNode.textContent = message;
      }
      this.#badgeController.node.setAttribute('aria-label', badgeLabel);
      this.#tooltipController.node.text = badgeTooltip;
      this.#revertButton.textContent = revert;
    }

    const field = this.#field;
    if (!field) {
      return;
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

    return html`
      <slot name="badge"></slot>
      <slot name="tooltip"></slot>
      <vaadin-popover
        .target="${this.#badgeController.node}"
        role="dialog"
        accessible-name="${this.__effectiveI18n.badgeLabel}"
        .trigger="${POPOVER_TRIGGER}"
        autofocus
        theme="arrow"
        position="end-top"
      >
        <slot name="message"></slot>
        <slot></slot>
        <slot name="actions"></slot>
      </vaadin-popover>
      <slot name="description"></slot>
    `;
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
    if (!('value' in field)) {
      return undefined;
    }
    return this.#valueDelay ? this.#valueDelay.latestValue : field.value;
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

    // TODO uses a fixed 500ms timeout, exactly half of the --ai-marker-slide animation
    this.#valueDelay ??= new DelayedFieldValue(field, 500);
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
      this.#lockedElements = locked.map((element) => ({ element, readonly: element.readonly }));
    }

    field.setAttribute('ai-working', '');
    this.#lockedElements.forEach(({ element }) => {
      element.readonly = true;
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
    if (!field) {
      return;
    }

    if (this.#restoreTimer != null) {
      // Already winding down. Finish it now when the marker is going away, so
      // the restore cannot overwrite a read-only state set after this point.
      if (immediate) {
        this.#restoreLockedElements();
      }
      return;
    }

    if (!this.#lockedElements) {
      return;
    }

    // Stop holding back the field's value assignments. A value the AI already
    // set stays queued so it still lands with the shimmer wind-down, unless the
    // marker is going away, in which case it is applied right away rather than
    // after the marker stopped annotating the field.
    if (immediate) {
      this.#valueDelay.flush();
    } else {
      this.#valueDelay.uninstall();
    }

    field.removeAttribute('ai-working');

    if (immediate) {
      this.#restoreLockedElements();
    } else {
      // TODO uses a fixed 500ms timeout, exactly half of the --ai-marker-slide animation
      this.#restoreTimer = setTimeout(() => this.#restoreLockedElements(), 500);
    }
  }

  /** Restores the read-only state captured when the working state was entered. */
  #restoreLockedElements() {
    clearTimeout(this.#restoreTimer);
    this.#restoreTimer = null;

    const locked = this.#lockedElements;
    this.#lockedElements = null;
    if (locked) {
      locked.forEach(({ element, readonly }) => {
        element.readonly = readonly;
      });
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
    // Focusing the element directly also leaves the focus-ring to the field's
    // own keyboard-vs-pointer detection instead of forcing it on.
    const field = this.#field;
    if (field) {
      const focusTarget = field.focusElement || field.inputElement || field;
      focusTarget.focus();
    }

    const popover = this.shadowRoot.querySelector('vaadin-popover');
    if (popover) {
      popover.opened = false;
    }

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

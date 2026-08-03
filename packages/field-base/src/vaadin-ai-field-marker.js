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
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { generateUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import { aiFieldMarkerHostStyles, aiFieldMarkerStyles } from './styles/vaadin-ai-field-marker-base-styles.js';

const DEFAULT_MESSAGE = 'This field value was modified by AI.';
const DEFAULT_REVERT_TEXT = 'Revert Value';
const DEFAULT_BADGE_LABEL = 'AI-provided value';
const DEFAULT_BADGE_TOOLTIP = 'Field value modified by AI.\nClick for details';

// Application-configurable defaults applied to every subsequently created
// marker, so the texts can be localized once via AiFieldMarker.setDefaults()
// instead of being set on each marker instance. Properties set on an instance
// still take precedence.
const defaults = {
  message: DEFAULT_MESSAGE,
  revertText: DEFAULT_REVERT_TEXT,
  badgeLabel: DEFAULT_BADGE_LABEL,
  badgeTooltip: DEFAULT_BADGE_TOOLTIP,
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

function delayValueSets(field, delay = 500) {
  if (Object.getOwnPropertyDescriptor(field, 'value')) {
    // Already intercepting
    return;
  }

  // Find the original accessor up the prototype chain
  let proto = Object.getPrototypeOf(field);
  let desc;
  while (proto && !(desc = Object.getOwnPropertyDescriptor(proto, 'value'))) {
    proto = Object.getPrototypeOf(proto);
  }

  let timer;
  Object.defineProperty(field, 'value', {
    configurable: true,
    get() {
      return desc.get.call(field);
    },
    set(v) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        delete field.value;
        field.value = v;
      }, delay);
    },
  });
}

/**
 * An element used to annotate a field as AI-filled. Appended as a direct
 * child of the field, it slots itself into the field via a slot injected
 * into the field's shadow root, draws an "AI" badge anchored to the field,
 * and offers a popover that explains the AI fill and lets the user revert
 * the value.
 *
 * The marker manages the annotation through its own lifecycle: adding it to
 * the field marks the field, removing it clears the mark:
 *
 * ```js
 * const marker = document.createElement('vaadin-ai-field-marker');
 * marker.message = 'Filled based on the uploaded document.';
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
 * Custom popover content — shown between the explanation and the revert
 * control — is supplied as an element through the `customContent` property;
 * the marker places it in the DOM. This is the integration point for
 * frameworks (e.g. Flow) that render content as server-side elements.
 *
 * @fires {CustomEvent} ai-field-revert - Fired from the field element when the user activates the revert control. The host restores the value.
 *
 * @customElement vaadin-ai-field-marker
 * @extends HTMLElement
 * @private
 */
export class AiFieldMarker extends DirMixin(PolylitMixin(LitElement)) {
  static get is() {
    return 'vaadin-ai-field-marker';
  }

  static get properties() {
    return {
      /**
       * The message shown in the popover explaining the AI fill.
       */
      message: {
        type: String,
        value: () => defaults.message,
      },

      /**
       * Optional custom content shown in the popover between the message and
       * the actions: an element supplied by the host (e.g. the provenance of
       * an AI-filled value — confidence, source, a source image with the
       * driving region outlined). Rendered as-is; `null` shows nothing.
       */
      customContent: {
        attribute: false,
        value: null,
      },

      /**
       * The label of the revert control.
       */
      revertText: {
        type: String,
        value: () => defaults.revertText,
      },

      /**
       * The accessible label of the badge button and the popover dialog.
       */
      badgeLabel: {
        type: String,
        value: () => defaults.badgeLabel,
      },

      /**
       * The tooltip text of the badge button.
       */
      badgeTooltip: {
        type: String,
        value: () => defaults.badgeTooltip,
      },

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

  /** The input whose `aria-describedby` references the description node. */
  #describedInput = null;

  /** The field value captured for the revert event detail. */
  #capturedValue;

  /**
   * While in the working state, the elements whose client-side `readonly`
   * state was overridden — the field itself and, for a `vaadin-custom-field`,
   * its inputs — with their original values, so leaving the working state can
   * restore them. `null` when not working.
   */
  #lockedElements = null;

  /** Set when the AI-fill announcement should be made on the next update. */
  #announcePending = false;

  constructor() {
    super();
    // Stable badge id: generating it in render() would re-target the tooltip
    // and popover on every re-render.
    this.__badgeId = generateUniqueId();

    // The marker and its popover content live in the field's light DOM, so a
    // click on the badge or inside the popover bubbles to the field host.
    // Fields that open their overlay on any host click (date-picker,
    // multi-select-combo-box) would act on it as if the field itself had been
    // clicked. Keep marker clicks to the marker. The popover and tooltip bind
    // their listeners on the badge, which is a descendant, so they still fire
    // before this bubble-phase listener.
    this.addEventListener('click', (event) => event.stopPropagation());
  }

  /**
   * Sets the texts used by every subsequently created marker, so an
   * application can localize them once instead of setting the properties on
   * each marker. Only the provided keys change; properties set on a marker
   * instance still take precedence over these defaults. Does not
   * retroactively update markers that already exist.
   *
   * @param {{ message?: string, revertText?: string, badgeLabel?: string, badgeTooltip?: string }} newDefaults
   */
  static setDefaults(newDefaults = {}) {
    if (newDefaults.message != null) {
      defaults.message = newDefaults.message;
    }
    if (newDefaults.revertText != null) {
      defaults.revertText = newDefaults.revertText;
    }
    if (newDefaults.badgeLabel != null) {
      defaults.badgeLabel = newDefaults.badgeLabel;
    }
    if (newDefaults.badgeTooltip != null) {
      defaults.badgeTooltip = newDefaults.badgeTooltip;
    }
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
    // connect, and render() must already know the field — committing the
    // `nothing` fallback first and the template later would make Lit clear
    // its part range, taking manually added light-DOM children with it.
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
    // resolves in the input's scope) and append its id to the input's
    // aria-describedby. Appending — rather than using aria-description, which
    // a screen reader ignores when aria-describedby is present — lets the
    // field's own helper/error description and the AI note both get read.
    const input = field.inputElement || field.focusElement;
    if (input) {
      const descNode = document.createElement('span');
      descNode.id = `ai-field-marker-${generateUniqueId()}`;
      descNode.textContent = this.message;
      descNode.style.cssText =
        'position:absolute;width:1px;height:1px;margin:-1px;padding:0;border:0;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;';
      // Insert before Lit's rendered content so the node stays outside the
      // range Lit manages (and may clear) in the light-DOM render root.
      this.insertBefore(descNode, this.firstChild);
      addValuesToAttribute(input, 'aria-describedby', descNode.id);
      this.#descNode = descNode;
      this.#describedInput = input;
    }

    // Capture the AI-filled value so the revert event can carry it.
    this.#capturedValue = 'value' in field ? field.value : undefined;

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
      removeValuesFromAttribute(this.#describedInput, 'aria-describedby', this.#descNode.id);
      this.#descNode.remove();
      this.#descNode = null;
      this.#describedInput = null;
    }

    // Remove the injected slot unless another marker still uses it.
    const markerSlot = field.shadowRoot.querySelector(`slot[name="${MARKER_SLOT}"]`);
    if (markerSlot && !field.querySelector(`:scope > ${AiFieldMarker.is}`)) {
      markerSlot.remove();
    }

    this.#field = null;
  }

  /**
   * @protected
   * @override
   */
  updated(props) {
    super.updated(props);

    const field = this.#field;
    if (!field) {
      return;
    }

    // Keep the hidden field description in sync with the current message.
    if (props.has('message') && this.#descNode) {
      this.#descNode.textContent = this.message;
    }

    if (props.has('working')) {
      if (this.working) {
        this.#startWorking();
      } else if (this.#lockedElements) {
        this.#stopWorking();
        // The fill landed: the marker now annotates the current value, so
        // re-capture it for the revert event and announce the mark again.
        this.#capturedValue = 'value' in field ? field.value : undefined;
        this.#announcePending = true;
      }
    }

    // Announce after the update so the announcement reflects a message set in
    // the same batch as the append or the `working` toggle.
    if (this.#announcePending && !this.working) {
      this.#announcePending = false;
      const { message } = this;
      const { label } = field;
      announce(label ? `${label}: ${message}` : message);
    }
  }

  /** @protected */
  render() {
    if (!this.#field) {
      return nothing;
    }

    const id = this.__badgeId;
    return html`
      <button id="vaadin-ai-marker-${id}" part="badge" type="button" aria-label="${this.badgeLabel}"></button>
      <vaadin-tooltip for="vaadin-ai-marker-${id}" text="${this.badgeTooltip}"></vaadin-tooltip>
      <vaadin-popover
        for="vaadin-ai-marker-${id}"
        role="dialog"
        accessible-name="${this.badgeLabel}"
        .trigger="${POPOVER_TRIGGER}"
        autofocus
        theme="arrow"
        position="end-top"
      >
        <p part="message">${this.message}</p>
        ${this.customContent ? html`<div part="custom-content">${this.customContent}</div>` : nothing}
        <div part="actions">
          <button type="button" part="revert-button" @click="${this.#onRevert}">${this.revertText}</button>
        </div>
      </vaadin-popover>
    `;
  }

  /** @protected */
  createRenderRoot() {
    return this;
  }

  /**
   * Enters the "AI is working" state: shows the shimmer and makes the field
   * read-only on the client so the user cannot edit a value the AI is about
   * to overwrite. Idempotent — keeps the state captured on entry.
   */
  #startWorking() {
    const field = this.#field;
    if (!field || this.#lockedElements) {
      return;
    }

    // TODO uses a fixed 500ms timeout, exactly half of the --ai-marker-slide animation
    delayValueSets(field, 500);

    // vaadin-custom-field does not propagate `readonly` to its inputs, so
    // they are locked (and restored) individually alongside the field.
    const locked = [field, ...(field.localName === 'vaadin-custom-field' ? (field.inputs ?? []) : [])];
    this.#lockedElements = locked.map((element) => ({ element, readonly: element.readonly }));

    field.setAttribute('ai-working', '');
    locked.forEach((element) => {
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
    if (!field || !this.#lockedElements) {
      return;
    }

    field.removeAttribute('ai-working');
    this.#lockedElements.forEach(({ element, readonly }) => {
      if (immediate) {
        element.readonly = readonly;
      } else {
        // TODO uses a fixed 500ms timeout, exactly half of the --ai-marker-slide animation
        setTimeout(() => {
          element.readonly = readonly;
        }, 500);
      }
    });

    this.#lockedElements = null;
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

    const popover = this.querySelector('vaadin-popover');
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

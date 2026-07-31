/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/popover/src/vaadin-popover.js';
import '@vaadin/tooltip/src/vaadin-tooltip.js';
import { html, LitElement } from 'lit';
import { announce } from '@vaadin/a11y-base/src/announce.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { addValueToAttribute, removeValueFromAttribute } from '@vaadin/component-base/src/dom-utils.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { generateUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import { aiFieldMarkerHostStyles, aiFieldMarkerStyles } from './styles/vaadin-ai-field-marker-base-styles.js';

const DEFAULT_MESSAGE = 'This field value was modified by AI.';
const DEFAULT_REVERT_TEXT = 'Revert Value';
const DEFAULT_BADGE_LABEL = 'AI-provided value';
const DEFAULT_BADGE_TOOLTIP = 'Field value modified by AI.\nClick for details';

// Application-configurable defaults applied to every marked field, so the
// texts can be localized once via AiFieldMarker.setDefaults() instead of being
// passed to each mark() call. Per-call options still take precedence.
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
 * Per-field marker bookkeeping, keyed by the field so `mark()` is idempotent
 * and `unmark()` can fully clean up.
 */
const markers = new WeakMap();

/**
 * Fields currently in the "AI is working" state, mapped to the elements whose
 * client-side `readonly` state `startWorking()` overrode — the field itself
 * and, for a `vaadin-custom-field`, its inputs — so `stopWorking()` can
 * restore it.
 */
const workingFields = new WeakMap();

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
 * An element used to annotate a field as AI-filled. It slots itself into the
 * field via a slot injected into the field's shadow root, draws an "AI" badge
 * anchored to the field, and offers a popover that explains the AI fill and
 * lets the user revert the value.
 *
 * Not intended to be used as a standalone tag; use the static
 * `AiFieldMarker.mark()` / `AiFieldMarker.unmark()` API (also reachable from
 * Flow via `customElements.get('vaadin-ai-field-marker')`). While an AI fill
 * is in progress, `AiFieldMarker.startWorking()` / `AiFieldMarker.stopWorking()`
 * toggle an "AI is working" shimmer on the field along with a client-side
 * read-only guard.
 *
 * Custom popover content — shown between the explanation and the revert
 * control — is supplied as an element through the `customContent` option of
 * `mark()`; the marker places it in the DOM. This is the integration point
 * for frameworks (e.g. Flow) that render content as server-side elements.
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
        value: DEFAULT_MESSAGE,
      },

      /**
       * Optional custom content shown in the popover between the message and
       * the actions: an element supplied by the host through `mark()` options
       * (e.g. the provenance of an AI-filled value — confidence, source, a
       * source image with the driving region outlined). Rendered as-is;
       * `null` shows nothing.
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
        value: DEFAULT_REVERT_TEXT,
      },

      /**
       * The accessible label of the badge button and the popover dialog.
       */
      badgeLabel: {
        type: String,
        value: DEFAULT_BADGE_LABEL,
      },

      /**
       * The tooltip text of the badge button.
       */
      badgeTooltip: {
        type: String,
        value: DEFAULT_BADGE_TOOLTIP,
      },
    };
  }

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

  /** @protected */
  render() {
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
        ${this.customContent ? html`<div part="custom-content">${this.customContent}</div>` : null}
        <div part="actions">
          <button type="button" part="revert-button" @click="${this._onRevert}">${this.revertText}</button>
        </div>
      </vaadin-popover>
    `;
  }

  createRenderRoot() {
    return this;
  }

  /** @private */
  _onRevert() {
    // Return focus to the field before closing the popover. The popover targets
    // the badge for focus restoration, but `unmark()` removes the badge on
    // revert, which would drop focus to the body. Moving focus to the field
    // first makes the overlay skip its own restore — it only restores while
    // focus is still inside the overlay (see OverlayFocusMixin._shouldRestoreFocus).
    //
    // Focus the field's own focusable element rather than calling focus() on
    // the host: a host focus() can carry component-specific semantics that a
    // revert must not trigger — date-picker opens its overlay on focus while
    // it has no usable text input (fullscreen, iOS, or no i18n.parseDate).
    // Focusing the element directly also leaves the focus-ring to the field's
    // own keyboard-vs-pointer detection instead of forcing it on.
    if (this._field) {
      const focusTarget = this._field.focusElement || this._field.inputElement || this._field;
      focusTarget.focus();
    }

    const popover = this.querySelector('vaadin-popover');
    if (popover) {
      popover.opened = false;
    }

    if (this._field) {
      this._field.dispatchEvent(
        new CustomEvent('ai-field-revert', {
          bubbles: true,
          composed: true,
          detail: { value: this._capturedValue },
        }),
      );
    }
  }

  /**
   * Sets the texts used by every subsequently marked field, so an application
   * can localize them once instead of passing options to each {@link mark}
   * call. Only the provided keys change; per-call {@link mark} options still
   * take precedence over these defaults. Does not retroactively update fields
   * that are already marked.
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
   * Marks the given field as AI-filled: injects the highlight + badge + popover
   * into the field's shadow root, announces the change to screen readers, and
   * associates the explanation with the field's input. Idempotent — repeated
   * calls reuse the existing marker and only refresh its content.
   *
   * Texts default to those set via {@link setDefaults} (English out of the
   * box); pass `options` to override them for this field only.
   *
   * @param {HTMLElement} field the field to mark
   * @param {{ message?: string, customContent?: HTMLElement, revertText?: string, badgeLabel?: string, badgeTooltip?: string }} [options]
   * @return {AiFieldMarker | null} the marker instance, or `null` when the field has no shadow root
   */
  static mark(field, options = {}) {
    if (!field || !field.shadowRoot) {
      return null;
    }

    adoptMarkerStyles(field);

    let entry = markers.get(field);
    if (!entry) {
      // Create a new slot for the marker element inside the field's own shadow root.
      const markerSlot = document.createElement('slot');
      markerSlot.setAttribute('name', MARKER_SLOT);
      field.shadowRoot.appendChild(markerSlot);

      // Create the marker element and place it in the marker slot.
      const marker = document.createElement(AiFieldMarker.is);
      marker._field = field;
      marker.slot = MARKER_SLOT;
      field.appendChild(marker);

      // Add a hidden description node in the field's light DOM (so its id
      // resolves in the input's scope) and append its id to the input's
      // aria-describedby. Appending — rather than using aria-description, which
      // a screen reader ignores when aria-describedby is present — lets the
      // field's own helper/error description and the AI note both get read.
      const input = field.inputElement || field.focusElement;
      let descNode = null;
      if (input) {
        descNode = document.createElement('span');
        descNode.id = `ai-field-marker-${generateUniqueId()}`;
        descNode.style.cssText =
          'position:absolute;width:1px;height:1px;margin:-1px;padding:0;border:0;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;';
        marker.appendChild(descNode);
        addValueToAttribute(input, 'aria-describedby', descNode.id);
      }

      entry = { marker, input, markerSlot, descNode };
      markers.set(field, entry);
    }

    const { marker } = entry;

    // Per-call options win over the application-configured defaults.
    marker.message = options.message ?? defaults.message;
    marker.revertText = options.revertText ?? defaults.revertText;
    marker.badgeLabel = options.badgeLabel ?? defaults.badgeLabel;
    marker.badgeTooltip = options.badgeTooltip ?? defaults.badgeTooltip;
    // No stored default for customContent — a re-mark without it clears the
    // previous value, so the popover never shows content that described an
    // earlier fill of the field.
    marker.customContent = options.customContent ?? null;

    // Capture the AI-filled value so the revert event can carry it.
    marker._capturedValue = 'value' in field ? field.value : undefined;

    // Announce to screen readers that the field was filled by AI.
    const { message } = marker;
    const { label } = field;
    announce(label ? `${label}: ${message}` : message);

    // Keep the hidden field description in sync with the current message.
    if (entry.descNode) {
      entry.descNode.textContent = message;
    }

    return marker;
  }

  /**
   * Removes the AI-filled annotation previously added by {@link AiFieldMarker.mark}.
   * A no-op when the field is not marked.
   *
   * @param {HTMLElement} field the field to clear
   */
  static unmark(field) {
    const entry = field && markers.get(field);
    if (!entry) {
      return;
    }

    const { marker, input, descNode, markerSlot } = entry;

    if (input && descNode) {
      removeValueFromAttribute(input, 'aria-describedby', descNode.id);
    }

    if (markerSlot) {
      markerSlot.remove();
    }

    marker.remove();

    markers.delete(field);
  }

  /**
   * Marks the field as being worked on by an AI: shows the "AI is working"
   * shimmer and makes the field read-only on the client so the user cannot
   * edit a value the AI is about to overwrite. Only the client-side
   * `readonly` state is touched; {@link AiFieldMarker.stopWorking} restores
   * it. Idempotent — repeated calls keep the state captured by the first
   * call. A no-op when the field has no shadow root.
   *
   * Hides an existing mark for the duration, since the value it annotates is
   * about to be replaced. {@link AiFieldMarker.stopWorking} brings it back, so
   * a cancelled or failed fill leaves the previous mark intact; call
   * {@link AiFieldMarker.mark} again to describe a new value.
   *
   * @param {HTMLElement} field the field the AI is working on
   */
  static startWorking(field) {
    if (!field || !field.shadowRoot || workingFields.has(field)) {
      return;
    }

    adoptMarkerStyles(field);

    // TODO uses a fixed 500ms timeout, exactly half of the --ai-marker-slide animation
    delayValueSets(field, 500);

    // vaadin-custom-field does not propagate `readonly` to its inputs, so
    // they are locked (and restored) individually alongside the field.
    const locked = [field, ...(field.localName === 'vaadin-custom-field' ? (field.inputs ?? []) : [])];
    workingFields.set(
      field,
      locked.map((element) => ({ element, readonly: element.readonly })),
    );

    field.setAttribute('ai-working', '');
    locked.forEach((element) => {
      element.readonly = true;
    });
  }

  /**
   * Clears the "AI is working" state set by {@link AiFieldMarker.startWorking}:
   * removes the shimmer and restores the field's previous client-side
   * read-only state. A no-op when the field is not in the working state.
   *
   * @param {HTMLElement} field the field to release
   */
  static stopWorking(field) {
    const entry = field && workingFields.get(field);
    if (!entry) {
      return;
    }

    field.removeAttribute('ai-working');
    entry.forEach(({ element, readonly }) => {
      // TODO uses a fixed 500ms timeout, exactly half of the --ai-marker-slide animation
      setTimeout(() => {
        element.readonly = readonly;
      }, 500);
    });
    // });

    workingFields.delete(field);
  }
}

defineCustomElement(AiFieldMarker);

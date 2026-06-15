/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/popover/src/vaadin-popover.js';
import { html, LitElement } from 'lit';
import { announce } from '@vaadin/a11y-base/src/announce.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { addValueToAttribute, removeValueFromAttribute } from '@vaadin/component-base/src/dom-utils.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { generateUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { aiFieldMarkerHostStyles, aiFieldMarkerStyles } from './styles/vaadin-ai-field-marker-base-styles.js';

const DEFAULT_MESSAGE = 'This value was filled in by an AI based on the input you provided';
const DEFAULT_REVERT_TEXT = 'Revert';
const DEFAULT_BADGE_LABEL = 'Filled in by AI';

// Application-configurable defaults applied to every marked field, so the
// texts can be localized once via AiFieldMarker.setDefaults() instead of being
// passed to each mark() call. Per-call options still take precedence.
const defaults = {
  message: DEFAULT_MESSAGE,
  revertText: DEFAULT_REVERT_TEXT,
  badgeLabel: DEFAULT_BADGE_LABEL,
};

const POPOVER_TRIGGER = ['click'];

// Name of the slot injected into the field's shadow root to render the hidden
// description node referenced by the input's aria-describedby.
const DESCRIPTION_SLOT = 'ai-field-marker-description';

// Name of the slot used to forward custom popover content. Set it on a field
// child (`slot="ai-field-marker-popover-content"`) to place content in the popover.
const POPOVER_CONTENT_SLOT = 'ai-field-marker-popover-content';

/**
 * Per-field marker bookkeeping, keyed by the field so `mark()` is idempotent
 * and `unmark()` can fully clean up.
 */
const markers = new WeakMap();

/**
 * An element used to annotate a field as AI-filled. It injects itself into the
 * field's shadow root, draws an "AI" badge anchored to the field, and offers a
 * popover that explains the AI fill and lets the user revert the value.
 *
 * Not intended to be used as a standalone tag; use the static
 * `AiFieldMarker.mark()` / `AiFieldMarker.unmark()` API (also reachable from
 * Flow via `customElements.get('vaadin-ai-field-marker')`).
 *
 * Custom popover content can be supplied by slotting an element on the FIELD
 * with `slot="ai-field-marker-popover-content"`; the marker forwards it into the
 * popover. This is the integration point for frameworks (e.g. Flow) that render
 * content as server-side elements in the field's light DOM.
 *
 * @fires {CustomEvent} ai-field-revert - Fired from the field element when the user activates the revert control. The host restores the value.
 *
 * @customElement vaadin-ai-field-marker
 * @extends HTMLElement
 * @private
 */
export class AiFieldMarker extends ThemableMixin(DirMixin(PolylitMixin(LumoInjectionMixin(LitElement)))) {
  static get is() {
    return 'vaadin-ai-field-marker';
  }

  static get styles() {
    return aiFieldMarkerStyles;
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
       * Optional extra text shown in the popover below the message.
       */
      additionalContent: {
        type: String,
        value: '',
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
    };
  }

  /** @protected */
  render() {
    return html`
      <button id="badge" part="badge" type="button" aria-label="${this.badgeLabel}">AI</button>
      <vaadin-popover
        for="badge"
        role="dialog"
        accessible-name="${this.badgeLabel}"
        .trigger="${POPOVER_TRIGGER}"
        autofocus
      >
        <div part="content">
          <p part="message">${this.message}</p>
          ${this.additionalContent ? html`<div part="additional-content">${this.additionalContent}</div>` : null}
          <slot name="${POPOVER_CONTENT_SLOT}"></slot>
          <div part="actions">
            <button type="button" part="revert-button" @click="${this._onRevert}">${this.revertText}</button>
          </div>
        </div>
      </vaadin-popover>
    `;
  }

  /** @private */
  _onRevert() {
    const popover = this.shadowRoot.querySelector('vaadin-popover');
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
   * @param {{ message?: string, revertText?: string, badgeLabel?: string }} newDefaults
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
   * @param {{ message?: string, additionalContent?: string, revertText?: string, badgeLabel?: string }} [options]
   * @return {AiFieldMarker | null} the marker instance, or `null` when the field has no shadow root
   */
  static mark(field, options = {}) {
    if (!field || !field.shadowRoot) {
      return null;
    }

    let entry = markers.get(field);
    if (!entry) {
      // Establish a positioning context for the absolutely-positioned marker,
      // unless the field already sets one inline.
      const hadInlinePosition = Boolean(field.style.position);
      if (!hadInlinePosition) {
        field.style.position = 'relative';
      }

      // Inject the host highlight styles into the field's own shadow root.
      const style = document.createElement('style');
      style.setAttribute('data-ai-field-marker', '');
      style.textContent = aiFieldMarkerHostStyles.cssText;
      field.shadowRoot.appendChild(style);

      const marker = document.createElement(AiFieldMarker.is);
      marker._field = field;
      field.shadowRoot.appendChild(marker);

      // Forward custom popover content from the field's light DOM into the
      // popover. The content (e.g. a Flow component) is slotted on the FIELD —
      // the only element a server-side framework controls — as
      // `slot="ai-field-marker-popover-content"`. This nested slot, a light child
      // of the marker, captures those field children and re-projects them into
      // the marker's own slot inside the popover.
      const contentSlot = document.createElement('slot');
      contentSlot.setAttribute('name', POPOVER_CONTENT_SLOT);
      contentSlot.setAttribute('slot', POPOVER_CONTENT_SLOT);
      marker.appendChild(contentSlot);

      // Add a hidden description node in the field's light DOM (so its id
      // resolves in the input's scope) and append its id to the input's
      // aria-describedby. Appending — rather than using aria-description, which
      // a screen reader ignores when aria-describedby is present — lets the
      // field's own helper/error description and the AI note both get read.
      const input = field.inputElement || field.focusElement;
      let descNode = null;
      let descSlot = null;
      if (input) {
        // Inject a slot so the description is actually rendered (assigned to a
        // slot) rather than left as unslotted, unrendered light DOM. The slot
        // must live in the FIELD's shadow root — not the marker's — because the
        // node has to stay in the field's light DOM for the input's
        // aria-describedby id to resolve in the same scope.
        descSlot = document.createElement('slot');
        descSlot.setAttribute('name', DESCRIPTION_SLOT);
        field.shadowRoot.appendChild(descSlot);

        descNode = document.createElement('span');
        descNode.id = `ai-field-marker-${generateUniqueId()}`;
        descNode.slot = DESCRIPTION_SLOT;
        descNode.style.cssText =
          'position:absolute;width:1px;height:1px;margin:-1px;padding:0;border:0;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;';
        field.appendChild(descNode);
        addValueToAttribute(input, 'aria-describedby', descNode.id);
      }

      entry = { marker, style, hadInlinePosition, input, descNode, descSlot };
      markers.set(field, entry);
    }

    const { marker } = entry;

    // Per-call options win over the application-configured defaults.
    marker.message = options.message ?? defaults.message;
    marker.revertText = options.revertText ?? defaults.revertText;
    marker.badgeLabel = options.badgeLabel ?? defaults.badgeLabel;
    if (options.additionalContent != null) {
      marker.additionalContent = options.additionalContent;
    }

    // Capture the AI-filled value so the revert event can carry it.
    marker._capturedValue = 'value' in field ? field.value : undefined;

    // Activate the injected host highlight.
    field.toggleAttribute('has-ai-marker', true);

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

    const { marker, style, input, descNode, descSlot, hadInlinePosition } = entry;

    field.toggleAttribute('has-ai-marker', false);

    if (input && descNode) {
      removeValueFromAttribute(input, 'aria-describedby', descNode.id);
    }
    if (descNode) {
      descNode.remove();
    }
    if (descSlot) {
      descSlot.remove();
    }

    marker.remove();
    style.remove();

    if (!hadInlinePosition) {
      field.style.position = '';
    }

    markers.delete(field);
  }
}

defineCustomElement(AiFieldMarker);

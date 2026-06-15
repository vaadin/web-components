/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Options accepted by {@link AiFieldMarker.mark}.
 */
export interface AiFieldMarkerOptions {
  /**
   * The message shown in the popover explaining the AI fill. Defaults to a
   * built-in English string; override for i18n.
   */
  message?: string;

  /**
   * Optional extra text shown in the popover below the message.
   */
  additionalContent?: string;

  /**
   * The label of the revert control. Defaults to `Revert`.
   */
  revertText?: string;

  /**
   * The accessible label of the badge button and the popover dialog. Defaults
   * to `Filled in by AI`.
   */
  badgeLabel?: string;
}

/**
 * Fired from the field element when the user activates the revert control.
 * The host is expected to restore the field's previous value.
 */
export type AiFieldRevertEvent = CustomEvent<{ value: unknown }>;

declare global {
  interface HTMLElementEventMap {
    'ai-field-revert': AiFieldRevertEvent;
  }
}

/**
 * An element that annotates a field as AI-filled. It injects itself into the
 * field's shadow root, draws an "AI" badge anchored to the field, and offers a
 * popover that explains the AI fill and lets the user revert the value.
 *
 * Not intended to be used as a standalone tag; use the static `mark()` /
 * `unmark()` API.
 */
declare class AiFieldMarker extends HTMLElement {
  /**
   * The message shown in the popover explaining the AI fill.
   */
  message: string;

  /**
   * Optional extra text shown in the popover below the message.
   */
  additionalContent: string;

  /**
   * The label of the revert control.
   */
  revertText: string;

  /**
   * The accessible label of the badge button and the popover dialog.
   */
  badgeLabel: string;

  /**
   * Marks the given field as AI-filled.
   *
   * @param field the field to mark
   * @param options optional content overrides
   * @returns the marker instance, or `null` when the field has no shadow root
   */
  static mark(field: HTMLElement, options?: AiFieldMarkerOptions): AiFieldMarker | null;

  /**
   * Removes the AI-filled annotation previously added by `mark`. A no-op when
   * the field is not marked.
   *
   * @param field the field to clear
   */
  static unmark(field: HTMLElement): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-ai-field-marker': AiFieldMarker;
  }
}

export { AiFieldMarker };

/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { I18nMixin } from '@vaadin/component-base/src/i18n-mixin.js';

export interface AiFieldMarkerI18n {
  /**
   * The message shown in the popover explaining the AI fill.
   */
  message?: string;

  /**
   * The label of the revert control.
   */
  revert?: string;

  /**
   * The accessible label of the badge button and the popover dialog.
   */
  badgeLabel?: string;

  /**
   * The tooltip text of the badge button.
   */
  badgeTooltip?: string;
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
 * An element that annotates a field as AI-filled. Appended as a direct child
 * of the field, it slots itself into the field via a slot injected into the
 * field's shadow root, draws an "AI" badge anchored to the field, and offers
 * a popover that explains the AI fill and lets the user revert the value.
 *
 * The marker manages the annotation through its own lifecycle: adding it to
 * the field marks the field, removing it clears the mark. While an AI fill is
 * in progress, set the `working` property to show an "AI is working" shimmer
 * on the field along with a client-side read-only guard.
 *
 * Custom popover content — shown between the explanation and the revert
 * control — is provided through the default slot: content appended to the
 * marker is slotted into the popover. This is the integration point for
 * frameworks (e.g. Flow) that render content as server-side elements.
 */
declare class AiFieldMarker extends I18nMixin<typeof HTMLElement, AiFieldMarkerI18n>(HTMLElement) {
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
   */
  i18n: AiFieldMarkerI18n;

  /**
   * Whether an AI is currently working on the field. While `true`, the field
   * shows an "AI is working" shimmer and is made read-only on the client so
   * the user cannot edit a value the AI is about to overwrite; only the
   * client-side `readonly` state is touched, and setting the property back to
   * `false` restores it. The marker badge is hidden for the duration, since
   * the value it annotates is about to be replaced.
   */
  working: boolean;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-ai-field-marker': AiFieldMarker;
  }
}

export { AiFieldMarker };

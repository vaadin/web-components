/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { I18nMixin } from '@vaadin/component-base/src/i18n-mixin.js';

/**
 * Localization texts for {@link AiFieldMarker}.
 */
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

  /**
   * The texts of the confidence indicator.
   */
  confidence?: {
    low?: string;
    medium?: string;
    high?: string;
  };
}

/**
 * Fired from the field element when the user activates the revert control.
 * The host is expected to restore the field's previous value.
 *
 * The event bubbles from the field rather than from the marker, so it is not
 * declared on a listener map: listen for it on the field or a container, and
 * annotate the listener with this type.
 */
export type AiFieldRevertEvent = CustomEvent<{ value: unknown }>;

/**
 * An element used internally by Vaadin. Not intended to be used separately.
 *
 * Annotates a field as AI-filled: appended as a direct child of the field,
 * it slots itself into the field via a slot injected into the field's shadow
 * root, draws an "AI" badge anchored to the field, and offers a popover that
 * explains the AI fill and lets the user revert the value.
 *
 * The marker manages the annotation through its own lifecycle: adding it to
 * the field marks the field, removing it clears the mark. While an AI fill is
 * in progress, set the `working` property to show an "AI is working" shimmer
 * on the field along with a client-side read-only guard.
 *
 * Set the `confidence` property to show the confidence level of the filled
 * value (`low`, `medium` or `high`) as an indicator in the field's helper
 * text section, ahead of a helper the field itself may have. While the
 * indicator is shown, the field is marked with `has-helper`, so that the
 * helper text section is laid out the same as for a helper of its own.
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
   *   badgeTooltip: 'Field value modified by AI.\nClick for details',
   *   // The texts of the confidence indicator.
   *   confidence: {
   *     low: 'Low confidence',
   *     medium: 'Medium confidence',
   *     high: 'High confidence'
   *   }
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
   * the value it annotates is about to be replaced. For assistive technology,
   * the field is marked with `aria-busy`.
   */
  working: boolean;

  /**
   * The confidence level of the AI-filled value, shown as an indicator
   * in the field's helper text section. Possible values are `low`,
   * `medium` and `high`; when not set, no indicator is shown. The
   * indicator texts can be localized with the `i18n` property.
   */
  confidence: 'high' | 'low' | 'medium' | null;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-ai-field-marker': AiFieldMarker;
  }
}

export { AiFieldMarker };

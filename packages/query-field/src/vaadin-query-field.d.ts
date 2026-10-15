/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { QueryFieldMixin, type QueryFieldQuery } from './vaadin-query-field-mixin.js';

export * from './vaadin-query-field-mixin.js';

/**
 * Fired when the user commits a value change.
 */
export type QueryFieldChangeEvent = Event & {
  target: QueryField;
};

/**
 * Fired when the `invalid` property changes.
 */
export type QueryFieldInvalidChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `value` property changes.
 */
export type QueryFieldValueChangedEvent = CustomEvent<{ value: string }>;

/**
 * Fired when the `query` property changes.
 */
export type QueryFieldQueryChangedEvent = CustomEvent<{ value: QueryFieldQuery }>;

/**
 * Fired whenever the field is validated.
 */
export type QueryFieldValidatedEvent = CustomEvent<{ valid: boolean }>;

export interface QueryFieldCustomEventMap {
  'invalid-changed': QueryFieldInvalidChangedEvent;

  'query-changed': QueryFieldQueryChangedEvent;

  'value-changed': QueryFieldValueChangedEvent;

  validated: QueryFieldValidatedEvent;
}

export interface QueryFieldEventMap extends HTMLElementEventMap, QueryFieldCustomEventMap {
  change: QueryFieldChangeEvent;
}

/**
 * `<vaadin-query-field>` is a text input for search and filter queries that mixes
 * free text with structured `name:value` filters. Filters are highlighted, validated
 * and autocompleted while typing, and the parsed query is available in `query`.
 *
 * ```html
 * <vaadin-query-field label="Search records"></vaadin-query-field>
 * ```
 *
 * ```js
 * field.filters = [
 *   { name: 'label', label: 'Record label', options: ['Warp Records', 'Ninja Tune'] },
 *   { name: 'year', label: 'Release year', type: 'number' },
 * ];
 * field.value = 'label:"Warp Records" year:2001 ambient';
 * // field.query → { text: 'ambient', filters: [{ name: 'label', value: 'Warp Records' }, { name: 'year', value: '2001' }] }
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name            | Description
 * ---------------------|----------------
 * `label`              | The label element
 * `input-field`        | The element that wraps prefix, value and suffix
 * `field-button`       | Set on the clear button
 * `clear-button`       | The clear button
 * `error-message`      | The error message element
 * `helper-text`        | The helper text element wrapper
 * `required-indicator` | The `required` state indicator element
 * `overlay`            | The suggestions overlay container
 * `content`            | The suggestions overlay content
 * `token`              | A recognized filter token in the value, e.g. `year:2001`
 * `token-name`         | The `name:` part of a filter token
 * `token-value`        | The value part of a filter token
 * `invalid-token`      | A filter token that is invalid, set when the caret is not inside it
 * `filter-{name}`      | A filter token of the filter with the given name, e.g. `filter-year`
 *
 * Only styles that do not change the text metrics (colors, backgrounds, `text-decoration`, `box-shadow`, `border-radius`)
 * can be applied to the token parts, otherwise the highlights are not aligned with the text. *
 * The following state attributes are available for styling:
 *
 * Attribute            | Description
 * ---------------------|---------------------------------
 * `disabled`           | Set when the element is disabled
 * `has-value`          | Set when the element has a value
 * `has-label`          | Set when the element has a label
 * `has-helper`         | Set when the element has helper text or slot
 * `has-error-message`  | Set when the element has an error message
 * `has-tooltip`        | Set when the element has a slotted tooltip
 * `invalid`            | Set when the element is invalid
 * `focused`            | Set when the element is focused
 * `focus-ring`         | Set when the element is keyboard focused
 * `readonly`           | Set when the element is readonly
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                                |
 * :--------------------------------------------------|
 * | `--vaadin-query-field-invalid-token-color`       |
 * | `--vaadin-query-field-overlay-max-height`        |
 * | `--vaadin-query-field-overlay-min-width`         |
 * | `--vaadin-query-field-selection-background`      |
 * | `--vaadin-query-field-token-background`          |
 * | `--vaadin-query-field-token-border-radius`       |
 * | `--vaadin-query-field-token-name-color`          |
 * | `--vaadin-query-field-token-value-color`         |
 * | `--vaadin-field-default-width`                   |
 * | `--vaadin-input-field-background`                |
 * | `--vaadin-input-field-border-color`              |
 * | `--vaadin-input-field-border-radius`             |
 * | `--vaadin-input-field-border-width`              |
 * | `--vaadin-input-field-bottom-end-radius`         |
 * | `--vaadin-input-field-bottom-start-radius`       |
 * | `--vaadin-input-field-button-text-color`         |
 * | `--vaadin-input-field-container-gap`             |
 * | `--vaadin-input-field-disabled-background`       |
 * | `--vaadin-input-field-disabled-text-color`       |
 * | `--vaadin-input-field-error-color`               |
 * | `--vaadin-input-field-error-font-size`           |
 * | `--vaadin-input-field-error-font-weight`         |
 * | `--vaadin-input-field-error-line-height`         |
 * | `--vaadin-input-field-gap`                       |
 * | `--vaadin-input-field-height`                    |
 * | `--vaadin-input-field-helper-color`              |
 * | `--vaadin-input-field-helper-font-size`          |
 * | `--vaadin-input-field-helper-font-weight`        |
 * | `--vaadin-input-field-helper-line-height`        |
 * | `--vaadin-input-field-label-aside-gap`           |
 * | `--vaadin-input-field-label-aside-text-align`    |
 * | `--vaadin-input-field-label-aside-width`         |
 * | `--vaadin-input-field-label-color`               |
 * | `--vaadin-input-field-label-font-size`           |
 * | `--vaadin-input-field-label-font-weight`         |
 * | `--vaadin-input-field-label-line-height`         |
 * | `--vaadin-input-field-padding`                   |
 * | `--vaadin-input-field-placeholder-color`         |
 * | `--vaadin-input-field-required-indicator`        |
 * | `--vaadin-input-field-required-indicator-color`  |
 * | `--vaadin-input-field-top-end-radius`            |
 * | `--vaadin-input-field-top-start-radius`          |
 * | `--vaadin-input-field-value-color`               |
 * | `--vaadin-input-field-value-font-size`           |
 * | `--vaadin-input-field-value-font-weight`         |
 * | `--vaadin-input-field-value-line-height`         |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {Event} input - Fired when the value is changed by the user: on every typing keystroke, and the value is cleared using the clear button.
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} query-changed - Fired when the `query` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 * @fires {CustomEvent} validated - Fired whenever the field is validated.

 */
declare class QueryField extends QueryFieldMixin(ElementMixin(HTMLElement)) {
  addEventListener<K extends keyof QueryFieldEventMap>(
    type: K,
    listener: (this: QueryField, ev: QueryFieldEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof QueryFieldEventMap>(
    type: K,
    listener: (this: QueryField, ev: QueryFieldEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-query-field': QueryField;
  }
}

export { QueryField };

/**
 * @license
 * Copyright (c) 2018 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DisabledMixin } from '@vaadin/component-base/src/disabled-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { FocusMixin } from '@vaadin/component-base/src/focus-mixin.js';
import { FieldMixin } from '@vaadin/field-base/src/field-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * Fired when the `invalid` property changes.
 */
export type CheckboxGroupInvalidChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `value` property changes.
 */
export type CheckboxGroupValueChangedEvent = CustomEvent<{ value: Array<string> }>;

export interface CheckboxGroupCustomEventMap {
  'invalid-changed': CheckboxGroupInvalidChangedEvent;

  'value-changed': CheckboxGroupValueChangedEvent;
}

export interface CheckboxGroupEventMap extends HTMLElementEventMap, CheckboxGroupCustomEventMap {}

/**
 * `<vaadin-checkbox-group>` is a web component that allows the user to choose several items from a group of binary choices.
 *
 * ```html
 * <vaadin-checkbox-group label="Preferred language of contact:">
 *   <vaadin-checkbox value="en" label="English"></vaadin-checkbox>
 *   <vaadin-checkbox value="fr" label="Français"></vaadin-checkbox>
 *   <vaadin-checkbox value="de" label="Deutsch"></vaadin-checkbox>
 * </vaadin-checkbox-group>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name            | Description
 * ---------------------|----------------
 * `label`              | The slotted label element wrapper
 * `group-field`        | The checkbox elements wrapper
 * `helper-text`        | The slotted helper text element wrapper
 * `error-message`      | The slotted error message element wrapper
 * `required-indicator` | The `required` state indicator element
 *
 * The following state attributes are available for styling:
 *
 * Attribute           | Description                               | Part name
 * --------------------|-------------------------------------------|------------
 * `disabled`          | Set when the element is disabled          | :host
 * `invalid`           | Set when the element is invalid           | :host
 * `focused`           | Set when the element is focused           | :host
 * `has-label`         | Set when the element has a label          | :host
 * `has-value`         | Set when the element has a value          | :host
 * `has-helper`        | Set when the element has helper text      | :host
 * `has-error-message` | Set when the element has an error message | :host
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 */
declare class CheckboxGroup extends FieldMixin(FocusMixin(DisabledMixin(ElementMixin(ThemableMixin(HTMLElement))))) {
  /**
   * The value of the checkbox group.
   * Note: toggling the checkboxes modifies the value by creating new
   * array each time, to override Polymer dirty-checking for arrays.
   * You can still use Polymer array mutation methods to update the value.
   */
  value: string[];

  addEventListener<K extends keyof CheckboxGroupEventMap>(
    type: K,
    listener: (this: CheckboxGroup, ev: CheckboxGroupEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof CheckboxGroupEventMap>(
    type: K,
    listener: (this: CheckboxGroup, ev: CheckboxGroupEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-checkbox-group': CheckboxGroup;
  }
}

export { CheckboxGroup };

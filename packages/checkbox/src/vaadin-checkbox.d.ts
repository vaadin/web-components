/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { CheckboxMixin } from './vaadin-checkbox-mixin.js';

/**
 * Fired when the checkbox is checked or unchecked by the user.
 */
export type CheckboxChangeEvent = Event & {
  target: Checkbox;
};

/**
 * Fired when the `checked` property changes.
 */
export type CheckboxCheckedChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `indeterminate` property changes.
 */
export type CheckboxIndeterminateChangedEvent = CustomEvent<{ value: boolean }>;

export interface CheckboxCustomEventMap {
  'checked-changed': CheckboxCheckedChangedEvent;

  'indeterminate-changed': CheckboxIndeterminateChangedEvent;
}

export interface CheckboxEventMap extends HTMLElementEventMap, CheckboxCustomEventMap {
  change: CheckboxChangeEvent;
}

/**
 * `<vaadin-checkbox>` is an input field representing a binary choice.
 *
 * ```html
 * <vaadin-checkbox label="I accept the terms and conditions"></vaadin-checkbox>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name   | Description
 * ------------|-------------
 * `checkbox`  | The element representing a stylable custom checkbox.
 *
 * The following state attributes are available for styling:
 *
 * Attribute       | Description
 * ----------------|-------------
 * `active`        | Set when the checkbox is activated with mouse, touch or the keyboard.
 * `checked`       | Set when the checkbox is checked.
 * `disabled`      | Set when the checkbox is disabled.
 * `focus-ring`    | Set when the checkbox is focused using the keyboard.
 * `focused`       | Set when the checkbox is focused.
 * `indeterminate` | Set when the checkbox is in the indeterminate state.
 * `has-label`     | Set when the checkbox has a label.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {Event} change - Fired when the checkbox is checked or unchecked by the user.
 * @fires {CustomEvent} checked-changed - Fired when the `checked` property changes.
 * @fires {CustomEvent} indeterminate-changed - Fired when the `indeterminate` property changes.
 */
declare class Checkbox extends CheckboxMixin(ElementMixin(ThemableMixin(HTMLElement))) {
  addEventListener<K extends keyof CheckboxEventMap>(
    type: K,
    listener: (this: Checkbox, ev: CheckboxEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof CheckboxEventMap>(
    type: K,
    listener: (this: Checkbox, ev: CheckboxEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-checkbox': Checkbox;
  }
}

export { Checkbox };

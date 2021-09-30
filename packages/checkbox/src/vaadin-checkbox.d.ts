/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ActiveMixin } from '@vaadin/component-base/src/active-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { CheckedMixin } from '@vaadin/field-base/src/checked-mixin.js';
import { DelegateFocusMixin } from '@vaadin/field-base/src/delegate-focus-mixin.js';
import { SlotLabelMixin } from '@vaadin/field-base/src/slot-label-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

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

export interface CheckboxEventMap extends HTMLElementEventMap, CheckboxCustomEventMap {}

/**
 * `<vaadin-checkbox>` is an input field representing a binary choice.
 *
 * ```html
 * <vaadin-checkbox>I accept the terms and conditions</vaadin-checkbox>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name   | Description
 * ------------|----------------
 * `container` | The container element
 * `checkbox`  | The wrapper element that contains slotted `<input type="checkbox">`
 * `label`     | The wrapper element that contains slotted `<label>`
 *
 * The following state attributes are available for styling:
 *
 * Attribute       | Description | Part name
 * ----------------|-------------|--------------
 * `active`        | Set when the checkbox is pressed down, either with mouse, touch or the keyboard. | `:host`
 * `disabled`      | Set when the checkbox is disabled. | `:host`
 * `focus-ring`    | Set when the checkbox is focused using the keyboard. | `:host`
 * `focused`       | Set when the checkbox is focused. | `:host`
 * `indeterminate` | Set when the checkbox is in the indeterminate state. | `:host`
 * `checked`       | Set when the checkbox is checked. | `:host`
 * `has-label`     | Set when the checkbox has a label. | `:host`
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {CustomEvent} checked-changed - Fired when the `checked` property changes.
 * @fires {CustomEvent} indeterminate-changed - Fired when the `indeterminate` property changes.
 */
declare class Checkbox extends SlotLabelMixin(
  CheckedMixin(DelegateFocusMixin(ActiveMixin(ElementMixin(ThemableMixin(HTMLElement)))))
) {
  /**
   * True if the checkbox is in the indeterminate state which means
   * it is not possible to say whether it is checked or unchecked.
   * The state is reset once the user switches the checkbox by hand.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#Indeterminate_state_checkboxes
   */
  indeterminate: boolean;

  /**
   * The name of the checkbox.
   */
  name: string;

  addEventListener<K extends keyof CheckboxEventMap>(
    type: K,
    listener: (this: Checkbox, ev: CheckboxEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof CheckboxEventMap>(
    type: K,
    listener: (this: Checkbox, ev: CheckboxEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-checkbox': Checkbox;
  }
}

export { Checkbox };

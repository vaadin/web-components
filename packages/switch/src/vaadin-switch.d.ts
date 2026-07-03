/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { CheckboxMixin } from '@vaadin/checkbox/src/vaadin-checkbox-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';

/**
 * Fired when the user flips the switch.
 */
export type SwitchChangeEvent = Event & {
  target: Switch;
};

/**
 * Fired when the `checked` property changes.
 */
export type SwitchCheckedChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `invalid` property changes.
 */
export type SwitchInvalidChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired whenever the switch is validated.
 */
export type SwitchValidatedEvent = CustomEvent<{ valid: boolean }>;

export interface SwitchCustomEventMap {
  'checked-changed': SwitchCheckedChangedEvent;

  'invalid-changed': SwitchInvalidChangedEvent;

  validated: SwitchValidatedEvent;
}

export interface SwitchEventMap extends HTMLElementEventMap, SwitchCustomEventMap {
  change: SwitchChangeEvent;
}

/**
 * `<vaadin-switch>` is a binary on/off switch control for a single setting.
 *
 * ```html
 * <vaadin-switch label="Notifications"></vaadin-switch>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name            | Description
 * ---------------------|-------------
 * `switch`             | The track element that holds the thumb.
 * `thumb`              | The circular thumb element inside the track.
 * `label`              | The slotted label element wrapper.
 * `helper-text`        | The slotted helper text element wrapper.
 * `error-message`      | The slotted error message element wrapper.
 * `required-indicator` | The `required` state indicator element.
 *
 * The following state attributes are available for styling:
 *
 * Attribute            | Description
 * ---------------------|-------------
 * `active`             | Set when the switch is activated with mouse, touch or the keyboard.
 * `checked`            | Set when the switch is checked.
 * `disabled`           | Set when the switch is disabled.
 * `readonly`           | Set when the switch is readonly.
 * `focus-ring`         | Set when the switch is focused using the keyboard.
 * `focused`            | Set when the switch is focused.
 * `required`           | Set when the switch is required.
 * `invalid`            | Set when the switch is invalid.
 * `has-label`          | Set when the switch has a label.
 * `has-helper`         | Set when the switch has helper text.
 * `has-error-message`  | Set when the switch has an error message.
 * `has-tooltip`        | Set when the switch has a slotted tooltip.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {Event} change - Fired when the user flips the switch.
 * @fires {CustomEvent} checked-changed - Fired when the `checked` property changes.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} validated - Fired whenever the field is validated.
 */
declare class Switch extends CheckboxMixin(ElementMixin(HTMLElement)) {
  addEventListener<K extends keyof SwitchEventMap>(
    type: K,
    listener: (this: Switch, ev: SwitchEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof SwitchEventMap>(
    type: K,
    listener: (this: Switch, ev: SwitchEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-switch': Switch;
  }
}

export { Switch };

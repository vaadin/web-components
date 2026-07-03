/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { CheckboxMixin } from '@vaadin/checkbox/src/vaadin-checkbox-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';

/**
 * Fired when the switch is toggled by the user.
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
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                                |
 * :--------------------------------------------------|
 * | `--vaadin-input-field-error-color`               |
 * | `--vaadin-input-field-error-font-size`           |
 * | `--vaadin-input-field-error-font-weight`         |
 * | `--vaadin-input-field-error-line-height`         |
 * | `--vaadin-input-field-helper-color`              |
 * | `--vaadin-input-field-helper-font-size`          |
 * | `--vaadin-input-field-helper-font-weight`        |
 * | `--vaadin-input-field-helper-line-height`        |
 * | `--vaadin-input-field-required-indicator`        |
 * | `--vaadin-input-field-required-indicator-color`  |
 * | `--vaadin-switch-background`                     |
 * | `--vaadin-switch-border-color`                   |
 * | `--vaadin-switch-border-width`                   |
 * | `--vaadin-switch-gap`                            |
 * | `--vaadin-switch-label-color`                    |
 * | `--vaadin-switch-label-font-size`                |
 * | `--vaadin-switch-label-font-weight`              |
 * | `--vaadin-switch-label-line-height`              |
 * | `--vaadin-switch-size`                           |
 * | `--vaadin-switch-thumb-color`                    |
 * | `--vaadin-switch-thumb-checked-color`            |
 * | `--vaadin-switch-thumb-size`                     |
 * | `--vaadin-switch-track-width`                    |
 *
 * @fires {Event} change - Fired when the switch is toggled by the user.
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

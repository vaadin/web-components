import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';

import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

import { ControlStateMixin } from '@vaadin/vaadin-control-state-mixin/vaadin-control-state-mixin.js';

import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';

/**
 * Fired when the `checked` property changes.
 */
export type RadioButtonCheckedChangedEvent = CustomEvent<{ value: boolean }>;

export interface RadioButtonElementEventMap {
  'checked-changed': RadioButtonCheckedChangedEvent;
}

export interface RadioButtonEventMap extends HTMLElementEventMap, RadioButtonElementEventMap {}

/**
 * `<vaadin-radio-button>` is a Web Component for radio buttons.
 *
 * ```html
 * <vaadin-radio-button value="foo">Foo</vaadin-radio-button>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name         | Description
 * ------------------|----------------
 * `radio`           | The radio button element
 * `label`           | The label content element
 *
 * The following state attributes are available for styling:
 *
 * Attribute  | Description | Part name
 * -----------|-------------|------------
 * `disabled`   | Set when the radio button is disabled. | :host
 * `focus-ring` | Set when the radio button is focused using the keyboard. | :host
 * `focused`    | Set when the radio button is focused. | :host
 * `checked`    | Set when the radio button is checked. | :host
 * `empty`      | Set when there is no label provided. | label
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} checked-changed - Fired when the `checked` property changes.
 */
declare class RadioButtonElement extends ElementMixin(
  ControlStateMixin(ThemableMixin(GestureEventListeners(HTMLElement)))
) {
  readonly focusElement: HTMLInputElement;

  /**
   * Name of the element.
   */
  name: string | null | undefined;

  /**
   * True if the radio button is checked.
   */
  checked: boolean;

  /**
   * The value for this element.
   */
  value: string;

  /**
   * Toggles the radio button, so that the native `change` event
   * is dispatched. Overrides the standard `HTMLElement.prototype.click`.
   */
  click(): void;

  addEventListener<K extends keyof RadioButtonEventMap>(
    type: K,
    listener: (this: RadioButtonElement, ev: RadioButtonEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof RadioButtonEventMap>(
    type: K,
    listener: (this: RadioButtonElement, ev: RadioButtonEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-radio-button': RadioButtonElement;
  }
}

export { RadioButtonElement };

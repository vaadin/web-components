import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';

import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

import { ControlStateMixin } from '@vaadin/vaadin-control-state-mixin/vaadin-control-state-mixin.js';

import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';

/**
 * Fired when the `checked` property changes.
 */
export type CheckboxCheckedChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `indeterminate` property changes.
 */
export type CheckboxIndeterminateChangedEvent = CustomEvent<{ value: boolean }>;

export interface CheckboxElementEventMap {
  'checked-changed': CheckboxCheckedChangedEvent;

  'indeterminate-changed': CheckboxIndeterminateChangedEvent;
}

export interface CheckboxEventMap extends HTMLElementEventMap, CheckboxElementEventMap {}

/**
 * `<vaadin-checkbox>` is a Web Component for customized checkboxes.
 *
 * ```html
 * <vaadin-checkbox>
 *   Make my profile visible
 * </vaadin-checkbox>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name         | Description
 * ------------------|----------------
 * `checkbox`        | The wrapper element for the native <input type="checkbox">
 * `label`           | The wrapper element in which the component's children, namely the label, is slotted
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description | Part name
 * -------------|-------------|--------------
 * `active`     | Set when the checkbox is pressed down, either with mouse, touch or the keyboard. | `:host`
 * `disabled`   | Set when the checkbox is disabled. | `:host`
 * `focus-ring` | Set when the checkbox is focused using the keyboard. | `:host`
 * `focused`    | Set when the checkbox is focused. | `:host`
 * `indeterminate` | Set when the checkbox is in indeterminate mode. | `:host`
 * `checked` | Set when the checkbox is checked. | `:host`
 * `empty` | Set when there is no label provided. | `label`
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} checked-changed - Fired when the `checked` property changes.
 * @fires {CustomEvent} indeterminate-changed - Fired when the `indeterminate` property changes.
 */
declare class CheckboxElement extends ElementMixin(
  ControlStateMixin(ThemableMixin(GestureEventListeners(HTMLElement)))
) {
  readonly focusElement: HTMLInputElement;

  /**
   * Name of the element.
   */
  name: string;

  /**
   * True if the checkbox is checked.
   */
  checked: boolean;

  /**
   * Indeterminate state of the checkbox when it's neither checked nor unchecked, but undetermined.
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#Indeterminate_state_checkboxes
   */
  indeterminate: boolean;

  /**
   * The value given to the data submitted with the checkbox's name to the server when the control is inside a form.
   */
  value: string | null | undefined;

  _toggleChecked(): void;

  addEventListener<K extends keyof CheckboxEventMap>(
    type: K,
    listener: (this: CheckboxElement, ev: CheckboxEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof CheckboxEventMap>(
    type: K,
    listener: (this: CheckboxElement, ev: CheckboxEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-checkbox': CheckboxElement;
  }
}

export { CheckboxElement };

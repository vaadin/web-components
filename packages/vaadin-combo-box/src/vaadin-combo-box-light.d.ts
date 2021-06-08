import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin';

import { ComboBoxMixin } from './vaadin-combo-box-mixin';

import { ComboBoxDataProviderMixin } from './vaadin-combo-box-data-provider-mixin';

import { ComboBoxDefaultItem, ComboBoxEventMap } from './interfaces';

/**
 * `<vaadin-combo-box-light>` is a customizable version of the `<vaadin-combo-box>` providing
 * only the dropdown functionality and leaving the input field definition to the user.
 *
 * The element has the same API as `<vaadin-combo-box>`.
 *
 * To create a custom input field, you need to add a child element which has a two-way
 * data-bindable property representing the input value. The property name is expected
 * to be `value` by default. See the example below for a simplest possible example
 * using a `<vaadin-text-field>` element.
 *
 * ```html
 * <vaadin-combo-box-light>
 *   <vaadin-text-field>
 *   </vaadin-text-field>
 * </vaadin-combo-box-light>
 * ```
 *
 * If you are using other custom input fields like `<iron-input>`, you
 * need to define the name of the bindable property with the `attrForValue` attribute.
 *
 * ```html
 * <vaadin-combo-box-light attr-for-value="bind-value">
 *   <iron-input>
 *     <input>
 *   </iron-input>
 * </vaadin-combo-box-light>
 * ```
 *
 * In the next example you can see how to create a custom input field based
 * on a `<paper-input>` decorated with a custom `<iron-icon>` and
 * two `<paper-button>`s to act as the clear and toggle controls.
 *
 * ```html
 * <vaadin-combo-box-light>
 *   <paper-input label="Elements" class="input">
 *     <iron-icon icon="toll" slot="prefix"></iron-icon>
 *     <paper-button slot="suffix" class="clear-button">Clear</paper-button>
 *     <paper-button slot="suffix" class="toggle-button">Toggle</paper-button>
 *   </paper-input>
 * </vaadin-combo-box-light>
 * ```
 *
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} custom-value-set - Fired when the user sets a custom value.
 * @fires {CustomEvent} filter-changed - Fired when the `filter` property changes.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 * @fires {CustomEvent} selected-item-changed - Fired when the `selectedItem` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 */
declare class ComboBoxLightElement<TItem = ComboBoxDefaultItem> extends HTMLElement {
  readonly _propertyForValue: string;

  _inputElementValue: string;

  readonly focused: boolean;

  /**
   * Name of the two-way data-bindable property representing the
   * value of the custom input field.
   * @attr {string} attr-for-value
   */
  attrForValue: string;

  readonly inputElement: Element | undefined;

  addEventListener<K extends keyof ComboBoxEventMap<TItem>>(
    type: K,
    listener: (this: ComboBoxLightElement<TItem>, ev: ComboBoxEventMap<TItem>[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof ComboBoxEventMap<TItem>>(
    type: K,
    listener: (this: ComboBoxLightElement<TItem>, ev: ComboBoxEventMap<TItem>[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

interface ComboBoxLightElement<TItem = ComboBoxDefaultItem>
  extends ComboBoxDataProviderMixin<TItem>,
    ComboBoxMixin<TItem>,
    ThemableMixin {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-combo-box-light': ComboBoxLightElement;
  }
}

export { ComboBoxLightElement };

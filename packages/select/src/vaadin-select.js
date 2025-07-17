/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/input-container/src/vaadin-input-container.js';
import './vaadin-select-item.js';
import './vaadin-select-list-box.js';
import './vaadin-select-overlay.js';
import './vaadin-select-value-button.js';
import { html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { screenReaderOnly } from '@vaadin/a11y-base/src/styles/sr-only-styles.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { inputFieldShared } from '@vaadin/field-base/src/styles/input-field-shared-styles.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { selectStyles } from './styles/vaadin-select-core-styles.js';
import { SelectBaseMixin } from './vaadin-select-base-mixin.js';

/**
 * `<vaadin-select>` is a Web Component for selecting values from a list of items.
 *
 * ### Items
 *
 * Use the `items` property to define possible options for the select:
 *
 * ```html
 * <vaadin-select id="select"></vaadin-select>
 * ```
 * ```js
 * const select = document.querySelector('#select');
 * select.items = [
 *   { label: 'Most recent first', value: 'recent' },
 *   { component: 'hr' },
 *   { label: 'Rating: low to high', value: 'rating-asc', className: 'asc' },
 *   { label: 'Rating: high to low', value: 'rating-desc', className: 'desc' },
 *   { component: 'hr' },
 *   { label: 'Price: low to high', value: 'price-asc', disabled: true },
 *   { label: 'Price: high to low', value: 'price-desc', disabled: true }
 * ];
 * ```
 *
 * ### Rendering
 *
 * Alternatively, the content of the select can be populated by using the renderer callback function.
 *
 * The renderer function provides `root`, `select` arguments.
 * Generate DOM content, append it to the `root` element and control the state
 * of the host element by accessing `select`.
 *
 * ```js
 * const select = document.querySelector('#select');
 * select.renderer = function(root, select) {
 *   const listBox = document.createElement('vaadin-list-box');
 *   // append 3 <vaadin-item> elements
 *   ['Jose', 'Manolo', 'Pedro'].forEach(function(name) {
 *     const item = document.createElement('vaadin-item');
 *     item.textContent = name;
 *     item.setAttribute('label', name)
 *     listBox.appendChild(item);
 *   });
 *
 *   // update the content
 *   root.appendChild(listBox);
 * };
 * ```
 *
 * Renderer is called on initialization of new select and on its opening.
 * DOM generated during the renderer call can be reused
 * in the next renderer call and will be provided with the `root` argument.
 * On first call it will be empty.
 *
 * * Hint: By setting the `label` property of inner vaadin-items you will
 * be able to change the visual representation of the selected value in the input part.
 *
 * ### Styling
 *
 * The following custom properties are available for styling:
 *
 * Custom property                  | Description                 | Default
 * ---------------------------------|-----------------------------|--------
 * `--vaadin-field-default-width`   | Default width of the field  | `12em`
 * `--vaadin-select-overlay-width`  | Width of the overlay        |
 *
 * `<vaadin-select>` provides mostly the same set of shadow DOM parts and state attributes as `<vaadin-text-field>`.
 * See [`<vaadin-text-field>`](#/elements/vaadin-text-field) for the styling documentation.
 *
 *
 * In addition to `<vaadin-text-field>` parts, the following parts are available for theming:
 *
 * Part name        | Description
 * -----------------|----------------
 * `toggle-button`  | The toggle button
 * `backdrop`       | Backdrop of the overlay
 * `overlay`        | The overlay container
 * `content`        | The overlay content
 *
 * In addition to `<vaadin-text-field>` state attributes, the following state attributes are available for theming:
 *
 * Attribute | Description
 * ----------|-----------------------------
 * `opened`  | Set when the select is open
 * `phone`   | Set when the overlay is shown in phone mode
 *
 * There are two exceptions in terms of styling compared to `<vaadin-text-field>`:
 * - the `clear-button` shadow DOM part does not exist in `<vaadin-select>`.
 * - the `input-prevented` state attribute is not supported by `<vaadin-select>`.
 *
 * ### Internal components
 *
 * In addition to `<vaadin-select>` itself, the following internal
 * components are themable:
 *
 * - `<vaadin-select-overlay>` - has the same API as [`<vaadin-overlay>`](#/elements/vaadin-overlay).
 * - `<vaadin-select-value-button>` - has the same API as [`<vaadin-button>`](#/elements/vaadin-button).
 * - [`<vaadin-input-container>`](#/elements/vaadin-input-container) - an internal element wrapping the button.
 *
 * Note: the `theme` attribute value set on `<vaadin-select>` is
 * propagated to the internal components listed above.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 * @fires {CustomEvent} validated - Fired whenever the field is validated.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes SelectBaseMixin
 * @mixes ThemableMixin
 */
class Select extends SelectBaseMixin(ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
  static get is() {
    return 'vaadin-select';
  }

  static get styles() {
    return [inputFieldShared, screenReaderOnly, selectStyles];
  }

  /** @protected */
  render() {
    return html`
      <div class="vaadin-select-container">
        <div part="label" @click="${this._onClick}">
          <slot name="label"></slot>
          <span part="required-indicator" aria-hidden="true" @click="${this.focus}"></span>
        </div>

        <vaadin-input-container
          part="input-field"
          .readonly="${this.readonly}"
          .disabled="${this.disabled}"
          .invalid="${this.invalid}"
          theme="${ifDefined(this._theme)}"
          @click="${this._onClick}"
        >
          <slot name="prefix" slot="prefix"></slot>
          <slot name="value"></slot>
          <div part="toggle-button" slot="suffix" aria-hidden="true" @mousedown="${this._onToggleMouseDown}"></div>
        </vaadin-input-container>

        <div part="helper-text">
          <slot name="helper"></slot>
        </div>

        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
      </div>

      <vaadin-select-overlay
        id="overlay"
        popover="manual"
        .owner="${this}"
        .positionTarget="${this._inputContainer}"
        .opened="${this.opened}"
        .withBackdrop="${this._phone}"
        .renderer="${this.renderer || this.__defaultRenderer}"
        ?phone="${this._phone}"
        theme="${ifDefined(this._theme)}"
        .restoreFocusOnClose="${this.__shouldRestoreFocus}"
        ?no-vertical-overlap="${this.noVerticalOverlap}"
        exportparts="backdrop, overlay, content"
        @opened-changed="${this._onOpenedChanged}"
        @vaadin-overlay-open="${this._onOverlayOpen}"
      >
        <slot name="overlay"></slot>
      </vaadin-select-overlay>

      <slot name="tooltip"></slot>
      <div class="sr-only">
        <slot name="sr-label"></slot>
      </div>
    `;
  }

  /** @private */
  _onOpenedChanged(event) {
    this.opened = event.detail.value;
  }

  /** @private */
  _onOverlayOpen() {
    if (this._menuElement) {
      this._menuElement.focus();
      this.__shouldRestoreFocus = true;
    }
  }

  /**
   * Fired when the user commits a value change.
   *
   * @event change
   */
}

defineCustomElement(Select);

export { Select };

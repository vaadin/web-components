/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { listBoxStyles } from './styles/vaadin-list-box-base-styles.js';
import { MultiSelectListMixin } from './vaadin-multi-select-list-mixin.js';

/**
 * `<vaadin-list-box>` is a Web Component for creating menus.
 *
 * ```html
 * <vaadin-list-box selected="2">
 *   <vaadin-item>Item 1</vaadin-item>
 *   <vaadin-item>Item 2</vaadin-item>
 *   <vaadin-item>Item 3</vaadin-item>
 *   <vaadin-item>Item 4</vaadin-item>
 * </vaadin-list-box>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name         | Description
 * ------------------|------------------------
 * `items`           | The items container
 *
 * The following state attributes are available for styling:
 *
 * Attribute      | Description
 * ---------------|---------------------------------
 * `has-tooltip`  | Set when the element has a slotted tooltip
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} items-changed - Fired when the `items` property changes.
 * @fires {CustomEvent} selected-changed - Fired when the `selected` property changes.
 * @fires {CustomEvent} selected-values-changed - Fired when the `selectedValues` property changes.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes MultiSelectListMixin
 * @mixes ThemableMixin
 * @mixes ElementMixin
 */
class ListBox extends ElementMixin(MultiSelectListMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
  static get is() {
    return 'vaadin-list-box';
  }

  static get styles() {
    return listBoxStyles;
  }

  static get properties() {
    return {
      // We don't need to define this property since super default is vertical,
      // but we don't want it to be modified, or be shown in the API docs.
      /** @private */
      orientation: {
        readOnly: true,
      },
    };
  }

  /** @protected */
  render() {
    return html`
      <div part="items">
        <slot></slot>
      </div>

      <slot name="tooltip"></slot>
    `;
  }

  /**
   * @return {!HTMLElement}
   * @protected
   * @override
   */
  get _scrollerElement() {
    return this.shadowRoot.querySelector('[part="items"]');
  }

  /** @protected */
  ready() {
    super.ready();

    this.setAttribute('role', 'listbox');

    this._tooltipController = new TooltipController(this);
    this.addController(this._tooltipController);
  }
}

defineCustomElement(ListBox);

export { ListBox };

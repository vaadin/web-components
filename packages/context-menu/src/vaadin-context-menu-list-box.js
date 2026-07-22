/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { ListMixin } from '@vaadin/a11y-base/src/list-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { listBoxStyles } from '@vaadin/list-box/src/styles/vaadin-list-box-base-styles.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-context-menu-list-box>` is a Web Component for wrapping `<vaadin-context-menu>` items.
 *
 * ```html
 * <vaadin-context-menu>
 *   <vaadin-context-menu-list-box slot="overlay">
 *     <vaadin-context-menu-item>Edit</vaadin-context-menu-item>
 *     <vaadin-context-menu-item>Delete</vaadin-context-menu-item>
 *   </vaadin-context-menu-list-box>
 * </vaadin-context-menu>
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
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement vaadin-context-menu-list-box
 * @extends HTMLElement
 */
class ContextMenuListBox extends ListMixin(ThemableMixin(DirMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
  static get is() {
    return 'vaadin-context-menu-list-box';
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
        type: String,
        readOnly: true,
      },
    };
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
  render() {
    return html`
      <div part="items">
        <slot></slot>
      </div>
    `;
  }

  /** @protected */
  ready() {
    super.ready();

    this.setAttribute('role', 'menu');
  }
}

defineCustomElement(ContextMenuListBox);

export { ContextMenuListBox };

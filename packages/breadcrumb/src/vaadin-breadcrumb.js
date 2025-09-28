/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-breadcrumb-item.js';
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { breadcrumbStyles } from './styles/vaadin-breadcrumb-styles.js';

/**
 * `<vaadin-breadcrumb>` is a Web Component for displaying hierarchical navigation.
 *
 * ```html
 * <vaadin-breadcrumb>
 *   <vaadin-breadcrumb-item href="/">Home</vaadin-breadcrumb-item>
 *   <vaadin-breadcrumb-item href="/products">Products</vaadin-breadcrumb-item>
 *   <vaadin-breadcrumb-item>Details</vaadin-breadcrumb-item>
 * </vaadin-breadcrumb>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name  | Description
 * -----------|----------------
 * `list`     | The ordered list element
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class Breadcrumb extends ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement)))) {
  static get is() {
    return 'vaadin-breadcrumb';
  }

  static get styles() {
    return breadcrumbStyles;
  }

  static get properties() {
    return {
      /**
       * The aria-label attribute for the breadcrumb navigation
       */
      ariaLabel: {
        type: String,
        value: 'Breadcrumb',
        reflectToAttribute: true,
        sync: true,
      },

      /**
       * The list of breadcrumb items
       * @type {!Array<!BreadcrumbItem>}
       * @private
       */
      _items: {
        type: Array,
      },
    };
  }

  constructor() {
    super();
    this._items = [];
  }

  /** @protected */
  render() {
    return html`
      <ol part="list" role="list">
        <slot @slotchange="${this._onSlotChange}"></slot>
      </ol>
    `;
  }

  /** @protected */
  firstUpdated() {
    super.firstUpdated();

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'navigation');
    }
  }

  /** @private */
  _onSlotChange() {
    const slot = this.shadowRoot.querySelector('slot');
    const items = slot.assignedElements().filter((el) => el.localName === 'vaadin-breadcrumb-item');

    this._items = items;

    // Update aria-current for the last item
    items.forEach((item, index) => {
      const isLast = index === items.length - 1;
      item._setLast(isLast);
    });
  }
}

defineCustomElement(Breadcrumb);

export { Breadcrumb };

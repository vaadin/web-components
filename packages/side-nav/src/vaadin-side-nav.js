/**
 * @license
 * Copyright (c) 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { generateUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { sideNavBaseStyles } from './vaadin-side-nav-base-styles.js';
import { SideNavChildrenMixin } from './vaadin-side-nav-children-mixin.js';

/**
 * `<vaadin-side-nav>` is a Web Component for navigation menus.
 *
 * ```html
 * <vaadin-side-nav>
 *   <vaadin-side-nav-item>Item 1</vaadin-side-nav-item>
 *   <vaadin-side-nav-item>Item 2</vaadin-side-nav-item>
 *   <vaadin-side-nav-item>Item 3</vaadin-side-nav-item>
 *   <vaadin-side-nav-item>Item 4</vaadin-side-nav-item>
 * </vaadin-side-nav>
 * ```
 *
 * ### Customization
 *
 * You can configure the component by using `slot` names.
 *
 * Slot name | Description
 * ----------|-------------
 * `label`   | The label (text) inside the side nav.
 *
 * #### Example
 *
 * ```html
 * <vaadin-side-nav>
 *   <span slot="label">Main menu</span>
 *   <vaadin-side-nav-item>Item</vaadin-side-nav-item>
 * </vaadin-side-nav>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name       | Description
 * ----------------|----------------
 * `label`         | The label element
 * `children`      | The element that wraps child items
 * `toggle-button` | The toggle button
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description
 * -------------|-------------
 * `collapsed`  | Set when the element is collapsed.
 * `focus-ring` | Set when the label is focused using the keyboard.
 * `focused`    | Set when the label is focused.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} collapsed-changed - Fired when the `collapsed` property changes.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes ElementMixin
 * @mixes SideNavChildrenMixin
 */
class SideNav extends SideNavChildrenMixin(FocusMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement))))) {
  static get is() {
    return 'vaadin-side-nav';
  }

  static get shadowRootOptions() {
    return { ...LitElement.shadowRootOptions, delegatesFocus: true };
  }

  static get properties() {
    return {
      /**
       * Whether the side nav is collapsible. When enabled, the toggle icon is shown.
       *
       * @type {boolean}
       */
      collapsible: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },

      /**
       * Whether the side nav is collapsed. When collapsed, the items are hidden.
       *
       * @type {boolean}
       */
      collapsed: {
        type: Boolean,
        value: false,
        notify: true,
        reflectToAttribute: true,
      },
    };
  }

  static get styles() {
    return sideNavBaseStyles;
  }

  constructor() {
    super();

    this._labelId = `side-nav-label-${generateUniqueId()}`;
  }

  /**
   * Name of the slot to be used for children.
   * @protected
   * @override
   */
  get _itemsSlotName() {
    return '';
  }

  /** @protected */
  get focusElement() {
    return this.shadowRoot.querySelector('button');
  }

  /** @protected */
  firstUpdated() {
    super.firstUpdated();

    // By default, if the user hasn't provided a custom role,
    // the role attribute is set to "navigation".
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'navigation');
    }
  }

  /** @protected */
  render() {
    return html`
      ${this.collapsible
        ? html`
            <button
              part="label"
              @click="${this._onLabelClick}"
              aria-expanded="${!this.collapsed}"
              aria-controls="children"
            >
              <slot name="label" @slotchange="${this._onLabelSlotChange}"></slot>
              <span part="toggle-button" aria-hidden="true"></span>
            </button>
          `
        : html`
            <div part="label">
              <slot name="label" @slotchange="${this._onLabelSlotChange}"></slot>
            </div>
          `}
      <ul
        id="children"
        role="list"
        part="children"
        ?hidden="${this.collapsed}"
        aria-hidden="${this.collapsed ? 'true' : 'false'}"
      >
        <slot></slot>
      </ul>
    `;
  }

  /**
   * @param {Event} event
   * @return {boolean}
   * @protected
   * @override
   */
  _shouldSetFocus(event) {
    return event.composedPath()[0] === this.focusElement;
  }

  /** @private */
  _onLabelClick() {
    if (this.collapsible) {
      this.__toggleCollapsed();
    }
  }

  /** @private */
  _onLabelSlotChange() {
    const label = this.querySelector('[slot="label"]');
    if (label) {
      if (!label.id) {
        label.id = this._labelId;
      }
      this.setAttribute('aria-labelledby', label.id);
    } else {
      this.removeAttribute('aria-labelledby');
    }
  }

  /** @private */
  __toggleCollapsed() {
    this.collapsed = !this.collapsed;
  }
}

defineCustomElement(SideNav);

export { SideNav };

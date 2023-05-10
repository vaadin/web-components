/**
 * @license
 * Copyright (c) 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { generateUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { sideNavBaseStyles } from './vaadin-side-nav-base-styles.js';

function isEnabled() {
  return window.Vaadin && window.Vaadin.featureFlags && !!window.Vaadin.featureFlags.sideNavComponent;
}

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
 * @fires {CustomEvent} collapsed-changed - Fired when the `collapsed` property changes.
 *
 * @extends LitElement
 * @mixes PolylitMixin
 * @mixes ThemableMixin
 * @mixes ElementMixin
 */
class SideNav extends ElementMixin(ThemableMixin(PolylitMixin(LitElement))) {
  static get is() {
    return 'vaadin-side-nav';
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

  /** @protected */
  firstUpdated() {
    // By default, if the user hasn't provided a custom role,
    // the role attribute is set to "navigation".
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'navigation');
    }
  }

  /** @protected */
  render() {
    const label = this.querySelector('[slot="label"]');
    if (label && this.collapsible) {
      return html`
        <details ?open="${!this.collapsed}" @toggle="${this.__toggleCollapsed}">${this.__renderBody(label)}</details>
      `;
    }
    return this.__renderBody(label);
  }

  /** @private */
  __renderBody(label) {
    if (label) {
      if (!label.id) label.id = `side-nav-label-${generateUniqueId()}`;
      this.setAttribute('aria-labelledby', label.id);
    } else {
      this.removeAttribute('aria-labelledby');
    }
    return html`
      <summary part="label" ?hidden="${label == null}">
        <slot name="label" @slotchange="${() => this.requestUpdate()}"></slot>
      </summary>
      <slot role="list"></slot>
    `;
  }

  /** @private */
  __toggleCollapsed(e) {
    this.collapsed = !e.target.open;
  }
}

if (isEnabled()) {
  customElements.define(SideNav.is, SideNav);
} else {
  console.warn(
    'WARNING: The side-nav component is currently an experimental feature and needs to be explicitly enabled. To enable the component, `import "@vaadin/side-nav/enable.js"` *before* importing the side-nav module itself.',
  );
}

export { SideNav };

/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

import { html, LitElement } from 'lit';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { sideNavStyles } from '../theme/lumo/vaadin-side-nav-styles.js';

function isEnabled() {
  return window.Vaadin && window.Vaadin.featureFlags && !!window.Vaadin.featureFlags.sideNavComponent;
}

// Used for generating unique IDs for label elements
let id = 0;

class SideNav extends ElementMixin(ThemableMixin(PolylitMixin(LitElement))) {
  static get is() {
    return 'vaadin-side-nav';
  }

  static get styles() {
    return sideNavStyles;
  }

  static get properties() {
    return {
      collapsible: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },

      collapsed: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'navigation');
  }

  render() {
    const label = this.querySelector('[slot="label"]');
    if (label && this.collapsible) {
      return html`
        <details ?open="${!this.collapsed}" @toggle="${this.toggleCollapsed}">${this._renderBody(label)}</details>
      `;
    }
    return this._renderBody(label);
  }

  _renderBody(label) {
    if (label) {
      // eslint-disable-next-line no-plusplus
      if (!label.id) label.id = `app-nav-label-${id++}`;
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

  toggleCollapsed(e) {
    if (e) {
      this.collapsed = !e.target.open;
    } else {
      this.collapsed = !this.collapsed;
    }
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

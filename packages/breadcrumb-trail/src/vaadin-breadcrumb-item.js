/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { breadcrumbItemStyles } from './styles/vaadin-breadcrumb-item-base-styles.js';

/**
 * `<vaadin-breadcrumb-item>` is a single item inside a `<vaadin-breadcrumb-trail>`.
 *
 * @customElement vaadin-breadcrumb-item
 * @extends HTMLElement
 * @mixes ElementMixin
 */
class BreadcrumbItem extends ElementMixin(PolylitMixin(LitElement)) {
  static get is() {
    return 'vaadin-breadcrumb-item';
  }

  static get styles() {
    return breadcrumbItemStyles;
  }

  static get experimental() {
    return 'breadcrumbTrailComponent';
  }

  static get properties() {
    return {
      /**
       * The URL the breadcrumb item links to. When set, the item renders as
       * an `<a>` link; when unset, it renders as a non-interactive `<span>`
       * representing the current page.
       */
      path: {
        type: String,
      },
    };
  }

  /** @protected */
  render() {
    if (this.path != null) {
      return html`
        <a part="link" href="${this.path}">
          <slot name="prefix"></slot>
          <span part="label"><slot></slot></span>
        </a>
      `;
    }
    return html`
      <span part="nolink">
        <slot name="prefix"></slot>
        <span part="label"><slot></slot></span>
      </span>
    `;
  }
}

defineCustomElement(BreadcrumbItem);

export { BreadcrumbItem };

/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-breadcrumbs-item.js';
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { breadcrumbsStyles } from './styles/vaadin-breadcrumbs-base-styles.js';

/**
 * `<vaadin-breadcrumbs>` is a Web Component that displays the user's location
 * within a hierarchy as a trail of links from the root to the current page.
 *
 * @customElement vaadin-breadcrumbs
 * @extends HTMLElement
 * @mixes ElementMixin
 */
class Breadcrumbs extends ElementMixin(PolylitMixin(LumoInjectionMixin(LitElement))) {
  static get is() {
    return 'vaadin-breadcrumbs';
  }

  static get styles() {
    return breadcrumbsStyles;
  }

  static get experimental() {
    return 'breadcrumbsComponent';
  }

  /** @protected */
  render() {
    return html`<div role="list" part="list"><slot></slot></div>`;
  }

  /** @protected */
  firstUpdated() {
    super.firstUpdated();

    // By default, if the user hasn't provided a custom role,
    // the role attribute is set to "navigation".
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'navigation');
    }

    // Evaluate initial children once.
    this.__updateCurrent();

    // Observe child list and `path` attribute changes to keep `current` in sync.
    this.__childObserver = new MutationObserver(() => {
      this.__updateCurrent();
    });
    this.__childObserver.observe(this, {
      childList: true,
      subtree: true,
      attributeFilter: ['path'],
    });
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.__childObserver) {
      this.__childObserver.disconnect();
    }
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();
    if (this.__childObserver) {
      this.__childObserver.observe(this, {
        childList: true,
        subtree: true,
        attributeFilter: ['path'],
      });
      this.__updateCurrent();
    }
  }

  /**
   * Re-evaluates which `<vaadin-breadcrumbs-item>` child should carry the
   * `current` state attribute. The current item is the last child iff its
   * `path` is `null` or `undefined`.
   *
   * @private
   */
  __updateCurrent() {
    const items = [...this.children].filter((child) => child.localName === 'vaadin-breadcrumbs-item');
    const lastIndex = items.length - 1;
    items.forEach((item, index) => {
      const isCurrent = index === lastIndex && item.path == null;
      if (typeof item._setCurrent === 'function') {
        item._setCurrent(isCurrent);
      }
    });
  }
}

defineCustomElement(Breadcrumbs);

export { Breadcrumbs };

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
import { SlotObserver } from '@vaadin/component-base/src/slot-observer.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { breadcrumbsStyles } from './styles/vaadin-breadcrumbs-base-styles.js';

/**
 * `<vaadin-breadcrumbs>` is a Web Component that displays the user's location
 * within a hierarchy as a trail of links from the root to the current page.
 *
 * @customElement vaadin-breadcrumbs
 * @extends HTMLElement
 */
class Breadcrumbs extends ElementMixin(PolylitMixin(LumoInjectionMixin(LitElement))) {
  static get is() {
    return 'vaadin-breadcrumbs';
  }

  static get lumoInjector() {
    return { ...super.lumoInjector, includeBaseStyles: true };
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

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'navigation');
    }

    // Re-evaluate items on add / remove via a single shadow-root-level observer.
    this.__slotObserver = new SlotObserver(this.shadowRoot, () => this.__updateItems());
    this.__slotObserver.flush();

    // Observe `path` attribute changes on items to modify the `current` state.
    this.__pathObserver = new MutationObserver(() => this.__updateItems());
    this.__pathObserver.observe(this, {
      attributes: true,
      attributeFilter: ['path'],
      subtree: true,
    });
  }

  /** @private */
  __getItems() {
    return [...this.children].filter((node) => node.localName === 'vaadin-breadcrumbs-item');
  }

  /** @private */
  __updateItems() {
    const items = this.__getItems();
    const lastIndex = items.length - 1;
    items.forEach((item, index) => {
      const isCurrent = index === lastIndex && item.path == null;
      item._setCurrent?.(isCurrent);
    });
  }
}

defineCustomElement(Breadcrumbs);

export { Breadcrumbs };

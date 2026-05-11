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
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { breadcrumbsStyles } from './styles/vaadin-breadcrumbs-base-styles.js';

/**
 * A controller for the default slot. Re-evaluates the `current` state on the
 * last `<vaadin-breadcrumbs-item>` child whenever items are added, removed, or
 * have their `path` attribute mutated.
 *
 * @private
 */
class ItemsSlotController extends SlotController {
  constructor(host) {
    super(host, '', null, { multiple: true, observe: true });

    // Observes `path` attribute mutations on every slotted item.
    this.__pathObserver = new MutationObserver(() => {
      this.__updateCurrent();
    });
  }

  /** @protected */
  initAddedNode(node) {
    this.__observeItem(node);
    this.__updateCurrent();
  }

  /** @protected */
  teardownNode(_node) {
    // MutationObserver has no per-target disconnect; re-observe all remaining
    // items so the removed one is dropped from the observation set.
    this.__pathObserver.disconnect();
    this.nodes.forEach((item) => this.__observeItem(item));
    this.__updateCurrent();
  }

  /** @private */
  __observeItem(node) {
    if (node.localName === 'vaadin-breadcrumbs-item') {
      this.__pathObserver.observe(node, { attributeFilter: ['path'] });
    }
  }

  /** @private */
  __updateCurrent() {
    const lastIndex = this.nodes.length - 1;
    this.nodes.forEach((item, index) => {
      const isCurrent = index === lastIndex && item.path == null;
      item._setCurrent?.(isCurrent);
    });
  }
}

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

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'navigation');
    }

    this.__itemsController = new ItemsSlotController(this);
    this.addController(this.__itemsController);
  }
}

defineCustomElement(Breadcrumbs);

export { Breadcrumbs };

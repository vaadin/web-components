/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { breadcrumbsItemStyles } from './styles/vaadin-breadcrumbs-item-base-styles.js';

/**
 * A `SlotController` subclass that observes the `prefix` slot and notifies the
 * host whenever the set of slotted nodes changes, so the host can toggle the
 * `has-prefix` state attribute. Also exposes `reobserve()` so the host can
 * re-bind the underlying `SlotObserver` when the slot element is re-created
 * (the `prefix` slot lives inside the `[part="link"]` / `[part="nolink"]`
 * branch and is replaced when `path` switches between set and unset).
 */
class PrefixSlotController extends SlotController {
  constructor(host) {
    super(host, 'prefix', null, { multiple: true, observe: true });
  }

  /** @protected */
  initCustomNode(node) {
    super.initCustomNode(node);
    this.host._updateHasPrefix();
  }

  /** @protected */
  teardownNode(node) {
    super.teardownNode(node);
    this.host._updateHasPrefix();
  }

  reobserve() {
    if (!this.initialized) {
      return;
    }
    if (this.__slotObserver) {
      this.__slotObserver.disconnect();
    }
    this.observeSlot();
  }
}

/**
 * `<vaadin-breadcrumbs-item>` is a single item inside a `<vaadin-breadcrumbs>`.
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------|------------------------------------------------------------
 * `link`    | The interactive `<a>` rendered when `path` is set.
 * `nolink`  | The non-interactive `<span>` rendered when `path` is unset.
 * `label`   | Wraps the item's text content, inside `link` or `nolink`.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement vaadin-breadcrumbs-item
 * @extends HTMLElement
 * @mixes ElementMixin
 */
class BreadcrumbsItem extends ElementMixin(PolylitMixin(LumoInjectionMixin(LitElement))) {
  static get is() {
    return 'vaadin-breadcrumbs-item';
  }

  static get properties() {
    return {
      /**
       * The path to navigate to. When set, the item renders as a link
       * (`<a part="link">`); when unset, it renders as a non-link
       * (`<span part="nolink">`).
       */
      path: {
        type: String,
      },
    };
  }

  static get styles() {
    return breadcrumbsItemStyles;
  }

  static get experimental() {
    return 'breadcrumbsComponent';
  }

  /** @protected */
  render() {
    return html`
      ${this.path == null
        ? html`
            <span part="nolink">
              <slot name="prefix"></slot>
              <span part="label">
                <slot></slot>
              </span>
            </span>
          `
        : html`
            <a href="${this.path}" part="link">
              <slot name="prefix"></slot>
              <span part="label">
                <slot></slot>
              </span>
            </a>
          `}
    `;
  }

  /** @protected */
  ready() {
    super.ready();

    this._prefixController = new PrefixSlotController(this);
    this.addController(this._prefixController);
  }

  /** @protected */
  updated(props) {
    super.updated(props);

    if (props.has('path') && this._prefixController) {
      this._prefixController.reobserve();
      this._updateHasPrefix();
    }
  }

  /** @protected */
  _updateHasPrefix() {
    this.toggleAttribute('has-prefix', this._prefixController.nodes.length > 0);
  }
}

defineCustomElement(BreadcrumbsItem);

export { BreadcrumbsItem };

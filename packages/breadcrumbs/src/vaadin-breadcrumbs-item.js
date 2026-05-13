/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { DisabledMixin } from '@vaadin/a11y-base/src/disabled-mixin.js';
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { breadcrumbsItemStyles } from './styles/vaadin-breadcrumbs-item-base-styles.js';

/**
 * A controller handling the prefix slot.
 */
class PrefixSlotController extends SlotController {
  constructor(host) {
    super(host, 'prefix', null, { multiple: true, observe: true });
  }

  /** @protected */
  initCustomNode(_node) {
    this.__updateHasPrefix();
  }

  /** @protected */
  teardownNode(_node) {
    this.__updateHasPrefix();
  }

  reobserve() {
    if (!this.initialized) {
      return;
    }
    if (this.__slotObserver) {
      this.__slotObserver.disconnect();
    }
    this.observeSlot();
    this.__updateHasPrefix();
  }

  /** @private */
  __updateHasPrefix() {
    this.host.toggleAttribute('has-prefix', this.nodes.length > 0);
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
 * The following state attributes are available for styling:
 *
 * Attribute    | Description
 * -------------|-------------
 * `current`    | Set by the parent `<vaadin-breadcrumbs>` on the last item when it has no `path`.
 * `disabled`   | Set when the item is disabled.
 * `focus-ring` | Set when the item is focused by the keyboard.
 * `focused`    | Set when the item is focused.
 * `has-prefix` | Set when the item has content in the prefix slot
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement vaadin-breadcrumbs-item
 * @extends HTMLElement
 */
class BreadcrumbsItem extends FocusMixin(DisabledMixin(ElementMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
  static get is() {
    return 'vaadin-breadcrumbs-item';
  }

  static get shadowRootOptions() {
    return { ...LitElement.shadowRootOptions, delegatesFocus: true };
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

      /**
       * When true, the item represents the current page. Set by the parent
       * `<vaadin-breadcrumbs>` on the last item when it has no `path`. The
       * item reflects this state by applying `aria-current="page"` to its
       * inner `[part="nolink"]` element.
       */
      current: {
        type: Boolean,
        value: false,
        readOnly: true,
        reflectToAttribute: true,
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
  firstUpdated() {
    super.firstUpdated();
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'listitem');
    }
  }

  /** @protected */
  render() {
    return html`
      ${this.path == null
        ? html`
            <span part="nolink" aria-current="${this.current ? 'page' : nothing}">
              <slot name="prefix"></slot>
              <span part="label">
                <slot></slot>
              </span>
            </span>
          `
        : html`
            <a
              href="${ifDefined(this.disabled ? null : this.path)}"
              tabindex="${this.disabled ? '-1' : '0'}"
              part="link"
            >
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

    if (props.has('path')) {
      this._prefixController.reobserve();
    }
  }
}

defineCustomElement(BreadcrumbsItem);

export { BreadcrumbsItem };

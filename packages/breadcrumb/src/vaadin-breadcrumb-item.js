/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { breadcrumbItemStyles } from './styles/vaadin-breadcrumb-item-base-styles.js';

/**
 * `<vaadin-breadcrumb-item>` is an individual item used inside `<vaadin-breadcrumb>`.
 *
 * This component is experimental. To use it, enable the feature flag before
 * importing the component:
 *
 * ```js
 * window.Vaadin.featureFlags.breadcrumbComponent = true;
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------|-------------
 * `link`    | The `<a>` or `<span>` element wrapping the prefix and label.
 * `label`   | The `<span>` wrapping the default slot content.
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description
 * -------------|-------------
 * `current`    | Set by the parent `<vaadin-breadcrumb>` on the last item when it has no `path`.
 * `has-prefix` | Set when the `prefix` slot has content.
 *
 * @customElement vaadin-breadcrumb-item
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class BreadcrumbItem extends ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement)))) {
  static get is() {
    return 'vaadin-breadcrumb-item';
  }

  static get styles() {
    return breadcrumbItemStyles;
  }

  static get experimental() {
    return 'breadcrumbComponent';
  }

  static get properties() {
    return {
      /**
       * The URL to navigate to. When set, the item renders as an `<a>` link.
       * When absent, the item renders as a non-interactive `<span>`.
       */
      path: {
        type: String,
      },

      /**
       * The link target (e.g. `_blank`). Only applies when `path` is set.
       */
      target: {
        type: String,
      },
    };
  }

  /** @protected */
  render() {
    const ariaCurrent = this.hasAttribute('current') ? 'page' : undefined;

    if (this.path != null) {
      return html`
        <a href="${this.path}" target="${ifDefined(this.target)}" part="link" aria-current="${ifDefined(ariaCurrent)}">
          <slot name="prefix"></slot>
          <span part="label">
            <slot></slot>
          </span>
        </a>
      `;
    }

    return html`
      <span part="link" aria-current="${ifDefined(ariaCurrent)}">
        <slot name="prefix"></slot>
        <span part="label">
          <slot></slot>
        </span>
      </span>
    `;
  }

  /** @protected */
  firstUpdated() {
    super.firstUpdated();

    // Set default role if the application has not provided one.
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'listitem');
    }
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();

    // The `current` state attribute is toggled externally by the parent
    // `<vaadin-breadcrumb>` rather than via a public property. Watch the
    // host's attributes so the render template can re-run and reflect the
    // value into the inner link/span as `aria-current="page"`.
    if (!this.__currentObserver) {
      this.__currentObserver = new MutationObserver(() => {
        this.requestUpdate();
      });
    }
    this.__currentObserver.observe(this, { attributes: true, attributeFilter: ['current'] });
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();

    if (this.__currentObserver) {
      this.__currentObserver.disconnect();
    }
  }
}

defineCustomElement(BreadcrumbItem);

export { BreadcrumbItem };

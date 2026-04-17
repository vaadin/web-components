/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

/**
 * A mixin providing common breadcrumb item functionality.
 *
 * @polymerMixin
 */
export const BreadcrumbItemMixin = dedupeMixin(
  (superClass) =>
    class BreadcrumbItemMixinClass extends superClass {
      static get properties() {
        return {
          /**
           * The path (URL) for this breadcrumb item. When set, the item
           * renders as a clickable link.
           *
           * @type {string | undefined}
           */
          path: {
            type: String,
            reflect: true,
          },

          /**
           * Whether this breadcrumb item represents the current page.
           * When true, sets `aria-current="page"` on the anchor.
           *
           * @type {boolean}
           */
          current: {
            type: Boolean,
            reflect: true,
            value: false,
          },
        };
      }

      /**
       * @protected
       * @override
       */
      updated(props) {
        super.updated(props);

        if (props.has('path')) {
          this.toggleAttribute('has-path', this.path != null);
        }
      }

      /** @protected */
      render() {
        return html`
          <a
            part="link"
            href="${ifDefined(this.path)}"
            tabindex="${this.path == null ? '-1' : '0'}"
            aria-current="${this.current ? 'page' : 'false'}"
          >
            <slot name="prefix"></slot>
            <slot></slot>
          </a>
        `;
      }
    },
);

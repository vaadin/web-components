/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement } from 'lit';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-side-nav>` is a Web Component for navigation menus.
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

  static get styles() {
    return css`
      :host {
        display: block;
      }

      :host([hidden]) {
        display: none !important;
      }

      summary {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      slot {
        /* Needed to make role="list" work */
        display: block;
      }
    `;
  }

  /** @protected */
  render() {
    // TODO: add missing logic to render body etc
    return html`
      <details>
        <summary part="label">
          <slot name="label"></slot>
        </summary>
        <slot role="list"></slot>
      </details>
    `;
  }

  /** @protected */
  firstUpdated() {
    super.ready();

    // By default, if the user hasn't provided a custom role,
    // the role attribute is set to "navigation".
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'navigation');
    }
  }
}

customElements.define(SideNav.is, SideNav);

export { SideNav };

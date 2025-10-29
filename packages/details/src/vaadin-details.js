/**
 * @license
 * Copyright (c) 2019 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-details-summary.js';
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { DetailsBaseMixin } from './vaadin-details-base-mixin.js';

/**
 * `<vaadin-details>` is a Web Component which the creates an
 * expandable panel similar to `<details>` HTML element.
 *
 * ```html
 * <vaadin-details>
 *   <vaadin-details-summary slot="summary">Expandable Details</vaadin-details-summary>
 *   <div>
 *     Toggle using mouse, Enter and Space keys.
 *   </div>
 * </vaadin-details>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are exposed for styling:
 *
 * Part name        | Description
 * -----------------|----------------
 * `content`        | The wrapper for the collapsible details content.
 *
 * The following state attributes are available for styling:
 *
 * Attribute      | Description
 * ---------------|------------
 * `opened`       | Set when the collapsible content is expanded and visible
 * `disabled`     | Set when the element is disabled
 * `focus-ring`   | Set when the element is focused using the keyboard
 * `focused`      | Set when the element is focused
 * `has-tooltip`  | Set when the element has a slotted tooltip
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes DetailsBaseMixin
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class Details extends DetailsBaseMixin(ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
  static get is() {
    return 'vaadin-details';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      :host([hidden]) {
        display: none !important;
      }

      [part='content'] {
        display: none;
      }

      :host([opened]) [part='content'] {
        display: block;
      }
    `;
  }

  static get lumoInjector() {
    return { ...super.lumoInjector, includeBaseStyles: true };
  }

  /** @protected */
  render() {
    return html`
      <slot name="summary"></slot>

      <div part="content">
        <slot></slot>
      </div>

      <slot name="tooltip"></slot>
    `;
  }
}

defineCustomElement(Details);

export { Details };

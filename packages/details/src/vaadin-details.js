/**
 * @license
 * Copyright (c) 2019 - 2026 Vaadin Ltd.
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
 * Part name          | Description
 * -------------------|----------------
 * `content`          | The wrapper for the collapsible details content.
 * `summary-wrapper`  | The wrapper for the summary and summary-suffix slots.
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
 * @attr {string} theme - The theme variants to apply to the component.
 * @customElement vaadin-details
 * @extends HTMLElement
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

      :host([hidden]),
      :host(:not([opened])) [part='content'] {
        display: none !important;
      }

      [part='summary-wrapper'] {
        display: flex;
        align-items: center;
      }

      [part='summary-wrapper'] > slot[name='summary'] {
        flex: 1;
      }

      [part='summary-wrapper'] > slot[name='summary-suffix'] {
        flex: none;
      }
    `;
  }

  static get lumoInjector() {
    return { ...super.lumoInjector, includeBaseStyles: true };
  }

  /** @protected */
  render() {
    return html`
      <div part="summary-wrapper">
        <slot name="summary"></slot>
        <slot name="summary-suffix"></slot>
      </div>

      <div part="content">
        <slot></slot>
      </div>

      <slot name="tooltip"></slot>
    `;
  }
}

defineCustomElement(Details);

export { Details };

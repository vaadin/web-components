/**
 * @license
 * Copyright (c) 2019 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-accordion-heading.js';
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { accordionPanel } from './styles/vaadin-accordion-panel-base-styles.js';
import { AccordionPanelMixin } from './vaadin-accordion-panel-mixin.js';

/**
 * The accordion panel element.
 *
 * ### Styling
 *
 * The following shadow DOM parts are exposed for styling:
 *
 * Part name        | Description
 * -----------------|----------------
 * `content`        | The wrapper for the collapsible panel content.
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
 * @mixes AccordionPanelMixin
 * @mixes ThemableMixin
 */
class AccordionPanel extends AccordionPanelMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement)))) {
  static get is() {
    return 'vaadin-accordion-panel';
  }

  static get styles() {
    return accordionPanel;
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

defineCustomElement(AccordionPanel);

export { AccordionPanel };

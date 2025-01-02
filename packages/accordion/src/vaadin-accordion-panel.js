/**
 * @license
 * Copyright (c) 2019 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-accordion-heading.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { AccordionPanelMixin } from './vaadin-accordion-panel-mixin.js';
import { accordionPanel } from './vaadin-accordion-panel-styles.js';

registerStyles('vaadin-accordion-panel', accordionPanel, { moduleId: 'vaadin-accordion-panel-styles' });

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
 * The following attributes are exposed for styling:
 *
 * Attribute    | Description
 * -------------| -----------
 * `opened`     | Set when the collapsible content is expanded and visible.
 * `disabled`   | Set when the element is disabled.
 * `focus-ring` | Set when the element is focused using the keyboard.
 * `focused`    | Set when the element is focused.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes AccordionPanelMixin
 * @mixes ControllerMixin
 * @mixes ThemableMixin
 */
class AccordionPanel extends AccordionPanelMixin(ThemableMixin(ControllerMixin(PolymerElement))) {
  static get is() {
    return 'vaadin-accordion-panel';
  }

  static get template() {
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

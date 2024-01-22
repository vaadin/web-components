/**
 * @license
 * Copyright (c) 2019 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-lit-accordion-heading.js';
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { AccordionPanelMixin } from './vaadin-accordion-panel-mixin.js';
import { accordionPanel } from './vaadin-accordion-panel-styles.js';

/**
 * LitElement based version of `<vaadin-accordion-panel>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class AccordionPanel extends AccordionPanelMixin(ThemableMixin(PolylitMixin(LitElement))) {
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

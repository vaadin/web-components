/**
 * @license
 * Copyright (c) 2019 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-accordion-panel.js';
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { AccordionMixin } from './vaadin-accordion-mixin.js';

/**
 * `<vaadin-accordion>` is a Web Component implementing accordion widget:
 * a vertically stacked set of expandable panels. The component should be
 * used as a wrapper for two or more `<vaadin-accordion-panel>` components.
 *
 * Panel headings function as controls that enable users to open (expand)
 * or hide (collapse) their associated sections of content. The user can
 * toggle panels by mouse click, Enter and Space keys.
 *
 * Only one panel can be opened at a time, opening a new one forces
 * previous panel to close and hide its content.
 *
 * ```html
 * <vaadin-accordion>
 *   <vaadin-accordion-panel>
 *     <vaadin-accordion-heading slot="summary">Panel 1</vaadin-accordion-heading>
 *     <div>This panel is opened, so the text is visible by default.</div>
 *   </vaadin-accordion-panel>
 *   <vaadin-accordion-panel>
 *     <vaadin-accordion-heading slot="summary">Panel 2</vaadin-accordion-heading>
 *     <div>After opening this panel, the first one becomes closed.</div>
 *   </vaadin-accordion-panel>
 * </vaadin-accordion>
 * ```
 *
 * ### Styling
 *
 * Accordion does not have own stylable shadow parts or state attributes. Instead, apply styles to
 * the following components:
 *
 * - [`<vaadin-accordion-heading>`](#/elements/vaadin-accordion-heading)
 * - [`<vaadin-accordion-panel>`](#/elements/vaadin-accordion-panel)
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} items-changed - Fired when the `items` property changes.
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes AccordionMixin
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class Accordion extends AccordionMixin(ThemableMixin(ElementMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-accordion';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      :host([hidden]) {
        display: none !important;
      }
    `;
  }

  /** @protected */
  render() {
    return html`<slot></slot>`;
  }
}

defineCustomElement(Accordion);

export { Accordion };

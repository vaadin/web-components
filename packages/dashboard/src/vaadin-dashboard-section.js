/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { html, LitElement } from 'lit';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { TitleController } from './title-controller.js';

/**
 * A section component for use with the Dashboard component
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ControllerMixin
 */
class DashboardSection extends ControllerMixin(ElementMixin(PolylitMixin(LitElement))) {
  static get is() {
    return 'vaadin-dashboard-section';
  }

  static get styles() {
    return css`
      :host {
        display: grid;
        grid-template-columns: subgrid;
        --_vaadin-dashboard-section-column: 1 / calc(var(--_vaadin-dashboard-effective-col-count) + 1);
        grid-column: var(--_vaadin-dashboard-section-column) !important;
        gap: var(--vaadin-dashboard-gap, 1rem);
        /* Dashbaord section header height */
        --_vaadin-dashboard-section-header-height: minmax(0, auto);
        grid-template-rows: repeat(
          auto-fill,
          var(--_vaadin-dashboard-section-header-height) var(--_vaadin-dashboard-row-height)
        );
        grid-auto-rows: var(--_vaadin-dashboard-row-height);
      }

      :host([hidden]) {
        display: none !important;
      }

      ::slotted(*) {
        --_vaadin-dashboard-title-level: 3;
        --_vaadin-dashboard-item-column: span
          min(
            var(--vaadin-dashboard-item-colspan, 1),
            var(--_vaadin-dashboard-effective-col-count, var(--_vaadin-dashboard-col-count))
          );

        grid-column: var(--_vaadin-dashboard-item-column);
      }

      ::slotted(vaadin-dashboard-widget-wrapper) {
        display: contents;
      }

      header {
        display: flex;
        grid-column: var(--_vaadin-dashboard-section-column);
        justify-content: space-between;
        align-items: center;
      }
    `;
  }

  static get properties() {
    return {
      /**
       * The title of the section
       */
      sectionTitle: {
        type: String,
        value: '',
        observer: '__onSectionTitleChanged',
      },
    };
  }

  /** @protected */
  render() {
    return html`
      <header>
        <slot name="title" @slotchange="${this.__onTitleSlotChange}"></slot>
        <div id="header-actions"></div>
      </header>

      <slot></slot>
    `;
  }

  constructor() {
    super();
    this.__titleController = new TitleController(this);
    this.__titleController.addEventListener('slot-content-changed', (event) => {
      const { node } = event.target;
      if (node) {
        this.setAttribute('aria-labelledby', node.id);
      }
    });
  }

  /** @protected */
  ready() {
    super.ready();
    this.addController(this.__titleController);

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'section');
    }
  }

  /** @private */
  __onSectionTitleChanged(sectionTitle) {
    this.__titleController.setTitle(sectionTitle);
  }
}

defineCustomElement(DashboardSection);

export { DashboardSection };

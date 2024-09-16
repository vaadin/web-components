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
import { FocusTrapController } from '@vaadin/a11y-base/src/focus-trap-controller.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { KeyboardController } from './keyboard-controller.js';
import { TitleController } from './title-controller.js';
import { fireRemove } from './vaadin-dashboard-helpers.js';
import { dashboardWidgetAndSectionStyles, hasWidgetWrappers } from './vaadin-dashboard-styles.js';

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
    return [
      css`
        :host {
          display: grid;
          position: relative;
          grid-template-columns: subgrid;
          --_vaadin-dashboard-section-column: 1 / calc(var(--_vaadin-dashboard-effective-col-count) + 1);
          grid-column: var(--_vaadin-dashboard-section-column) !important;
          gap: var(--vaadin-dashboard-gap, 1rem);
          /* Dashbaord section header height */
          --_vaadin-dashboard-section-header-height: minmax(0, auto);
          grid-template-rows: var(--_vaadin-dashboard-section-header-height) repeat(
              auto-fill,
              var(--_vaadin-dashboard-row-height)
            );
          grid-auto-rows: var(--_vaadin-dashboard-row-height);
        }

        :host([hidden]) {
          display: none !important;
        }

        :host([highlight]) {
          background-color: #f5f5f5;
        }

        ::slotted(*) {
          --_vaadin-dashboard-title-level: 3;
          --_vaadin-dashboard-item-column: span
            min(
              var(--vaadin-dashboard-item-colspan, 1),
              var(--_vaadin-dashboard-effective-col-count, var(--_vaadin-dashboard-col-count))
            );

          grid-column: var(--_vaadin-dashboard-item-column);
          --_vaadin-dashboard-item-row: span var(--vaadin-dashboard-item-rowspan, 1);
          grid-row: var(--_vaadin-dashboard-item-row);
        }

        header {
          grid-column: var(--_vaadin-dashboard-section-column);
        }

        :host::before {
          z-index: 2 !important;
        }
      `,
      hasWidgetWrappers,
      dashboardWidgetAndSectionStyles,
    ];
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

      /** @private */
      __selected: {
        type: Boolean,
        reflectToAttribute: true,
        attribute: 'selected',
        observer: '__selectedChanged',
      },

      /** @private */
      __focused: {
        type: Boolean,
        reflectToAttribute: true,
        attribute: 'focused',
      },

      /** @private */
      __moveMode: {
        type: Boolean,
        reflectToAttribute: true,
        attribute: 'move-mode',
      },
    };
  }

  /** @protected */
  render() {
    return html`
      <button
        aria-label="Select Section Title for editing"
        id="focus-button"
        draggable="true"
        class="drag-handle"
        @click="${() => {
          this.__selected = true;
        }}"
      ></button>

      <div id="focustrap">
        <header>
          <button id="drag-handle" draggable="true" class="drag-handle" tabindex="${this.__selected ? 0 : -1}"></button>
          <slot name="title" @slotchange="${this.__onTitleSlotChange}"></slot>
          <button id="remove-button" tabindex="${this.__selected ? 0 : -1}" @click="${() => fireRemove(this)}"></button>
        </header>
      </div>

      <slot></slot>
    `;
  }

  constructor() {
    super();
    this.__keyboardController = new KeyboardController(this);
    this.__titleController = new TitleController(this);
    this.__focusTrapController = new FocusTrapController(this);
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
    this.addController(this.__keyboardController);
    this.addController(this.__titleController);
    this.addController(this.__focusTrapController);

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'section');
    }
  }

  /** @private */
  __onSectionTitleChanged(sectionTitle) {
    this.__titleController.setTitle(sectionTitle);
  }

  /** @private */
  __selectedChanged(selected) {
    if (selected) {
      this.__focusTrapController.trapFocus(this.$.focustrap);
    } else {
      this.__focusTrapController.releaseFocus();
    }
  }

  focus() {
    if (this.hasAttribute('editable')) {
      this.$['focus-button'].focus();
    } else {
      super.focus();
    }
  }

  __exitMode(focus) {
    if (this.__moveMode) {
      this.__moveMode = false;
      if (focus) {
        this.$['drag-handle'].focus();
      }
    }
    // this.__focusTrapController.releaseFocus();
  }
}

defineCustomElement(DashboardSection);

export { DashboardSection };

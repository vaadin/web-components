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
import { DashboardItemMixin } from './vaadin-dashboard-item-mixin.js';
import { getDefaultI18n } from './vaadin-dashboard-item-mixin.js';
import { hasWidgetWrappers } from './vaadin-dashboard-styles.js';

/**
 * A section component for use with the Dashboard component
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ControllerMixin
 * @mixes DashboardItemMixin
 */
class DashboardSection extends DashboardItemMixin(ControllerMixin(ElementMixin(PolylitMixin(LitElement)))) {
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
      super.styles,
    ];
  }

  static get properties() {
    return {
      /**
       * The object used to localize this component.
       *
       * To change the default localization, replace the entire
       * `i18n` object with a custom one.
       *
       * The object has the following structure and default values:
       * ```
       * {
       *   selectSection: 'Select section for editing',
       *   remove: 'Remove',
       *   move: 'Move',
       *   moveApply: 'Apply',
       *   moveForward: 'Move Forward',
       *   moveBackward: 'Move Backward',
       * }
       * ```
       * @private
       */
      __i18n: {
        type: Object,
        value: () => {
          const i18n = getDefaultI18n();
          return {
            selectSection: i18n.selectSection,
            remove: i18n.remove,
            move: i18n.move,
            moveApply: i18n.moveApply,
            moveForward: i18n.moveForward,
            moveBackward: i18n.moveBackward,
          };
        },
      },

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
      ${this.__renderFocusButton('selectSection')} ${this.__renderMoveControls()}

      <div id="focustrap">
        <header>
          ${this.__renderDragHandle()}
          <slot name="title" id="title" @slotchange="${this.__onTitleSlotChange}"></slot>
          ${this.__renderRemoveButton()}
        </header>
      </div>

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

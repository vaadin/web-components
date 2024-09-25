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
import { SYNCHRONIZED_ATTRIBUTES, WRAPPER_LOCAL_NAME } from './vaadin-dashboard-helpers.js';
import { DashboardItemMixin } from './vaadin-dashboard-item-mixin.js';
import { getDefaultI18n } from './vaadin-dashboard-item-mixin.js';

/**
 * A Widget component for use with the Dashboard component
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ControllerMixin
 * @mixes DashboardItemMixin
 */
class DashboardWidget extends DashboardItemMixin(ControllerMixin(ElementMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-dashboard-widget';
  }

  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;
          grid-column: var(--_vaadin-dashboard-item-column);
          grid-row: var(--_vaadin-dashboard-item-row);
          position: relative;
        }

        :host([hidden]) {
          display: none !important;
        }

        :host(:not([editable])) #resize-handle {
          display: none;
        }

        #content {
          flex: 1;
          min-height: 100px;
        }

        #resize-handle {
          position: absolute;
          bottom: 0;
          inset-inline-end: 0;
          font-size: 30px;
          cursor: grab;
          line-height: 1;
          z-index: 1;
          overflow: hidden;
        }

        #resize-handle::before {
          content: '\\2921';
        }

        :host([dir='rtl']) #resize-handle::before {
          content: '\\2922';
        }

        :host::after {
          content: '';
          z-index: 2;
          position: absolute;
          inset-inline-start: 0;
          top: 0;
          width: var(--_vaadin-dashboard-widget-resizer-width, 0);
          height: var(--_vaadin-dashboard-widget-resizer-height, 0);
          background: rgba(0, 0, 0, 0.1);
        }
      `,
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
       *   selectWidgetTitleForEditing: 'Select widget title for editing',
       *   remove: 'Remove',
       *   resize: 'Resize',
       *   resizeApply: 'Apply',
       *   resizeShrinkWidth: 'Shrink width',
       *   resizeGrowWidth: 'Grow width',
       *   resizeShrinkHeight: 'Shrink height',
       *   resizeGrowHeight: 'Grow height',
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
          delete i18n.selectSectionTitleForEditing;
          return i18n;
        },
      },

      /**
       * The title of the widget.
       */
      widgetTitle: {
        type: String,
        value: '',
        observer: '__onWidgetTitleChanged',
      },
    };
  }

  /** @protected */
  render() {
    return html`
      ${this.__renderFocusButton('selectWidgetTitleForEditing')} ${this.__renderMoveControls()}
      ${this.__renderResizeControls()}

      <div id="focustrap">
        <header>
          ${this.__renderDragHandle()}
          <slot name="title" id="title" @slotchange="${this.__onTitleSlotChange}"></slot>
          <slot name="header"></slot>
          ${this.__renderRemoveButton()}
        </header>

        ${this.__renderResizeHandle()}
      </div>

      <div id="content">
        <slot></slot>
      </div>
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
  connectedCallback() {
    super.connectedCallback();

    const wrapper = this.closest(WRAPPER_LOCAL_NAME);
    if (wrapper) {
      SYNCHRONIZED_ATTRIBUTES.forEach((attr) => {
        this.toggleAttribute(attr, !!wrapper[attr]);
      });
      this.__i18n = wrapper.i18n;
    }

    const undefinedAncestor = this.closest('*:not(:defined)');
    if (undefinedAncestor) {
      customElements.whenDefined(undefinedAncestor.localName).then(() => queueMicrotask(() => this.__updateTitle()));
    } else {
      this.__updateTitle();
    }
  }

  /** @protected */
  ready() {
    super.ready();
    this.addController(this.__titleController);

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'article');
    }
  }

  /** @private */
  __onWidgetTitleChanged() {
    this.__updateTitle();
  }

  /** @private */
  __updateTitle() {
    this.__titleController.setTitle(this.widgetTitle);
  }
}

defineCustomElement(DashboardWidget);

export { DashboardWidget };

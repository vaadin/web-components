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
import {
  fireMove,
  fireRemove,
  fireResize,
  SYNCHRONIZED_ATTRIBUTES,
  WRAPPER_LOCAL_NAME,
} from './vaadin-dashboard-helpers.js';
import { dashboardWidgetAndSectionStyles } from './vaadin-dashboard-styles.js';

/**
 * A Widget component for use with the Dashboard component
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ControllerMixin
 */
class DashboardWidget extends ControllerMixin(ElementMixin(PolylitMixin(LitElement))) {
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

        .controls {
          position: absolute;
          inset: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: rgba(255, 255, 255, 0.5);
          z-index: 1;
        }

        .controls[hidden] {
          display: none;
        }

        #resize-shink-width {
          position: absolute;
          inset-inline-end: 0;
          inset-block-start: 50%;
          transform: translateY(-50%);
        }

        #resize-grow-width {
          position: absolute;
          inset-inline-start: 100%;
          inset-block-start: 50%;
          transform: translateY(-50%);
        }

        #resize-shink-height {
          position: absolute;
          inset-inline-start: 50%;
          inset-block-end: 0;
          transform: translateX(-50%);
        }

        #resize-grow-height {
          position: absolute;
          inset-inline-start: 50%;
          inset-block-start: 100%;
          transform: translateX(-50%);
        }
      `,
      dashboardWidgetAndSectionStyles,
    ];
  }

  static get properties() {
    return {
      /**
       * The title of the widget.
       */
      widgetTitle: {
        type: String,
        value: '',
        observer: '__onWidgetTitleChanged',
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

      /** @private */
      __resizeMode: {
        type: Boolean,
        reflectToAttribute: true,
        attribute: 'resize-mode',
      },
    };
  }

  /** @protected */
  render() {
    return html`
      <button
        aria-label="Select Widget Title for editing"
        id="focus-button"
        draggable="true"
        class="drag-handle"
        @click="${() => {
          this.__selected = true;
        }}"
      ></button>

      <div id="focustrap">
        <header>
          <button
            id="drag-handle"
            draggable="true"
            class="drag-handle"
            tabindex="${this.__selected ? 0 : -1}"
            @click="${() => this.__move()}"
          ></button>
          <slot name="title" @slotchange="${this.__onTitleSlotChange}"></slot>
          <slot name="header"></slot>
          <button id="remove-button" tabindex="${this.__selected ? 0 : -1}" @click="${() => fireRemove(this)}"></button>
        </header>

        <button
          id="resize-handle"
          class="resize-handle"
          tabindex="${this.__selected ? 0 : -1}"
          @click="${() => this.__resize()}"
        ></button>
      </div>

      <div id="content">
        <slot></slot>
      </div>

      <div id="movecontrols" class="controls" .hidden="${!this.__moveMode}">
        <button title="Move backward" @click="${() => fireMove(this, -1)}">&lt;️</button>
        <button title="Move forward" @click="${() => fireMove(this, 1)}">&gt;️</button>
      </div>

      <div id="resizecontrols" class="controls" .hidden="${!this.__resizeMode}">
        <button id="resize-shink-width" title="Shrink width" @click="${() => fireResize(this, -1, 0)}">-</button>
        <button id="resize-grow-width" title="Grow width" @click="${() => fireResize(this, 1, 0)}">+</button>
        <button id="resize-shink-height" title="Shrink height" @click="${() => fireResize(this, 0, -1)}">-</button>
        <button id="resize-grow-height" title="Grow height" @click="${() => fireResize(this, 0, 1)}">+</button>
      </div>
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
  connectedCallback() {
    super.connectedCallback();

    const wrapper = this.closest(WRAPPER_LOCAL_NAME);
    if (wrapper) {
      SYNCHRONIZED_ATTRIBUTES.forEach((attr) => {
        this.toggleAttribute(attr, wrapper.hasAttribute(attr));
      });
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
    this.addController(this.__keyboardController);
    this.addController(this.__focusTrapController);

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

  /** @private */
  __selectedChanged(selected) {
    if (selected) {
      this.__focusTrapController.trapFocus(this.$.focustrap);
    } else {
      this.__focusTrapController.releaseFocus();
    }
  }

  focus() {
    if (this.__selected) {
      this.$['drag-handle'].focus();
    } else if (this.hasAttribute('editable')) {
      this.$['focus-button'].focus();
    } else {
      super.focus();
    }
  }

  /** @private */
  __exitMode(focus) {
    if (this.__moveMode) {
      this.__moveMode = false;
      if (focus) {
        this.$['drag-handle'].focus();
        this.__focusTrapController.trapFocus(this.$.focustrap);
      }
    } else if (this.__resizeMode) {
      this.__resizeMode = false;
      if (focus) {
        this.$['resize-handle'].focus();
        this.__focusTrapController.trapFocus(this.$.focustrap);
      }
    }
  }

  /** @private */
  __move() {
    this.__moveMode = true;
    requestAnimationFrame(() => {
      this.__focusTrapController.trapFocus(this.$.movecontrols);
      this.$.movecontrols.querySelector('button').focus();
    });
  }

  /** @private */
  __resize() {
    this.__resizeMode = true;
    requestAnimationFrame(() => {
      this.__focusTrapController.trapFocus(this.$.resizecontrols);
      this.$.resizecontrols.querySelector('button').focus();
    });
  }
}

defineCustomElement(DashboardWidget);

export { DashboardWidget };

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
import { html } from 'lit';
import { FocusTrapController } from '@vaadin/a11y-base/src/focus-trap-controller.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { KeyboardController } from './keyboard-controller.js';
import { fireMove, fireRemove } from './vaadin-dashboard-helpers.js';
import { dashboardWidgetAndSectionStyles } from './vaadin-dashboard-styles.js';

/**
 * Shared functionality between widgets and sections
 *
 * @polymerMixin
 * @mixes ResizeMixin
 */
export const DashboardItemMixin = (superClass) =>
  class DashboardItemMixinClass extends ResizeMixin(superClass) {
    static get styles() {
      return dashboardWidgetAndSectionStyles;
    }

    static get properties() {
      return {
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

    /** @private */
    __renderDragHandle() {
      return html`<button
        id="drag-handle"
        draggable="true"
        class="drag-handle"
        tabindex="${this.__selected ? 0 : -1}"
        @click="${() => this.__enterMoveMode()}"
      ></button>`;
    }

    /** @private */
    __renderRemoveButton() {
      return html`<button
        id="remove-button"
        tabindex="${this.__selected ? 0 : -1}"
        @click="${() => fireRemove(this)}"
      ></button>`;
    }

    /** @private */
    __renderFocusButton() {
      return html`<button
        aria-label="Select Title for editing"
        id="focus-button"
        draggable="true"
        class="drag-handle"
        @click="${() => {
          this.__selected = true;
        }}"
      ></button>`;
    }

    /** @private */
    __renderModeControls() {
      return html`<div
        id="move-controls"
        class="mode-controls"
        .hidden="${!this.__moveMode}"
        @pointerdown="${(e) => e.preventDefault()}"
      >
        <button title="Move backward" @click="${() => fireMove(this, -1)}" id="move-backward"></button>
        <button title="Apply" @click="${() => this.__exitMode(true)}" id="move-apply"></button>
        <button title="Move forward" @click="${() => fireMove(this, 1)}" id="move-forward"></button>
      </div>`;
    }

    constructor() {
      super();
      this.__keyboardController = new KeyboardController(this);
      this.__focusTrapController = new FocusTrapController(this);
    }

    /** @protected */
    ready() {
      super.ready();
      this.addController(this.__keyboardController);
      this.addController(this.__focusTrapController);
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

    /** @private */
    __exitMode(focus) {
      if (this.__moveMode) {
        this.__moveMode = false;
        if (focus) {
          this.$['drag-handle'].focus();
          this.__focusTrapController.trapFocus(this.$.focustrap);
        }
      }
    }

    /** @private */
    __focusApply() {
      if (this.__moveMode) {
        this.$['move-apply'].focus();
      }
    }

    /** @private */
    __enterMoveMode() {
      this.__selected = true;
      this.__moveMode = true;
      requestAnimationFrame(() => {
        this.__focusTrapController.trapFocus(this.$['move-controls']);
      });
    }
  };

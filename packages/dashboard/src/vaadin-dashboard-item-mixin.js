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
import './vaadin-dashboard-button.js';
import { html } from 'lit';
import { FocusTrapController } from '@vaadin/a11y-base/src/focus-trap-controller.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { KeyboardController } from './keyboard-controller.js';
import { fireMove, fireRemove, fireResize } from './vaadin-dashboard-helpers.js';
import { dashboardWidgetAndSectionStyles } from './vaadin-dashboard-styles.js';

const DEFAULT_I18N = {
  selectWidget: 'Select widget for editing',
  selectSection: 'Select section for editing',
  remove: 'Remove',
  move: 'Move',
  moveApply: 'Apply',
  moveForward: 'Move Forward',
  moveBackward: 'Move Backward',
  resize: 'Resize',
  resizeApply: 'Apply',
  resizeShrinkWidth: 'Shrink width',
  resizeGrowWidth: 'Grow width',
  resizeShrinkHeight: 'Shrink height',
  resizeGrowHeight: 'Grow height',
};

/**
 * Returns a new object with the default i18n values
 */
export function getDefaultI18n() {
  return { ...DEFAULT_I18N };
}

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
        /** @protected */
        __i18n: {
          type: Object,
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
          observer: '__moveModeChanged',
        },

        /** @private */
        __resizeMode: {
          type: Boolean,
          reflectToAttribute: true,
          attribute: 'resize-mode',
          observer: '__resizeModeChanged',
        },
      };
    }

    /** @private */
    __renderDragHandle() {
      return html`<vaadin-dashboard-button
        id="drag-handle"
        draggable="true"
        class="drag-handle"
        part="move-button"
        theme="icon tertiary"
        aria-label="${this.__i18n.move}"
        title="${this.__i18n.move}"
        tabindex="${this.__selected ? 0 : -1}"
        @click="${() => this.__enterMoveMode()}"
      >
        <div class="icon"></div>
      </vaadin-dashboard-button>`;
    }

    /** @private */
    __renderRemoveButton() {
      return html`<vaadin-dashboard-button
        aria-label="${this.__i18n.remove}"
        title="${this.__i18n.remove}"
        id="remove-button"
        part="remove-button"
        theme="icon tertiary"
        tabindex="${this.__selected ? 0 : -1}"
        @click="${() => fireRemove(this)}"
      >
        <div class="icon"></div>
      </vaadin-dashboard-button>`;
    }

    /** @private */
    __renderFocusButton(i18nSelectTitleForEditingProperty) {
      // To make the button draggable on Firefox, using a workaround from https://stackoverflow.com/a/55019027/3409629
      return html`<label draggable="true" class="drag-handle" id="focus-button-wrapper">
        <button
          id="focus-button"
          aria-label=${this.__i18n[i18nSelectTitleForEditingProperty]}
          aria-describedby="title"
          aria-pressed="${!!this.__selected}"
          @focus="${() => {
            this.__focused = true;
          }}"
          @blur="${() => {
            this.__focused = false;
          }}"
          @click="${() => {
            const wasSelected = this.__selected;
            this.__selected = !wasSelected;
            this.__focused = wasSelected;
            if (this.__selected) {
              this.$['drag-handle'].focus();
            }
          }}"
        ></button>
      </label>`;
    }

    /** @private */
    __renderResizeHandle() {
      return html`<vaadin-dashboard-button
        aria-label="${this.__i18n.resize}"
        title="${this.__i18n.resize}"
        id="resize-handle"
        part="resize-button"
        class="resize-handle"
        theme="icon tertiary"
        tabindex="${this.__selected ? 0 : -1}"
        @click="${() => this.__enterResizeMode()}"
      >
        <div class="icon"></div>
      </vaadin-dashboard-button>`;
    }

    /** @private */
    __renderMoveControls() {
      return html`<div
        id="move-controls"
        class="mode-controls"
        .hidden="${!this.__moveMode}"
        @pointerdown="${(e) => e.preventDefault()}"
      >
        <vaadin-dashboard-button
          theme="primary icon"
          aria-label="${this.__i18n.moveBackward}"
          title="${this.__i18n.moveBackward}"
          @click="${() => fireMove(this, -1)}"
          id="move-backward"
          part="move-backward-button"
        >
          <div class="icon"></div>
        </vaadin-dashboard-button>
        <vaadin-dashboard-button
          theme="primary icon large"
          aria-label="${this.__i18n.moveApply}"
          title="${this.__i18n.moveApply}"
          @click="${() => this.__exitMode(true)}"
          id="move-apply"
          part="move-apply-button"
        >
          <div class="icon"></div>
        </vaadin-dashboard-button>
        <vaadin-dashboard-button
          theme="primary icon"
          aria-label="${this.__i18n.moveForward}"
          title="${this.__i18n.moveForward}"
          @click="${() => fireMove(this, 1)}"
          id="move-forward"
          part="move-forward-button"
        >
          <div class="icon"></div>
        </vaadin-dashboard-button>
      </div>`;
    }

    /** @private */
    __renderResizeControls() {
      const style = getComputedStyle(this);
      const hasMinRowHeight = style.getPropertyValue('--_vaadin-dashboard-row-min-height') !== 'auto';

      const effectiveColCount = style.getPropertyValue('--_vaadin-dashboard-col-count');
      const maxColCount = style.getPropertyValue('--_vaadin-dashboard-col-max-count');
      const colCount = Math.min(effectiveColCount, maxColCount);
      const colspan = style.getPropertyValue('--vaadin-dashboard-item-colspan') || 1;
      const rowspan = style.getPropertyValue('--vaadin-dashboard-item-rowspan') || 1;
      const canShrinkWidth = colspan > 1;
      const canShrinkHeight = rowspan > 1;
      const canGrowWidth = colspan < colCount;

      return html`<div
        id="resize-controls"
        class="mode-controls"
        .hidden="${!this.__resizeMode}"
        @pointerdown="${(e) => e.preventDefault()}"
      >
        <vaadin-dashboard-button
          theme="primary icon large"
          aria-label="${this.__i18n.resizeApply}"
          title="${this.__i18n.resizeApply}"
          @click="${() => this.__exitMode(true)}"
          id="resize-apply"
          part="resize-apply-button"
        >
          <div class="icon"></div>
        </vaadin-dashboard-button>
        <vaadin-dashboard-button
          theme="primary icon"
          aria-label="${this.__i18n.resizeShrinkWidth}"
          title="${this.__i18n.resizeShrinkWidth}"
          @click="${() => fireResize(this, -1, 0)}"
          .hidden="${!canShrinkWidth}"
          id="resize-shrink-width"
          part="resize-shrink-width-button"
        >
          <div class="icon"></div>
        </vaadin-dashboard-button>
        <vaadin-dashboard-button
          theme="primary icon"
          aria-label="${this.__i18n.resizeGrowWidth}"
          title="${this.__i18n.resizeGrowWidth}"
          @click="${() => fireResize(this, 1, 0)}"
          .hidden="${!canGrowWidth}"
          id="resize-grow-width"
          part="resize-grow-width-button"
        >
          <div class="icon"></div>
        </vaadin-dashboard-button>
        <vaadin-dashboard-button
          theme="primary icon"
          aria-label="${this.__i18n.resizeShrinkHeight}"
          title="${this.__i18n.resizeShrinkHeight}"
          @click="${() => fireResize(this, 0, -1)}"
          id="resize-shrink-height"
          part="resize-shrink-height-button"
          .hidden="${!hasMinRowHeight || !canShrinkHeight}"
        >
          <div class="icon"></div>
        </vaadin-dashboard-button>
        <vaadin-dashboard-button
          theme="primary icon"
          aria-label="${this.__i18n.resizeGrowHeight}"
          title="${this.__i18n.resizeGrowHeight}"
          @click="${() => fireResize(this, 0, 1)}"
          id="resize-grow-height"
          part="resize-grow-height-button"
          .hidden="${!hasMinRowHeight}"
        >
          <div class="icon"></div>
        </vaadin-dashboard-button>
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
    __selectedChanged(selected, oldSelected) {
      if (!!selected === !!oldSelected) {
        return;
      }
      this.dispatchEvent(new CustomEvent('item-selected-changed', { bubbles: true, detail: { value: selected } }));
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
      } else if (this.__resizeMode) {
        this.__resizeMode = false;
        if (focus) {
          this.$['resize-handle'].focus();
          this.__focusTrapController.trapFocus(this.$.focustrap);
        }
      }
    }

    /** @private */
    __focusApply() {
      if (this.__moveMode) {
        this.$['move-apply'].focus();
      } else if (this.__resizeMode) {
        this.$['resize-apply'].focus();
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

    /** @private */
    __enterResizeMode() {
      this.__selected = true;
      this.__resizeMode = true;
      requestAnimationFrame(() => {
        this.__focusTrapController.trapFocus(this.$['resize-controls']);
      });
    }

    /** @private */
    __moveModeChanged(moveMode, oldMoveMode) {
      if (!!moveMode === !!oldMoveMode) {
        return;
      }
      this.dispatchEvent(new CustomEvent('item-move-mode-changed', { bubbles: true, detail: { value: moveMode } }));
    }

    /** @private */
    __resizeModeChanged(resizeMode, oldResizeMode) {
      if (!!resizeMode === !!oldResizeMode) {
        return;
      }
      this.dispatchEvent(new CustomEvent('item-resize-mode-changed', { bubbles: true, detail: { value: resizeMode } }));
    }
  };

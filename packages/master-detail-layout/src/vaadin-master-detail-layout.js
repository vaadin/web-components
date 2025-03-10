/**
 * @license
 * Copyright (c) 2025 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-master-detail-layout>` is a web component for building UIs with a master
 * (or primary) area and a detail (or secondary) area that is displayed next to, or
 * overlaid on top of, the master area, depending on configuration and viewport size.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes ElementMixin
 */
class MasterDetailLayout extends ElementMixin(ThemableMixin(PolylitMixin(LitElement))) {
  static get is() {
    return 'vaadin-master-detail-layout';
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        box-sizing: border-box;
        height: 100%;
      }

      :host([hidden]) {
        display: none !important;
      }

      :host(:not([has-detail])) [part='detail'] {
        display: none;
      }

      /* No fixed size */
      :host(:not([has-master-size])) [part='master'] {
        flex-grow: 1;
        flex-basis: var(--_master-min-size, 50%);
      }

      :host(:not([has-detail-size])) [part='detail'] {
        flex-grow: 1;
        flex-basis: var(--_detail-min-size, 50%);
      }

      /* Fixed size */
      :host([has-master-size]) [part='master'] {
        width: var(--_master-size);
        flex-shrink: 0;
      }

      :host([has-detail-size]) [part='detail'] {
        width: var(--_detail-size);
        flex-shrink: 0;
      }
    `;
  }

  static get properties() {
    return {
      /**
       * Fixed size (in CSS length units) to be set on the detail pane.
       * When specified, it prevents the detail pane from growing.
       *
       * @attr {string} detail-size
       */
      detailSize: {
        type: String,
        sync: true,
        observer: '__detailSizeChanged',
      },

      /**
       * Minimum size (in CSS length units) to be set on the detail pane.
       *
       * @attr {string} detail-min-size
       */
      detailMinSize: {
        type: String,
        sync: true,
        observer: '__detailMinSizeChanged',
      },

      /**
       * Fixed size (in CSS length units) to be set on the master pane.
       * When specified, it prevents the master pane from growing.
       *
       * @attr {string} master-size
       */
      masterSize: {
        type: String,
        sync: true,
        observer: '__masterSizeChanged',
      },

      /**
       * Minimum size (in CSS length units) to be set on the master pane.
       *
       * @attr {string} master-min-size
       */
      masterMinSize: {
        type: String,
        sync: true,
        observer: '__masterMinSizeChanged',
      },
    };
  }

  /** @protected */
  render() {
    return html`
      <div part="master">
        <slot></slot>
      </div>
      <div part="detail">
        <slot name="detail" @slotchange="${this.__onDetailSlotChange}"></slot>
      </div>
    `;
  }

  /** @private */
  __onDetailSlotChange(e) {
    this.toggleAttribute('has-detail', e.target.assignedNodes().length > 0);
  }

  /** @private */
  __detailSizeChanged(size, oldSize) {
    this.toggleAttribute('has-detail-size', !!size);
    this.__updateStyleProperty('detail-size', size, oldSize);
  }

  /** @private */
  __detailMinSizeChanged(size, oldSize) {
    this.__updateStyleProperty('detail-min-size', size, oldSize);
  }

  /** @private */
  __masterSizeChanged(size, oldSize) {
    this.toggleAttribute('has-master-size', !!size);
    this.__updateStyleProperty('master-size', size, oldSize);
  }

  /** @private */
  __masterMinSizeChanged(size, oldSize) {
    this.__updateStyleProperty('master-min-size', size, oldSize);
  }

  /** @private */
  __updateStyleProperty(prop, size, oldSize) {
    if (size) {
      this.style.setProperty(`--_${prop}`, size);
    } else if (oldSize) {
      this.style.removeProperty(`--_${prop}`);
    }
  }
}

defineCustomElement(MasterDetailLayout);

export { MasterDetailLayout };

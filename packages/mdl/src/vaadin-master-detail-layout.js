/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { masterDetailLayoutStyles } from './styles/vaadin-master-detail-layout-base-styles.js';

/**
 * `<vaadin-master-detail-layout>` is a web component for building UIs with a master
 * (or primary) area and a detail (or secondary) area that is displayed next to, or
 * overlaid on top of, the master area, depending on configuration and viewport size.
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name      | Description
 * ---------------|----------------------
 * `backdrop`     | Backdrop covering the master area in the drawer mode
 * `master`       | The master area
 * `detail`       | The detail area
 *
 * The following state attributes are available for styling:
 *
 * Attribute      | Description
 * ---------------| -----------
 * `expand`       | Set to `master`, `detail`, or `both` depending on the expand mode.
 * `has-detail`   | Set when the detail content is provided.
 *
 * @customElement vaadin-master-detail-layout
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes ElementMixin
 */
class MasterDetailLayout extends ElementMixin(ThemableMixin(PolylitMixin(LitElement))) {
  static get is() {
    return 'vaadin-master-detail-layout';
  }

  static get styles() {
    return masterDetailLayoutStyles;
  }

  static get properties() {
    return {
      /**
       * Size (in CSS length units) for the master column.
       * Used as the basis for the master column in the CSS grid layout.
       *
       * @attr {string} master-size
       */
      masterSize: {
        type: String,
        sync: true,
        observer: '__masterSizeChanged',
      },

      /**
       * Size (in CSS length units) for the detail column.
       * Used as the basis for the detail column in the CSS grid layout.
       *
       * @attr {string} detail-size
       */
      detailSize: {
        type: String,
        sync: true,
        observer: '__detailSizeChanged',
      },

      /**
       * Controls which column(s) expand to fill available space.
       * Possible values: `'master'`, `'detail'`, `'both'`.
       * Defaults to `'both'`.
       */
      expand: {
        type: String,
        value: 'both',
        reflectToAttribute: true,
        sync: true,
      },

      /**
       * Controls the visual style of the detail overlay when the layout
       * overflows (i.e., when both columns don't fit side by side).
       *
       * Possible values:
       * - `'drawer'` (default): detail as a sticky side-panel with backdrop
       * - `'full'`: detail covers the entire layout area
       *
       * @attr {string} detail-overlay-mode
       */
      detailOverlayMode: {
        type: String,
        value: 'drawer',
        reflectToAttribute: true,
        sync: true,
      },

      /**
       * When true, the component has the detail content provided.
       * @protected
       */
      _hasDetail: {
        type: Boolean,
        attribute: 'has-detail',
        reflectToAttribute: true,
        sync: true,
      },
    };
  }

  static get experimental() {
    return true;
  }

  /** @protected */
  render() {
    return html`
      <div part="backdrop"></div>
      <div id="master" part="master">
        <slot></slot>
      </div>
      <div id="detail" part="detail">
        <slot name="detail" @slotchange="${this.__onDetailSlotChange}"></slot>
      </div>
    `;
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();

    this.__resizeObserver = new ResizeObserver(() => setTimeout(() => this.__detectOverflow()));
    this.__resizeObserver.observe(this);
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();

    this.__resizeObserver.disconnect();
  }

  /** @private */
  __onDetailSlotChange(e) {
    const children = e.target.assignedNodes();
    this._hasDetail = children.length > 0;
    this.__detectOverflow();
  }

  /** @private */
  __masterSizeChanged(size, oldSize) {
    this.__updateStyleProperty('master-size', size, oldSize);
    this.__detectOverflow();
  }

  /** @private */
  __detailSizeChanged(size, oldSize) {
    this.__updateStyleProperty('detail-size', size, oldSize);
    this.__detectOverflow();
  }

  /** @private */
  __updateStyleProperty(prop, size, oldSize) {
    if (size) {
      this.style.setProperty(`--_${prop}`, size);
    } else if (oldSize) {
      this.style.removeProperty(`--_${prop}`);
    }

    this.toggleAttribute(`has-${prop}`, !!size);
  }

  /**
   * Reads resolved CSS grid column widths and toggles the `overflow`
   * attribute when the sum of column minimums exceeds the host width.
   * @private
   */
  __detectOverflow() {
    // In full mode with overflow, the detail's CSS (negative margin, explicit
    // width) changes its contribution to grid track sizing. Temporarily remove
    // overflow to measure "natural" column widths and avoid oscillation.
    if (this.detailOverlayMode === 'full' && this.hasAttribute('overflow')) {
      this.removeAttribute('overflow');
    }

    const { gridTemplateColumns } = getComputedStyle(this);
    const columns = gridTemplateColumns.split(' ').map(parseFloat);
    const totalWidth = columns.reduce((a, b) => a + b, 0);
    const hasOverflow = Math.round(totalWidth) > this.offsetWidth;
    this.toggleAttribute('overflow', hasOverflow);

    if (hasOverflow && columns.length >= 2) {
      this.style.setProperty('--_master-col-width', `${columns[0]}px`);
      this.style.setProperty('--_host-width', `${this.offsetWidth}px`);
    } else {
      this.style.removeProperty('--_master-col-width');
      this.style.removeProperty('--_host-width');
    }
  }
}

defineCustomElement(MasterDetailLayout);

export { MasterDetailLayout };

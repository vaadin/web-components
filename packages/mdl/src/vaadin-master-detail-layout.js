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
 * Attribute             | Description
 * ----------------------|----------------------
 * `expand`              | Set to `master`, `detail`, or `both` depending on the expand mode.
 * `has-detail`          | Set when the detail content is provided.
 * `detail-overlay-mode` | Set to `drawer`, `drawer-viewport`, `full`, or `full-viewport` depending on the overlay mode.
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
       * Controls the overlay mode for the detail panel.
       * Possible values: `'drawer'`, `'drawer-viewport'`, `'full'`, `'full-viewport'`.
       * Defaults to `'drawer'`.
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
        <slot @slotchange="${this.__onSlotChange}"></slot>
      </div>
      <div id="detail" part="detail">
        <slot name="detail" @slotchange="${this.__onSlotChange}"></slot>
      </div>
    `;
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();
    this.__initResizeObserver();
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.__resizeObserver.disconnect();
  }

  /** @private */
  __masterSizeChanged(size, oldSize) {
    this.__updateStyleProperty('master-size', size, oldSize);
  }

  /** @private */
  __detailSizeChanged(size, oldSize) {
    this.__updateStyleProperty('detail-size', size, oldSize);
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

  /** @private */
  __onSlotChange() {
    if (!this.__initPending) {
      this.__initPending = true;
      queueMicrotask(() => {
        this.__initPending = false;
        this.__initResizeObserver();
      });
    }
  }

  /** @private */
  __initResizeObserver() {
    this.__resizeObserver = this.__resizeObserver || new ResizeObserver(() => this.__onResize());
    this.__resizeObserver.disconnect();

    const children = this.querySelectorAll('[slot="detail"], :not([slot])');
    [this, ...children].forEach((node) => {
      this.__resizeObserver.observe(node);
    });
  }

  /**
   * Called by the ResizeObserver whenever the host element is resized.
   * Updates `has-detail` and `overflow` attributes.
   * @private
   */
  __onResize() {
    // Update has-detail first — it controls --_detail-column CSS variable,
    // which affects grid column widths read below.
    const hasDetail = this.__computeDetailVisibility();
    this.toggleAttribute('has-detail', hasDetail);

    const [masterWidth, detailWidth] = this.__computeColumnWidths();
    const hasOverflow = hasDetail && Math.round(masterWidth + detailWidth) > this.offsetWidth;
    this.toggleAttribute('overflow', hasOverflow);
  }

  /** @private */
  __computeDetailVisibility() {
    return [...this.querySelectorAll('[slot="detail"]')].some((node) => node.checkVisibility());
  }

  /** @private */
  __computeColumnWidths() {
    const { gridTemplateColumns } = getComputedStyle(this);
    return gridTemplateColumns.split(' ').map(parseFloat);
  }
}

defineCustomElement(MasterDetailLayout);

export { MasterDetailLayout };

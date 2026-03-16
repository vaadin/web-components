/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { SlotObserver } from '@vaadin/component-base/src/slot-observer.js';
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
       * Size (in CSS length units) for the detail content when it's rendered in an overlay.
       * Defaults to the value of `detailSize`.
       *
       * @attr {string} detail-overlay-size
       */
      detailOverlaySize: {
        type: String,
        sync: true,
        observer: '__detailOverlaySizeChanged',
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
        <slot></slot>
      </div>
      <div id="detail" part="detail">
        <slot name="detail"></slot>
      </div>
    `;
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();

    this.__resizeObserver = new ResizeObserver(() => this.__onResize());
    this.__resizeObserver.observe(this);

    this.__masterSlot = this.shadowRoot.querySelector('slot:not([name])');
    this.__masterSlotObserver = new SlotObserver(this.__masterSlot, ({ addedNodes, removedNodes }) => {
      removedNodes.forEach((node) => this.__resizeObserver.unobserve(node));
      addedNodes.forEach((node) => this.__resizeObserver.observe(node));
    });

    this.__detailSlot = this.shadowRoot.querySelector('slot[name="detail"]');
    this.__detailSlotObserver = new SlotObserver(this.__detailSlot, ({ addedNodes, removedNodes }) => {
      removedNodes.forEach((node) => this.__resizeObserver.unobserve(node));
      addedNodes.forEach((node) => this.__resizeObserver.observe(node));
    });
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.__resizeObserver.disconnect();
    this.__masterSlotObserver.disconnect();
    this.__detailSlotObserver.disconnect();
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
  __detailOverlaySizeChanged(size, oldSize) {
    this.__updateStyleProperty('detail-overlay-size', size, oldSize);
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
   * Called by the ResizeObserver whenever the host element is resized.
   * Updates `has-detail` and `overflow` attributes, and locks/unlocks
   * the master column width to prevent content from shrinking during
   * CSS grid reflow when the detail panel appears or disappears.
   * @private
   */
  __onResize() {
    const hasDetail = this.__computeDetailVisibility();
    const [masterWidth, detailWidth] = this.__computeColumnWidths();
    const hasOverflow = hasDetail && masterWidth + detailWidth > this.offsetWidth;

    if (!this.hasAttribute('has-detail') && hasDetail) {
      // Lock the master column width when the detail panel becomes visible.
      // This prevents the master content from shrinking when the CSS grid
      // allocates space for the detail column in response to the `has-detail`
      // attribute while the master area is configured to expand.
      this.style.setProperty('--_master-column', `clamp(${this.masterSize}, 100%, ${masterWidth}px)`);
    }
    if (this.hasAttribute('has-detail') && !hasDetail) {
      // Unlock the master column width when the detail panel becomes hidden.
      this.style.removeProperty('--_master-column');
    }
    if (this.hasAttribute('overflow') && !hasOverflow) {
      // Unlock the master column width when overflow is no longer present.
      this.style.removeProperty('--_master-column');
    }

    this.toggleAttribute('has-detail', hasDetail);
    this.toggleAttribute('overflow', hasOverflow);
  }

  /** @private */
  __computeDetailVisibility() {
    return [...this.__detailSlot.assignedNodes()].some((node) => node.checkVisibility());
  }

  /** @private */
  __computeColumnWidths() {
    const { gridTemplateColumns } = getComputedStyle(this);
    return gridTemplateColumns.split(' ').map(parseFloat);
  }
}

defineCustomElement(MasterDetailLayout);

export { MasterDetailLayout };

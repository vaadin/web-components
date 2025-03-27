/**
 * @license
 * Copyright (c) 2025 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement, nothing } from 'lit';
import { getFocusableElements } from '@vaadin/a11y-base/src/focus-utils.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { SlotStylesMixin } from '@vaadin/component-base/src/slot-styles-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { transitionStyles } from './vaadin-master-detail-layout-transition-styles.js';

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
 * `master`       | The master area
 * `detail`       | The detail area
 *
 * The following state attributes are available for styling:
 *
 * Attribute      | Description
 * ---------------| -----------
 * `containment`  | Set to `layout` or `viewport` depending on the containment.
 * `orientation`  | Set to `horizontal` or `vertical` depending on the orientation.
 * `has-detail`   | Set when the detail content is provided.
 * `overlay`      | Set when the layout is using the overlay mode.
 * `stack`        | Set when the layout is using the stack mode.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes ElementMixin
 * @mixes ResizeMixin
 * @mixes SlotStylesMixin
 */
class MasterDetailLayout extends SlotStylesMixin(ResizeMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement))))) {
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

      /* Overlay mode */
      :host(:is([overlay], [stack])) {
        position: relative;
      }

      :host(:is([overlay], [stack])[containment='layout']) [part='detail'] {
        position: absolute;
      }

      :host(:is([overlay], [stack])[containment='viewport']) [part='detail'] {
        position: fixed;
      }

      :host([overlay][orientation='horizontal']) [part='detail'] {
        inset-inline-end: 0;
        height: 100%;
        width: var(--_detail-min-size, min-content);
        max-width: 100%;
      }

      :host([overlay][orientation='horizontal'][containment='viewport']) [part='detail'] {
        inset-block-start: 0;
      }

      :host([overlay][orientation='horizontal']) [part='master'] {
        max-width: 100%;
      }

      /* No fixed size */
      :host(:not([has-master-size])) [part='master'],
      :host(:not([has-detail-size])) [part='detail'] {
        flex-grow: 1;
        flex-basis: 50%;
      }

      /* Fixed size */
      :host([has-master-size]) [part='master'],
      :host([has-detail-size]) [part='detail'] {
        flex-shrink: 0;
      }

      :host([has-master-size][orientation='horizontal']) [part='master'] {
        width: var(--_master-size);
      }

      :host([has-detail-size][orientation='horizontal']:not([stack])) [part='detail'] {
        width: var(--_detail-size);
      }

      :host([has-master-size][has-detail-size]) [part='master'] {
        flex-grow: 1;
        flex-basis: var(--_master-size);
      }

      :host([has-master-size][has-detail-size]) [part='detail'] {
        flex-grow: 1;
        flex-basis: var(--_detail-size);
      }

      /* Min size */
      :host([has-master-min-size][orientation='horizontal']:not([overlay])) [part='master'] {
        min-width: var(--_master-min-size);
      }

      :host([has-detail-min-size][orientation='horizontal']:not([overlay]):not([stack])) [part='detail'] {
        min-width: var(--_detail-min-size);
      }

      :host([has-master-min-size]) [part='master'],
      :host([has-detail-min-size]) [part='detail'] {
        flex-shrink: 0;
      }

      /* Vertical */
      :host([orientation='vertical']) {
        flex-direction: column;
      }

      :host([orientation='vertical'][overlay]) [part='master'] {
        max-height: 100%;
      }

      :host([orientation='vertical'][overlay]) [part='detail'] {
        inset-block-end: 0;
        width: 100%;
        height: var(--_detail-min-size, min-content);
      }

      :host([overlay][orientation='vertical'][containment='viewport']) [part='detail'] {
        inset-inline-start: 0;
      }

      /* Fixed size */
      :host([has-master-size][orientation='vertical']) [part='master'] {
        height: var(--_master-size);
      }

      :host([has-detail-size][orientation='vertical']:not([stack])) [part='detail'] {
        height: var(--_detail-size);
      }

      /* Min size */
      :host([has-master-min-size][orientation='vertical']:not([overlay])) [part='master'],
      :host([has-master-min-size][orientation='vertical'][overlay]) {
        min-height: var(--_master-min-size);
      }

      :host([has-detail-min-size][orientation='vertical']:not([overlay]):not([stack])) [part='detail'] {
        min-height: var(--_detail-min-size);
      }

      /* Stack mode */
      :host([stack]) [part='master'] {
        max-height: 100%;
      }

      :host([stack]) [part='detail'] {
        inset: 0;
      }

      [part='master']::before {
        background-position-y: var(--_stack-threshold);
      }
    `;
  }

  static get properties() {
    return {
      /**
       * Fixed size (in CSS length units) to be set on the detail area.
       * When specified, it prevents the detail area from growing or
       * shrinking. If there is not enough space to show master and detail
       * areas next to each other, the layout switches to the overlay mode.
       *
       * @attr {string} detail-size
       */
      detailSize: {
        type: String,
        sync: true,
        observer: '__detailSizeChanged',
      },

      /**
       * Minimum size (in CSS length units) to be set on the detail area.
       * When specified, it prevents the detail area from shrinking below
       * this size. If there is not enough space to show master and detail
       * areas next to each other, the layout switches to the overlay mode.
       *
       * @attr {string} detail-min-size
       */
      detailMinSize: {
        type: String,
        sync: true,
        observer: '__detailMinSizeChanged',
      },

      /**
       * Fixed size (in CSS length units) to be set on the master area.
       * When specified, it prevents the master area from growing or
       * shrinking. If there is not enough space to show master and detail
       * areas next to each other, the layout switches to the overlay mode.
       *
       * @attr {string} master-size
       */
      masterSize: {
        type: String,
        sync: true,
        observer: '__masterSizeChanged',
      },

      /**
       * Minimum size (in CSS length units) to be set on the master area.
       * When specified, it prevents the master area from shrinking below
       * this size. If there is not enough space to show master and detail
       * areas next to each other, the layout switches to the overlay mode.
       *
       * @attr {string} master-min-size
       */
      masterMinSize: {
        type: String,
        sync: true,
        observer: '__masterMinSizeChanged',
      },

      /**
       * Define how master and detail areas are shown next to each other,
       * and the way how size and min-size properties are applied to them.
       * Possible values are: `horizontal` or `vertical`.
       * Defaults to horizontal.
       */
      orientation: {
        type: String,
        value: 'horizontal',
        reflectToAttribute: true,
        observer: '__orientationChanged',
        sync: true,
      },

      /**
       * When specified, forces the layout to use overlay mode, even if
       * there is enough space for master and detail to be shown next to
       * each other using the default (split) mode.
       *
       * @attr {boolean} force-overlay
       */
      forceOverlay: {
        type: Boolean,
        value: false,
        observer: '__forceOverlayChanged',
        sync: true,
      },

      /**
       * Defines the containment of the detail area when the layout is in
       * overlay mode. When set to `layout`, the overlay is confined to the
       * layout. When set to `viewport`, the overlay is confined to the
       * browser's viewport. Defaults to `layout`.
       */
      containment: {
        type: String,
        value: 'layout',
        reflectToAttribute: true,
        sync: true,
      },

      /**
       * The threshold (in CSS length units) at which the layout switches to
       * the "stack" mode, making detail area fully cover the master area.
       *
       * @attr {string} stack-threshold
       */
      stackThreshold: {
        type: String,
        observer: '__stackThresholdChanged',
        sync: true,
      },

      /**
       * When true, the layout does not use animated transitions for the detail area.
       *
       * @attr {boolean} no-animation
       */
      noAnimation: {
        type: Boolean,
        value: false,
      },

      /**
       * When true, the component uses the overlay mode. This property is read-only.
       * In order to enforce the overlay mode, use `forceOverlay` property.
       * @protected
       */
      _overlay: {
        type: Boolean,
        attribute: 'overlay',
        reflectToAttribute: true,
        sync: true,
      },

      /**
       * When true, the component uses the stack mode. This property is read-only.
       * In order to enforce the stack mode, use `stackThreshold` property.
       * @protected
       */
      _stack: {
        type: Boolean,
        attribute: 'stack',
        reflectToAttribute: true,
        sync: true,
      },
    };
  }

  /** @override */
  get slotStyles() {
    return [transitionStyles];
  }

  /** @protected */
  render() {
    return html`
      <div id="master" part="master" ?inert="${this._overlay && this.containment === 'layout'}">
        <slot></slot>
      </div>
      <div
        id="detail"
        part="detail"
        role="${this._overlay || this._stack ? 'dialog' : nothing}"
        aria-modal="${this._overlay && this.containment === 'viewport' ? 'true' : nothing}"
      >
        <slot name="detail" @slotchange="${this.__onDetailSlotChange}"></slot>
      </div>
    `;
  }

  /** @private */
  __onDetailSlotChange() {
    this.__updateDetailSlot();
  }

  /** @private */
  __updateDetailSlot() {
    const detail = this.querySelector('[slot="detail"]');
    const hasDetail = !!detail;

    this.toggleAttribute('has-detail', hasDetail);
    this.__detectLayoutMode();

    // Move focus to the detail area when it is added to the DOM,
    // in case if the layout is using overlay or stack mode.
    if ((this.hasAttribute('overlay') || this.hasAttribute('stack')) && hasDetail) {
      const focusables = getFocusableElements(detail);
      if (focusables.length) {
        focusables[0].focus();
      }
    }
  }

  /**
   * @protected
   * @override
   */
  _onResize() {
    this.__detectLayoutMode();
  }

  /** @private */
  __detailSizeChanged(size, oldSize) {
    this.__updateStyleProperty('detail-size', size, oldSize);
    this.__detectLayoutMode();
  }

  /** @private */
  __detailMinSizeChanged(size, oldSize) {
    this.__updateStyleProperty('detail-min-size', size, oldSize);
    this.__detectLayoutMode();
  }

  /** @private */
  __masterSizeChanged(size, oldSize) {
    this.__updateStyleProperty('master-size', size, oldSize);
    this.__detectLayoutMode();
  }

  /** @private */
  __masterMinSizeChanged(size, oldSize) {
    this.__updateStyleProperty('master-min-size', size, oldSize);
    this.__detectLayoutMode();
  }

  /** @private */
  __orientationChanged(orientation, oldOrientation) {
    if (orientation || oldOrientation) {
      this.__detectLayoutMode();
    }
  }

  /** @private */
  __forceOverlayChanged(forceOverlay, oldForceOverlay) {
    if (forceOverlay || oldForceOverlay) {
      this.__detectLayoutMode();
    }
  }

  /** @private */
  __stackThresholdChanged(threshold, oldThreshold) {
    if (threshold || oldThreshold) {
      if (threshold) {
        this.$.master.style.setProperty('--_stack-threshold', threshold);
      } else {
        this.$.master.style.removeProperty('--_stack-threshold');
      }

      this.__detectLayoutMode();
    }
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
  __detectLayoutMode() {
    this._overlay = false;
    this._stack = false;

    if (this.forceOverlay) {
      this._overlay = true;
      return;
    }

    if (this.stackThreshold != null) {
      const threshold = this.__getStackThresholdInPixels();
      const size = this.orientation === 'vertical' ? this.offsetHeight : this.offsetWidth;
      if (size <= threshold) {
        this._stack = true;
        return;
      }
    }

    if (!this.hasAttribute('has-detail')) {
      return;
    }

    if (this.orientation === 'vertical') {
      this.__detectVerticalMode();
    } else {
      this.__detectHorizontalMode();
    }
  }

  /** @private */
  __detectHorizontalMode() {
    const detailWidth = this.$.detail.offsetWidth;

    // Detect minimum width needed by master content. Use max-width to ensure
    // the layout can switch back to split mode once there is enough space.
    // If there is master  size or min-size set, use that instead to force the
    // overlay mode by setting `masterSize` / `masterMinSize` to 100%/
    this.$.master.style.maxWidth = this.masterSize || this.masterMinSize || 'min-content';
    const masterWidth = this.$.master.offsetWidth;
    this.$.master.style.maxWidth = '';

    // If the combined minimum size of both the master and the detail content
    // exceeds the size of the layout, the layout changes to the overlay mode.
    this._overlay = this.offsetWidth < masterWidth + detailWidth;

    // Toggling the overlay resizes master content, which can cause document
    // scroll bar to appear or disappear, and trigger another resize of the
    // layout which can affect previous measurements and end up in horizontal
    // scroll. Check if that is the case and if so, preserve the overlay mode.
    if (this.offsetWidth < this.scrollWidth) {
      this._overlay = true;
    }
  }

  /** @private */
  __detectVerticalMode() {
    // Remove overlay attribute temporarily to detect if there is enough space
    // for both areas so that layout could switch back to the split mode.
    this._overlay = false;

    const masterHeight = this.$.master.clientHeight;

    // If the combined minimum size of both the master and the detail content
    // exceeds the available height, the layout changes to the overlay mode.
    if (this.offsetHeight < masterHeight + this.$.detail.clientHeight) {
      this._overlay = true;
    }
  }

  /** @private */
  __getStackThresholdInPixels() {
    const { backgroundPositionY } = getComputedStyle(this.$.master, '::before');
    return parseFloat(backgroundPositionY);
  }
}

defineCustomElement(MasterDetailLayout);

export { MasterDetailLayout };

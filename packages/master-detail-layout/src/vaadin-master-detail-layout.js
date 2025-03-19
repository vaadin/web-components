/**
 * @license
 * Copyright (c) 2025 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
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
 * @mixes ResizeMixin
 */
class MasterDetailLayout extends ResizeMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement)))) {
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
      :host([overlay][has-detail]) {
        position: relative;
      }

      :host([overlay]) [part='detail'] {
        position: absolute;
      }

      :host([overlay][orientation='horizontal']) [part='detail'] {
        inset-inline-end: 0;
        height: 100%;
        width: var(--_detail-min-size, min-content);
        max-width: 100%;
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

      :host([has-detail-size][orientation='horizontal']) [part='detail'] {
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

      :host([has-detail-min-size][orientation='horizontal']:not([overlay])) [part='detail'] {
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

      /* Fixed size */
      :host([has-master-size][orientation='vertical']) [part='master'] {
        height: var(--_master-size);
      }

      :host([has-detail-size][orientation='vertical']) [part='detail'] {
        height: var(--_detail-size);
      }

      /* Min size */
      :host([has-master-min-size][orientation='vertical']:not([overlay])) [part='master'],
      :host([has-master-min-size][orientation='vertical'][overlay]) {
        min-height: var(--_master-min-size);
      }

      :host([has-detail-min-size][orientation='vertical']:not([overlay])) [part='detail'] {
        min-height: var(--_detail-min-size);
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
    };
  }

  /** @protected */
  render() {
    return html`
      <div id="master" part="master">
        <slot></slot>
      </div>
      <div id="detail" part="detail">
        <slot name="detail" @slotchange="${this.__onDetailSlotChange}"></slot>
      </div>
    `;
  }

  /** @private */
  __onDetailSlotChange(e) {
    this.toggleAttribute('has-detail', e.target.assignedNodes().length > 0);
    this.__detectLayoutMode();
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
    if (!this.hasAttribute('has-detail')) {
      this.removeAttribute('overlay');
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
    if (this.offsetWidth < masterWidth + detailWidth) {
      this.setAttribute('overlay', '');
    } else {
      this.removeAttribute('overlay');
    }

    // Toggling the overlay resizes master content, which can cause document
    // scroll bar to appear or disappear, and trigger another resize of the
    // layout which can affect previous measurements and end up in horizontal
    // scroll. Check if that is the case and if so, preserve the overlay mode.
    if (this.offsetWidth < this.scrollWidth) {
      this.setAttribute('overlay', '');
    }
  }

  /** @private */
  __detectVerticalMode() {
    // Set position to static temporarily to detect if there is enough space
    // for both areas so that layout could switch back to the split mode.
    this.$.detail.style.position = 'static';
    const masterHeight = this.$.master.offsetHeight;
    this.$.detail.style.position = '';

    // If the combined minimum size of both the master and the detail content
    // exceeds the available height, the layout changes to the overlay mode.
    if (this.offsetHeight < masterHeight + this.$.detail.offsetHeight) {
      this.setAttribute('overlay', '');
    } else {
      this.removeAttribute('overlay');
    }
  }
}

defineCustomElement(MasterDetailLayout);

export { MasterDetailLayout };

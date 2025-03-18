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

      :host([overlay]:not([orientation='vertical'])) [part='detail'] {
        inset-inline-end: 0;
        height: 100%;
        width: var(--_detail-min-size, min-content);
        max-width: 100%;
      }

      :host([overlay]:not([orientation='vertical'])) [part='master'] {
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

      :host([has-master-size]:not([orientation='vertical'])) [part='master'] {
        width: var(--_master-size);
      }

      :host([has-detail-size]:not([orientation='vertical'])) [part='detail'] {
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
      :host([has-master-min-size]:not([overlay]):not([orientation='vertical'])) [part='master'] {
        min-width: var(--_master-min-size);
      }

      :host([has-detail-min-size]:not([overlay]):not([orientation='vertical'])) [part='detail'] {
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
       * This property can be used to enforce the overlay mode to be used.
       * In order to do it, set `100%` with default (horizontal) orientation
       * or `100vh` with vertical orientation.
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
       * This property can be used to enforce the overlay mode to be used.
       * In order to do it, set `100%` with default (horizontal) orientation
       * or `100vh` with vertical orientation.
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
       * When not specified, defaults to horizontal.
       */
      orientation: {
        type: String,
        reflectToAttribute: true,
        observer: '__orientationChanged',
        sync: true,
      },
    };
  }

  constructor() {
    super();

    this.__onWindowResize = this.__onWindowResize.bind(this);
  }

  /**
   * @return {boolean}
   * @protected
   */
  get _vertical() {
    return this.orientation === 'vertical';
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

  /** @protected */
  ready() {
    super.ready();

    window.addEventListener('resize', this.__onWindowResize);
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
  __onWindowResize() {
    // On window resize, the component does not necessarily get resized
    // when already in vertical overlay mode, so we have this listener.
    if (this._vertical) {
      this.__detectVerticalMode();
    }
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

    if (this._vertical) {
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
    // Detect potentially available height in the viewport.
    const maxHeight = window.innerHeight - this.getBoundingClientRect().top;

    // If the combined minimum size of both the master and the detail content
    // exceeds the available height, the layout changes to the overlay mode.
    if (maxHeight < this.$.master.offsetHeight + this.$.detail.offsetHeight) {
      this.setAttribute('overlay', '');
    } else {
      this.removeAttribute('overlay');
    }
  }
}

defineCustomElement(MasterDetailLayout);

export { MasterDetailLayout };

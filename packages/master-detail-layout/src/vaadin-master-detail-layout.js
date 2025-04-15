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
 * The following custom CSS properties are available for styling (needed to be set
 * on the `<html>` element since they are used by the global view transitions):
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name      | Description
 * ---------------|----------------------
 * `backdrop`     | Backdrop covering the master area in the overlay and stack modes.
 * `master`       | The master area.
 * `detail`       | The detail area.
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
      /* Layout and positioning styles */

      :host {
        display: flex;
        box-sizing: border-box;
        height: 100%;
        max-width: 100%;
        max-height: 100%;
        position: relative; /* Keep the positioning context stable across all modes */
        overflow: hidden;
      }

      :host([hidden]) {
        display: none !important;
      }

      :host([orientation='vertical']) {
        flex-direction: column;
      }

      [part='_detail-internal'] {
        z-index: 1;
        display: contents;
        justify-content: end;
      }

      :host([orientation='vertical']) [part='_detail-internal'] {
        flex-direction: column;
      }

      :host(:is([overlay], [stack])) [part='_detail-internal'],
      :host(:is([overlay], [stack])[has-detail]) [part='backdrop'] {
        display: flex;
        position: absolute;
        inset: 0;
        overscroll-behavior: contain;
      }

      :host(:not([has-detail])) [part='_detail-internal'],
      [part='backdrop'] {
        display: none;
      }

      :host([overlay][orientation='horizontal']) [part='detail'] {
        margin-inline-start: 50px;
      }

      :host([overlay][orientation='vertical']) [part='detail'] {
        margin-block-start: 50px;
      }

      :host(:is([overlay], [stack])[containment='viewport']) :is([part='_detail-internal'], [part='backdrop']) {
        position: fixed;
      }

      /* Sizing styles */

      [part] {
        box-sizing: border-box;
        max-width: 100%;
        max-height: 100%;
      }

      :host(:not([overlay])) [part] {
        flex: auto;
      }

      /* [part='detail'] {
        min-width: min(100%, 15em);
        min-height: min(100%, 10em);
      } */

      :host([overlay]) [part='master'],
      :host([stack]) [part] {
        width: 100% !important;
        height: 100% !important;
        min-width: auto !important;
        min-height: auto !important;
        max-width: 100% !important;
        max-height: 100% !important;
      }

      /* Decorative/visual styles */

      [part='backdrop'] {
        background-color: hsl(0 0 0 / 0.2);
      }

      [part='detail'] {
        background: #fff;
      }

      :host(:is([overlay], [stack])) [part='detail'] {
        box-shadow: 0 0 20px 0 hsl(0 0 0 / 0.3);
      }

      :host(:not([overlay], [stack])[orientation='horizontal']) [part='detail'] {
        border-inline-start: 1px solid hsl(0 0 0 / 0.1);
      }

      :host(:not([overlay], [stack])[orientation='vertical']) [part='detail'] {
        border-block-start: 1px solid hsl(0 0 0 / 0.1);
      }
    `;
  }

  static get properties() {
    return {
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
       * When true, the layout does not use animated transitions.
       *
       * @attr {boolean} no-animation
       */
      noAnimation: {
        type: Boolean,
        value: false,
      },

      /**
       * When true, the component uses the overlay mode. This property is read-only.
       * In order to enforce the overlay mode, set the master or detail area min size to 100%.
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
       * In order to enforce the stack mode, set the layout and detail area min size to 100%.
       * @protected
       */
      _stack: {
        type: Boolean,
        attribute: 'stack',
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

  /** @override */
  get slotStyles() {
    return [transitionStyles];
  }

  /** @protected */
  render() {
    return html`
      <div part="backdrop"></div>
      <div
        id="master"
        part="master"
        ?inert="${this._hasDetail && (this._stack || (this._overlay && this.containment === 'layout'))}"
      >
        <slot></slot>
      </div>
      <div part="_detail-internal">
        <div
          id="detail"
          part="detail"
          role="${this._overlay || this._stack ? 'dialog' : nothing}"
          aria-modal="${this._overlay && this.containment === 'viewport' ? 'true' : nothing}"
        >
          <slot name="detail" @slotchange="${this.__onDetailSlotChange}"></slot>
        </div>
      </div>
    `;
  }

  /** @private */
  __onDetailSlotChange(e) {
    const children = e.target.assignedNodes();

    this._hasDetail = children.length > 0;

    if (this._hasDetail) {
      this.__detectLayoutMode();
    }

    // Move focus to the detail area when it is added to the DOM,
    // in case if the layout is using overlay or stack mode.
    if ((this.hasAttribute('overlay') || this.hasAttribute('stack')) && children.length > 0) {
      const focusables = getFocusableElements(children[0]);
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
  __orientationChanged(orientation, oldOrientation) {
    if (orientation || oldOrientation) {
      this.__detectLayoutMode();
    }
  }

  /** @private */
  __detectLayoutMode() {
    // Change back to default split mode to detect if there is enough space
    // for both areas.
    this._overlay = false;
    this._stack = false;

    if (!this._hasDetail) {
      return;
    }

    let layoutSize,
      layoutScrollSize = 0,
      masterSize,
      detailSize,
      containerSize;

    if (this.orientation === 'vertical') {
      // this.__detectVerticalMode();
      layoutSize = this.clientHeight;
      containerSize = document.documentElement.clientHeight;
      this.style.maxHeight = 'min-content';
      masterSize = this.$.master.offsetHeight;
      detailSize = this.$.detail.offsetHeight;
      this.style.maxHeight = '';
    } else {
      // this.__detectHorizontalMode();
      layoutSize = this.clientWidth;
      layoutScrollSize = this.scrollWidth;
      containerSize = document.documentElement.clientWidth;
      this.style.maxWidth = 'min-content';
      masterSize = this.$.master.offsetWidth;
      detailSize = this.$.detail.offsetWidth;
      this.style.maxWidth = '';
    }

    // If the combined minimum size of both the master and the detail content
    // exceeds the size of the layout, the layout changes to the overlay mode.
    // The extra pixels avoid looping between modes with nested layouts.
    this._overlay = layoutSize < masterSize + detailSize + 7;

    // Toggling the overlay resizes master content, which can cause document
    // scroll bar to appear or disappear, and trigger another resize of the
    // layout which can affect previous measurements and end up in horizontal
    // scroll. Check if that is the case and if so, preserve the overlay mode.
    if (layoutSize < layoutScrollSize) {
      this._overlay = true;
    }

    // Change to stack mode once the overlay covers the whole layout
    if (
      this._overlay &&
      ((this.containment === 'layout' && detailSize >= layoutSize - 50) || detailSize >= containerSize - 50)
    ) {
      this._overlay = false;
      this._stack = true;
    }
  }

  /**
   * Sets the detail element to be displayed in the detail area and starts a
   * view transition that animates adding, replacing or removing the detail
   * area. During the view transition, the element is added to the DOM and
   * assigned to the `detail` slot. Any previous detail element is removed.
   * When passing null as the element, the current detail element is removed.
   *
   * If the browser does not support view transitions, the respective updates
   * are applied immediately without starting a transition. The transition can
   * also be skipped using the `skipTransition` parameter.
   *
   * @param element the new detail element, or null to remove the current detail
   * @param skipTransition whether to skip the transition
   * @returns {Promise<void>}
   * @protected
   */
  _setDetail(element, skipTransition) {
    // Don't start a transition if detail didn't change
    const currentDetail = this.querySelector('[slot="detail"]');
    if ((element || null) === currentDetail) {
      return Promise.resolve();
    }

    const updateSlot = () => {
      // Remove old content
      this.querySelectorAll('[slot="detail"]').forEach((oldElement) => oldElement.remove());
      // Add new content
      if (element) {
        element.setAttribute('slot', 'detail');
        this.appendChild(element);
      }
    };

    if (skipTransition) {
      updateSlot();
      return Promise.resolve();
    }

    const hasDetail = !!currentDetail;
    const transitionType = hasDetail && element ? 'replace' : hasDetail ? 'remove' : 'add';
    return this._startTransition(transitionType, () => {
      // Update the DOM
      updateSlot();
      // Finish the transition
      this._finishTransition();
    });
  }

  /**
   * Starts a view transition that animates adding, replacing or removing the
   * detail area. Once the transition is ready and the browser has taken a
   * snapshot of the current layout, the provided update callback is called.
   * The callback should update the DOM, which can happen asynchronously.
   * Once the DOM is updated, the caller must call `_finishTransition`,
   * which results in the browser taking a snapshot of the new layout and
   * animating the transition.
   *
   * If the browser does not support view transitions, or the `noAnimation`
   * property is set, the update callback is called immediately without
   * starting a transition.
   *
   * @param transitionType
   * @param updateCallback
   * @returns {Promise<void>}
   * @protected
   */
  _startTransition(transitionType, updateCallback) {
    const useTransition = typeof document.startViewTransition === 'function' && !this.noAnimation;
    if (!useTransition) {
      updateCallback();
      return Promise.resolve();
    }

    this.setAttribute('transition', transitionType);
    this.__transition = document.startViewTransition(() => {
      // Return a promise that can be resolved once the DOM is updated
      return new Promise((resolve) => {
        this.__resolveUpdateCallback = resolve;
        // Notify the caller that the transition is ready, so that they can
        // update the DOM
        updateCallback();
      });
    });
    return this.__transition.finished;
  }

  /**
   * Finishes the current view transition, if any. This method should be called
   * after the DOM has been updated to finish the transition and animate the
   * change in the layout.
   *
   * @returns {Promise<void>}
   * @protected
   */
  async _finishTransition() {
    // Detect new layout mode after DOM has been updated.
    // Don't update the mode when detail is removed so that correct view transition styles still apply
    // (e.g. closing details when in stack mode, the master part should still have a dedicated transition).
    if (this.getAttribute('transition') !== 'remove') {
      this.__detectLayoutMode();
    }

    if (!this.__transition) {
      return Promise.resolve();
    }
    // Resolve the update callback to finish the transition
    this.__resolveUpdateCallback();
    await this.__transition.finished;
    this.removeAttribute('transition');
    this.__transition = null;
    this.__resolveUpdateCallback = null;

    // Clean up layout mode after the view transition if there is no detail element.
    if (!this._hasDetail) {
      this._overlay = false;
      this._stack = false;
    }
  }
}

defineCustomElement(MasterDetailLayout);

export { MasterDetailLayout };

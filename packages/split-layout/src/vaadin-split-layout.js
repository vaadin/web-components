/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { addListener } from '@vaadin/component-base/src/gestures.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-split-layout>` is a Web Component implementing a split layout for two
 * content elements with a draggable splitter between them.
 *
 * ```html
 * <vaadin-split-layout>
 *   <div>First content element</div>
 *   <div>Second content element</div>
 * </vaadin-split-layout>
 * ```
 *
 * ### Horizontal and Vertical Layouts
 *
 * By default, the split's orientation is horizontal, meaning that the content elements are
 * positioned side by side in a flex container with a horizontal layout.
 *
 * You can change the split mode to vertical by setting the `orientation` attribute to `"vertical"`:
 *
 * ```html
 * <vaadin-split-layout orientation="vertical">
 *   <div>Content on the top</div>
 *   <div>Content on the bottom</div>
 * </vaadin-split-layout>
 * ```
 *
 * ### Layouts Combination
 *
 * For the layout contents, we usually use `<div>` elements in the examples,
 * although you can use any other elements as well.
 *
 * For instance, in order to have a nested vertical split layout inside a
 * horizontal one, you can include `<vaadin-split-layout>` as a content element
 * inside another split layout:
 *
 * ```html
 * <vaadin-split-layout>
 *   <div>First content element</div>
 *   <vaadin-split-layout orientation="vertical">
 *     <div>Second content element</div>
 *     <div>Third content element</div>
 *   </vaadin-split-layout>
 * </vaadin-split-layout>
 * ```
 *
 * You can also trigger the vertical mode in JavaScript by setting the property:
 * `splitLayout.orientation = "vertical";`.
 *
 * ### Split Layout Element Height
 *
 * `<vaadin-split-layout>` element itself is a flex container. It does not inherit
 * the parent height by default, but rather sets its height depending on the
 * content.
 *
 * You can use CSS to set the fixed height for the split layout, as usual with any
 * block element:
 *
 * ```html
 * <vaadin-split-layout style="height: 200px;">
 *   <div>First content element</div>
 *   <div>Second content element</div>
 * </vaadin-split-layout>
 * ```
 *
 * It is possible to define percentage height as well. Note that you have to set
 * the parent height in order to make percentages work correctly. In the following
 * example, the `<body>` is resized to fill the entire viewport, and the
 * `<vaadin-split-layout>` element is set to take 100% height of the `<body>`:
 *
 * ```html
 * <body style="height: 100vh; margin: 0;">
 *   <vaadin-split-layout style="height: 100%;">
 *     <div>First</div>
 *     <div>Second</div>
 *   </vaadin-split-layout>
 * </body>
 * ```
 *
 * Alternatively, you can use a flexbox layout to make `<vaadin-split-layout>`
 * fill up the parent:
 *
 * ```html
 * <body style="height: 100vh; margin: 0; display: flex;">
 *   <vaadin-split-layout style="flex: 1;">
 *     <div>First</div>
 *     <div>Second</div>
 *   </vaadin-split-layout>
 * </body>
 * ```
 *
 * ### Initial Splitter Position
 *
 * The initial splitter position is determined from the sizes of the content elements
 * inside the split layout. Therefore, changing `width` on the content elements
 * affects the initial splitter position for the horizontal layouts, while `height`
 * affects the vertical ones.
 *
 * Note that when the total size of the content elements does not fit the layout,
 * the content elements are scaled proportionally.
 *
 * When setting initial sizes with relative units, such as percentages, it is
 * recommended to assign the size for both content elements:
 *
 * ```html
 * <vaadin-split-layout>
 *   <div style="width: 75%;">Three fourths</div>
 *   <div style="width: 25%;">One fourth</div>
 * </vaadin-split-layout>
 * ```
 *
 * ### Size Limits
 *
 * The `min-width`/`min-height`, and `max-width`/`max-height` CSS size values
 * for the content elements are respected and used to limit the splitter position
 * when it is dragged.
 *
 * It is preferred to set the limits only for a single content element, in order
 * to avoid size conflicts:
 *
 * ```html
 * <vaadin-split-layout>
 *   <div style="min-width: 50px; max-width: 150px;">First</div>
 *   <div>Second</div>
 * </vaadin-split-layout>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description | Theme for Element
 * ----------------|----------------|----------------
 * `splitter` | Split element | vaadin-split-layout
 * `handle` | The handle of the splitter | vaadin-split-layout
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {Event} splitter-dragend - Fired after dragging the splitter have ended.
 *
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class SplitLayout extends ElementMixin(ThemableMixin(PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host {
          display: flex;
          overflow: hidden !important;
          transform: translateZ(0);
        }

        :host([hidden]) {
          display: none !important;
        }

        :host([orientation='vertical']) {
          flex-direction: column;
        }

        :host ::slotted(*) {
          flex: 1 1 auto;
          overflow: auto;
          -webkit-overflow-scrolling: touch;
        }

        [part='splitter'] {
          flex: none;
          position: relative;
          z-index: 1;
          overflow: visible;
          min-width: 8px;
          min-height: 8px;
        }

        :host(:not([orientation='vertical'])) > [part='splitter'] {
          cursor: ew-resize;
        }

        :host([orientation='vertical']) > [part='splitter'] {
          cursor: ns-resize;
        }

        [part='handle'] {
          width: 40px;
          height: 40px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate3d(-50%, -50%, 0);
        }
      </style>
      <slot id="primary" name="primary"></slot>
      <div part="splitter" id="splitter">
        <div part="handle"></div>
      </div>
      <slot id="secondary" name="secondary"></slot>
    `;
  }

  static get is() {
    return 'vaadin-split-layout';
  }

  static get properties() {
    return {
      /**
       * The split layout's orientation. Possible values are: `horizontal|vertical`.
       * @type {string}
       */
      orientation: {
        type: String,
        reflectToAttribute: true,
        value: 'horizontal',
      },

      /** @private */
      _previousPrimaryPointerEvents: String,

      /** @private */
      _previousSecondaryPointerEvents: String,
    };
  }

  /** @protected */
  ready() {
    super.ready();
    this.__observer = new FlattenedNodesObserver(this, (info) => {
      this._cleanupNodes(info.removedNodes);
      this._processChildren();
    });

    const splitter = this.$.splitter;
    addListener(splitter, 'track', this._onHandleTrack.bind(this));
    addListener(splitter, 'down', this._setPointerEventsNone.bind(this));
    addListener(splitter, 'up', this._restorePointerEvents.bind(this));
  }

  /** @private */
  _cleanupNodes(nodes) {
    nodes.forEach((node) => {
      node.removeAttribute('slot');
    });
  }

  /** @private */
  _processChildren() {
    [...this.children].forEach((child, i) => {
      if (i === 0) {
        this._primaryChild = child;
        child.setAttribute('slot', 'primary');
      } else if (i === 1) {
        this._secondaryChild = child;
        child.setAttribute('slot', 'secondary');
      } else {
        child.removeAttribute('slot');
      }
    });
  }

  /** @private */
  _setFlexBasis(element, flexBasis, containerSize) {
    flexBasis = Math.max(0, Math.min(flexBasis, containerSize));
    if (flexBasis === 0) {
      // Pure zero does not play well in Safari
      flexBasis = 0.000001;
    }
    element.style.flex = `1 1 ${flexBasis}px`;
  }

  /** @private */
  _setPointerEventsNone(event) {
    if (!this._primaryChild || !this._secondaryChild) {
      return;
    }
    this._previousPrimaryPointerEvents = this._primaryChild.style.pointerEvents;
    this._previousSecondaryPointerEvents = this._secondaryChild.style.pointerEvents;
    this._primaryChild.style.pointerEvents = 'none';
    this._secondaryChild.style.pointerEvents = 'none';

    event.preventDefault();
  }

  /** @private */
  _restorePointerEvents() {
    if (!this._primaryChild || !this._secondaryChild) {
      return;
    }
    this._primaryChild.style.pointerEvents = this._previousPrimaryPointerEvents;
    this._secondaryChild.style.pointerEvents = this._previousSecondaryPointerEvents;
  }

  /** @private */
  _onHandleTrack(event) {
    if (!this._primaryChild || !this._secondaryChild) {
      return;
    }

    const size = this.orientation === 'vertical' ? 'height' : 'width';
    if (event.detail.state === 'start') {
      this._startSize = {
        container: this.getBoundingClientRect()[size] - this.$.splitter.getBoundingClientRect()[size],
        primary: this._primaryChild.getBoundingClientRect()[size],
        secondary: this._secondaryChild.getBoundingClientRect()[size],
      };

      return;
    }

    const distance = this.orientation === 'vertical' ? event.detail.dy : event.detail.dx;
    const isRtl = this.orientation !== 'vertical' && this.getAttribute('dir') === 'rtl';
    const dirDistance = isRtl ? -distance : distance;

    this._setFlexBasis(this._primaryChild, this._startSize.primary + dirDistance, this._startSize.container);
    this._setFlexBasis(this._secondaryChild, this._startSize.secondary - dirDistance, this._startSize.container);

    if (event.detail.state === 'end') {
      this.dispatchEvent(new CustomEvent('splitter-dragend'));

      delete this._startSize;
    }
  }

  /**
   * @deprecated Since Vaadin 23, `notifyResize()` is deprecated. The component uses a
   * ResizeObserver internally and doesn't need to be explicitly notified of resizes.
   */
  notifyResize() {
    console.warn(
      `WARNING: Since Vaadin 23, notifyResize() is deprecated. The component uses a ResizeObserver internally and doesn't need to be explicitly notified of resizes.`,
    );
  }

  /**
   * Fired after dragging the splitter have ended.
   *
   * @event splitter-dragend
   */
}

customElements.define(SplitLayout.is, SplitLayout);

export { SplitLayout };

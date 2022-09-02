/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-tab.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { ListMixin } from '@vaadin/vaadin-list-mixin/vaadin-list-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-tabs>` is a Web Component for organizing and grouping content into sections.
 *
 * ```
 *   <vaadin-tabs selected="4">
 *     <vaadin-tab>Page 1</vaadin-tab>
 *     <vaadin-tab>Page 2</vaadin-tab>
 *     <vaadin-tab>Page 3</vaadin-tab>
 *     <vaadin-tab>Page 4</vaadin-tab>
 *   </vaadin-tabs>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name         | Description
 * ------------------|--------------------------------------
 * `back-button`     | Button for moving the scroll back
 * `tabs`            | The tabs container
 * `forward-button`  | Button for moving the scroll forward
 *
 * The following state attributes are available for styling:
 *
 * Attribute  | Description | Part name
 * -----------|-------------|------------
 * `orientation` | Tabs disposition, valid values are `horizontal` and `vertical`. | :host
 * `overflow` | It's set to `start`, `end`, none or both. | :host
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components) documentation.
 *
 * @fires {CustomEvent} items-changed - Fired when the `items` property changes.
 * @fires {CustomEvent} selected-changed - Fired when the `selected` property changes.
 *
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ListMixin
 * @mixes ThemableMixin
 * @mixes ResizeMixin
 */
class Tabs extends ResizeMixin(ElementMixin(ListMixin(ThemableMixin(PolymerElement)))) {
  static get template() {
    return html`
      <style>
        :host {
          display: flex;
          align-items: center;
        }

        :host([hidden]) {
          display: none !important;
        }

        :host([orientation='vertical']) {
          display: block;
        }

        :host([orientation='horizontal']) [part='tabs'] {
          flex-grow: 1;
          display: flex;
          align-self: stretch;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        /* This seems more future-proof than \`overflow: -moz-scrollbars-none\` which is marked obsolete
         and is no longer guaranteed to work:
         https://developer.mozilla.org/en-US/docs/Web/CSS/overflow#Mozilla_Extensions */
        @-moz-document url-prefix() {
          :host([orientation='horizontal']) [part='tabs'] {
            overflow: hidden;
          }
        }

        :host([orientation='horizontal']) [part='tabs']::-webkit-scrollbar {
          display: none;
        }

        :host([orientation='vertical']) [part='tabs'] {
          height: 100%;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }

        [part='back-button'],
        [part='forward-button'] {
          pointer-events: none;
          opacity: 0;
          cursor: default;
        }

        :host([overflow~='start']) [part='back-button'],
        :host([overflow~='end']) [part='forward-button'] {
          pointer-events: auto;
          opacity: 1;
        }

        [part='back-button']::after {
          content: '◀';
        }

        [part='forward-button']::after {
          content: '▶';
        }

        :host([orientation='vertical']) [part='back-button'],
        :host([orientation='vertical']) [part='forward-button'] {
          display: none;
        }

        /* RTL specific styles */

        :host([dir='rtl']) [part='back-button']::after {
          content: '▶';
        }

        :host([dir='rtl']) [part='forward-button']::after {
          content: '◀';
        }
      </style>
      <div on-click="_scrollBack" part="back-button" aria-hidden="true"></div>

      <div id="scroll" part="tabs">
        <slot></slot>
      </div>

      <div on-click="_scrollForward" part="forward-button" aria-hidden="true"></div>
    `;
  }

  static get is() {
    return 'vaadin-tabs';
  }

  static get properties() {
    return {
      /**
       * Set tabs disposition. Possible values are `horizontal|vertical`
       * @type {!TabsOrientation}
       */
      orientation: {
        value: 'horizontal',
        type: String,
      },

      /**
       * The index of the selected tab.
       */
      selected: {
        value: 0,
        type: Number,
      },
    };
  }

  static get observers() {
    return ['__tabsItemsChanged(items, items.*)'];
  }

  constructor() {
    super();

    this.__itemsResizeObserver = new ResizeObserver(() => {
      setTimeout(() => this._updateOverflow());
    });
  }

  /** @protected */
  ready() {
    super.ready();
    this._scrollerElement.addEventListener('scroll', () => this._updateOverflow());
    this.setAttribute('role', 'tablist');

    // Wait for the vaadin-tab elements to upgrade and get styled
    afterNextRender(this, () => {
      this._updateOverflow();
    });
  }

  /**
   * @protected
   * @override
   */
  _onResize() {
    this._updateOverflow();
  }

  /** @private */
  __tabsItemsChanged(items) {
    // Disconnected to unobserve any removed items
    this.__itemsResizeObserver.disconnect();

    // Observe current items
    (items || []).forEach((item) => {
      this.__itemsResizeObserver.observe(item);
    });

    this._updateOverflow();
  }

  /** @private */
  _scrollForward() {
    this._scroll(-this.__direction * this._scrollOffset);
  }

  /** @private */
  _scrollBack() {
    this._scroll(this.__direction * this._scrollOffset);
  }

  /**
   * @return {number}
   * @protected
   */
  get _scrollOffset() {
    return this._vertical ? this._scrollerElement.offsetHeight : this._scrollerElement.offsetWidth;
  }

  /**
   * @return {!HTMLElement}
   * @protected
   */
  get _scrollerElement() {
    return this.$.scroll;
  }

  /** @private */
  get __direction() {
    return !this._vertical && this.getAttribute('dir') === 'rtl' ? 1 : -1;
  }

  /** @private */
  _updateOverflow() {
    const scrollPosition = this._vertical
      ? this._scrollerElement.scrollTop
      : this.__getNormalizedScrollLeft(this._scrollerElement);
    const scrollSize = this._vertical ? this._scrollerElement.scrollHeight : this._scrollerElement.scrollWidth;

    let overflow = scrollPosition > 0 ? 'start' : '';
    overflow += scrollPosition + this._scrollOffset < scrollSize ? ' end' : '';

    if (this.__direction === 1) {
      overflow = overflow.replace(/start|end/gi, (matched) => {
        return matched === 'start' ? 'end' : 'start';
      });
    }

    if (overflow) {
      this.setAttribute('overflow', overflow.trim());
    } else {
      this.removeAttribute('overflow');
    }
  }
}

customElements.define(Tabs.is, Tabs);

export { Tabs };

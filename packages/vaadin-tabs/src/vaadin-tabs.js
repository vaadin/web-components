/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ListMixin } from '@vaadin/vaadin-list-mixin/vaadin-list-mixin.js';
import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';
import './vaadin-tab.js';

/**
 * `<vaadin-tabs>` is a Web Component for easy switching between different views.
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
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {CustomEvent} items-changed - Fired when the `items` property changes.
 * @fires {CustomEvent} selected-changed - Fired when the `selected` property changes.
 *
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ListMixin
 * @mixes ThemableMixin
 */
class TabsElement extends ElementMixin(
  ListMixin(ThemableMixin(mixinBehaviors([IronResizableBehavior], PolymerElement)))
) {
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
      <div on-click="_scrollBack" part="back-button"></div>

      <div id="scroll" part="tabs">
        <slot></slot>
      </div>

      <div on-click="_scrollForward" part="forward-button"></div>
    `;
  }

  static get is() {
    return 'vaadin-tabs';
  }

  static get version() {
    return '21.0.4';
  }

  static get properties() {
    return {
      /**
       * Set tabs disposition. Possible values are `horizontal|vertical`
       * @type {!ListOrientation}
       */
      orientation: {
        value: 'horizontal',
        type: String
      },

      /**
       * The index of the selected tab.
       */
      selected: {
        value: 0,
        type: Number
      }
    };
  }

  static get observers() {
    return ['_updateOverflow(items.*)'];
  }

  ready() {
    super.ready();
    this.addEventListener('iron-resize', () => this._updateOverflow());
    this._scrollerElement.addEventListener('scroll', () => this._updateOverflow());
    this.setAttribute('role', 'tablist');

    // Wait for the vaadin-tab elements to upgrade and get styled
    afterNextRender(this, () => {
      this._updateOverflow();
    });
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

    if (this.__direction == 1) {
      overflow = overflow.replace(/start|end/gi, (matched) => {
        return matched === 'start' ? 'end' : 'start';
      });
    }

    overflow ? this.setAttribute('overflow', overflow.trim()) : this.removeAttribute('overflow');
  }
}

customElements.define(TabsElement.is, TabsElement);

export { TabsElement };

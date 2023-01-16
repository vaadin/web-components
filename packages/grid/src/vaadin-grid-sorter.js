/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const template = document.createElement('template');

template.innerHTML = `
  <style>
    @font-face {
      font-family: 'vaadin-grid-sorter-icons';
      src: url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAAQwAA0AAAAABuwAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAAEFAAAABkAAAAcfep+mUdERUYAAAP4AAAAHAAAAB4AJwAOT1MvMgAAAZgAAAA/AAAAYA8TBPpjbWFwAAAB7AAAAFUAAAFeF1fZ4mdhc3AAAAPwAAAACAAAAAgAAAAQZ2x5ZgAAAlgAAABcAAAAnMvguMloZWFkAAABMAAAAC8AAAA2C5Ap72hoZWEAAAFgAAAAHQAAACQGbQPHaG10eAAAAdgAAAAUAAAAHAoAAABsb2NhAAACRAAAABIAAAASAIwAYG1heHAAAAGAAAAAFgAAACAACwAKbmFtZQAAArQAAAECAAACZxWCgKhwb3N0AAADuAAAADUAAABZCrApUXicY2BkYGAA4rDECVrx/DZfGbhZGEDgyqNPOxH0/wNMq5kPALkcDEwgUQBWRA0dAHicY2BkYGA+8P8AAwMLAwgwrWZgZEAFbABY4QM8AAAAeJxjYGRgYOAAQiYGEICQSAAAAi8AFgAAeJxjYGY6yziBgZWBgWkm0xkGBoZ+CM34msGYkZMBFTAKoAkwODAwvmRiPvD/AIMDMxCD1CDJKjAwAgBktQsXAHicY2GAAMZQCM0EwqshbAALxAEKeJxjYGBgZoBgGQZGBhCIAPIYwXwWBhsgzcXAwcAEhIwMCi+Z/v/9/x+sSuElA4T9/4k4K1gHFwMMMILMY2QDYmaoABOQYGJABUA7WBiGNwAAJd4NIQAAAAAAAAAACAAIABAAGAAmAEAATgAAeJyNjLENgDAMBP9tIURJwQCMQccSZgk2i5fIYBDAidJjycXr7x5EPwE2wY8si7jmyBNXGo/bNBerxJNrpxhbO3/fEFpx8ZICpV+ghxJ74fAMe+h7Ox14AbrsHB14nK2QQWrDMBRER4mTkhQK3ZRQKOgCNk7oGQqhhEIX2WSlWEI1BAlkJ5CDdNsj5Ey9Rncdi38ES+jzNJo/HwTgATcoDEthhY3wBHc4CE+pfwsX5F/hGe7Vo/AcK/UhvMSz+mGXKhZU6pww8ISz3oWn1BvhgnwTnuEJf8Jz1OpFeIlX9YULDLdFi4ASHolkSR0iuYdjLak1vAequBhj21D61Nqyi6l3qWybGPjySbPHGScGJl6dP58MYcQRI0bts7mjebBqrFENH7t3qWtj0OuqHnXcW7b0HOTZFnKryRGW2hFX1m0O2vEM3opNMfTau+CS6Z3Vx6veNnEXY6jwDxhsc2gAAHicY2BiwA84GBgYmRiYGJkZmBlZGFkZ2djScyoLMgzZS/MyDQwMwLSrpYEBlIbxjQDrzgsuAAAAAAEAAf//AA94nGNgZGBg4AFiMSBmYmAEQnYgZgHzGAAD6wA2eJxjYGBgZACCKyoz1cD0o087YTQATOcIewAAAA==) format('woff');
      font-weight: normal;
      font-style: normal;
    }
  </style>
`;

document.head.appendChild(template.content);

/**
 * `<vaadin-grid-sorter>` is a helper element for the `<vaadin-grid>` that provides out-of-the-box UI controls,
 * visual feedback, and handlers for sorting the grid data.
 *
 * #### Example:
 * ```html
 * <vaadin-grid-column id="column"></vaadin-grid-column>
 * ```
 * ```js
 * const column = document.querySelector('#column');
 * column.renderer = (root, column, model) => {
 *   let sorter = root.firstElementChild;
 *   if (!sorter) {
 *     sorter = document.createElement('vaadin-grid-sorter');
 *     root.appendChild(sorter);
 *   }
 *   sorter.path = 'name.first';
 * };
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------------|----------------
 * `content` | The slotted content wrapper
 * `indicators` | The internal sorter indicators.
 * `order` | The internal sorter order
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description | Part name
 * -------------|-------------|------------
 * `direction` | Sort direction of a sorter | :host
 *
 * @fires {CustomEvent} direction-changed - Fired when the `direction` property changes.
 * @fires {CustomEvent} sorter-changed - Fired when the `path` or `direction` property changes.
 *
 * @extends HTMLElement
 */
class GridSorter extends ThemableMixin(DirMixin(PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host {
          display: inline-flex;
          cursor: pointer;
          max-width: 100%;
        }

        [part='content'] {
          flex: 1 1 auto;
        }

        [part='indicators'] {
          position: relative;
          align-self: center;
          flex: none;
        }

        [part='order'] {
          display: inline;
          vertical-align: super;
        }

        [part='indicators']::before {
          font-family: 'vaadin-grid-sorter-icons';
          display: inline-block;
        }

        :host(:not([direction])) [part='indicators']::before {
          content: '\\e901';
        }

        :host([direction='asc']) [part='indicators']::before {
          content: '\\e900';
        }

        :host([direction='desc']) [part='indicators']::before {
          content: '\\e902';
        }
      </style>

      <div part="content">
        <slot></slot>
      </div>
      <div part="indicators">
        <span part="order">[[_getDisplayOrder(_order)]]</span>
      </div>
    `;
  }

  static get is() {
    return 'vaadin-grid-sorter';
  }

  static get properties() {
    return {
      /**
       * JS Path of the property in the item used for sorting the data.
       */
      path: String,

      /**
       * How to sort the data.
       * Possible values are `asc` to use an ascending algorithm, `desc` to sort the data in
       * descending direction, or `null` for not sorting the data.
       * @type {GridSorterDirection | undefined}
       */
      direction: {
        type: String,
        reflectToAttribute: true,
        notify: true,
        value: null,
      },

      /**
       * @type {number | null}
       * @protected
       */
      _order: {
        type: Number,
        value: null,
      },

      /** @private */
      _isConnected: {
        type: Boolean,
        observer: '__isConnectedChanged',
      },
    };
  }

  static get observers() {
    return ['_pathOrDirectionChanged(path, direction)'];
  }

  /** @protected */
  ready() {
    super.ready();
    this.addEventListener('click', this._onClick.bind(this));
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();
    this._isConnected = true;
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();
    this._isConnected = false;

    if (!this.parentNode && this._grid) {
      this._grid.__removeSorters([this]);
    }
  }

  /** @private */
  _pathOrDirectionChanged() {
    this.__dispatchSorterChangedEvenIfPossible();
  }

  /** @private */
  __isConnectedChanged(newValue, oldValue) {
    if (oldValue === false) {
      return;
    }

    this.__dispatchSorterChangedEvenIfPossible();
  }

  /** @private */
  __dispatchSorterChangedEvenIfPossible() {
    if (this.path === undefined || this.direction === undefined || !this._isConnected) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent('sorter-changed', {
        detail: { shiftClick: Boolean(this._shiftClick), fromSorterClick: Boolean(this._fromSorterClick) },
        bubbles: true,
        composed: true,
      }),
    );
    // Cleaning up as a programatically sorting can be done after some user interaction
    this._fromSorterClick = false;
    this._shiftClick = false;
  }

  /** @private */
  _getDisplayOrder(order) {
    return order === null ? '' : order + 1;
  }

  /** @private */
  _onClick(e) {
    if (e.defaultPrevented) {
      // Something else has already handled the click event, do nothing.
      return;
    }

    const activeElement = this.getRootNode().activeElement;
    if (this !== activeElement && this.contains(activeElement)) {
      // Some focusable content inside the sorter was clicked, do nothing.
      return;
    }

    e.preventDefault();
    this._shiftClick = e.shiftKey;
    this._fromSorterClick = true;
    if (this.direction === 'asc') {
      this.direction = 'desc';
    } else if (this.direction === 'desc') {
      this.direction = null;
    } else {
      this.direction = 'asc';
    }
  }
}

customElements.define(GridSorter.is, GridSorter);

export { GridSorter };

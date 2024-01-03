/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

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

registerStyles(
  'vaadin-grid-sorter',
  css`
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
  `,
  { moduleId: 'vaadin-grid-sorter-styles' },
);

/**
 * A mixin providing common sorter functionality.
 *
 * @polymerMixin
 */
export const GridSorterMixin = (superClass) =>
  class GridSorterMixinClass extends superClass {
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
          sync: true,
        },

        /**
         * @type {number | null}
         * @protected
         */
        _order: {
          type: Number,
          value: null,
          sync: true,
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
      if (this._grid) {
        this._grid.__applySorters();
      } else {
        this.__dispatchSorterChangedEvenIfPossible();
      }
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      if (!this.parentNode && this._grid) {
        this._grid.__removeSorters([this]);
      } else if (this._grid) {
        this._grid.__applySorters();
      }
    }

    /** @private */
    _pathOrDirectionChanged() {
      this.__dispatchSorterChangedEvenIfPossible();
    }

    /** @private */
    __dispatchSorterChangedEvenIfPossible() {
      if (this.path === undefined || this.direction === undefined || !this.isConnected) {
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
  };

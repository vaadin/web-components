/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * An element used internally by `<vaadin-field-highlighter>`. Not intended to be used separately.
 *
 * @extends HTMLElement
 * @mixes DirMixin
 * @mixes ThemableMixin
 * @private
 */
export class UserTag extends ThemableMixin(DirMixin(PolymerElement)) {
  static get is() {
    return 'vaadin-user-tag';
  }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
          box-sizing: border-box;
          margin: 0 0 var(--vaadin-user-tag-offset);
          opacity: 0;
          height: 1.3rem;
          transition: opacity 0.2s ease-in-out;
          background-color: var(--vaadin-user-tag-color);
          color: #fff;
          cursor: default;
          -webkit-user-select: none;
          user-select: none;
          --vaadin-user-tag-offset: 4px;
        }

        :host(.show) {
          opacity: 1;
        }

        :host(:last-of-type) {
          margin-bottom: 0;
        }

        [part='name'] {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          box-sizing: border-box;
          padding: 2px 4px;
          height: 1.3rem;
          font-size: 13px;
        }
      </style>
      <div part="name">[[name]]</div>
    `;
  }

  static get properties() {
    return {
      /**
       * Name of the user.
       */
      name: {
        type: String,
      },

      /**
       * Id of the user.
       */
      uid: {
        type: String,
      },

      /**
       * Color index of the user.
       */
      colorIndex: {
        type: Number,
        observer: '_colorIndexChanged',
      },
    };
  }

  /** @protected */
  ready() {
    super.ready();

    // Capture mousedown to prevent click on the underlying label,
    // which would result in undesirable focusing field components.
    // TODO: consider handling touchstart event in a similar way
    this.addEventListener('mousedown', this._onClick.bind(this), true);
  }

  /** @private */
  _colorIndexChanged(index) {
    if (index != null) {
      this.style.setProperty('--vaadin-user-tag-color', `var(--vaadin-user-color-${index})`);
    }
  }

  /**
   * @param {Event} e
   * @private
   */
  _onClick(e) {
    e.preventDefault();
    this.dispatchEvent(
      new CustomEvent('user-tag-click', {
        bubbles: true,
        composed: true,
        detail: {
          name: this.name,
        },
      }),
    );
  }
}

customElements.define(UserTag.is, UserTag);

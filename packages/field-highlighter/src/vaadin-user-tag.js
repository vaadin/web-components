/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { userTagStyles } from './vaadin-field-highlighter-styles.js';

/**
 * An element used internally by `<vaadin-field-highlighter>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes DirMixin
 * @mixes ThemableMixin
 * @private
 */
export class UserTag extends ThemableMixin(DirMixin(PolylitMixin(LitElement))) {
  static get is() {
    return 'vaadin-user-tag';
  }

  static get styles() {
    return userTagStyles;
  }

  /** @protected */
  render() {
    return html`<div part="name">${this.name}</div>`;
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

defineCustomElement(UserTag);

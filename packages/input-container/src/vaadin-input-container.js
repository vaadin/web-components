/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export class InputContainer extends ThemableMixin(DirMixin(PolymerElement)) {
  static get is() {
    return 'vaadin-input-container';
  }

  static get template() {
    return html`
      <style>
        :host {
          display: flex;
          align-items: center;
          flex: 0 1 auto;
        }

        :host([hidden]) {
          display: none !important;
        }

        /* Reset the native input styles */
        ::slotted(input) {
          -webkit-appearance: none;
          -moz-appearance: none;
          flex: auto;
          white-space: nowrap;
          overflow: hidden;
          width: 100%;
          height: 100%;
          outline: none;
          margin: 0;
          padding: 0;
          border: 0;
          border-radius: 0;
          min-width: 0;
          font: inherit;
          line-height: normal;
          color: inherit;
          background-color: transparent;
          /* Disable default invalid style in Firefox */
          box-shadow: none;
        }

        ::slotted(*) {
          flex: none;
        }

        ::slotted(:is(input, textarea))::placeholder {
          /* Use ::slotted(input:placeholder-shown) in themes to style the placeholder. */
          /* because ::slotted(...)::placeholder does not work in Safari. */
          font: inherit;
          color: inherit;
          /* Override default opacity in Firefox */
          opacity: 1;
        }
      </style>
      <slot name="prefix"></slot>
      <slot></slot>
      <slot name="suffix"></slot>
    `;
  }

  static get properties() {
    return {
      /**
       * If true, the user cannot interact with this element.
       */
      disabled: {
        type: Boolean,
        reflectToAttribute: true,
      },

      /**
       * Set to true to make this element read-only.
       */
      readonly: {
        type: Boolean,
        reflectToAttribute: true,
      },

      /**
       * Set to true when the element is invalid.
       */
      invalid: {
        type: Boolean,
        reflectToAttribute: true,
      },
    };
  }

  /** @protected */
  ready() {
    super.ready();

    this.addEventListener('pointerdown', (event) => {
      if (event.target === this) {
        // Prevent direct clicks to the input container from blurring the input
        event.preventDefault();
      }
    });

    this.addEventListener('click', (event) => {
      if (event.target === this) {
        // The vaadin-input-container element was directly clicked,
        // focus any focusable child element from the default slot
        this.shadowRoot
          .querySelector('slot:not([name])')
          .assignedNodes({ flatten: true })
          .forEach((node) => node.focus && node.focus());
      }
    });
  }
}

customElements.define(InputContainer.is, InputContainer);

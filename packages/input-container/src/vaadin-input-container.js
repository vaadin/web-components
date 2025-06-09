/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { CSSInjectionMixin } from '@vaadin/vaadin-themable-mixin/css-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { inputContainerStyles } from './vaadin-input-container-core-styles.js';

/**
 * @customElement
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes DirMixin
 */
export class InputContainer extends CSSInjectionMixin(ThemableMixin(DirMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-input-container';
  }

  static get styles() {
    return inputContainerStyles;
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
  render() {
    return html`
      <slot name="prefix"></slot>
      <slot></slot>
      <slot name="suffix"></slot>
    `;
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

defineCustomElement(InputContainer);

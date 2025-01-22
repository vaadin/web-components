/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';

/*
 * @customElement
 * @extends HTMLElement
 */
class FormRow extends PolymerElement {
  static get is() {
    return 'vaadin-form-row';
  }

  static get template() {
    return html`
      <style>
        :host {
          display: contents;
        }
        ::slotted(*) {
          grid-column-start: auto;
        }
        ::slotted(*:first-child) {
          grid-column-start: 1;
        }
      </style>
      <slot id="contentSlot"></slot>
    `;
  }
}

defineCustomElement(FormRow);

export { FormRow };

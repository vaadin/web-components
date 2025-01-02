/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { InputContainer } from '@vaadin/input-container/src/vaadin-lit-input-container.js';

/**
 * An element used internally by `<vaadin-multi-select-combo-box>`. Not intended to be used separately.
 *
 * @customElement
 * @extends InputContainer
 * @private
 */
class MultiSelectComboBoxContainer extends InputContainer {
  static get is() {
    return 'vaadin-multi-select-combo-box-container';
  }

  static get styles() {
    return [
      super.styles,
      css`
        #wrapper {
          display: flex;
          width: 100%;
          min-width: 0;
        }

        :host([auto-expand-vertically]) #wrapper {
          flex-wrap: wrap;
        }
      `,
    ];
  }

  static get properties() {
    return {
      /**
       * Set to true to not collapse selected items chips into the overflow
       * chip and instead always expand vertically, causing input field to
       * wrap into multiple lines when width is limited.
       * @attr {boolean} auto-expand-vertically
       */
      autoExpandVertically: {
        type: Boolean,
        reflectToAttribute: true,
      },
    };
  }

  /** @protected */
  render() {
    return html`
      <div id="wrapper">
        <slot name="prefix"></slot>
        <slot></slot>
      </div>
      <slot name="suffix"></slot>
    `;
  }
}

defineCustomElement(MultiSelectComboBoxContainer);

/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { InputContainer } from '@vaadin/input-container/src/vaadin-input-container.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-multi-select-combo-box-container',
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
  {
    moduleId: 'vaadin-multi-select-combo-box-container-styles',
  },
);

let memoizedTemplate;

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

  static get template() {
    if (!memoizedTemplate) {
      memoizedTemplate = super.template.cloneNode(true);
      const content = memoizedTemplate.content;
      const slots = content.querySelectorAll('slot');

      const wrapper = document.createElement('div');
      wrapper.setAttribute('id', 'wrapper');
      content.insertBefore(wrapper, slots[2]);

      wrapper.appendChild(slots[0]);
      wrapper.appendChild(slots[1]);
    }
    return memoizedTemplate;
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
}

defineCustomElement(MultiSelectComboBoxContainer);

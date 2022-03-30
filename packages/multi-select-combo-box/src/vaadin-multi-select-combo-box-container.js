/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { InputContainer } from '@vaadin/input-container/src/vaadin-input-container.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-multi-select-combo-box-container',
  css`
    :host {
      height: 36px;
      overflow: hidden;
    }

    .outer {
      display: block;
      width: 100%;
      height: calc(100% + 20px);
      overflow-x: scroll;
      overflow-y: hidden;
      align-self: flex-start;
    }

    [part='wrapper'] {
      display: flex;
      width: max-content;
      align-items: center;
    }
  `,
  {
    moduleId: 'vaadin-multi-select-combo-box-container-styles'
  }
);

let memoizedTemplate;

/**
 * An element used internally by `<vaadin-multi-select-combo-box>`. Not intended to be used separately.
 *
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

      const outer = document.createElement('div');
      outer.classList.add('outer');
      content.insertBefore(outer, slots[2]);

      const wrapper = document.createElement('div');
      wrapper.setAttribute('part', 'wrapper');
      outer.appendChild(wrapper);

      wrapper.appendChild(slots[0]);
      wrapper.appendChild(slots[1]);
    }
    return memoizedTemplate;
  }
}

customElements.define(MultiSelectComboBoxContainer.is, MultiSelectComboBoxContainer);

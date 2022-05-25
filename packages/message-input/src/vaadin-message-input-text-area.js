/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { TextArea } from '@vaadin/text-area/src/vaadin-text-area.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-message-input-text-area',
  css`
    :host {
      align-self: stretch;
      flex-grow: 1;
    }

    .textarea-wrapper {
      min-height: 0;
    }
  `,
  { moduleId: 'vaadin-message-input-text-area-styles' },
);

/**
 * An element used internally by `<vaadin-message-input>`. Not intended to be used separately.
 *
 * @extends TextArea
 * @protected
 */
class MessageInputTextArea extends TextArea {
  static get is() {
    return 'vaadin-message-input-text-area';
  }

  static get properties() {
    return {
      ariaLabel: {
        type: String,
        observer: '__ariaLabelChanged',
      },
    };
  }

  /**
   * Override an observer from `InputMixin`.
   * @protected
   * @override
   */
  _inputElementChanged(input) {
    super._inputElementChanged(input);

    if (input) {
      input.removeAttribute('aria-labelledby');

      // Set initial height to one row
      input.setAttribute('rows', 1);
      input.style.minHeight = '0';

      this.__updateAriaLabel(this.ariaLabel);
    }
  }

  /**
   * Override an event listener from `InputControlMixin`
   * to dispatch a custom event on Enter key.
   * @param {!KeyboardEvent} event
   * @protected
   * @override
   */
  _onKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      event.stopPropagation();
      this.dispatchEvent(new CustomEvent('enter'));
    }

    super._onKeyDown(event);
  }

  /** @private */
  __updateAriaLabel(ariaLabel) {
    if (ariaLabel) {
      this.inputElement.setAttribute('aria-label', ariaLabel);
    } else {
      this.inputElement.removeAttribute('aria-label');
    }
  }

  /** @private */
  __ariaLabelChanged(ariaLabel) {
    if (!this.inputElement) {
      return;
    }

    this.__updateAriaLabel(ariaLabel);
  }
}

customElements.define(MessageInputTextArea.is, MessageInputTextArea);

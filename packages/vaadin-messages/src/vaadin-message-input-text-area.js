/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { TextAreaElement } from '@vaadin/vaadin-text-field/src/vaadin-text-area.js';
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

registerStyles(
  'vaadin-message-input-text-area',
  css`
    :host {
      align-self: stretch;
      flex-grow: 1;
    }
  `,
  { moduleId: 'vaadin-message-input-text-area-styles' }
);

/**
 * An element used internally by `<vaadin-message-input>`. Not intended to be used separately.
 *
 * @extends TextAreaElement
 * @protected
 */
class MessageInputTextAreaElement extends TextAreaElement {
  static get is() {
    return 'vaadin-message-input-text-area';
  }

  static get version() {
    return '21.0.4';
  }

  static get properties() {
    return {
      ariaLabel: {
        type: String,
        observer: '__ariaLabelChanged'
      }
    };
  }

  ready() {
    super.ready();

    const textarea = this.inputElement;
    textarea.removeAttribute('aria-labelledby');

    // Set initial height to one row
    textarea.setAttribute('rows', 1);
    textarea.style.minHeight = '0';

    // Add enter handling for text area.
    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        this.dispatchEvent(new CustomEvent('enter'));
      }
    });
  }

  __ariaLabelChanged(ariaLabel) {
    // Set aria-label to provide an accessible name for the labelless input
    if (ariaLabel) {
      this.inputElement.setAttribute('aria-label', ariaLabel);
    } else {
      this.inputElement.removeAttribute('aria-label');
    }
  }
}

customElements.define(MessageInputTextAreaElement.is, MessageInputTextAreaElement);

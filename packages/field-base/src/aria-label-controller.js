/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A controller to link an input element with a slotted `<label>` element.
 */
export class AriaLabelController {
  constructor(host, input, label) {
    this.input = input;
    this.__preventDuplicateLabelClick = this.__preventDuplicateLabelClick.bind(this);

    if (label) {
      label.addEventListener('click', this.__preventDuplicateLabelClick);

      if (input) {
        label.setAttribute('for', input.id);

        this.__setAriaLabelledBy(input, host.hasAttribute('has-label') ? label.id : null);
        host.addEventListener('has-label-changed', (event) =>
          this.__setAriaLabelledBy(input, event.detail.value ? label.id : null)
        );
      }
    }
  }

  /**
   * The native platform fires an event for both the click on the label, and also
   * the subsequent click on the native input element caused by label click.
   * This results in two click events arriving at the host, but we only want one.
   * This method prevents the duplicate click and ensures the correct isTrusted event
   * with the correct event.target arrives at the host.
   * @private
   */
  __preventDuplicateLabelClick() {
    const inputClickHandler = (e) => {
      e.stopImmediatePropagation();
      this.input.removeEventListener('click', inputClickHandler);
    };
    this.input.addEventListener('click', inputClickHandler);
  }

  /**
   * Sets or removes the `aria-labelledby` attribute on the input element.
   * @param {HTMLElement} input
   * @param {string | null | undefined} value
   * @private
   */
  __setAriaLabelledBy(input, value) {
    if (value) {
      input.setAttribute('aria-labelledby', value);
    } else {
      input.removeAttribute('aria-labelledby');
    }
  }
}

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

        this.__linkAria(input, label, host.hasAttribute('has-label'));
        host.addEventListener('has-label-changed', (event) => this.__linkAria(input, label, event.detail.value));
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
   * Links or unlinks the input to the label element using aria-labelledby attribute.
   * @private
   */
  __linkAria(input, label, link) {
    if (input && label) {
      if (link) {
        input.setAttribute('aria-labelledby', label.id);
      } else {
        input.removeAttribute('aria-labelledby');
      }
    }
  }
}

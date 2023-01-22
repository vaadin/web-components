/**
 * @license
 * Copyright (c) 2015 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A controller to manage the combo-box DOM elements state.
 */
export class ComboBoxController {
  constructor(host, tagNamePrefix) {
    /** @type {HTMLElement} */
    this.host = host;

    /** @type {string} */
    this.tagNamePrefix = tagNamePrefix;
  }

  /**
   * Request an update for the content of item elements.
   */
  requestContentUpdate() {
    if (!this.scroller) {
      return;
    }

    this.scroller.requestContentUpdate();

    this._getItemElements().forEach((item) => {
      item.requestContentUpdate();
    });
  }

  /**
   * Set and initialize the scroller element.
   * @param {HTMLElement} scroller
   */
  setScroller(scroller) {
    this.scroller = scroller;
  }

  /** @private */
  _getItemElements() {
    return [...this.scroller.querySelectorAll(`${this.tagNamePrefix}-item`)];
  }
}

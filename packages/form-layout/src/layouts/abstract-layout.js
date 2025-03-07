/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * An abstract class for layout implementation. Not intended for public use.
 *
 * @private
 */
export class AbstractLayout {
  /**
   * @param {HTMLElement} host
   * @param {{ mutationObserverOptions: MutationObserverInit }} config
   */
  constructor(host, config) {
    this.host = host;
    this.props = {};
    this.config = config;
    this.isConnected = false;

    /** @private */
    this.__resizeObserver = new ResizeObserver((entries) => setTimeout(() => this._onResize(entries)));

    /** @private */
    this.__mutationObserver = new MutationObserver((records) => this._onMutation(records));
  }

  /**
   * Connects the layout to the host element.
   */
  connect() {
    if (this.isConnected) {
      return;
    }

    this.isConnected = true;
    this.__resizeObserver.observe(this.host);
    this.__mutationObserver.observe(this.host, this.config.mutationObserverOptions);
  }

  /**
   * Disconnects the layout from the host element.
   */
  disconnect() {
    if (!this.isConnected) {
      return;
    }

    this.isConnected = false;
    this.__resizeObserver.disconnect();
    this.__mutationObserver.disconnect();
  }

  /**
   * Sets the properties of the layout controller.
   */
  setProps(props) {
    this.props = props;
  }

  /**
   * Updates the layout based on the current properties.
   */
  updateLayout() {
    // To be implemented
  }

  /**
   * @param {ResizeObserverEntry[]} _entries
   * @protected
   */
  _onResize(_entries) {
    // To be implemented
  }

  /**
   * @param {MutationRecord[]} _records
   * @protected
   */
  _onMutation(_records) {
    // To be implemented
  }
}

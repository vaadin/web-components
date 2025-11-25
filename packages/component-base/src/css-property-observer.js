/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * WARNING: For internal use only. Do not use this class in custom components.
 *
 * @private
 */
export class CSSPropertyObserver extends EventTarget {
  element;
  callback;
  properties = new Set();

  constructor(element, callback) {
    super();
    this.element = element;
    this._handleTransitionEvent = this._handleTransitionEvent.bind(this);

    if (callback) {
      this.addEventListener('property-changed', (event) => callback(event.detail.propertyName));
    }
  }

  observe(...properties) {
    this.connect();

    const newProperties = properties.filter((property) => !this.properties.has(property));
    if (newProperties.length > 0) {
      newProperties.forEach((property) => this.properties.add(property));
      this._updateStyles();
    }
  }

  connect() {
    this.element.addEventListener('transitionend', this._handleTransitionEvent);
  }

  disconnect() {
    this.properties.clear();
    this.element.removeEventListener('transitionend', this._handleTransitionEvent);
  }

  /** @protected */
  _handleTransitionEvent(event) {
    const { propertyName } = event;
    this.dispatchEvent(new CustomEvent('property-changed', { detail: { propertyName } }));
  }

  /** @protected */
  _updateStyles() {
    this.element.style.display = 'contents';
    this.element.style.transitionDuration = '1ms';
    this.element.style.transitionBehavior = 'allow-discrete';
    this.element.style.transitionProperty = `${[...this.properties].join(', ')}`;
    this.element.style.transitionTimingFunction = 'step-end';
  }
}

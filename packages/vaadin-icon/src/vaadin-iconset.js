/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';
import { cloneSvgNode } from './vaadin-icon-svg.js';

const iconRegistry = {};

export const getIconId = (id) => (id || '').replace('vaadin-icon:', '');

/**
 * `<vaadin-iconset>` is a Web Component for creating SVG icon collections.
 *
 * @extends HTMLElement
 * @mixes ElementMixin
 */
class IconsetElement extends ElementMixin(PolymerElement) {
  static get template() {
    return null;
  }

  static get is() {
    return 'vaadin-iconset';
  }

  static get version() {
    return '21.0.0-alpha2';
  }

  static get properties() {
    return {
      /**
       * The name of the iconset.
       */
      name: {
        type: String,
        observer: '__nameChanged'
      }
    };
  }

  /**
   * Create an instance of the iconset.
   *
   * @param {string} name
   */
  static getIconset(name) {
    let iconset = iconRegistry[name];
    if (!iconset) {
      iconset = document.createElement('vaadin-iconset');
      iconset.name = name;
      iconRegistry[name] = iconset;
    }
    return iconset;
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();

    this.style.display = 'none';
  }

  /**
   * Produce SVGTemplateResult for the element matching `id` in this
   * iconset, or `undefined` if there is no matching element.
   *
   * @param {string} id
   */
  applyIcon(id) {
    // create the icon map on-demand, since the iconset itself has no discrete
    // signal to know when it's children are fully parsed
    this._icons = this._icons || this.__createIconMap();
    return cloneSvgNode(this._icons[getIconId(id)]);
  }

  /**
   * Create a map of child SVG elements by id.
   */
  __createIconMap() {
    const icons = {};
    this.querySelectorAll('[id]').forEach((icon) => {
      icons[getIconId(icon.id)] = icon;
    });
    return icons;
  }

  /** @private */
  __nameChanged(name, oldName) {
    if (oldName) {
      iconRegistry[name] = IconsetElement.getIconset(oldName);
      delete iconRegistry[oldName];
    }
    if (name) {
      iconRegistry[name] = this;
    }
  }
}

customElements.define(IconsetElement.is, IconsetElement);

export { IconsetElement };

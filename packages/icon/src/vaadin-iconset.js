/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { cloneSvgNode } from './vaadin-icon-svg.js';

const iconRegistry = {};

/**
 * `<vaadin-iconset>` is a Web Component for creating SVG icon collections.
 *
 * @extends HTMLElement
 * @mixes ElementMixin
 */
class Iconset extends ElementMixin(PolymerElement) {
  static get template() {
    return null;
  }

  static get is() {
    return 'vaadin-iconset';
  }

  static get properties() {
    return {
      /**
       * The name of the iconset. Every iconset is required to have its own unique name.
       * All the SVG icons in the iconset must have IDs conforming to its name.
       *
       * See also [`name`](#/elements/vaadin-icon#property-name) property of `vaadin-icon`.
       */
      name: {
        type: String,
        observer: '__nameChanged',
      },

      /**
       * The size of an individual icon. Note that icons must be square.
       *
       * When using `vaadin-icon`, the size of the iconset will take precedence
       * over the size defined by the user to ensure correct appearance.
       */
      size: {
        type: Number,
        value: 24,
      },
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
   * Produce SVGTemplateResult for the element matching `name` in this
   * iconset, or `undefined` if there is no matching element.
   *
   * @param {string} name
   */
  applyIcon(name) {
    // Create the icon map on-demand, since the iconset itself has no discrete
    // signal to know when it's children are fully parsed
    this._icons = this._icons || this.__createIconMap();
    const icon = this._icons[this.__getIconId(name)];
    return {
      svg: cloneSvgNode(icon),
      size: this.size,
      viewBox: icon ? icon.getAttribute('viewBox') : null,
    };
  }

  /**
   * Create a map of child SVG elements by id.
   */
  __createIconMap() {
    const icons = {};
    this.querySelectorAll('[id]').forEach((icon) => {
      icons[this.__getIconId(icon.id)] = icon;
    });
    return icons;
  }

  /** @private */
  __getIconId(id) {
    return (id || '').replace(`${this.name}:`, '');
  }

  /** @private */
  __nameChanged(name, oldName) {
    if (oldName) {
      iconRegistry[name] = Iconset.getIconset(oldName);
      delete iconRegistry[oldName];
    }
    if (name) {
      iconRegistry[name] = this;
      document.dispatchEvent(new CustomEvent('vaadin-iconset-registered', { detail: name }));
    }
  }
}

customElements.define(Iconset.is, Iconset);

export { Iconset };

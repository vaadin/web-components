/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { cloneSvgNode } from './vaadin-icon-svg.js';

const iconsetRegistry = {};

const attachedIcons = new Set();

function getIconId(id, name) {
  return (id || '').replace(`${name}:`, '');
}

function getIconsetName(icon) {
  if (!icon) {
    return;
  }

  const parts = icon.split(':');

  // Use "vaadin" as a fallback
  return parts[0] || 'vaadin';
}

function initIconsMap(iconset, name) {
  iconset._icons = [...iconset.querySelectorAll('[id]')].reduce((map, svg) => {
    const key = getIconId(svg.id, name);
    map[key] = svg;
    return map;
  }, {});
}

/**
 * `<vaadin-iconset>` is a Web Component for creating SVG icon collections.
 *
 * @customElement
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
   * Set of the `vaadin-icon` instances in the DOM.
   *
   * @return {Set<Icon>}
   */
  static get attachedIcons() {
    return attachedIcons;
  }

  /**
   * Returns an instance of the iconset by its name.
   *
   * @param {string} name
   * @return {Iconset}
   */
  static getIconset(name) {
    return iconsetRegistry[name];
  }

  /**
   * Returns SVGTemplateResult for the `icon` ID matching `name` of the
   * iconset, or `nothing` literal if there is no matching icon found.
   *
   * @param {string} icon
   * @param {?string} name
   */
  static getIconSvg(icon, name) {
    const iconsetName = name || getIconsetName(icon);
    const iconset = this.getIconset(iconsetName);

    if (!icon || !iconset) {
      // Missing icon, return `nothing` literal.
      return { svg: cloneSvgNode(null) };
    }

    const iconId = getIconId(icon, iconsetName);
    const iconSvg = iconset._icons[iconId];

    return {
      preserveAspectRatio: iconSvg ? iconSvg.getAttribute('preserveAspectRatio') : null,
      svg: cloneSvgNode(iconSvg),
      size: iconset.size,
      viewBox: iconSvg ? iconSvg.getAttribute('viewBox') : null,
    };
  }

  /**
   * Register an iconset without adding to the DOM.
   *
   * @param {string} name
   * @param {number} size
   * @param {?HTMLTemplateElement} template
   */
  static register(name, size, template) {
    if (!iconsetRegistry[name]) {
      const iconset = document.createElement('vaadin-iconset');
      iconset.appendChild(template.content.cloneNode(true));
      iconsetRegistry[name] = iconset;

      initIconsMap(iconset, name);

      iconset.size = size;
      iconset.name = name;

      // Call this function manually instead of using observer
      // to make it work without appending element to the DOM.
      iconset.__nameChanged(name);
    }
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();

    this.style.display = 'none';

    // Store reference and init icons.
    const { name } = this;
    iconsetRegistry[name] = this;
    initIconsMap(this, name);
    this.__updateIcons(name);
  }

  /**
   * Update all the icons instances in the DOM.
   *
   * @param {string} name
   * @private
   */
  __updateIcons(name) {
    attachedIcons.forEach((element) => {
      if (name === getIconsetName(element.icon)) {
        element._applyIcon();
      }
    });
  }

  /** @private */
  __nameChanged(name, oldName) {
    if (oldName) {
      iconsetRegistry[name] = iconsetRegistry[oldName];
      delete iconsetRegistry[oldName];
    }
    if (name) {
      this.__updateIcons(name);
    }
  }
}

defineCustomElement(Iconset);

export { Iconset };

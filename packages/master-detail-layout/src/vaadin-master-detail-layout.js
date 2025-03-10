/**
 * @license
 * Copyright (c) 2025 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-master-detail-layout>` is a web component for building UIs with a master
 * (or primary) area and a detail (or secondary) area that is displayed next to, or
 * overlaid on top of, the master area, depending on configuration and viewport size.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes ElementMixin
 * @mixes ResizeMixin
 */
class MasterDetailLayout extends ResizeMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-master-detail-layout';
  }

  static get styles() {
    return css`
      :host {
        display: grid;
        box-sizing: border-box;
        height: 100%;
        --_master-min-size: 20em;
        --_detail-min-size: 20em;
      }

      :host([hidden]) {
        display: none !important;
      }

      :host([has-detail]) {
        grid-template-columns: minmax(var(--_master-min-size), auto) minmax(var(--_detail-min-size), auto);
      }

      :host(:not([has-detail])) [part='detail'] {
        display: none;
      }

      :host([overlay][has-detail]) {
        position: relative;
        grid-template-columns: minmax(var(--_master-min-size), auto);
      }

      :host([overlay]) [part='detail'] {
        position: absolute;
        inset-inline-end: 0;
        min-width: var(--_detail-min-size);
        height: 100%;
      }

      :host([stack][has-detail]) [part='master'] {
        display: none;
      }

      ::slotted(*) {
        box-sizing: border-box;
        height: 100%;
      }
    `;
  }

  /** @protected */
  render() {
    return html`
      <div part="master">
        <slot></slot>
      </div>
      <div part="detail" @slotchange="${this.__onDetailSlotChange}">
        <slot name="detail"></slot>
      </div>
    `;
  }

  /**
   * @protected
   * @override
   */
  _onResize(contentRect) {
    const masterMinSize = this.__getMinSizePx('master');
    const detailMinSize = this.__getMinSizePx('detail');

    // If the combined minimum size of both the master and the detail content
    // exceeds the size of the layout, the layout changes to the overlay mode.
    if (contentRect.width < masterMinSize + detailMinSize && contentRect.width > detailMinSize) {
      this.setAttribute('overlay', '');
    } else {
      this.removeAttribute('overlay');
    }

    if (contentRect.width <= detailMinSize) {
      this.setAttribute('stack', '');
    } else {
      this.removeAttribute('stack');
    }
  }

  /** @private */
  __getMinSizePx(prop) {
    const tmpStyleProp = 'background-position';
    // Convert em size to px units for comparison
    this.style.setProperty(tmpStyleProp, `var(--_${prop}-min-size)`);
    const minSizePx = parseFloat(getComputedStyle(this).getPropertyValue(tmpStyleProp));
    this.style.removeProperty(tmpStyleProp);
    return minSizePx;
  }

  /** @private */
  __onDetailSlotChange(e) {
    this.toggleAttribute('has-detail', e.target.assignedNodes().length > 0);
  }
}

defineCustomElement(MasterDetailLayout);

export { MasterDetailLayout };

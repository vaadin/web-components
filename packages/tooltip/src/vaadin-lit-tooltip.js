/**
 * @license
 * Copyright (c) 2022 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-lit-tooltip-overlay.js';
import { css, html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import { TooltipMixin } from './vaadin-tooltip-mixin.js';

/**
 * LitElement based version of `<vaadin-tooltip>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 *
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemePropertyMixin
 * @mixes TooltipMixin
 */
class Tooltip extends TooltipMixin(ThemePropertyMixin(ElementMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-tooltip';
  }

  static get styles() {
    return css`
      :host {
        display: none;
      }
    `;
  }

  /** @protected */
  render() {
    const effectivePosition = this.__effectivePosition;

    return html`
      <vaadin-tooltip-overlay
        .renderer="${this._renderer}"
        .owner="${this}"
        theme="${ifDefined(this._theme)}"
        .opened="${this._isConnected && (this.manual ? this.opened : this._autoOpened)}"
        .positionTarget="${this.target}"
        .position="${effectivePosition}"
        ?no-horizontal-overlap="${this.__computeNoHorizontalOverlap(effectivePosition)}"
        ?no-vertical-overlap="${this.__computeNoVerticalOverlap(effectivePosition)}"
        .horizontalAlign="${this.__computeHorizontalAlign(effectivePosition)}"
        .verticalAlign="${this.__computeVerticalAlign(effectivePosition)}"
        @mouseenter="${this.__onOverlayMouseEnter}"
        @mouseleave="${this.__onOverlayMouseLeave}"
        modeless
      ></vaadin-tooltip-overlay>

      <slot name="sr-label"></slot>
    `;
  }

  /** @protected */
  ready() {
    super.ready();

    this._overlayElement = this.shadowRoot.querySelector('vaadin-tooltip-overlay');
  }
}

defineCustomElement(Tooltip);

export { Tooltip };

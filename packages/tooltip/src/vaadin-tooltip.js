/**
 * @license
 * Copyright (c) 2022 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-tooltip-overlay.js';
import { css, html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import { TooltipMixin } from './vaadin-tooltip-mixin.js';

/**
 * `<vaadin-tooltip>` is a Web Component for creating tooltips.
 *
 * ```html
 * <button id="confirm">Confirm</button>
 * <vaadin-tooltip text="Click to save changes" for="confirm"></vaadin-tooltip>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name   | Description
 * ----------- | ---------------
 * `overlay`   | The overlay element
 * `content`   | The overlay content element
 *
 * The following state attributes are available for styling:
 *
 * Attribute        | Description
 * -----------------|----------------------------------------
 * `position`       | Reflects the `position` property value.
 *
 * ### Custom CSS Properties
 *
 * The following custom CSS properties are available on the `<vaadin-tooltip>` element:
 *
 * Custom CSS property              | Description
 * ---------------------------------|-------------
 * `--vaadin-tooltip-offset-top`    | Used as an offset when the tooltip is aligned vertically below the target
 * `--vaadin-tooltip-offset-bottom` | Used as an offset when the tooltip is aligned vertically above the target
 * `--vaadin-tooltip-offset-start`  | Used as an offset when the tooltip is aligned horizontally after the target
 * `--vaadin-tooltip-offset-end`    | Used as an offset when the tooltip is aligned horizontally before the target
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} content-changed - Fired when the tooltip text content is changed.
 *
 * @customElement
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
        display: contents;
      }
    `;
  }

  /** @protected */
  render() {
    const effectivePosition = this.__effectivePosition;

    return html`
      <vaadin-tooltip-overlay
        id="overlay"
        .owner="${this}"
        theme="${ifDefined(this._theme)}"
        .opened="${this._isConnected && this.opened}"
        .positionTarget="${this.target}"
        .position="${effectivePosition}"
        ?no-horizontal-overlap="${this.__computeNoHorizontalOverlap(effectivePosition)}"
        ?no-vertical-overlap="${this.__computeNoVerticalOverlap(effectivePosition)}"
        .horizontalAlign="${this.__computeHorizontalAlign(effectivePosition)}"
        .verticalAlign="${this.__computeVerticalAlign(effectivePosition)}"
        @mouseenter="${this.__onOverlayMouseEnter}"
        @mouseleave="${this.__onOverlayMouseLeave}"
        modeless
        exportparts="overlay, content"
        ><slot name="overlay"></slot
      ></vaadin-tooltip-overlay>
    `;
  }
}

defineCustomElement(Tooltip);

export { Tooltip };

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
 * ### Markdown Support
 *
 * The tooltip supports rendering Markdown content by setting the `markdown` property:
 *
 * ```html
 * <button id="info">Info</button>
 * <vaadin-tooltip
 *   text="**Important:** Click to view *detailed* information"
 *   markdown
 *   for="info">
 * </vaadin-tooltip>
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
 * `markdown`       | Reflects the `markdown` property value.
 * `position`       | Reflects the `position` property value.
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                |
 * :----------------------------------|
 * | `--vaadin-tooltip-background`    |
 * | `--vaadin-tooltip-border-color`  |
 * | `--vaadin-tooltip-border-radius` |
 * | `--vaadin-tooltip-border-width`  |
 * | `--vaadin-tooltip-font-size`     |
 * | `--vaadin-tooltip-font-weight`   |
 * | `--vaadin-tooltip-line-height`   |
 * | `--vaadin-tooltip-max-width`     |
 * | `--vaadin-tooltip-offset-bottom` |
 * | `--vaadin-tooltip-offset-end`    |
 * | `--vaadin-tooltip-offset-start`  |
 * | `--vaadin-tooltip-offset-top`    |
 * | `--vaadin-tooltip-padding`       |
 * | `--vaadin-tooltip-shadow`        |
 * | `--vaadin-tooltip-text-color`    |
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
        @click="${this.__onOverlayClick}"
        @mousedown="${this.__onOverlayMouseDown}"
        @mouseenter="${this.__onOverlayMouseEnter}"
        @mouseleave="${this.__onOverlayMouseLeave}"
        modeless
        ?markdown="${this.markdown}"
        exportparts="overlay, content"
        ><slot name="overlay"></slot
      ></vaadin-tooltip-overlay>
    `;
  }
}

defineCustomElement(Tooltip);

export { Tooltip };

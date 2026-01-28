/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-slider-tooltip-overlay.js';
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';

/**
 * `<vaadin-slider-tooltip>` is a web component used by `<vaadin-slider>` to display
 * the current value above the thumb during interaction.
 *
 * @customElement
 * @extends HTMLElement
 * @private
 */
class SliderTooltip extends PolylitMixin(LitElement) {
  static get is() {
    return 'vaadin-slider-tooltip';
  }

  static get styles() {
    return css`
      :host {
        display: contents;
      }
    `;
  }

  static get properties() {
    return {
      /**
       * The value to display in the tooltip.
       */
      value: {
        type: Number,
      },

      /**
       * The element to position the tooltip relative to.
       */
      positionTarget: {
        type: Object,
      },

      /**
       * Whether the tooltip is opened.
       */
      opened: {
        type: Boolean,
        value: false,
      },
    };
  }

  /** @protected */
  render() {
    return html`
      <vaadin-slider-tooltip-overlay
        .opened="${this.opened}"
        .positionTarget="${this.positionTarget}"
        vertical-align="bottom"
        no-vertical-overlap
        modeless
      >
        <slot></slot>
      </vaadin-slider-tooltip-overlay>
    `;
  }
}

defineCustomElement(SliderTooltip);

export { SliderTooltip };

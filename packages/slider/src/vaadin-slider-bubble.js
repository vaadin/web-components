/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-slider-bubble-overlay.js';
import { css, html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';

/**
 * An element used internally by `<vaadin-slider>`. Not intended to be used separately.
 *
 * @customElement vaadin-slider-bubble
 * @extends HTMLElement
 * @private
 */
class SliderBubble extends ThemePropertyMixin(PolylitMixin(LitElement)) {
  static get is() {
    return 'vaadin-slider-bubble';
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
       * The thumb element next to which the overlay should be aligned.
       */
      positionTarget: {
        type: Object,
      },

      /**
       * Whether the overlay is opened.
       */
      opened: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },
    };
  }

  /** @protected */
  render() {
    return html`
      <vaadin-slider-bubble-overlay
        id="overlay"
        .owner="${this}"
        .opened="${this.opened}"
        .positionTarget="${this.positionTarget}"
        theme="${ifDefined(this._theme)}"
        vertical-align="bottom"
        no-vertical-overlap
        modeless
        exportparts="overlay, content"
      >
        <slot></slot>
      </vaadin-slider-bubble-overlay>
    `;
  }
}

defineCustomElement(SliderBubble);

export { SliderBubble };

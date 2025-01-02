/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { overlayStyles } from '@vaadin/overlay/src/vaadin-overlay-styles.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { SelectOverlayMixin } from './vaadin-select-overlay-mixin.js';

/**
 * An element used internally by `<vaadin-select>`. Not intended to be used separately.
 *
 * @extends HTMLElement
 * @mixes SelectOverlayMixin
 * @mixes ThemableMixin
 * @protected
 */
class SelectOverlay extends SelectOverlayMixin(ThemableMixin(PolylitMixin(LitElement))) {
  static get is() {
    return 'vaadin-select-overlay';
  }

  static get styles() {
    return [
      overlayStyles,
      css`
        :host {
          align-items: flex-start;
          justify-content: flex-start;
        }

        :host(:not([phone])) [part='overlay'] {
          min-width: var(--vaadin-select-overlay-width, var(--vaadin-select-text-field-width));
        }

        @media (forced-colors: active) {
          [part='overlay'] {
            outline: 3px solid;
          }
        }
      `,
    ];
  }

  /** @protected */
  render() {
    return html`
      <div id="backdrop" part="backdrop" ?hidden="${!this.withBackdrop}"></div>
      <div part="overlay" id="overlay" tabindex="0">
        <div part="content" id="content">
          <slot></slot>
        </div>
      </div>
    `;
  }

  /** @protected */
  updated(props) {
    super.updated(props);

    if (props.has('renderer')) {
      this.requestContentUpdate();
    }
  }
}

defineCustomElement(SelectOverlay);

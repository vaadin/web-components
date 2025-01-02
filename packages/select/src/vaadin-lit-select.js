/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/input-container/src/vaadin-lit-input-container.js';
import './vaadin-lit-select-item.js';
import './vaadin-lit-select-list-box.js';
import './vaadin-lit-select-overlay.js';
import './vaadin-lit-select-value-button.js';
import { css, html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { screenReaderOnly } from '@vaadin/a11y-base/src/styles/sr-only-styles.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { fieldShared } from '@vaadin/field-base/src/styles/field-shared-styles.js';
import { inputFieldContainer } from '@vaadin/field-base/src/styles/input-field-container-styles.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { SelectBaseMixin } from './vaadin-select-base-mixin.js';

/**
 * LitElement based version of `<vaadin-select>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 *
 * @extends HTMLElement
 */
class Select extends SelectBaseMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-select';
  }

  static get styles() {
    return [
      fieldShared,
      inputFieldContainer,
      screenReaderOnly,
      css`
        :host {
          position: relative;
        }

        ::slotted([slot='value']) {
          flex-grow: 1;
        }
      `,
    ];
  }

  /** @protected */
  render() {
    return html`
      <div class="vaadin-select-container">
        <div part="label" @click="${this._onClick}">
          <slot name="label"></slot>
          <span part="required-indicator" aria-hidden="true" @click="${this.focus}"></span>
        </div>

        <vaadin-input-container
          part="input-field"
          .readonly="${this.readonly}"
          .disabled="${this.disabled}"
          .invalid="${this.invalid}"
          theme="${ifDefined(this._theme)}"
          @click="${this._onClick}"
        >
          <slot name="prefix" slot="prefix"></slot>
          <slot name="value"></slot>
          <div part="toggle-button" slot="suffix" aria-hidden="true" @mousedown="${this._onToggleMouseDown}"></div>
        </vaadin-input-container>

        <div part="helper-text">
          <slot name="helper"></slot>
        </div>

        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
      </div>

      <vaadin-select-overlay
        id="overlay"
        .owner="${this}"
        .positionTarget="${this._inputContainer}"
        .opened="${this.opened}"
        .withBackdrop="${this._phone}"
        .renderer="${this.renderer || this.__defaultRenderer}"
        ?phone="${this._phone}"
        theme="${ifDefined(this._theme)}"
        ?no-vertical-overlap="${this.noVerticalOverlap}"
        @opened-changed="${this._onOpenedChanged}"
        @vaadin-overlay-open="${this._onOverlayOpen}"
      ></vaadin-select-overlay>

      <slot name="tooltip"></slot>
      <div class="sr-only">
        <slot name="sr-label"></slot>
      </div>
    `;
  }

  /** @private */
  _onOpenedChanged(event) {
    this.opened = event.detail.value;
  }

  /** @private */
  _onOverlayOpen() {
    if (this._menuElement) {
      this._menuElement.focus();
    }
  }
}

defineCustomElement(Select);

export { Select };

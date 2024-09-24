/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { overlayStyles } from '@vaadin/overlay/src/vaadin-overlay-styles.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { DatePickerOverlayMixin } from './vaadin-date-picker-overlay-mixin.js';
import { datePickerOverlayStyles } from './vaadin-date-picker-overlay-styles.js';

/**
 * An element used internally by `<vaadin-date-picker>`. Not intended to be used separately.
 *
 * @extends HTMLElement
 * @mixes DatePickerOverlayMixin
 * @mixes DirMixin
 * @mixes ThemableMixin
 * @private
 */
class DatePickerOverlay extends DatePickerOverlayMixin(DirMixin(ThemableMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-date-picker-overlay';
  }

  static get styles() {
    return [overlayStyles, datePickerOverlayStyles];
  }

  static get properties() {
    return {
      /**
       * When true, the overlay is visible and attached to body.
       * This property config is overridden to set `sync: true`.
       */
      opened: {
        type: Boolean,
        notify: true,
        observer: '_openedChanged',
        reflectToAttribute: true,
        sync: true,
      },
    };
  }

  /** @protected */
  render() {
    return html`
      <div id="backdrop" part="backdrop" ?hidden="${!this.withBackdrop}"></div>
      <div part="overlay" id="overlay">
        <div part="content" id="content">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

defineCustomElement(DatePickerOverlay);

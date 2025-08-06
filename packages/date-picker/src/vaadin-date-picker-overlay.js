/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { overlayStyles } from '@vaadin/overlay/src/styles/vaadin-overlay-base-styles.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { datePickerOverlayStyles } from './styles/vaadin-date-picker-overlay-base-styles.js';
import { DatePickerOverlayMixin } from './vaadin-date-picker-overlay-mixin.js';

/**
 * An element used internally by `<vaadin-date-picker>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes DatePickerOverlayMixin
 * @mixes DirMixin
 * @mixes ThemableMixin
 * @private
 */
class DatePickerOverlay extends DatePickerOverlayMixin(
  DirMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement)))),
) {
  static get is() {
    return 'vaadin-date-picker-overlay';
  }

  static get styles() {
    return [overlayStyles, datePickerOverlayStyles];
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

  /**
   * Override method from `OverlayFocusMixin` to specify content root
   * used to detect whether focus should be restored on overlay close.
   *
   * @protected
   * @override
   */
  get _contentRoot() {
    return this.owner._overlayContent;
  }
}

defineCustomElement(DatePickerOverlay);

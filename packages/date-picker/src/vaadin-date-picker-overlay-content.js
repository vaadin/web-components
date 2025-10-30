/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/button/src/vaadin-button.js';
import './vaadin-date-picker-month-scroller.js';
import './vaadin-date-picker-year-scroller.js';
import './vaadin-date-picker-year.js';
import './vaadin-month-calendar.js';
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { overlayContentStyles } from './styles/vaadin-date-picker-overlay-content-base-styles.js';
import { DatePickerOverlayContentMixin } from './vaadin-date-picker-overlay-content-mixin.js';

/**
 * @customElement
 * @extends HTMLElement
 * @private
 */
class DatePickerOverlayContent extends DatePickerOverlayContentMixin(
  ThemableMixin(DirMixin(PolylitMixin(LumoInjectionMixin(LitElement)))),
) {
  static get is() {
    return 'vaadin-date-picker-overlay-content';
  }

  static get styles() {
    return overlayContentStyles;
  }

  static get lumoInjector() {
    return { ...super.lumoInjector, includeBaseStyles: true };
  }

  /** @protected */
  render() {
    return html`
      <slot name="months"></slot>
      <slot name="years"></slot>

      <div role="toolbar" part="toolbar">
        <slot name="today-button"></slot>
        <div
          part="years-toggle-button"
          ?hidden="${this._desktopMode}"
          aria-hidden="true"
          @click="${this._toggleYearScroller}"
        >
          ${this._yearAfterXMonths(this._visibleMonthIndex)}
        </div>
        <slot name="cancel-button"></slot>
      </div>
    `;
  }

  /** @protected */
  firstUpdated() {
    super.firstUpdated();

    this.setAttribute('role', 'dialog');

    this._initControllers();
  }
}

defineCustomElement(DatePickerOverlayContent);

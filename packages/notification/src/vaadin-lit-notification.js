/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { NotificationContainerMixin, NotificationMixin } from './vaadin-notification-mixin.js';
import { notificationCardStyles, notificationContainerStyles } from './vaadin-notification-styles.js';

/**
 * An element used internally by `<vaadin-notification>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes NotificationContainerMixin
 * @mixes ElementMixin
 * @mixes ThemableMixin
 * @private
 */
class NotificationContainer extends NotificationContainerMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement)))) {
  static get styles() {
    return notificationContainerStyles;
  }

  render() {
    return html`
      <div region="top-stretch"><slot name="top-stretch"></slot></div>
      <div region-group="top">
        <div region="top-start"><slot name="top-start"></slot></div>
        <div region="top-center"><slot name="top-center"></slot></div>
        <div region="top-end"><slot name="top-end"></slot></div>
      </div>
      <div region="middle"><slot name="middle"></slot></div>
      <div region-group="bottom">
        <div region="bottom-start"><slot name="bottom-start"></slot></div>
        <div region="bottom-center"><slot name="bottom-center"></slot></div>
        <div region="bottom-end"><slot name="bottom-end"></slot></div>
      </div>
      <div region="bottom-stretch"><slot name="bottom-stretch"></slot></div>
    `;
  }

  static get is() {
    return 'vaadin-notification-container';
  }
}

/**
 * An element used internally by `<vaadin-notification>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes ElementMixin
 * @private
 */
class NotificationCard extends ElementMixin(ThemableMixin(PolylitMixin(LitElement))) {
  static get styles() {
    return notificationCardStyles;
  }

  render() {
    return html`
      <div part="overlay">
        <div part="content">
          <slot></slot>
        </div>
      </div>
    `;
  }

  static get is() {
    return 'vaadin-notification-card';
  }

  /** @protected */
  ready() {
    super.ready();
    this.setAttribute('role', 'alert');
  }
}

/**
 * LitElement based version of `<vaadin-notification>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class Notification extends NotificationMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement)))) {
  static get styles() {
    return css`
      :host {
        display: none !important;
      }
    `;
  }

  render() {
    return html`
      <vaadin-notification-card
        theme="${this._theme || ''}"
        aria-live="${this.__computeAriaLive(this.assertive)}"
      ></vaadin-notification-card>
    `;
  }

  static get is() {
    return 'vaadin-notification';
  }

  /**
   * Fired when the notification is closed.
   *
   * @event closed
   */
}

defineCustomElement(NotificationContainer);
defineCustomElement(NotificationCard);
defineCustomElement(Notification);

export { Notification };

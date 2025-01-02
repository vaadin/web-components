/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { NotificationContainerMixin, NotificationMixin } from './vaadin-notification-mixin.js';
import { notificationCardStyles, notificationContainerStyles } from './vaadin-notification-styles.js';

registerStyles('vaadin-notification-container', notificationContainerStyles, {
  moduleId: 'vaadin-notification-container-styles',
});

registerStyles('vaadin-notification-card', notificationCardStyles, {
  moduleId: 'vaadin-notification-card-styles',
});

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
class NotificationContainer extends NotificationContainerMixin(ThemableMixin(ElementMixin(PolymerElement))) {
  static get template() {
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
 * @private
 */
class NotificationCard extends ThemableMixin(PolymerElement) {
  static get template() {
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
 * `<vaadin-notification>` is a Web Component providing accessible and customizable notifications (toasts).
 *
 * ### Rendering
 *
 * The content of the notification can be populated by using the renderer callback function.
 *
 * The renderer function provides `root`, `notification` arguments.
 * Generate DOM content, append it to the `root` element and control the state
 * of the host element by accessing `notification`. Before generating new content,
 * users are able to check if there is already content in `root` for reusing it.
 *
 * ```html
 * <vaadin-notification id="notification"></vaadin-notification>
 * ```
 * ```js
 * const notification = document.querySelector('#notification');
 * notification.renderer = function(root, notification) {
 *   root.textContent = "Your work has been saved";
 * };
 * ```
 *
 * Renderer is called on the opening of the notification.
 * DOM generated during the renderer call can be reused
 * in the next renderer call and will be provided with the `root` argument.
 * On first call it will be empty.
 *
 * ### Styling
 *
 * `<vaadin-notification>` uses `<vaadin-notification-card>` internal
 * themable component as the actual visible notification cards.
 *
 * The following shadow DOM parts of the `<vaadin-notification-card>` are available for styling:
 *
 * Part name | Description
 * ----------------|----------------
 * `overlay` | The notification container
 * `content` | The content of the notification
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * Note: the `theme` attribute value set on `<vaadin-notification>` is
 * propagated to the internal `<vaadin-notification-card>`.
 *
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 * @fires {CustomEvent} closed - Fired when the notification is closed.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes NotificationMixin
 * @mixes ElementMixin
 */
class Notification extends NotificationMixin(ElementMixin(PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host {
          display: none !important;
        }
      </style>
      <vaadin-notification-card
        theme$="[[_theme]]"
        aria-live$="[[__computeAriaLive(assertive)]]"
      ></vaadin-notification-card>
    `;
  }

  static get is() {
    return 'vaadin-notification';
  }
}

defineCustomElement(NotificationContainer);
defineCustomElement(NotificationCard);
defineCustomElement(Notification);

export { Notification };

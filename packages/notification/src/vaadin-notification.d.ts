/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { TemplateResult } from 'lit';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import {
  NotificationContainerMixin,
  NotificationMixin,
  type NotificationPosition,
} from './vaadin-notification-mixin.js';

export * from './vaadin-notification-mixin.js';

export interface ShowOptions {
  assertive?: boolean;
  duration?: number;
  position?: NotificationPosition;
  theme?: string;
}

/**
 * Fired when the `opened` property changes.
 */
export type NotificationOpenedChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the notification is closed.
 */
export type NotificationClosedEvent = CustomEvent;

export interface NotificationCustomEventMap {
  'opened-changed': NotificationOpenedChangedEvent;
  closed: NotificationClosedEvent;
}

export interface NotificationEventMap extends HTMLElementEventMap, NotificationCustomEventMap {}

/**
 * An element used internally by `<vaadin-notification>`. Not intended to be used separately.
 */
declare class NotificationContainer extends NotificationContainerMixin(ElementMixin(ThemableMixin(HTMLElement))) {}

/**
 * An element used internally by `<vaadin-notification>`. Not intended to be used separately.
 */
declare class NotificationCard extends ThemableMixin(HTMLElement) {}

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
 */
declare class Notification extends NotificationMixin(ElementMixin(HTMLElement)) {
  /**
   * Shows a notification with the given content.
   * By default, positions the notification at `bottom-start` and uses a 5 second duration.
   * An options object can be passed to configure the notification.
   * The options object has the following structure:
   *
   * ```
   * {
   *   assertive?: boolean
   *   position?: string
   *   duration?: number
   *   theme?: string
   * }
   * ```
   *
   * See the individual documentation for:
   * - [`assertive`](#/elements/vaadin-notification#property-assertive)
   * - [`position`](#/elements/vaadin-notification#property-position)
   * - [`duration`](#/elements/vaadin-notification#property-duration)
   *
   * @param contents the contents to show, either as a string or a Lit template.
   * @param options optional options for customizing the notification.
   */
  static show(contents: TemplateResult | string, options?: ShowOptions): Notification;

  addEventListener<K extends keyof NotificationEventMap>(
    type: K,
    listener: (this: Notification, ev: NotificationEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof NotificationEventMap>(
    type: K,
    listener: (this: Notification, ev: NotificationEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-notification-container': NotificationContainer;
    'vaadin-notification-card': NotificationCard;
    'vaadin-notification': Notification;
  }
}

export { Notification };

/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { TemplateResult } from 'lit';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';

export type NotificationPosition =
  | 'bottom-center'
  | 'bottom-end'
  | 'bottom-start'
  | 'bottom-stretch'
  | 'middle'
  | 'top-center'
  | 'top-end'
  | 'top-start'
  | 'top-stretch';

export type NotificationRenderer = (root: HTMLElement, notification?: Notification) => void;

/**
 * Fired when the `opened` property changes.
 */
export type NotificationOpenedChangedEvent = CustomEvent<{ value: boolean }>;

export interface NotificationCustomEventMap {
  'opened-changed': NotificationOpenedChangedEvent;
}

export interface NotificationEventMap extends HTMLElementEventMap, NotificationCustomEventMap {}

export interface ShowOptions {
  duration?: number;
  position?: NotificationPosition;
  theme?: string;
}

/**
 * An element used internally by `<vaadin-notification>`. Not intended to be used separately.
 */
declare class NotificationContainer extends ElementMixin(ThemableMixin(HTMLElement)) {
  /**
   * True when the container is opened
   */
  opened: boolean;
}

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
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * Note: the `theme` attribute value set on `<vaadin-notification>` is
 * propagated to the internal `<vaadin-notification-card>`.
 *
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 */
declare class Notification extends ThemePropertyMixin(ElementMixin(HTMLElement)) {
  /**
   * Shows a notification with the given content.
   * By default, positions the notification at `bottom-start` and uses a 5 second duration.
   * An options object can be passed to configure the notification.
   * The options object has the following structure:
   *
   * ```
   * {
   *   position?: string
   *   duration?: number
   *   theme?: string
   * }
   * ```
   *
   * See the individual documentation for:
   * - [`position`](#/elements/vaadin-notification#property-position)
   * - [`duration`](#/elements/vaadin-notification#property-duration)
   *
   * @param contents the contents to show, either as a string or a Lit template.
   * @param options optional options for customizing the notification.
   */
  static show(contents: TemplateResult | string, options?: ShowOptions): Notification;

  /**
   * The duration in milliseconds to show the notification.
   * Set to `0` or a negative number to disable the notification auto-closing.
   */
  duration: number;

  /**
   * True if the notification is currently displayed.
   */
  opened: boolean;

  /**
   * Alignment of the notification in the viewport
   * Valid values are `top-stretch|top-start|top-center|top-end|middle|bottom-start|bottom-center|bottom-end|bottom-stretch`
   */
  position: NotificationPosition;

  /**
   * Custom function for rendering the content of the notification.
   * Receives two arguments:
   *
   * - `root` The `<vaadin-notification-card>` DOM element. Append
   *   your content to it.
   * - `notification` The reference to the `<vaadin-notification>` element.
   */
  renderer: NotificationRenderer | undefined;

  /**
   * Requests an update for the content of the notification.
   * While performing the update, it invokes the renderer passed in the `renderer` property.
   *
   * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
   */
  requestContentUpdate(): void;

  /**
   * Opens the notification.
   */
  open(): void;

  /**
   * Closes the notification.
   */
  close(): void;

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

import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';

import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';

import { NotificationEventMap, NotificationPosition, NotificationRenderer } from './interfaces';

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
declare class NotificationElement extends ThemePropertyMixin(ElementMixin(HTMLElement)) {
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
   * Manually invoke existing renderer.
   *
   * @deprecated Since Vaadin 21, `render()` is deprecated. Please use `requestContentUpdate()` instead.
   */
  render(): void;

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
    listener: (this: NotificationElement, ev: NotificationEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof NotificationEventMap>(
    type: K,
    listener: (this: NotificationElement, ev: NotificationEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-notification-container': NotificationContainer;
    'vaadin-notification-card': NotificationCard;
    'vaadin-notification': NotificationElement;
  }
}

export { NotificationElement };

import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';

import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';

import { NotificationEventMap, NotificationPosition, NotificationRenderer } from './interfaces';

/**
 * The container element for all notifications.
 */
declare class NotificationContainer extends ElementMixin(ThemableMixin(HTMLElement)) {
  /**
   * True when the container is opened
   */
  opened: boolean;
}

/**
 * The container element for the notification
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------------|----------------
 * `overlay` | The notification container
 * `content` | The content of the notification
 *
 * See [ThemableMixin – how to apply styles for shadow parts](https://github.com/vaadin/vaadin-themable-mixin/wiki)
 */
declare class NotificationCard extends ThemableMixin(HTMLElement) {}

/**
 * `<vaadin-notification>` is a Web Component providing accessible and customizable notifications (toasts).
 * The content of the notification can be populated in two ways: imperatively by using renderer callback function
 * and declaratively by using Polymer's Templates.
 *
 * ### Rendering
 *
 * By default, the notification uses the content provided by using the renderer callback function.
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
 * notification.renderer = function(root) {
 *   root.textContent = "Your work has been saved";
 * };
 * ```
 *
 * Renderer is called on the opening of the notification.
 * DOM generated during the renderer call can be reused
 * in the next renderer call and will be provided with the `root` argument.
 * On first call it will be empty.
 *
 * ### Polymer Templates
 *
 * Alternatively, the content can be provided with Polymer's Template.
 * Notification finds the first child template and uses that in case renderer callback function
 * is not provided. You can also set a custom template using the `template` property.
 *
 * ```
 * <vaadin-notification>
 *   <template>
 *     Your work has been saved
 *   </template>
 * </vaadin-notification>
 * ```
 *
 * ### Styling
 *
 * `<vaadin-notification>` uses `<vaadin-notification-card>` internal
 * themable component as the actual visible notification cards. See
 * the stylable parts the
 * [`<vaadin-notification-card>` API](https://vaadin.com/components/vaadin-notification/html-api/elements/Vaadin.NotificationCard).
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
   * The template of the notification card content.
   */
  _notificationTemplate: HTMLTemplateElement | undefined;

  _setTemplateFromNodes(nodes: Node[]): void;

  /**
   * Manually invoke existing renderer.
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

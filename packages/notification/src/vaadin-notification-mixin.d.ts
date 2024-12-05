import type { Constructor } from '@open-wc/dedupe-mixin';
import type { OverlayClassMixinClass } from '@vaadin/component-base/src/overlay-class-mixin.js';
import type { OverlayStackMixinClass } from '@vaadin/overlay/src/vaadin-overlay-stack-mixin.js';
import type { ThemePropertyMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import type { Notification } from './vaadin-notification.js';

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

export type NotificationRenderer = (root: HTMLElement, notification: Notification) => void;

/**
 * A mixin providing common notification container functionality.
 */
export declare function NotificationContainerMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<NotificationContainerMixinClass> & Constructor<OverlayStackMixinClass> & T;

export declare class NotificationContainerMixinClass {
  /**
   * True when the container is opened
   */
  opened: boolean;
}

/**
 * A mixin providing common notification functionality.
 */
export declare function NotificationMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<NotificationMixinClass> & Constructor<ThemePropertyMixinClass> & Constructor<OverlayClassMixinClass> & T;

export declare class NotificationMixinClass {
  /**
   * When true, the notification card has `aria-live` attribute set to
   * `assertive` instead of `polite`. This makes screen readers announce
   * the notification content immediately when it appears.
   */
  assertive: boolean;

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
}

import { Notification } from './vaadin-notification';

export type NotificationPosition =
  | 'top-stretch'
  | 'top-start'
  | 'top-center'
  | 'top-end'
  | 'middle'
  | 'bottom-start'
  | 'bottom-center'
  | 'bottom-end'
  | 'bottom-stretch';

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
}

import { NotificationElement } from './vaadin-notification';

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

export type NotificationRenderer = (root: HTMLElement, notification?: NotificationElement) => void;

/**
 * Fired when the `opened` property changes.
 */
export type NotificationOpenedChanged = CustomEvent<{ value: boolean }>;

export interface NotificationElementEventMap {
  'opened-changed': NotificationOpenedChanged;
}

export interface NotificationEventMap extends HTMLElementEventMap, NotificationElementEventMap {}

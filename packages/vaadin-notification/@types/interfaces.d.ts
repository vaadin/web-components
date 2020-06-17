import { NotificationElement } from '../src/vaadin-notification.js';

export type NotificationPosition =
  'top-stretch' | 'top-start' | 'top-center' | 'top-end' | 'middle' | 'bottom-start' | 'bottom-center' | 'bottom-end' |
  'bottom-stretch';

export type NotificationRenderer = (
  root: HTMLElement,
  notification?: NotificationElement
) => void;

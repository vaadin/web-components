/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ReactiveController } from 'lit';

/**
 * `<vaadin-a11y-announcer>` is a singleton element for on-demand screen reader announcements.
 * It uses ARIA live region and dynamically updates its content when requested to do so.
 *
 * In order to make use of the announcer, it is best to use `A11yAnnouncerController`,
 * a reactive controller that can be added by the consumer element class:
 *
 * ```js
 * this._a11yController = new A11yAnnouncerController(this)
 * this.addController(this._a11yController);
 * ```
 *
 * After the announcer instance has been made available, you can use the method provided
 * by the controller instance to trigger the screen reader announcement:
 *
 * ```js
 * this._a11yController.announce('Session expired, please reload page.');
 * ```
 *
 * Alternatively, you can make announcements on any component by dispatching bubbling
 * `vaadin-announce` event with `detail` object containing a `text` property:
 *
 * ```js
 *   this.dispatchEvent(
 *     new CustomEvent('vaadin-announce', {
 *       bubbles: true,
 *       composed: true,
 *       detail: {
 *         text: 'Session expired, please reload page.'
 *       }
 *     })
 *   );
 * ```
 *
 * **Note:** announcements are only audible if you have a screen reader enabled.
 */
declare class A11yAnnouncer extends HTMLElement {
  static instance: A11yAnnouncer;

  /**
   * The value of mode is used to set the `aria-live` attribute to set priority
   * with which screen reader should treat updates to the live region.
   * Valid values are: `off`, `polite` and `assertive`.
   */
  mode: 'off' | 'polite' | 'assertive';

  /**
   * Cause a text string to be announced by screen readers.
   */
  announce(text: string): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-a11y-announcer': A11yAnnouncer;
  }
}

export { A11yAnnouncer };

/**
 * A controller for handling on-demand screen reader announcements.
 */
export class A11yAnnouncerController implements ReactiveController {
  constructor(host: HTMLElement);

  hostConnected(): void;

  /**
   * Cause a text string to be announced by screen readers.
   */
  announce(text: string): void;
}

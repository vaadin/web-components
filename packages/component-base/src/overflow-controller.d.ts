/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import type { ReactiveController } from 'lit';

/**
 * A controller that detects if content inside the element overflows its scrolling viewport,
 * and sets the `overflow` attribute on the host with a value that indicates the directions
 * where content is overflowing. Supported values are: `top`, `bottom`, `start`, `end`.
 */
export class OverflowController implements ReactiveController {
  /**
   * The controller host element.
   */
  host: HTMLElement;

  /**
   * The element that wraps scrollable content.
   * If not set, the host element is used.
   */
  scrollTarget: HTMLElement;

  constructor(host: HTMLElement, scrollTarget?: HTMLElement);

  hostConnected(): void;

  /**
   * Setup a scroll listener and observers to update overflow.
   * Also performs one-time update synchronously when called.
   */
  protected observe(): void;
}

/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { ReactiveController } from 'lit';

/**
 * A controller that detects if the content part of a dialog overlay overflows
 * its scrolling viewport vertically, and sets the `overflow` attribute on the
 * overlay (and its owner) with `top`, `bottom`, or `top bottom` accordingly, so
 * that overflow indicators can be styled in CSS.
 */
export class DialogOverflowController implements ReactiveController {
  /**
   * The overlay element that hosts the controller.
   */
  host: HTMLElement;

  constructor(host: HTMLElement);

  hostConnected(): void;

  /**
   * Forces a synchronous overflow update. Call after changing content that
   * affects whether the content part overflows.
   */
  update(): void;
}

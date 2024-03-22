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
 * A controller for listening on media query changes.
 */
export class MediaQueryController implements ReactiveController {
  /**
   * The CSS media query to evaluate.
   */
  protected query: string;

  /**
   * Function to call when media query changes.
   */
  protected callback: (matches: boolean) => void;

  /**
   * @param {HTMLElement} host
   */
  constructor(query: string, callback: (matches: boolean) => void);

  hostConnected(): void;

  hostDisconnected(): void;
}

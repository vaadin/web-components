/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ReactiveController } from 'lit';

/**
 * A controller for listening on media query changes.
 */
export class MediaQueryController implements ReactiveController {
  /**
   * @param {HTMLElement} host
   */
  constructor(query: string, callback: (matches: boolean) => void);

  hostConnected(): void;

  hostDisconnected(): void;

  /**
   * The CSS media query to evaluate.
   */
  protected query: string;

  /**
   * Function to call when media query changes.
   */
  protected callback: (matches: boolean) => void;
}

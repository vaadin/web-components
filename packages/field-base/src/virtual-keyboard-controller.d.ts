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
 * A controller which prevents the virtual keyboard from showing up on mobile devices
 * when the field's overlay is closed.
 */
export class VirtualKeyboardController implements ReactiveController {
  constructor(host: HTMLElement & { inputElement?: HTMLElement; opened: boolean });
}

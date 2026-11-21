/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlottedContentController } from '@vaadin/component-base/src/slotted-content-controller.js';

/**
 * A controller to create and initialize slotted `<input>` element.
 */
export class InputController extends SlottedContentController {
  constructor(host: HTMLElement, callback?: (node: HTMLInputElement) => void, options?: { uniqueIdPrefix?: string });
}

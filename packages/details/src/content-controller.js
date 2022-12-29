/**
 * @license
 * Copyright (c) 2019 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

import { SlotObserveController } from '@vaadin/component-base/src/slot-observe-controller.js';

export class ContentController extends SlotObserveController {
  /**
   * Override method from `SlotController` to change
   * the ID prefix for the default slot content.
   *
   * @param {HTMLElement} host
   * @return {string}
   * @protected
   * @override
   */
  static generateId(host) {
    return super.generateId(host, 'content');
  }

  constructor(host) {
    super(host, '', null, { multiple: true });
  }
}

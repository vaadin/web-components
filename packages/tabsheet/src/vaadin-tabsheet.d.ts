/**
 * @license
 * Copyright (c) 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export type TabSheetOrientation = 'horizontal' | 'vertical';

declare class TabSheet extends ControllerMixin(ElementMixin(ThemableMixin(PolymerElement))) {
  /**
   * The tabsheet's orientation. Possible values are `horizontal|vertical`
   */
  orientation: TabSheetOrientation;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-tabsheet': TabSheet;
  }
}

export { TabSheet };

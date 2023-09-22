/**
 * @license
 * Copyright (c) 2022 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { Scroller } from '@vaadin/scroller/src/vaadin-scroller.js';

/**
 * An element used internally by `<vaadin-tabsheet>`. Not intended to be used separately.
 *
 * @customElement
 * @extends Scroller
 * @private
 */
class TabsheetScroller extends Scroller {
  static get is() {
    return 'vaadin-tabsheet-scroller';
  }
}

defineCustomElement(TabsheetScroller);

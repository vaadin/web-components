/**
 * @license
 * Copyright (c) 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Scroller } from '@vaadin/scroller/src/vaadin-scroller.js';

/**
 * An element used internally by `<vaadin-tabsheet>`. Not intended to be used separately.
 *
 * @extends Scroller
 * @private
 */
class TabsheetScroller extends Scroller {
  static get is() {
    return 'vaadin-tabsheet-scroller';
  }
}

customElements.define(TabsheetScroller.is, TabsheetScroller);

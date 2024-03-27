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

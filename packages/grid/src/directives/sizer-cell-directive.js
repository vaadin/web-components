/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { directive } from 'lit/async-directive.js';
import { BodyCellDirective } from './body-cell-directive.js';

/**
 * A directive that keeps a sizer cell registered as the sizer cell of its column.
 */
class SizerCellDirective extends BodyCellDirective {
  register(column, cell) {
    super.register(column, cell);
    column._sizerCell = cell;
  }

  unregister(column, cell) {
    super.unregister(column, cell);
    column._sizerCell = null;
  }
}

export const sizerCell = directive(SizerCellDirective);

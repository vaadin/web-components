/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export declare function GridSelectionColumnBaseMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<GridSelectionColumnBaseMixinClass> & T;

/**
 * A mixin that provides basic functionality for the
 * `<vaadin-grid-selection-column>`. This includes properties, cell rendering,
 * and overridable methods for handling changes to the selection state.
 *
 * **NOTE**: This mixin is re-used by the Flow component, and as such must not
 * implement any selection state updates for the column element or the grid.
 * Web component-specific selection state updates must be implemented in the
 * `<vaadin-grid-selection-column>` itself, by overriding the protected methods
 * provided by this mixin.
 *
 * @polymerMixin
 */
export declare class GridSelectionColumnBaseMixinClass {
  /**
   * When true, all the items are selected.
   * @attr {boolean} select-all
   */
  selectAll: boolean;

  /**
   * When true, the active gets automatically selected.
   * @attr {boolean} auto-select
   */
  autoSelect: boolean;
}

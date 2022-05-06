/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @polymerMixin
 */
export const StylingMixin = (superClass) =>
  class StylingMixin extends superClass {
    static get properties() {
      return {
        /**
         * A function that allows generating CSS class names for grid cells
         * based on their row and column. The return value should be the generated
         * class name as a string, or multiple class names separated by whitespace
         * characters.
         *
         * Receives two arguments:
         * - `column` The `<vaadin-grid-column>` element (`undefined` for details-cell).
         * - `model` The object with the properties related with
         *   the rendered item, contains:
         *   - `model.index` The index of the item.
         *   - `model.item` The item.
         *   - `model.expanded` Sublevel toggle state.
         *   - `model.level` Level of the tree represented with a horizontal offset of the toggle button.
         *   - `model.selected` Selected state.
         *
         * @type {GridCellClassNameGenerator | null | undefined}
         */
        cellClassNameGenerator: Function,
      };
    }

    static get observers() {
      return ['__cellClassNameGeneratorChanged(cellClassNameGenerator)'];
    }

    __cellClassNameGeneratorChanged() {
      this.generateCellClassNames();
    }

    /**
     * Runs the `cellClassNameGenerator` for the visible cells.
     * If the generator depends on varying conditions, you need to
     * call this function manually in order to update the styles when
     * the conditions change.
     */
    generateCellClassNames() {
      Array.from(this.$.items.children)
        .filter((row) => !row.hidden && !row.hasAttribute('loading'))
        .forEach((row) => this._generateCellClassNames(row, this.__getRowModel(row)));
    }

    /** @private */
    _generateCellClassNames(row, model) {
      Array.from(row.children).forEach((cell) => {
        if (cell.__generatedClasses) {
          cell.__generatedClasses.forEach((className) => cell.classList.remove(className));
        }
        if (this.cellClassNameGenerator) {
          const result = this.cellClassNameGenerator(cell._column, model);
          cell.__generatedClasses = result && result.split(' ').filter((className) => className.length > 0);
          if (cell.__generatedClasses) {
            cell.__generatedClasses.forEach((className) => cell.classList.add(className));
          }
        }
      });
    }
  };

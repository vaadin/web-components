/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { iterateChildren } from './vaadin-grid-helpers.js';

export const StylingMixin = (superClass) =>
  class StylingMixin extends superClass {
    static get properties() {
      return {
        /**
         * A function that allows generating CSS `part` names for grid cells in Shadow DOM based
         * on their row and column, for styling from outside using the `::part()` selector.
         *
         * The return value should be the generated part name as a string, or multiple part names
         * separated by whitespace characters.
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
         * @type {GridCellPartNameGenerator | null | undefined}
         */
        cellPartNameGenerator: {
          type: Function,
          sync: true,
        },
      };
    }

    static get observers() {
      return ['__cellPartNameGeneratorChanged(cellPartNameGenerator)'];
    }

    /** @private */
    __cellPartNameGeneratorChanged() {
      this.generateCellPartNames();
    }

    /**
     * Runs the `cellPartNameGenerator` for the visible cells.
     * If the generator depends on varying conditions, you need to
     * call this function manually in order to update the styles when
     * the conditions change.
     */
    generateCellPartNames() {
      if (!this._columnTree) {
        return;
      }

      iterateChildren(this.$.items, (row) => {
        if (!row.hidden) {
          this.__renderBodyRow(row);
        }
      });
    }
  };

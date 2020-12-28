import { ColumnBaseMixin, GridColumnElement } from './vaadin-grid-column.js';

/**
 * A `<vaadin-grid-column-group>` is used to make groups of columns in `<vaadin-grid>` and
 * to configure additional headers and footers.
 *
 * Groups can be nested to create complex header and footer configurations.
 *
 * The `class` attribute is used to differentiate header and footer templates.
 *
 * #### Example:
 * ```html
 * <vaadin-grid-column-group resizable>
 *  <template class="header">Name</template>
 *
 *  <vaadin-grid-column>
 *    <template class="header">First</template>
 *    <template>[[item.name.first]]</template>
 *  </vaadin-grid-column>
 *  <vaadin-grid-column>
 *    <template class="header">Last</template>
 *    <template>[[item.name.last]]</template>
 *  </vaadin-grid-column>
 * </vaadin-grid-column-group>
 * ```
 */
declare class GridColumnGroupElement extends ColumnBaseMixin(HTMLElement) {
  /**
   * Flex grow ratio for the column group as the sum of the ratios of its child columns.
   * @attr {number} flex-grow
   */
  readonly flexGrow: number | null | undefined;

  /**
   * Width of the column group as the sum of the widths of its child columns.
   */
  readonly width: string | null | undefined;

  _columnPropChanged(path: string, value?: unknown | null): void;

  _updateFlexAndWidth(): void;

  _getChildColumns(el: GridColumnGroupElement): GridColumnElement[];

  _isColumnElement(node: Node): boolean;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-grid-column-group': GridColumnGroupElement;
  }
}

export { GridColumnGroupElement };

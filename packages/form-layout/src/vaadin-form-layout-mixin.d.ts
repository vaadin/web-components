/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { SlotStylesMixinClass } from '@vaadin/component-base/src/slot-styles-mixin.js';

export type FormLayoutLabelsPosition = 'aside' | 'top';

export type FormLayoutResponsiveStep = {
  minWidth?: string | 0;
  columns: number;
  labelsPosition?: FormLayoutLabelsPosition;
};

/**
 * A mixin providing common form-layout functionality.
 */
export declare function FormLayoutMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<FormLayoutMixinClass> & Constructor<SlotStylesMixinClass> & T;

export declare class FormLayoutMixinClass {
  /**
   * Allows specifying a responsive behavior with the number of columns
   * and the label position depending on the layout width.
   *
   * Format: array of objects, each object defines one responsive step
   * with `minWidth` CSS length, `columns` number, and optional
   * `labelsPosition` string of `"aside"` or `"top"`. At least one item is required.
   *
   * #### Examples
   *
   * ```javascript
   * formLayout.responsiveSteps = [{columns: 1}];
   * // The layout is always a single column, labels aside.
   * ```
   *
   * ```javascript
   * formLayout.responsiveSteps = [
   *   {minWidth: 0, columns: 1},
   *   {minWidth: '40em', columns: 2}
   * ];
   * // Sets two responsive steps:
   * // 1. When the layout width is < 40em, one column, labels aside.
   * // 2. Width >= 40em, two columns, labels aside.
   * ```
   *
   * ```javascript
   * formLayout.responsiveSteps = [
   *   {minWidth: 0, columns: 1, labelsPosition: 'top'},
   *   {minWidth: '20em', columns: 1},
   *   {minWidth: '40em', columns: 2}
   * ];
   * // Default value. Three responsive steps:
   * // 1. Width < 20em, one column, labels on top.
   * // 2. 20em <= width < 40em, one column, labels aside.
   * // 3. Width >= 40em, two columns, labels aside.
   * ```
   */
  responsiveSteps: FormLayoutResponsiveStep[];

  /**
   * Enables the auto responsive mode where the component automatically creates and adjusts
   * columns based on the container's width. Columns have a fixed width defined by `columnWidth`
   * and their number increases up to the limit set by `maxColumns`. The component dynamically
   * adjusts the number of columns as the container size changes. When this mode is enabled,
   * the `responsiveSteps` are ignored.
   *
   * By default, each field is placed on a new row. To organize fields into rows, there are
   * two options:
   *
   * 1. Use `<vaadin-form-row>` to explicitly group fields into rows.
   *
   * 2. Enable the `autoRows` property to automatically arrange fields in available columns,
   *    wrapping to a new row when necessary. `<br>` elements can be used to force a new row.
   *
   * @attr {boolean} auto-responsive
   */
  autoResponsive: boolean;

  /**
   * When `autoResponsive` is enabled, defines the width of each column.
   * The value must be defined in CSS length units, e.g., `100px` or `13em`.
   * The default value is `13em`.
   *
   * @attr {string} column-width
   */
  columnWidth: string;

  /**
   * When `autoResponsive` is enabled, defines the maximum number of columns
   * that the layout can create. The layout will create columns up to this
   * limit based on the available container width. The default value is `10`.
   *
   * @attr {number} max-columns
   */
  maxColumns: number;

  /**
   * When enabled with `autoResponsive`, distributes fields across columns
   * by placing each field in the next available column and wrapping to
   * the next row when the current row is full. `<br>` elements can be
   * used to force a new row.
   *
   * @attr {boolean} auto-rows
   */
  autoRows: boolean;

  /**
   * When enabled with `autoResponsive`, `<vaadin-form-item>` prefers positioning
   * labels beside the fields. If the layout is too narrow to fit a single column
   * with side labels, they revert to their default position above the fields.
   *
   * To customize the label width and the gap between the label and the field,
   * use the following CSS properties:
   *
   * - `--vaadin-form-layout-label-width`
   * - `--vaadin-form-layout-label-spacing`
   *
   * @attr {boolean} labels-aside
   */
  labelsAside: boolean;

  /**
   * When `autoResponsive` is enabled, specifies whether the columns should expand
   * in width to evenly fill any remaining space after the layout has created as
   * many fixed-width (`columnWidth`) columns as possible within the `maxColumns`
   * limit. The default value is `false`.
   *
   * @attr {boolean} expand-columns
   */
  expandColumns: boolean;

  /**
   * When `autoResponsive` is enabled, specifies whether fields should stretch
   * to take up all available space within columns. This setting also applies
   * to fields inside `<vaadin-form-item>` elements. The default value is `false`.
   *
   * @attr {boolean} expand-fields
   */
  expandFields: boolean;

  /**
   * Update the layout.
   */
  protected _updateLayout(): void;
}

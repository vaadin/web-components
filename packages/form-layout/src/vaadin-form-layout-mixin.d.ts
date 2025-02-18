/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { ResizeMixinClass } from '@vaadin/component-base/src/resize-mixin.js';

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
): Constructor<ResizeMixinClass> & Constructor<FormLayoutMixinClass> & T;

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
   * When enabled, makes the layout automatically create and adjust its columns based on
   * the container width. The layout creates columns of fixed width (defined by `columnWidth`),
   * up to the limit set by `maxColumns`. The number of columns adjusts dynamically as
   * the container size changes.
   *
   * By default, each field is placed on a new row. To group fields on the same row,
   * wrap them into <vaadin-form-row> or enable the `autoRows` property to make
   * the layout try to fit as many fields as possible on the same row before moving
   * to the new row.
   *
   * NOTE: This property overrides any `responsiveSteps` configuration.
   *
   * @attr {boolean} auto-responsive
   */
  autoResponsive: boolean;

  /**
   * When `autoResponsive` is enabled, defines the width of each column.
   * Must be specified in CSS length units, e.g. `100px`. The default value is `13em`.
   */
  columnWidth: string;

  /**
   * When `autoResponsive` is enabled, defines the maximum number of columns the layout can create.
   * The layout will create columns up to this limit, based on the available container width.
   */
  maxColumns: number;

  /**
   * When enabled with `autoResponsive`, automatically places each field into the next available column
   * until the row is filled. Then the layout moves to the next row.
   */
  autoRows: boolean;

  /**
   * Update the layout.
   */
  protected _updateLayout(): void;
}

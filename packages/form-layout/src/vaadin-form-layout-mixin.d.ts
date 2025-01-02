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
   * Update the layout.
   */
  protected _updateLayout(): void;
}

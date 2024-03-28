/**
 * @license
 * Copyright (c) 2018 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import type { FieldMixinClass } from '@vaadin/field-base/src/field-mixin.js';
import type { LabelMixinClass } from '@vaadin/field-base/src/label-mixin.js';
import type { ValidateMixinClass } from '@vaadin/field-base/src/validate-mixin.js';

/**
 * A mixin providing common checkbox-group functionality.
 */
export declare function CheckboxGroupMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<CheckboxGroupMixinClass> &
  Constructor<ControllerMixinClass> &
  Constructor<DisabledMixinClass> &
  Constructor<FieldMixinClass> &
  Constructor<FocusMixinClass> &
  Constructor<LabelMixinClass> &
  Constructor<ValidateMixinClass> &
  T;

export declare class CheckboxGroupMixinClass {
  /**
   * An array containing values of the currently checked checkboxes.
   *
   * The array is immutable so toggling checkboxes always results in
   * creating a new array.
   */
  value: string[];

  /**
   * When true, the user cannot modify the value of the checkbox group.
   * The difference between `disabled` and `readonly` is that in the
   * read-only checkbox group, all the checkboxes are also read-only,
   * and therefore remain focusable and announced by screen readers.
   */
  readonly: boolean;
}

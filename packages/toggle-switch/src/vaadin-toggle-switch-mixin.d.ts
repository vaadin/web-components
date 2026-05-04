/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { ActiveMixinClass } from '@vaadin/a11y-base/src/active-mixin.js';
import type { DelegateFocusMixinClass } from '@vaadin/a11y-base/src/delegate-focus-mixin.js';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { KeyboardMixinClass } from '@vaadin/a11y-base/src/keyboard-mixin.js';
import type { DelegateStateMixinClass } from '@vaadin/component-base/src/delegate-state-mixin.js';
import type { SlotStylesMixinClass } from '@vaadin/component-base/src/slot-styles-mixin.js';
import type { CheckedMixinClass } from '@vaadin/field-base/src/checked-mixin.js';
import type { FieldMixinClass } from '@vaadin/field-base/src/field-mixin.js';
import type { InputMixinClass } from '@vaadin/field-base/src/input-mixin.js';
import type { LabelMixinClass } from '@vaadin/field-base/src/label-mixin.js';
import type { ValidateMixinClass } from '@vaadin/field-base/src/validate-mixin.js';

/**
 * A mixin providing common toggle switch functionality.
 */
export declare function ToggleSwitchMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ActiveMixinClass> &
  Constructor<CheckedMixinClass> &
  Constructor<DelegateFocusMixinClass> &
  Constructor<DelegateStateMixinClass> &
  Constructor<DisabledMixinClass> &
  Constructor<FieldMixinClass> &
  Constructor<FocusMixinClass> &
  Constructor<InputMixinClass> &
  Constructor<KeyboardMixinClass> &
  Constructor<LabelMixinClass> &
  Constructor<SlotStylesMixinClass> &
  Constructor<ToggleSwitchMixinClass> &
  Constructor<ValidateMixinClass> &
  T;

export declare class ToggleSwitchMixinClass {
  /**
   * The name of the toggle switch.
   */
  name: string;

  /**
   * When true, the user cannot modify the value of the toggle switch.
   * The difference between `disabled` and `readonly` is that the
   * read-only toggle switch remains focusable, is announced by screen
   * readers and its value can be submitted as part of the form.
   */
  readonly: boolean;
}

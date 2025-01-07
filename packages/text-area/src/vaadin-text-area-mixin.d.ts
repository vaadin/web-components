/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { DelegateFocusMixinClass } from '@vaadin/a11y-base/src/delegate-focus-mixin.js';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { KeyboardMixinClass } from '@vaadin/a11y-base/src/keyboard-mixin.js';
import type { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import type { DelegateStateMixinClass } from '@vaadin/component-base/src/delegate-state-mixin.js';
import type { ResizeMixinClass } from '@vaadin/component-base/src/resize-mixin.js';
import type { SlotStylesMixinClass } from '@vaadin/component-base/src/slot-styles-mixin.js';
import type { ClearButtonMixinClass } from '@vaadin/field-base/src/clear-button-mixin.js';
import type { FieldMixinClass } from '@vaadin/field-base/src/field-mixin.js';
import type { InputConstraintsMixinClass } from '@vaadin/field-base/src/input-constraints-mixin.js';
import type { InputControlMixinClass } from '@vaadin/field-base/src/input-control-mixin.js';
import type { InputFieldMixinClass } from '@vaadin/field-base/src/input-field-mixin.js';
import type { InputMixinClass } from '@vaadin/field-base/src/input-mixin.js';
import type { LabelMixinClass } from '@vaadin/field-base/src/label-mixin.js';
import type { ValidateMixinClass } from '@vaadin/field-base/src/validate-mixin.js';

/**
 * A mixin providing common text area functionality.
 */
export declare function TextAreaMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ClearButtonMixinClass> &
  Constructor<ControllerMixinClass> &
  Constructor<DelegateFocusMixinClass> &
  Constructor<DelegateStateMixinClass> &
  Constructor<DisabledMixinClass> &
  Constructor<FieldMixinClass> &
  Constructor<FocusMixinClass> &
  Constructor<InputConstraintsMixinClass> &
  Constructor<InputControlMixinClass> &
  Constructor<InputFieldMixinClass> &
  Constructor<InputMixinClass> &
  Constructor<KeyboardMixinClass> &
  Constructor<LabelMixinClass> &
  Constructor<ResizeMixinClass> &
  Constructor<SlotStylesMixinClass> &
  Constructor<TextAreaMixinClass> &
  Constructor<ValidateMixinClass> &
  T;

export declare class TextAreaMixinClass {
  /**
   * Maximum number of characters (in Unicode code points) that the user can enter.
   */
  maxlength: number | null | undefined;

  /**
   * Minimum number of characters (in Unicode code points) that the user can enter.
   */
  minlength: number | null | undefined;

  /**
   * A regular expression that the value is checked against.
   * The pattern must match the entire value, not just some subset.
   */
  pattern: string;

  /**
   * Minimum number of rows to show. Default is two rows.
   *
   * When using a custom slotted textarea, the minimum number of rows are not applied for backwards compatibility.
   *
   * @attr {number} min-rows
   */
  minRows: number;

  /**
   * Maximum number of rows to expand to before the text area starts scrolling. This effectively sets a max-height
   * on the `input-field` part. By default, it is not set, and the text area grows with the content without
   * constraints.
   * @attr {number} max-rows
   */
  maxRows: number | null | undefined;

  /**
   * Scrolls the textarea to the start if it has a vertical scrollbar.
   */
  scrollToStart(): void;

  /**
   * Scrolls the textarea to the end if it has a vertical scrollbar.
   */
  scrollToEnd(): void;
}

/**
 * @license
 * Copyright (c) 2015 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { KeyboardMixinClass } from '@vaadin/a11y-base/src/keyboard-mixin.js';
import type { OverlayClassMixinClass } from '@vaadin/component-base/src/overlay-class-mixin.js';
import type { InputMixinClass } from '@vaadin/field-base/src/input-mixin.js';

export declare function ComboBoxBaseMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ComboBoxBaseMixinClass> &
  Constructor<DisabledMixinClass> &
  Constructor<FocusMixinClass> &
  Constructor<InputMixinClass> &
  Constructor<KeyboardMixinClass> &
  Constructor<OverlayClassMixinClass> &
  T;

export declare class ComboBoxBaseMixinClass {
  /**
   * True if the dropdown is open, false otherwise.
   */
  opened: boolean;

  /**
   * Set true to prevent the overlay from opening automatically.
   * @attr {boolean} auto-open-disabled
   */
  autoOpenDisabled: boolean | null | undefined;

  /**
   * When present, it specifies that the field is read-only.
   */
  readonly: boolean;

  /**
   * Opens the dropdown list.
   */
  open(): void;

  /**
   * Closes the dropdown list.
   */
  close(): void;
}

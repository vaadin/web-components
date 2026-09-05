/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { InputMixinClass } from '@vaadin/field-base/src/input-mixin.js';
import type { FormatMixinClass } from './format-mixin.js';

/**
 * A mixin that presents the field value in another form than the one stored in
 * `value`, as the user types: an IBAN presented as `FI21 1234 5600 0007 85`, a
 * phone number presented as `+1 (555) 123-4567`.
 *
 * A format is defined in one of two ways:
 *
 * - `formatMask` lays the value out with a pattern of slots and fixed characters,
 *   for example `'+1 (000) 000-0000'`.
 * - `formatBlocks`, `formatDelimiter` and `formatTextCase` group the value into
 *   blocks of a fixed length, for example `[4, 4, 4, 4, 2]` for an IBAN.
 *
 * Setting both is reported with a warning, and `formatMask` is the one applied.
 * With neither of them set the field behaves exactly as an unformatted one.
 *
 * The `value` property stays the string the user entered, without the characters
 * that the format inserts. The presented text is written to the input element and
 * mirrored in the read-only `formattedValue` property. A value that the format
 * cannot lay out in full is kept as it is, and only the part that fits is shown.
 *
 * Applies `FormatMixin`, which owns the presentation write path, so the mixin is
 * applied on its own rather than on top of it. Every behavior of this mixin is
 * conditional on its own format properties, so a layer above it can present a
 * format of its own and this one stays out of the way.
 *
 * Requires `InputControlMixin` (or a mixin applying it) below this mixin in the
 * chain. The `beforeinput`, `paste` and `drop` listeners are registered there;
 * without it, the delete intents and paste acceptance are inert and shrink
 * detection falls back to the view-length diff. Formatting on input still works.
 */
export declare function InputFormatMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<FormatMixinClass> & Constructor<InputFormatMixinClass> & Constructor<InputMixinClass> & T;

export declare class InputFormatMixinClass {
  /**
   * The group lengths for as-you-type chunking, e.g. `[4, 4, 4, 4, 2]` for an
   * IBAN. When unset, the field behaves exactly as an unformatted text field
   * and the other two chunking properties have no effect. Assign a new array
   * to change the grouping — mutating it in place does not trigger an update.
   *
   * Settable as a JSON attribute: format-blocks='[4,4,4,4,2]'
   *
   * Ignored while `formatMask` is set.
   *
   * An invalid value is reported with a warning and treated as unset.
   */
  formatBlocks: number[] | undefined;

  /**
   * The single character inserted between the groups of `formatBlocks`.
   * Defaults to a space.
   *
   * An invalid value is reported with a warning, and a space is used instead.
   *
   * @attr {string} format-delimiter
   */
  formatDelimiter: string | undefined;

  /**
   * The case applied to the value, either `'upper'` or `'lower'`. When unset,
   * the value is kept as the user enters it.
   *
   * An invalid value is reported with a warning, and no case is applied.
   *
   * @attr {string} format-text-case
   */
  formatTextCase: string | undefined;

  /**
   * The pattern that the value is laid out with, e.g. `'+1 (000) 000-0000'`
   * for a US phone number. Each character of the pattern is either a slot
   * that the user fills or a character that the field inserts:
   *
   * - `0` any digit, stored as the ASCII digit
   * - `a` any letter
   * - `*` any character
   * - `\x` the character `x` itself, e.g. `\0` for a literal zero
   * - every other character is inserted as it is
   *
   * Takes precedence over `formatBlocks`, which is then ignored with a
   * warning. Unlike the blocks, a mask is a fixed length: characters past
   * its last slot are dropped.
   *
   * An invalid value is reported with a warning and treated as unset.
   *
   * @attr {string} format-mask
   */
  formatMask: string | undefined;

  /**
   * When true and a `formatMask` is set, a value that does not fill the mask
   * makes the field invalid. Checked on commit, like the other constraints,
   * so an incomplete value is reported when the user leaves the field, not
   * while typing.
   *
   * Has no effect with `formatBlocks`, which has no fixed length to fill, and
   * an empty value is left to `required`.
   *
   * @attr {boolean} format-completion-required
   */
  formatCompletionRequired: boolean;

  /**
   * Returns whether the value fills the configured mask, which is what
   * `formatCompletionRequired` makes a constraint.
   *
   * A field with no `formatMask` reports complete: `formatBlocks` has no fixed
   * length to fill, so there is nothing for the value to be short of, and a mask
   * that did not compile is treated as unset everywhere else as well.
   */
  protected _isFormatComplete(): boolean;

  /**
   * The `inputmode` that the configured format implies, `'numeric'` for a mask
   * whose every slot is a digit, `undefined` otherwise. Derived from the mask's
   * maximal expansion, so it does not change while the user types.
   */
  protected readonly _formatInputMode: string | undefined;
}

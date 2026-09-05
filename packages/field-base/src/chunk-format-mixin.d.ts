/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { FormatMixinClass } from './format-mixin.js';
import type { InputMixinClass } from './input-mixin.js';

/**
 * A mixin that presents the field value in groups of a fixed length, separated
 * by a delimiter, as the user types. An IBAN presented as `FI21 1234 5600 0007 85`
 * and a phone number presented as `555 123 4567` are the two typical cases.
 *
 * The `value` property stays the unformatted string. The grouped text is written
 * to the input element and mirrored in the read-only `formattedValue` property.
 * With no `formatBlocks` configured the field behaves exactly as an unformatted one.
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
export declare function ChunkFormatMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ChunkFormatMixinClass> & Constructor<FormatMixinClass> & Constructor<InputMixinClass> & T;

export declare class ChunkFormatMixinClass {
  /**
   * The group lengths for as-you-type chunking, e.g. `[4, 4, 4, 4, 2]` for an
   * IBAN. When unset, the field behaves exactly as an unformatted text field
   * and the other two format properties have no effect. Assign a new array to
   * change the grouping — mutating it in place does not trigger an update.
   *
   * Settable as a JSON attribute: format-blocks='[4,4,4,4,2]'
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
}

/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A compiled mask: one item per character of the masked value, a regular expression
 * for a user slot and a string for a fixed character, together with the set of every
 * character that the mask holds as a fixed character and the text case to apply to
 * the characters that the user types.
 */
export interface NormalizedMask {
  items: Array<RegExp | string>;
  literalChars: Set<string>;
  textCase?: 'lower' | 'upper';
}

/**
 * The value of an input element together with its selection.
 */
export interface MaskState {
  value: string;
  selection: [number, number];
}

/**
 * A state as a caller may pass it in, with the selection defaulting to a collapsed
 * one at the end of the value.
 */
export interface MaskStateInput {
  value: string;
  selection?: number[];
}

/**
 * A compiled mask, or a function that returns the compiled mask to use for a state,
 * for a mask that depends on the value. A function carries `maximal` when the mask
 * it describes has a maximal expansion, which is the case for a mask with optional
 * sections and not for one that grows with the value.
 */
export type MaskExpression = (((state: MaskState) => NormalizedMask) & { maximal?: NormalizedMask }) | NormalizedMask;

/**
 * Options for compiling a mask.
 */
export interface MaskCompileOptions {
  /**
   * The case to apply to the characters that the user types. Any value other than
   * `'upper'` and `'lower'` is compiled as no case at all, without a warning.
   */
  textCase?: string | null;
}

/**
 * Options for a deletion applied through the mask.
 */
export interface MaskDeleteOptions {
  /**
   * What deleting a range that covers fixed characters only does: move the caret over
   * them (`'hop'`, the default), or delete one character on the far side instead
   * (`'widen'`).
   */
  literals?: 'hop' | 'widen';

  /**
   * Whether the deletion runs forwards, which decides the side the caret moves to and
   * the side that `literals: 'widen'` extends the range on.
   */
  forward?: boolean;
}

/**
 * Options for masking a value.
 */
export interface MaskCalibrateOptions {
  /**
   * The state the value is edited from, used to tell a fixed character that the value
   * already held from one that the user typed.
   */
  initialState?: MaskState | null;

  /**
   * Whether the value is an unmasked one, in which case the fixed characters are always
   * inserted and never consume a character of the value.
   */
  raw?: boolean;
}

/**
 * An edit expressed as the range of a value that was replaced and the text that
 * replaced it.
 */
export interface MaskEdit {
  start: number;
  end: number;
  data: string;
}

/**
 * Returns the text with the given case applied, or unchanged when no case is set.
 * Only `'upper'` and `'lower'` are recognized, any other value leaves the text as
 * it is.
 */
export function applyTextCase(text: string, textCase: string | null | undefined): string;

/**
 * Compiles a mask string into the list of items that the other functions work with,
 * one item per character of the masked value: a regular expression for a user slot
 * and a string for a fixed character. The compiled mask also carries the set of every
 * character that the mask holds as a fixed character, for offset independent filtering
 * of a text fragment.
 *
 * The compiled mask carries the text case to apply to the characters that the user
 * types, taken from `options.textCase`. Only `'upper'` and `'lower'` are accepted, any
 * other value is recorded as no case at all and does not warn, since the layer that
 * reads the property is the one that validates it.
 *
 * The grammar is a subset of the IMask one:
 *
 * - `0` any digit, stored as the ASCII digit
 * - `a` any letter
 * - `*` any character
 * - `[…]` an optional section at the end of the mask
 * - `\x` the literal character `x`
 * - every other character is a fixed character
 *
 * A mask with optional sections describes several lengths rather than one, so it
 * compiles to a mask expression instead of a single compiled mask: the sections are
 * enabled left to right, which gives a chain of one expansion per section plus the
 * one with none of them, and the expression returns the shortest expansion that
 * holds the user characters of the state it is given. The maximal expansion is
 * carried as the `maximal` property of the expression, for a caller that needs the
 * mask as a whole rather than as it currently resolves.
 *
 * Returns `null` when no mask is configured. Also returns `null` when the mask is
 * invalid, in which case a warning is logged and the mask is treated as unset. The
 * first of these conditions that the mask meets is the one reported:
 *
 * - the mask is not a non-empty string
 * - the mask ends with a dangling `\`
 * - an optional section is nested inside another, or is left unclosed
 * - a `]` has no matching `[`, which `\]` is the way to write as a literal
 * - an optional section is not at the end of the mask
 * - an optional section has no user slot
 * - the mask has no user slot outside its optional sections
 * - the mask has more than four optional sections
 * - the mask has no user slot at all
 */
export function compileMask(mask: string | null | undefined, options?: MaskCompileOptions): MaskExpression | null;

/**
 * Returns the maximal expansion of the given compiled mask, that is the mask as a
 * whole rather than as it currently resolves, or `undefined` when it has none.
 *
 * A plain compiled mask is its own maximal expansion. A mask expression that
 * `compileMask` returned for a mask with optional sections carries one. Any other
 * mask expression describes a mask that has no maximal expansion at all, such as a
 * chunking one that grows with the value, and yields `undefined`.
 */
export function maximalOf(compiled: MaskExpression): NormalizedMask | undefined;

/**
 * Returns whether the given value fits the given mask exactly, that is whether it has
 * one character per mask item and every character is accepted by its item.
 */
export function validateWithMask(value: string, compiled: MaskExpression): boolean;

/**
 * Returns the given state masked, that is the closest value to it that the mask
 * accepts, with both selection indexes mapped to that value.
 *
 * A value that already fits the mask is returned unchanged. Otherwise it is rebuilt
 * left to right: the fixed characters of the mask are inserted where they are due,
 * characters that their slot rejects are dropped, and characters past the end of the
 * mask are truncated.
 *
 * When the mask has a text case, every character of the value is stored with that case
 * applied. A character that lands in a digit slot is stored as the ASCII digit with the
 * same numeric value, so that a value typed with another set of digits reads the same as
 * one typed with the ASCII ones.
 *
 * With `raw: true` the value is taken as an unmasked one, so the fixed characters are
 * always inserted and never consume a character of the value. With `raw: false` a
 * character that equals the fixed character due next is consumed as that character,
 * unless `initialState` already held it at that index, which is how typing a delimiter
 * that the mask inserts anyway does not double it.
 */
export function calibrate(
  state: MaskState | MaskStateInput,
  compiled: MaskExpression,
  options?: MaskCalibrateOptions,
): MaskState;

/**
 * Returns the given masked value or state without the fixed characters of the mask,
 * that is the characters that the user typed. A character is only dropped where it
 * equals the fixed character sitting at its own index, so a value that does not fit
 * the mask keeps the characters that the mask does not describe.
 *
 * A string returns a string, a state returns a state with both selection indexes
 * mapped to the unmasked value.
 */
export function unmask(state: string, compiled: MaskExpression): string;
export function unmask(state: MaskState | MaskStateInput, compiled: MaskExpression): MaskState;

/**
 * Returns the index in the unmasked value that corresponds to the given index in the
 * masked value, that is the number of characters before it that the mask does not hold
 * as a fixed character anywhere.
 *
 * Unlike `unmask`, which only drops a fixed character sitting at its own index, this
 * does not depend on the offsets of the mask, so it also maps an index of a value that
 * another mask laid out, such as after a mask change while the field is focused. The
 * given index is clamped to the length of the value.
 */
export function unmaskedIndex(value: string, compiled: MaskExpression, index: number): number;

/**
 * Returns the index in the masked value that corresponds to the given index in the
 * unmasked value, that is the index just after the character that the given index
 * counts up to, counting only the characters that the mask does not hold as a fixed
 * character anywhere.
 *
 * Returns `0` for index `0`, which callers must treat as a valid index rather than as
 * falsy, and the length of the value when the given index is past its last character
 * that the mask does not hold as a fixed character.
 */
export function maskedIndex(value: string, compiled: MaskExpression, unmaskedIdx: number): number;

/**
 * Returns the state that results from inserting the given text at the selection of the
 * given state, with the text placed in the unmasked value so that the fixed characters
 * of the mask flow around it.
 *
 * Returns `null` when the mask rejected all of the given text, so that the caller can
 * signal the rejection instead of presenting an unchanged value.
 */
export function insertText(prevState: MaskState, data: string, compiled: MaskExpression): MaskState | null;

/**
 * Returns the state that results from deleting the given range of the given state, with
 * the range mapped into the unmasked value so that the fixed characters of the mask flow
 * around the remaining characters.
 *
 * A range that covers fixed characters only is not deleted as such. With the default
 * `literals: 'hop'` the value stays as it is and only the caret moves over the fixed
 * characters, in the direction of the deletion. With `literals: 'widen'` the range is
 * extended by one character on the far side and that character is deleted instead.
 */
export function deleteRange(
  prevState: MaskState,
  range: number[],
  compiled: MaskExpression,
  options?: MaskDeleteOptions,
): MaskState;

/**
 * Returns the edit that turned the previous state into the next one, as the range of the
 * previous value that was replaced and the text it was replaced with.
 *
 * The range is found with a common prefix scan disambiguated by the caret of the next
 * state, since a common suffix scan picks the wrong character whenever the edited one
 * repeats, such as deleting the middle `0` of `200`. A previously empty value is taken as
 * fully replaced, which is what an autofill looks like.
 */
export function reconstructEdit(prevState: MaskState, nextState: MaskState): MaskEdit;

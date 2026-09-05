/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A compiled mask: one item per character of the masked value, a regular expression
 * for a user slot and a string for a fixed character, together with the set of every
 * character that the mask holds as a fixed character.
 */
export interface NormalizedMask {
  items: Array<RegExp | string>;
  literalChars: Set<string>;
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
 * for a mask that depends on the value.
 */
export type MaskExpression = ((state: MaskState) => NormalizedMask) | NormalizedMask;

/**
 * Options for an edit applied through the mask.
 */
export interface MaskEditOptions {
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
 * Compiles a mask string into the list of items that the other functions work with,
 * one item per character of the masked value: a regular expression for a user slot
 * and a string for a fixed character. The compiled mask also carries the set of every
 * character that the mask holds as a fixed character, for offset independent filtering
 * of a text fragment.
 *
 * The grammar is a subset of the IMask one:
 *
 * - `0` any digit
 * - `a` any letter
 * - `*` any character
 * - `\x` the literal character `x`
 * - every other character is a fixed character
 *
 * Returns `null` when no mask is configured. Also returns `null` when the mask is
 * invalid, in which case a warning is logged and the mask is treated as unset:
 *
 * - the mask is not a non-empty string
 * - the mask ends with a dangling `\`
 * - the mask has no user slot at all
 */
export function compileMask(mask: string | null | undefined): NormalizedMask | null;

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
 * Returns the state that results from inserting the given text at the selection of the
 * given state, with the text placed in the unmasked value so that the fixed characters
 * of the mask flow around it.
 *
 * Returns `null` when the mask rejected all of the given text, so that the caller can
 * signal the rejection instead of presenting an unchanged value.
 */
export function insertText(
  prevState: MaskState,
  data: string,
  compiled: MaskExpression,
  options?: MaskEditOptions,
): MaskState | null;

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
  options?: MaskEditOptions,
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

/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Configuration for as-you-type chunking.
 */
export interface FieldFormat {
  /**
   * The group lengths, e.g. `[4, 4, 4, 4, 2]` for an IBAN.
   */
  blocks: number[];

  /**
   * The single character inserted between groups. Defaults to a space.
   */
  delimiter?: string;

  /**
   * The case applied to the value.
   */
  case?: 'lower' | 'upper';
}

/**
 * A validated format configuration, with the delimiter defaulted when it is not set.
 */
export interface NormalizedFieldFormat {
  blocks: number[];
  delimiter: string;
  case?: 'lower' | 'upper';
}

/**
 * Validates the given format configuration and returns a normalized copy of it,
 * with the delimiter defaulted when it is not set.
 *
 * Returns `null` when no format is configured. Also returns `null` when the
 * configuration is invalid, in which case a warning is logged and the format is
 * treated as unset:
 *
 * - `blocks` is not a non-empty array of positive integers
 * - `delimiter` is set to something other than a single character
 * - `case` is set to something other than `'upper'` or `'lower'`
 */
export function normalizeFormat(format: FieldFormat | null | undefined): NormalizedFieldFormat | null;

/**
 * Groups the unformatted value into the blocks of the given format, joined with
 * its delimiter, and applies its case.
 *
 * Characters beyond the sum of the block lengths are kept, appended after one
 * more delimiter, so that a value longer than the format describes is never
 * truncated. An empty value formats to an empty string.
 */
export function formatChunks(rawValue: string, options: NormalizedFieldFormat): { formatted: string };

/**
 * Returns the unformatted value for the given presented value, by removing every
 * occurrence of the delimiter and applying the case of the given format.
 *
 * The result is idempotent: unformatting an already unformatted value returns it
 * unchanged.
 */
export function unformat(viewValue: string, options: NormalizedFieldFormat): string;

/**
 * Returns the index in the unformatted value that corresponds to the given index
 * in the presented value, that is the number of non-delimiter characters that
 * precede it.
 *
 * Only ever called with a normalized format that callers have already checked to
 * be set, so it does not validate `options`.
 */
export function rawIndexFromViewIndex(viewValue: string, viewIndex: number, options: NormalizedFieldFormat): number;

/**
 * Returns the index in the presented value that corresponds to the given index in
 * the unformatted value, that is the index just after its last counted character.
 *
 * Returns `0` for index `0`, which callers must treat as a valid index rather than
 * as falsy. Returns the length of the presented value when the given index is past
 * its last non-delimiter character, never `undefined` and never `NaN`.
 *
 * Only ever called with a normalized format that callers have already checked to
 * be set, so it does not validate `options`.
 */
export function viewIndexFromRawIndex(formatted: string, rawIndex: number, options: NormalizedFieldFormat): number;

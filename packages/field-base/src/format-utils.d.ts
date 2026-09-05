/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A validated format configuration, with the delimiter defaulted when it is not set.
 */
export interface NormalizedFieldFormat {
  blocks: number[];
  delimiter: string;
  textCase?: 'lower' | 'upper';
}

/**
 * Validates the given format properties and returns a normalized copy of them,
 * with the delimiter defaulted when it is not set.
 *
 * Returns `null` when no blocks are configured, in which case the delimiter and
 * the case have no effect. Each property is validated on its own, so that one
 * invalid value does not take the others down with it. An invalid value is
 * reported with a warning and falls back as follows:
 *
 * - `blocks` is not a non-empty array of positive integers — the format is unset
 * - `delimiter` is not a single character — a space is used instead
 * - `textCase` is neither `'upper'` nor `'lower'` — no case is applied
 */
export function normalizeFormat(
  blocks: number[] | null | undefined,
  delimiter: string | null | undefined,
  textCase: string | null | undefined,
): NormalizedFieldFormat | null;

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

/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { issueWarning } from '@vaadin/component-base/src/warnings.js';

const DEFAULT_DELIMITER = ' ';

/**
 * Returns the text with the given case applied, or unchanged when no case is set.
 *
 * @param {string} text
 * @param {string | undefined} textCase
 * @return {string}
 */
function applyCase(text, textCase) {
  if (textCase === 'upper') {
    return text.toUpperCase();
  }

  if (textCase === 'lower') {
    return text.toLowerCase();
  }

  return text;
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
 *
 * @param {FieldFormat | null | undefined} format
 * @return {NormalizedFieldFormat | null}
 */
export function normalizeFormat(format) {
  if (format === undefined || format === null) {
    return null;
  }

  const { blocks, delimiter, case: textCase } = format;

  if (!Array.isArray(blocks) || blocks.length === 0 || !blocks.every((block) => Number.isInteger(block) && block > 0)) {
    issueWarning('Invalid "format": "blocks" must be a non-empty array of positive integers. Ignoring the format.');
    return null;
  }

  if (delimiter !== undefined && (typeof delimiter !== 'string' || delimiter.length !== 1)) {
    issueWarning('Invalid "format": "delimiter" must be a single character. Ignoring the format.');
    return null;
  }

  if (textCase !== undefined && textCase !== 'upper' && textCase !== 'lower') {
    issueWarning('Invalid "format": "case" must be either "upper" or "lower". Ignoring the format.');
    return null;
  }

  const normalized = {
    blocks: [...blocks],
    delimiter: delimiter === undefined ? DEFAULT_DELIMITER : delimiter,
  };

  if (textCase !== undefined) {
    normalized.case = textCase;
  }

  return normalized;
}

/**
 * Groups the unformatted value into the blocks of the given format, joined with
 * its delimiter, and applies its case.
 *
 * Characters beyond the sum of the block lengths are kept, appended after one
 * more delimiter, so that a value longer than the format describes is never
 * truncated. An empty value formats to an empty string.
 *
 * @param {string} rawValue the unformatted value
 * @param {NormalizedFieldFormat} options
 * @return {{ formatted: string }}
 */
export function formatChunks(rawValue, options) {
  const value = applyCase(rawValue, options.case);

  if (!value) {
    return { formatted: '' };
  }

  const chunks = [];
  let index = 0;

  for (const block of options.blocks) {
    if (index >= value.length) {
      break;
    }

    chunks.push(value.slice(index, index + block));
    index += block;
  }

  if (index < value.length) {
    chunks.push(value.slice(index));
  }

  return { formatted: chunks.join(options.delimiter) };
}

/**
 * Returns the unformatted value for the given presented value, by removing every
 * occurrence of the delimiter and applying the case of the given format.
 *
 * The result is idempotent: unformatting an already unformatted value returns it
 * unchanged.
 *
 * @param {string} viewValue the value as presented in the input element
 * @param {NormalizedFieldFormat} options
 * @return {string}
 */
export function unformat(viewValue, options) {
  return applyCase(viewValue.split(options.delimiter).join(''), options.case);
}

/**
 * Returns the index in the unformatted value that corresponds to the given index
 * in the presented value, that is the number of non-delimiter characters that
 * precede it.
 *
 * Only ever called with a normalized format that callers have already checked to
 * be set, so it does not validate `options`.
 *
 * @param {string} viewValue the value as presented in the input element
 * @param {number} viewIndex
 * @param {NormalizedFieldFormat} options
 * @return {number}
 */
export function rawIndexFromViewIndex(viewValue, viewIndex, options) {
  const end = Math.min(viewIndex, viewValue.length);
  let rawIndex = 0;

  for (let i = 0; i < end; i++) {
    if (viewValue[i] !== options.delimiter) {
      rawIndex += 1;
    }
  }

  return rawIndex;
}

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
 *
 * @param {string} formatted the value as presented in the input element
 * @param {number} rawIndex
 * @param {NormalizedFieldFormat} options
 * @return {number}
 */
export function viewIndexFromRawIndex(formatted, rawIndex, options) {
  if (rawIndex <= 0) {
    return 0;
  }

  let count = 0;

  for (let i = 0; i < formatted.length; i++) {
    if (formatted[i] !== options.delimiter) {
      count += 1;

      if (count === rawIndex) {
        return i + 1;
      }
    }
  }

  return formatted.length;
}

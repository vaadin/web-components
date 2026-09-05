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
 *
 * @param {number[] | null | undefined} blocks
 * @param {string | null | undefined} delimiter
 * @param {string | null | undefined} textCase
 * @return {NormalizedFieldFormat | null}
 */
export function normalizeFormat(blocks, delimiter, textCase) {
  if (blocks === undefined || blocks === null) {
    return null;
  }

  if (!Array.isArray(blocks) || blocks.length === 0 || !blocks.every((block) => Number.isInteger(block) && block > 0)) {
    issueWarning('Invalid "formatBlocks": must be a non-empty array of positive integers. Ignoring the format.');
    return null;
  }

  const normalized = {
    blocks: [...blocks],
    delimiter: DEFAULT_DELIMITER,
  };

  if (delimiter !== undefined && delimiter !== null) {
    if (typeof delimiter === 'string' && delimiter.length === 1) {
      normalized.delimiter = delimiter;
    } else {
      issueWarning('Invalid "formatDelimiter": must be a single character. Using a space instead.');
    }
  }

  if (textCase !== undefined && textCase !== null) {
    if (textCase === 'upper' || textCase === 'lower') {
      normalized.textCase = textCase;
    } else {
      issueWarning('Invalid "formatTextCase": must be either "upper" or "lower". Ignoring the case.');
    }
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
  const value = applyCase(rawValue, options.textCase);

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
  return applyCase(viewValue.split(options.delimiter).join(''), options.textCase);
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

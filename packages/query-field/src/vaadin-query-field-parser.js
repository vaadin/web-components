/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const FILTER_NAME_REGEX = /^[A-Za-z][\w-]*(?=:)/u;
const WHITESPACE_REGEX = /\s/u;

/**
 * Returns the index of the first whitespace character at or after `from`,
 * or the length of the text when there is none.
 */
function findWhitespace(text, from) {
  let index = from;
  while (index < text.length && !WHITESPACE_REGEX.test(text[index])) {
    index += 1;
  }
  return index;
}

/**
 * Splits the given query text into segments. Each segment has a `type`
 * (`'space'`, `'text'` or `'filter'`), its `start` / `end` offsets and the
 * `raw` text it covers. Filter segments additionally have a `name`, an
 * unquoted `value`, the `valueStart` offset, and `quoted` / `closed` flags.
 *
 * Concatenating the `raw` text of all segments yields the original text.
 *
 * @param {string} text
 * @return {Array<Object>}
 */
export function parseQuery(text) {
  const segments = [];
  let index = 0;

  while (index < text.length) {
    const start = index;

    if (WHITESPACE_REGEX.test(text[index])) {
      while (index < text.length && WHITESPACE_REGEX.test(text[index])) {
        index += 1;
      }
      segments.push({ type: 'space', start, end: index, raw: text.slice(start, index) });
      continue;
    }

    const nameMatch = FILTER_NAME_REGEX.exec(text.slice(index));
    if (nameMatch) {
      const name = nameMatch[0];
      const valueStart = start + name.length + 1;
      let value, end, quoted, closed;

      if (text[valueStart] === '"') {
        const closingQuote = text.indexOf('"', valueStart + 1);
        quoted = true;
        closed = closingQuote !== -1;
        end = closed ? closingQuote + 1 : text.length;
        value = text.slice(valueStart + 1, closed ? closingQuote : text.length);
      } else {
        quoted = false;
        closed = true;
        end = findWhitespace(text, valueStart);
        value = text.slice(valueStart, end);
      }

      segments.push({
        type: 'filter',
        start,
        end,
        raw: text.slice(start, end),
        name,
        value,
        valueStart,
        quoted,
        closed,
      });
      index = end;
      continue;
    }

    index = findWhitespace(text, index);
    segments.push({ type: 'text', start, end: index, raw: text.slice(start, index) });
  }

  return segments;
}

/**
 * Returns the given filter value in the form it should be typed into the
 * query, i.e. wrapped in double quotes if it is empty or contains whitespace.
 * Double quotes inside the value are not supported and are removed.
 *
 * @param {string} value
 * @return {string}
 */
export function formatFilterValue(value) {
  const sanitized = String(value).replaceAll('"', '');
  return sanitized === '' || WHITESPACE_REGEX.test(sanitized) ? `"${sanitized}"` : sanitized;
}

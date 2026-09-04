/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

// Deliberately more permissive than the HTML "valid floating-point number"
// grammar: a leading `+`, a leading `.`, and a trailing `.` are unambiguous,
// so rejecting them would be hostile.
const NUMBER_REGEX = /^[+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?$/u;

/**
 * Parses the given text as a number and returns its canonical decimal
 * string form, or `null` when the text is not a parsable number.
 *
 * The result is a string, never a `Number`, so that notation and
 * precision beyond IEEE-754 double survive as typed, e.g. `1e3` or
 * `1.00000000000000000001`.
 *
 * @param {string} text
 * @return {string | null}
 */
export function parseNumber(text) {
  const value = text ? String(text).trim() : '';
  return NUMBER_REGEX.test(value) ? value : null;
}

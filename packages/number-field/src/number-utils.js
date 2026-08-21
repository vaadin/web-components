/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

// Deliberately more permissive than the HTML "valid floating-point number"
// grammar: a leading `+`, a leading `.`, and a trailing `.` are unambiguous,
// so rejecting them would be hostile.
const NUMBER_REGEX = /^[+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?$/u;

// Whitespace variants that number formatters actually emit as group
// separators: regular space, no-break space (ru-RU), narrow no-break
// space (fr-FR). When a locale groups with any whitespace, users type
// a regular space for it, so all variants are accepted interchangeably.
const GROUP_WHITESPACE_CLASS = ` \\u00A0\\u202F`;
const GROUP_WHITESPACE_REGEX = new RegExp(`[${GROUP_WHITESPACE_CLASS}]`, `gu`);

function escapeCharClass(char) {
  return /[\\\]^-]/u.test(char) ? `\\${char}` : char;
}

/**
 * Creates the parsing and formatting context for the given locale and
 * `Intl.NumberFormat` options: the formatter used for the presentation
 * value, the locale's symbols, the digit map for non-ASCII numbering
 * systems, and the allowed character pattern derived from the symbols.
 *
 * @param {string | undefined} locale
 * @param {Intl.NumberFormatOptions | undefined} formatOptions
 */
export function createNumberContext(locale, formatOptions) {
  const formatter = new Intl.NumberFormat(locale || undefined, formatOptions || {});

  // Symbols come from a separate plain formatter so that format options
  // such as `useGrouping: false` do not hide the group separator that
  // the user may still legitimately type.
  const symbols = { decimal: '.', group: '', minusSign: '-' };
  new Intl.NumberFormat(locale || undefined, { minimumFractionDigits: 1, useGrouping: true })
    .formatToParts(-12345678.9)
    .forEach((part) => {
      if (part.type === 'decimal' || part.type === 'group' || part.type === 'minusSign') {
        symbols[part.type === 'minusSign' ? 'minusSign' : part.type] = part.value;
      }
    });

  // Maps locale digits back to ASCII. Identity for `latn`, in which case
  // the replacement step is skipped entirely.
  const digitFormatter = new Intl.NumberFormat(locale || undefined, { useGrouping: false });
  let digitMap = null;
  if (digitFormatter.format(0) !== '0') {
    digitMap = new Map();
    for (let digit = 0; digit <= 9; digit++) {
      digitMap.set(digitFormatter.format(digit), String(digit));
    }
  }

  const groupIsWhitespace = !!symbols.group && /^\s$/u.test(symbols.group);
  const patternChars = ['\\d', '+\\-', 'eE', '−', escapeCharClass(symbols.decimal)];
  if (symbols.group) {
    patternChars.push(groupIsWhitespace ? GROUP_WHITESPACE_CLASS : escapeCharClass(symbols.group));
  }
  if (symbols.minusSign !== '-' && symbols.minusSign !== '−') {
    patternChars.push(escapeCharClass(symbols.minusSign));
  }
  if (digitMap) {
    patternChars.push(...[...digitMap.keys()].map(escapeCharClass));
  }

  return {
    formatter,
    symbols,
    digitMap,
    groupIsWhitespace,
    allowedCharPattern: `[${patternChars.join('')}]`,
  };
}

/**
 * Parses the given text as a number and returns its canonical decimal
 * string form, or `null` when the text is not a parsable number.
 *
 * With a context, the text is interpreted in that locale: group
 * separators are removed (leniently — grouping positions are not
 * validated, except that a group separator after the decimal separator
 * is rejected), the locale decimal separator maps to `.`, locale digits
 * map to ASCII, and minus sign variants map to `-`.
 *
 * The result is a string, never a `Number`, so that notation and
 * precision beyond IEEE-754 double survive as typed, e.g. `1e3` or
 * `1.00000000000000000001`.
 *
 * @param {string} text
 * @param {ReturnType<typeof createNumberContext>} [context]
 * @return {string | null}
 */
export function parseNumber(text, context) {
  let value = text ? String(text).trim() : '';

  if (context && value) {
    const { symbols, digitMap, groupIsWhitespace } = context;

    if (symbols.group) {
      const groupRegExp = groupIsWhitespace
        ? GROUP_WHITESPACE_REGEX
        : new RegExp(`[${escapeCharClass(symbols.group)}]`, 'gu');
      // A group separator after the decimal separator cannot be grouping,
      // e.g. "1,234.5" typed into a field whose decimal separator is ","
      const decimalIndex = value.indexOf(symbols.decimal);
      groupRegExp.lastIndex = 0;
      const groupMatches = [...value.matchAll(groupRegExp)];
      if (decimalIndex !== -1 && groupMatches.some((match) => match.index > decimalIndex)) {
        return null;
      }
      value = value.replace(groupRegExp, '');
    }

    if (symbols.decimal !== '.') {
      value = value.split(symbols.decimal).join('.');
    }

    value = value.replace(/−/gu, '-');
    if (symbols.minusSign !== '-') {
      value = value.split(symbols.minusSign).join('-');
    }

    if (digitMap) {
      value = value.replace(/./gu, (char) => digitMap.get(char) || char);
    }
  }

  return NUMBER_REGEX.test(value) ? value : null;
}

/**
 * Formats the given canonical decimal string for showing in the input
 * element. The value is passed to `Intl.NumberFormat` as a string
 * (Intl.NumberFormat V3), which preserves precision beyond IEEE-754.
 *
 * @param {string} value
 * @param {ReturnType<typeof createNumberContext>} [context]
 * @return {string}
 */
export function formatNumber(value, context) {
  if (!value) {
    return '';
  }
  if (!context) {
    return String(value);
  }
  return context.formatter.format(String(value));
}

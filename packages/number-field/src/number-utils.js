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
// formatToParts types that carry the number itself; everything else
// (currency, unit, percentSign, literal, compact) is an affix.
const NUMERIC_PART_TYPES = new Set([
  'integer',
  'group',
  'decimal',
  'fraction',
  'minusSign',
  'plusSign',
  'exponentSeparator',
  'exponentMinusSign',
  'exponentInteger',
]);

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

  // Affixes the formatter adds around the number (currency symbol, unit,
  // surrounding literals), which the parser strips before reading digits.
  // Percent and compact notation are excluded from the affix list on
  // purpose: their affixes change the magnitude, so stripping them would
  // corrupt the value, and the mixin rejects those options instead.
  const affixes = [
    ...new Set(
      formatter
        .formatToParts(-12345678.9)
        .filter((part) => !NUMERIC_PART_TYPES.has(part.type))
        .map((part) => part.value)
        .filter((affix) => affix.trim() !== ''),
    ),
  ];

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
  // Characters shared by integer and decimal input: digits, signs, group
  // separator, and the affix characters so formatted text can be typed back.
  const integerChars = ['\\d', '+\\-', '−'];
  if (symbols.group) {
    integerChars.push(groupIsWhitespace ? GROUP_WHITESPACE_CLASS : escapeCharClass(symbols.group));
  }
  if (symbols.minusSign !== '-' && symbols.minusSign !== '−') {
    integerChars.push(escapeCharClass(symbols.minusSign));
  }
  if (digitMap) {
    integerChars.push(...[...digitMap.keys()].map(escapeCharClass));
  }
  affixes.forEach((affix) => {
    integerChars.push(...[...affix].map(escapeCharClass), GROUP_WHITESPACE_CLASS);
  });

  return {
    formatter,
    symbols,
    digitMap,
    groupIsWhitespace,
    affixes,
    allowedCharPattern: `[${[...integerChars, 'eE', escapeCharClass(symbols.decimal)].join('')}]`,
    integerAllowedCharPattern: `[${integerChars.join('')}]`,
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
    const { symbols, digitMap, groupIsWhitespace, affixes } = context;

    affixes.forEach((affix) => {
      value = value.split(affix).join('');
    });
    value = value.trim();

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

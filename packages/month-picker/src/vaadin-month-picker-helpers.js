/**
 * @license
 * Copyright (c) 2025 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @typedef YearMonth
 * @type {object}
 * @property {number} year - The year
 * @property {number} month - The month
 */

/**
 * Formats year and month object to string.
 * @param {YearMonth} yearObject
 * @return {string}
 */
export function yearMonthToValue(yearMonthObject) {
  const { year, month } = yearMonthObject;
  return `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}`;
}

/**
 * Parses string to the year and month object.
 * @param {string} yearString
 * @return {YearMonth}
 */
export function valueToYearMonth(yearString) {
  if (yearString && yearString.length) {
    const parts = yearString.split('-');
    return {
      year: parseInt(parts[0], 10),
      month: parseInt(parts[1], 10),
    };
  }
  return null;
}

/**
 * Extracts the century from the given 4-digit year.
 * The century will be "20", when "2025" is passed.
 * @param {number} year 4-digit year
 * @return {number}
 */
export function toRefCentury(year) {
  return Math.trunc(year / 100);
}

/**
 * Applies the reference century onto the given 2-digit year.
 * @param {number} year 2-digit year
 * @param {number} century century (e.g. "20")
 * @return {number}
 */
export function applyRefCentury(year, century) {
  return year + century * 100;
}

/**
 * Checks if the given string is within given ranges.
 * @param {string} value The value to check
 * @param {string} min The minimum constraint
 * @param {string} nax The maximum constraint
 * @return {boolean}
 */
export function isInvalid(value, min, max) {
  return (min != null && min.length > 0 && value < min) || (max != null && max.length > 0 && value > max);
}

/**
 * Checks if the given string should be disabled.
 * @param {number} year The value to check
 * @param {string} minYear The minimum constraint
 * @param {string} maxYear The maximum constraint
 * @return {boolean}
 */
export function isYearDisabled(year, minYear, maxYear) {
  return (
    (minYear != null && minYear.length > 0 && year < valueToYearMonth(minYear).year) ||
    (maxYear != null && maxYear.length > 0 && year > valueToYearMonth(maxYear).year)
  );
}

/**
 * Checks if the given month is allowed for selection.
 * @param {string} value The value to check
 * @param {string} minYear The minimum constraint
 * @param {string} maxYear The maximum constraint
 * @return {boolean}
 */
export function monthAllowed(value, minYear, maxYear) {
  const invalid = isInvalid(value, minYear, maxYear);
  const yearMonth = valueToYearMonth(value);
  const year = yearMonth ? yearMonth.year : null;
  const disabled = isYearDisabled(year, minYear, maxYear);
  return !invalid && !disabled;
}

/**
 * Formats a given YearMonth object into a string based on the defined format.
 * Uses the first format in the `i18n.formats` array as the display format.
 * @param {YearMonth} yearMonthObject
 * @param {object} i18n
 * @return {string}
 */
export function formatValue(yearMonthObject, i18n) {
  const { year, month } = yearMonthObject;

  const format = i18n.formats[0]; // Use the first format to display

  let result;

  if (format.includes('MMMM')) {
    result = format.replace(/MMMM/u, i18n.monthNames[month - 1].padStart(2, '0'));
  } else if (!format.includes('MMMM') && format.includes('MMM')) {
    result = format.replace(/MMM/u, i18n.monthNamesShort[month - 1].padStart(2, '0'));
  } else {
    result = format.replace(/MM/u, String(month).padStart(2, '0')).replace(/M/u, String(month)); // Match month (1 or 2 digits)
  }

  return result
    .replace(/YYYY/u, String(year))
    .replace(/YY/u, String(year - parseInt(year / 100) * 100).padStart(2, '0'));
}

/**
 * Parses a given string into a YearMonth object based on the available formats.
 * Accepts multiple formats from `i18n.formats` and normalizes different separators.
 * @param {string} inputValue
 * @param {object} i18n
 * @return {YearMonth}
 */
export function parseValue(inputValue, i18n) {
  const { formats } = i18n;

  // Iterate over each format
  for (const format of formats) {
    // Handle no separator (i.e., continuous format like MMYYYY)
    const separator = format.includes('.')
      ? '.'
      : format.includes('/')
        ? '/'
        : format.includes('-')
          ? '-'
          : format.includes(' ')
            ? ' '
            : ''; // Handle common separators and space

    const formatUsesLongMonthName = format.includes('MMMM');
    const formatUsesShortMonthName = !formatUsesLongMonthName && format.includes('MMM');

    // Adjust the regex based on the presence of the separator
    let regex;

    // we have to explicitly separate the patterns, otherwise replacing /M/ could lead to issues
    // in month names, like "March".
    if (formatUsesLongMonthName) {
      regex = format.replace(/MMMM/u, `(${i18n.monthNames.join('|')})`);
    } else if (formatUsesShortMonthName) {
      regex = format.replace(/MMM/u, `(${i18n.monthNamesShort.join('|')})`);
    } else {
      regex = format.replace(/MM/u, '(\\d{1,2})').replace(/M/u, '(\\d{1})'); // Match month (1 or 2 digits)
    }

    // applying year pattern
    regex = regex.replace(/YYYY/u, '(\\d{4})').replace(/YY/u, '(\\d{2})');

    if (separator) {
      // Escape the separator for regex if present
      regex = regex.replace(new RegExp(`\\${separator}`, 'gu'), `\\${separator}`);
    }

    // Check if the input matches the format with the correct separator (if any)
    const match = inputValue.match(new RegExp(`^${regex}$`, 'iu'));

    if (match) {
      // Get month and year indexes based on format
      const monthIndex = format.indexOf('M') < format.indexOf('YY') ? 1 : 2;
      const yearIndex = monthIndex === 1 ? 2 : 1;

      let month;

      if (formatUsesLongMonthName) {
        month = i18n.monthNames.map((s) => s.toLowerCase()).indexOf(match[monthIndex].toLowerCase()) + 1;
      } else if (formatUsesShortMonthName) {
        month = i18n.monthNamesShort.map((s) => s.toLowerCase()).indexOf(match[monthIndex].toLowerCase()) + 1;
      } else {
        month = parseInt(match[monthIndex], 10);
      }

      const year = parseInt(match[yearIndex], 10);
      // Validate that the parsed month is within the valid range (1-12)
      if (month >= 1 && month <= 12) {
        return { month, year };
      }
    }
  }

  return null;
}

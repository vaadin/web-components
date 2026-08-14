/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Create a date at midnight in local time. Unlike `new Date(year, month, day)`,
 * this supports years below 100, which the constructor maps into the 20th
 * century. The month is assigned before the day so that the initial day of month
 * (1) always exists in the target month.
 *
 * @param {number} year
 * @param {number} month Zero-based month, may be out of range to shift the year
 * @param {number} day May be `0` to select the last day of the previous month
 * @return {Date}
 */
export function createDate(year, month, day) {
  const date = new Date(0, 0); // Wrong date (1900-01-01), but with midnight in local time
  date.setFullYear(year);
  date.setMonth(month);
  date.setDate(day);
  return date;
}

/**
 * Get the first day of the month the given date is in.
 *
 * @param {!Date} date
 * @return {Date}
 */
export function firstOfMonth(date) {
  return createDate(date.getFullYear(), date.getMonth(), 1);
}

/**
 * Get the last day of the month the given date is in.
 *
 * @param {!Date} date
 * @return {Date}
 */
export function lastOfMonth(date) {
  return createDate(date.getFullYear(), date.getMonth() + 1, 0);
}

/**
 * Get the index of a month, counted from January of year 0. Reduces a month to a single
 * integer, so a lookup builds no key and two months are adjacent when their indexes are.
 *
 * @param {number} year
 * @param {number} month Zero-based month
 * @return {number}
 */
export function monthIndexOf(year, month) {
  return year * 12 + month;
}

/**
 * Get the index of the month the given date is in.
 *
 * @param {!Date} date
 * @return {number}
 */
export function monthIndex(date) {
  return monthIndexOf(date.getFullYear(), date.getMonth());
}

/**
 * Get the first day of the month with the given index, inverting `monthIndexOf`. Counting from
 * January of year 0 also inverts negative indexes, since `createDate` normalizes a month outside
 * 0-11 into the year.
 *
 * @param {number} index
 * @return {Date}
 */
export function monthDate(index) {
  return createDate(0, index, 1);
}

/**
 * Get ISO 8601 week number for the given date.
 *
 * @param {!Date} date
 * @return {number} Week number
 */
export function getISOWeekNumber(date) {
  // Ported from Vaadin Framework method com.vaadin.client.DateTimeService.getISOWeekNumber(date)
  let dayOfWeek = date.getDay(); // 0 == sunday

  // ISO 8601 use weeks that start on monday so we use
  // mon=1,tue=2,...sun=7;
  if (dayOfWeek === 0) {
    dayOfWeek = 7;
  }
  // Find nearest thursday (defines the week in ISO 8601). The week number
  // for the nearest thursday is the same as for the target date.
  const nearestThursdayDiff = 4 - dayOfWeek; // 4 is thursday
  const nearestThursday = new Date(date.getTime() + nearestThursdayDiff * 24 * 3600 * 1000);

  const firstOfJanuary = new Date(0, 0);
  firstOfJanuary.setFullYear(nearestThursday.getFullYear());

  const timeDiff = nearestThursday.getTime() - firstOfJanuary.getTime();

  // Rounding the result, as the division doesn't result in an integer
  // when the given date is inside daylight saving time period.
  const daysSinceFirstOfJanuary = Math.round(timeDiff / (24 * 3600 * 1000));

  return Math.floor(daysSinceFirstOfJanuary / 7 + 1);
}

/**
 * Creates a new object with the same date, but sets the hours, minutes, seconds and milliseconds to 0.
 *
 * @param {Date} date in system timezone
 * @return {Date} The same date with time elements set to 0, in UTC timezone.
 */
export function normalizeDate(date) {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  return normalizedDate;
}

/**
 * Creates a new object with the same date, but sets the hours, minutes, seconds and milliseconds to 0.
 *
 * Uses UTC date components to allow handling date instances independently of
 * the system time-zone.
 *
 * @param {Date} date in UTC timezone
 * @return {Date} The same date with time elements set to 0, in UTC timezone.
 */
export function normalizeUTCDate(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0));
}

/**
 * Check if two dates are equal.
 *
 * @param {Date} date1
 * @param {Date} date2
 * @param {function(Date): Date} normalizer
 * @return {boolean} True if the given date objects refer to the same date
 */
export function dateEquals(date1, date2, normalizer = normalizeDate) {
  return date1 instanceof Date && date2 instanceof Date && normalizer(date1).getTime() === normalizer(date2).getTime();
}

/**
 * Extracts the basic component parts of a date (day, month and year)
 * to the expected format.
 * @param {!Date} date
 * @return {{day: number, month: number, year: number}}
 */
export function extractDateParts(date) {
  return {
    day: date.getDate(),
    month: date.getMonth(),
    year: date.getFullYear(),
  };
}

/**
 * Check if the given date is in the range of allowed dates.
 *
 * @param {!Date} date The date to check
 * @param {Date} min Range start
 * @param {Date} max Range end
 * @param {function(!DatePickerDate): boolean} isDateDisabled Callback to check if the date is disabled
 * @return {boolean} True if the date is in the range
 */
export function dateAllowed(date, min, max, isDateDisabled) {
  let dateIsDisabled = false;
  if (typeof isDateDisabled === 'function' && !!date) {
    const dateToCheck = extractDateParts(date);
    dateIsDisabled = isDateDisabled(dateToCheck);
  }

  return (!min || date >= min) && (!max || date <= max) && !dateIsDisabled;
}

/**
 * Check if the given date can be selected: allowed by `dateAllowed` and not reported as disabled
 * by the date metadata controller. This is narrower than `dateAllowed`, which decides what can be
 * focused: a disabled date is still focusable, it just cannot be selected.
 *
 * @param {!Date} date The date to check
 * @param {Date | null} min Range start
 * @param {Date | null} max Range end
 * @param {function(!DatePickerDate): boolean} isDateDisabled Callback to check if the date is disabled
 * @param {DateMetadataController | null} [controller] The date metadata controller
 * @return {boolean} True if the date can be selected
 */
export function dateSelectable(date, min, max, isDateDisabled, controller) {
  return dateAllowed(date, min, max, isDateDisabled) && !controller?.isDateDisabled(date);
}

/**
 * Get closest date from array of dates.
 *
 * @param {!Date} date The date to compare dates with
 * @param {!Array<!Date>} dates Array of date objects
 * @return {!Date} Closest date
 */
export function getClosestDate(date, dates) {
  return dates
    .filter((date) => date !== undefined)
    .reduce((closestDate, candidate) => {
      if (!candidate) {
        return closestDate;
      }

      if (!closestDate) {
        return candidate;
      }

      const candidateDiff = Math.abs(date.getTime() - candidate.getTime());
      const closestDateDiff = Math.abs(closestDate.getTime() - date.getTime());
      return candidateDiff < closestDateDiff ? candidate : closestDate;
    });
}

/**
 * Get difference in months between today and given months value.
 *
 * @param {number} months
 * @return {number}
 */
export function dateAfterXMonths(months) {
  const today = new Date();
  const result = new Date(today);
  result.setDate(1);
  result.setMonth(parseInt(months) + today.getMonth());
  return result;
}

/**
 * Calculate the year of the date based on the provided reference date.
 * Gets a two-digit year and returns a full year.
 * @param {!Date} referenceDate The date to act as basis in the calculation
 * @param {!number} year Should be in the range of [0, 99]
 * @param {number} month
 * @param {number} day
 * @return {!number} Adjusted year value
 */
export function getAdjustedYear(referenceDate, year, month = 0, day = 1) {
  if (year > 99) {
    throw new Error('The provided year cannot have more than 2 digits.');
  }
  if (year < 0) {
    throw new Error('The provided year cannot be negative.');
  }
  // Year values up to 2 digits are parsed based on the reference date.
  let adjustedYear = year + Math.floor(referenceDate.getFullYear() / 100) * 100;
  if (referenceDate < new Date(adjustedYear - 50, month, day)) {
    adjustedYear -= 100;
  } else if (referenceDate > new Date(adjustedYear + 50, month, day)) {
    adjustedYear += 100;
  }
  return adjustedYear;
}

const ISO_DATE = /^([-+]\d{1,6}|\d{2,4})-(\d{1,2})-(\d{1,2})$/u;

// The parts of a date string in a format the parsers accept, as written.
function parseParts(str) {
  // Parsing with RegExp to ensure correct format
  const parts = ISO_DATE.exec(str);
  if (!parts) {
    return undefined;
  }

  return { year: parseInt(parts[1], 10), month: parseInt(parts[2], 10) - 1, day: parseInt(parts[3], 10) };
}

/**
 * Parse date string of one of the following date formats:
 * - ISO 8601 `"YYYY-MM-DD"`
 * - Extended ISO 8601 with a signed year, e.g. `"+012026-MM-DD"` or `"-0001-MM-DD"`
 *
 * A date that does not exist, such as `"2026-02-30"`, is not parsed. Building it would carry the
 * surplus into the next month or year and answer with a date that was never asked for.
 *
 * @param {!string} str Date string to parse
 * @return {Date} Parsed date in system timezone
 */
export function parseDate(str) {
  const parts = parseParts(str);
  if (!parts) {
    return undefined;
  }

  const date = createDate(parts.year, parts.month, parts.day);

  return date.getMonth() === parts.month && date.getDate() === parts.day ? date : undefined;
}

/**
 * Parse date string of one of the following date formats:
 * - ISO 8601 `"YYYY-MM-DD"`
 * - Extended ISO 8601 with a signed year, e.g. `"+012026-MM-DD"` or `"-0001-MM-DD"`
 *
 * Uses UTC date components to allow handling date instances independently of
 * the system time-zone.
 *
 * A date that does not exist, such as `"2026-02-30"`, is not parsed, as in `parseDate`.
 *
 * @param {!string} str Date string to parse
 * @return {Date} Parsed date in UTC timezone
 */
export function parseUTCDate(str) {
  const parts = parseParts(str);
  if (!parts) {
    return undefined;
  }

  const date = new Date(Date.UTC(0, 0)); // Wrong date (1900-01-01), but with midnight in UTC
  date.setUTCFullYear(parts.year);
  date.setUTCMonth(parts.month);
  date.setUTCDate(parts.day);

  return date.getUTCMonth() === parts.month && date.getUTCDate() === parts.day ? date : undefined;
}

function formatISODateBase(dateParts) {
  const pad = (num, fmt = '00') => (fmt + num).substr((fmt + num).length - fmt.length);

  let yearSign = '';
  let yearFmt = '0000';
  let yearAbs = dateParts.year;
  if (yearAbs < 0) {
    yearAbs = -yearAbs;
    yearSign = '-';
    yearFmt = '000000';
  } else if (dateParts.year >= 10000) {
    yearSign = '+';
    yearFmt = '000000';
  }

  const year = yearSign + pad(yearAbs, yearFmt);
  const month = pad(dateParts.month + 1);
  const day = pad(dateParts.day);
  return [year, month, day].join('-');
}

/**
 * Format a date instance in ISO 8601 (`"YYYY-MM-DD"`) or 6-digit extended ISO
 * 8601 (`"+YYYYYY-MM-DD"`, `"-YYYYYY-MM-DD"`) format.
 * @param {Date} date in system timezone
 * @returns {string}
 */
export function formatISODate(date) {
  if (!(date instanceof Date)) {
    return '';
  }

  return formatISODateBase({
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
  });
}

/**
 * Format a date instance in ISO 8601 (`"YYYY-MM-DD"`) or 6-digit extended ISO
 * 8601 (`"+YYYYYY-MM-DD"`, `"-YYYYYY-MM-DD"`) format.
 *
 * Uses UTC date components to allow handling date instances independently of
 * the system time-zone.
 *
 * @param {Date} date in UTC timezone
 * @returns {string}
 */
export function formatUTCISODate(date) {
  if (!(date instanceof Date)) {
    return '';
  }

  return formatISODateBase({
    year: date.getUTCFullYear(),
    month: date.getUTCMonth(),
    day: date.getUTCDate(),
  });
}

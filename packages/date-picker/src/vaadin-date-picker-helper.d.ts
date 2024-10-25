import type { DatePickerDate } from './vaadin-date-picker-mixin.js';

/**
 * Get ISO 8601 week number for the given date.
 *
 * @returns Week number
 */
declare function getISOWeekNumber(Date: Date): number;

/**
 * Check if two dates are equal.
 *
 * @returns True if the given date objects refer to the same date
 */
declare function dateEquals(date1: Date | null, date2: Date | null): boolean;

/**
 * Check if the given date is in the range of allowed dates.
 *
 * @returns True if the date is in the range
 */
declare function dateAllowed(
  date: Date,
  min: Date | null,
  max: Date | null,
  isDateDisabled: (date: DatePickerDate) => boolean | null,
): boolean;

/**
 * Get closest date from array of dates.
 *
 * @returns Closest date
 */
declare function getClosestDate(date: Date, dates: Date[]): Date;

/**
 * Extracts the basic component parts of a date (day, month and year)
 * to the expected format.
 */
declare function extractDateParts(date: Date): { day: number; month: number; year: number };

/**
 * Get difference in months between today and given months value.
 */
declare function dateAfterXMonths(months: number): number;

/**
 * Calculate the year of the date based on the provided reference date
 * Gets a two-digit year and returns a full year.
 */
declare function getAdjustedYear(referenceDate: Date, year: number, month?: number, day?: number): Date;

/**
 * Parse date string of one of the following date formats:
 * - ISO 8601 `"YYYY-MM-DD"`
 * - 6-digit extended ISO 8601 `"+YYYYYY-MM-DD"`, `"-YYYYYY-MM-DD"`
 */
declare function parseDate(str: string): Date;

export {
  getISOWeekNumber,
  dateEquals,
  dateAllowed,
  getClosestDate,
  extractDateParts,
  dateAfterXMonths,
  getAdjustedYear,
  parseDate,
};

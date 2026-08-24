/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { DateMetadataController } from './vaadin-date-metadata-controller.js';
import type { DatePickerDate } from './vaadin-date-picker-mixin.js';

/**
 * Create a date at midnight in local time. Unlike `new Date(year, month, day)`,
 * this supports years below 100, which the constructor maps into the 20th
 * century. The month is assigned before the day so that the initial day of month
 * (1) always exists in the target month.
 *
 * @param month Zero-based month, may be out of range to shift the year
 * @param day May be `0` to select the last day of the previous month
 */
declare function createDate(year: number, month: number, day: number): Date;

/**
 * Get the first day of the month the given date is in.
 */
declare function firstOfMonth(date: Date): Date;

/**
 * Get the last day of the month the given date is in.
 */
declare function lastOfMonth(date: Date): Date;

/**
 * Get the index of a month, counted from January of year 0. Reduces a month to a single
 * integer, so a lookup builds no key and two months are adjacent when their indexes are.
 *
 * @param month Zero-based month
 */
declare function monthIndexOf(year: number, month: number): number;

/**
 * Get the index of the month the given date is in.
 */
declare function monthIndex(date: Date): number;

/**
 * Get the first day of the month with the given index, inverting `monthIndexOf`. Counting from
 * January of year 0 also inverts negative indexes, since `createDate` normalizes a month outside
 * 0-11 into the year.
 */
declare function monthDate(index: number): Date;

/**
 * Get ISO 8601 week number for the given date.
 *
 * @returns Week number
 */
declare function getISOWeekNumber(Date: Date): number;

/**
 * Creates a new object with the same date, but sets the hours, minutes, seconds and milliseconds to 0.
 *
 * @param date in system timezone
 * @returns The same date with time elements set to 0, in system timezone.
 */
declare function normalizeDate(date: Date): Date;

/**
 * Creates a new object with the same date, but sets the hours, minutes, seconds and milliseconds to 0.
 *
 * Uses UTC date components to allow handling date instances independently of
 * the system time-zone.
 *
 * @param date in UTC timezone
 * @returns The same date with time elements set to 0, in UTC timezone.
 */
declare function normalizeUTCDate(date: Date): Date;

/**
 * Check if two dates are equal.
 *
 * @returns True if the given date objects refer to the same date
 */
declare function dateEquals(date1: Date | null, date2: Date | null): boolean;

/**
 * Extracts the basic component parts of a date (day, month and year)
 * to the expected format.
 */
declare function extractDateParts(date: Date): { day: number; month: number; year: number };

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
 * Check if the given date can be selected: allowed by `dateAllowed` and not reported as disabled
 * by the date metadata controller. This is narrower than `dateAllowed`, which decides what can be
 * focused: a disabled date is still focusable, it just cannot be selected.
 *
 * @returns True if the date can be selected
 */
declare function dateSelectable(
  date: Date,
  min: Date | null,
  max: Date | null,
  isDateDisabled: (date: DatePickerDate) => boolean | null,
  controller?: DateMetadataController | null,
): boolean;

/**
 * Get closest date from array of dates.
 *
 * @returns Closest date
 */
declare function getClosestDate(date: Date, dates: Date[]): Date;

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

/**
 * Parse date string of one of the following date formats:
 * - ISO 8601 `"YYYY-MM-DD"`
 * - 6-digit extended ISO 8601 `"+YYYYYY-MM-DD"`, `"-YYYYYY-MM-DD"`
 *
 * Uses UTC date components to allow handling date instances independently of
 * the system time-zone.
 */
declare function parseUTCDate(str: string): Date;

/**
 * Format a date instance in ISO 8601 (`"YYYY-MM-DD"`) or 6-digit extended ISO
 * 8601 (`"+YYYYYY-MM-DD"`, `"-YYYYYY-MM-DD"`) format.
 *
 * @param date in system timezone
 */
declare function formatISODate(date: Date): string;

/**
 * Format a date instance in ISO 8601 (`"YYYY-MM-DD"`) or 6-digit extended ISO
 * 8601 (`"+YYYYYY-MM-DD"`, `"-YYYYYY-MM-DD"`) format.
 *
 * Uses UTC date components to allow handling date instances independently of
 * the system time-zone.
 *
 * @param date in UTC timezone
 */
declare function formatUTCISODate(date: Date): string;

export {
  createDate,
  firstOfMonth,
  lastOfMonth,
  monthIndexOf,
  monthIndex,
  monthDate,
  getISOWeekNumber,
  normalizeDate,
  normalizeUTCDate,
  dateEquals,
  extractDateParts,
  dateAllowed,
  dateSelectable,
  getClosestDate,
  dateAfterXMonths,
  getAdjustedYear,
  parseDate,
  parseUTCDate,
  formatISODate,
  formatUTCISODate,
};

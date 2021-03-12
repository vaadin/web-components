export { getISOWeekNumber };

/**
 * Get ISO 8601 week number for the given date.
 *
 * @returns Week number
 */
declare function getISOWeekNumber(Date: Date): number;

export { dateEquals };

/**
 * Check if two dates are equal.
 *
 * @returns True if the given date objects refer to the same date
 */
declare function dateEquals(date1: Date | null, date2: Date | null): boolean;

export { dateAllowed };

/**
 * Check if the given date is in the range of allowed dates.
 *
 * @returns True if the date is in the range
 */
declare function dateAllowed(date: Date, min: Date | null, max: Date | null): boolean;

export { getClosestDate };

/**
 * Get closest date from array of dates.
 *
 * @returns Closest date
 */
declare function getClosestDate(date: Date, dates: Date[]): Date;

export { extractDateParts };

/**
 * Extracts the basic component parts of a date (day, month and year)
 * to the expected format.
 */
declare function extractDateParts(date: Date): { day: number; month: number; year: number };

/**
 * @license
 * Copyright (c) 2018 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

export interface TimePickerTime {
  hours: number | string;
  minutes: number | string;
  seconds?: number | string;
  milliseconds?: number | string;
}

/**
 * A function to format given `Object` as time string.
 * Object is in the format `{ hours: ..., minutes: ..., seconds: ..., milliseconds: ... }`
 */
export function formatISOTime(time: TimePickerTime | undefined): string;

/**
 * A function to parse the given string to an `Object` in the format
 * `{ hours: ..., minutes: ..., seconds: ..., milliseconds: ... }`.
 */
export function parseISOTime(timeString: string): TimePickerTime | undefined;

export type TimePickerResolution = 'minutes' | 'seconds' | 'milliseconds';

/**
 * Returns the finest time unit needed to represent the given step:
 * `'minutes'`, `'seconds'` or `'milliseconds'`. A step that is not set,
 * zero, or not a number, defaults to minutes.
 */
export function getStepResolution(stepValue: number | string | null | undefined): TimePickerResolution;

/**
 * Returns a copy of the time object truncated to the given resolution, with
 * every remaining part converted to a number. An unknown resolution truncates
 * to minutes.
 *
 * Returns a new object, so that a time object owned by the caller, such as one
 * returned by the `i18n.parseTime` function, is left as it is.
 */
export function truncateTime(
  timeObject: TimePickerTime | undefined,
  resolution: TimePickerResolution,
): TimePickerTime | undefined;

/**
 * Returns a copy of the time object truncated to the resolution defined by
 * the given step, see `getStepResolution` and `truncateTime`.
 */
export function validateTime(
  timeObject: TimePickerTime | undefined,
  step: number | null | undefined,
): TimePickerTime | undefined;

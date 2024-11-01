/**
 * @license
 * Copyright (c) 2018 - 2024 Vaadin Ltd.
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

/**
 * A function to validate the time object based on the given step.
 */
export function validateTime(
  timeObject: TimePickerTime | undefined,
  step: number | null | undefined,
): TimePickerTime | undefined;

/**
 * @license
 * Copyright (c) 2018 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A function to format given `Object` as time string.
 * Object is in the format `{ hours: ..., minutes: ..., seconds: ..., milliseconds: ... }`
 * @param {object} time
 * @return {string}
 */
export function formatISOTime(time) {
  if (!time) {
    return '';
  }

  const pad = (num = 0, fmt = '00') => (fmt + num).substr((fmt + num).length - fmt.length);
  // Always display hour and minute
  let timeString = `${pad(time.hours)}:${pad(time.minutes)}`;
  // Adding second and millisecond depends on resolution
  if (time.seconds !== undefined) {
    timeString += `:${pad(time.seconds)}`;
  }
  if (time.milliseconds !== undefined) {
    timeString += `.${pad(time.milliseconds, '000')}`;
  }
  return timeString;
}

const MATCH_HOURS = '(\\d|[0-1]\\d|2[0-3])';
const MATCH_MINUTES = '(\\d|[0-5]\\d)';
const MATCH_SECONDS = MATCH_MINUTES;
const MATCH_MILLISECONDS = '(\\d{1,3})';
const re = new RegExp(`^${MATCH_HOURS}(?::${MATCH_MINUTES}(?::${MATCH_SECONDS}(?:\\.${MATCH_MILLISECONDS})?)?)?$`, 'u');

/**
 * A function to parse the given string to an `Object` in the format
 * `{ hours: ..., minutes: ..., seconds: ..., milliseconds: ... }`.
 *
 * @param {string} timeString
 * @return {object | undefined}
 */
export function parseISOTime(timeString) {
  // Parsing with RegExp to ensure correct format
  const parts = re.exec(timeString);
  if (parts) {
    // Allows setting the milliseconds with hundreds and tens precision
    if (parts[4]) {
      while (parts[4].length < 3) {
        parts[4] += '0';
      }
    }
    return { hours: parts[1], minutes: parts[2], seconds: parts[3], milliseconds: parts[4] };
  }
}

/**
 * Returns the finest time unit needed to represent the given step:
 * `'minutes'`, `'seconds'` or `'milliseconds'`. A step that is not set,
 * zero, or not a number, defaults to minutes.
 *
 * @param {number | string | null | undefined} stepValue
 * @return {'minutes' | 'seconds' | 'milliseconds'}
 */
export function getStepResolution(stepValue) {
  const step = stepValue == null ? 60 : parseFloat(stepValue);
  if (!step || step % 60 === 0) {
    return 'minutes';
  }
  if (step % 1 === 0) {
    return 'seconds';
  }
  return 'milliseconds';
}

/**
 * Returns a copy of the time object truncated to the given resolution, with
 * every remaining part converted to a number. An unknown resolution truncates
 * to minutes.
 *
 * Returns a new object, so that a time object owned by the caller, such as one
 * returned by the `i18n.parseTime` function, is left as it is.
 *
 * @param {object} timeObject
 * @param {'minutes' | 'seconds' | 'milliseconds'} resolution
 * @return {object | undefined}
 */
export function truncateTime(timeObject, resolution) {
  if (!timeObject) {
    return timeObject;
  }

  const includeMilliseconds = resolution === 'milliseconds';
  const includeSeconds = includeMilliseconds || resolution === 'seconds';

  return {
    ...timeObject,
    hours: parseInt(timeObject.hours),
    minutes: parseInt(timeObject.minutes || 0),
    seconds: includeSeconds ? parseInt(timeObject.seconds || 0) : undefined,
    milliseconds: includeMilliseconds ? parseInt(timeObject.milliseconds || 0) : undefined,
  };
}

/**
 * Returns a copy of the time object truncated to the resolution defined by
 * the given step, see `getStepResolution` and `truncateTime`.
 *
 * @param {object} timeObject
 * @param {number | null | undefined} step
 * @return {object | undefined}
 */
export function validateTime(timeObject, step) {
  return truncateTime(timeObject, getStepResolution(step));
}

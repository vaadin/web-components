/**
 * @license
 * Copyright (c) 2018 - 2024 Vaadin Ltd.
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

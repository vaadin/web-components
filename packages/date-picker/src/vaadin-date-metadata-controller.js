/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { extractDateParts } from './vaadin-date-picker-helper.js';

/**
 * Number of months fetched before and after the requested range, so that
 * scrolling a few months in either direction does not trigger a new request.
 * Mirrors how the grid prefetches rows around the viewport.
 */
const PREFETCH_MONTHS = 6;

function monthKey(date) {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

function dateKey(date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function firstOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function lastOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function addMonths(date, months) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

/**
 * A reactive controller that resolves the metadata (disabled state, custom part
 * names, ...) for the dates shown by the date-picker's `dateMetadataProvider`.
 * It calls the provider once for a range of months (never one date at a time),
 * caches the resolved months so scrolling back and forth does not re-fetch them,
 * and prefetches a buffer of months around the requested range. While any
 * request is in flight, {@link #loading} is `true` so the overlay can show a
 * spinner.
 *
 * The provider may return an array synchronously or a `Promise`, so results
 * from a server (Flow) or a remote availability service can be awaited. Each
 * returned entry is a `DatePickerDate` extended with metadata fields, e.g.
 * `{ year, month, day, disabled: true, part: 'busy' }`.
 */
export class DateMetadataController {
  constructor(host, onChange) {
    this.host = host;
    this.__onChange = onChange;
    this.provider = null;
    this.__metadata = new Map();
    this.__loadedMonths = new Set();
    this.__pendingMonths = new Set();
    this.__requestId = 0;
  }

  hostDisconnected() {
    // Invalidate in-flight requests so their late results don't touch a
    // detached host, and drop the pending (loading) state. The resolved cache
    // is kept so reopening the overlay does not re-fetch.
    this.__requestId += 1;
    this.__pendingMonths = new Set();
  }

  /**
   * Whether any month range is currently being fetched.
   * @return {boolean}
   */
  get loading() {
    return this.__pendingMonths.size > 0;
  }

  /**
   * Sets the provider function and clears the cache. Passing the same provider
   * again is a no-op, so the cache survives unrelated re-renders — callers
   * should therefore keep a stable provider reference rather than passing a new
   * function on every update, which would otherwise reset the cache and
   * re-fetch every visible range.
   */
  setProvider(provider) {
    if (this.provider === provider) {
      return;
    }
    this.provider = provider;
    this.reset();
  }

  /** Clears the cache and invalidates any in-flight requests. */
  reset() {
    this.__metadata = new Map();
    this.__loadedMonths = new Set();
    this.__pendingMonths = new Set();
    this.__requestId += 1;
    this.__notify();
  }

  /**
   * Whether the month containing the given date has been fully resolved.
   * @param {Date} date
   * @return {boolean}
   */
  isMonthLoaded(date) {
    return this.__loadedMonths.has(monthKey(date));
  }

  /**
   * The metadata resolved for the given date, or `undefined` when the date has
   * no metadata or its month has not been resolved yet.
   * @param {Date} date
   * @return {object | undefined}
   */
  getMetadata(date) {
    return date ? this.__metadata.get(dateKey(date)) : undefined;
  }

  /**
   * Whether the given date is disabled by the provider. Only returns `true` for
   * dates in an already-resolved month.
   * @param {Date} date
   * @return {boolean}
   */
  isDateDisabled(date) {
    return !!this.getMetadata(date)?.disabled;
  }

  /**
   * Whether the given date cannot be selected yet: it is disabled by the
   * provider, or its month has not been resolved so its state is still unknown.
   * Returns `false` when no provider is set. Used to block selection and to
   * render dates as non-selectable while their month is loading.
   * @param {Date} date
   * @return {boolean}
   */
  isDateBlocked(date) {
    return !!this.provider && !!date && (this.isDateDisabled(date) || !this.isMonthLoaded(date));
  }

  /**
   * Ensures the provider has been consulted for the inclusive range between the
   * given dates, expanded by a prefetch buffer of months on each side. Months
   * that are already loaded or in flight are skipped, and consecutive missing
   * months are grouped into a single provider call.
   *
   * @param {Date} startDate
   * @param {Date} endDate
   */
  ensureRangeLoaded(startDate, endDate) {
    if (!this.provider || !startDate || !endDate) {
      return;
    }

    const first = addMonths(firstOfMonth(startDate), -PREFETCH_MONTHS);
    const last = addMonths(firstOfMonth(endDate), PREFETCH_MONTHS);

    const monthsToLoad = [];
    for (let month = first; month <= last; month = addMonths(month, 1)) {
      const key = monthKey(month);
      if (!this.__loadedMonths.has(key) && !this.__pendingMonths.has(key)) {
        monthsToLoad.push(new Date(month));
      }
    }

    if (monthsToLoad.length === 0) {
      return;
    }

    this.__groupConsecutiveMonths(monthsToLoad).forEach((group) => this.__loadGroup(group));
  }

  /** @private */
  __groupConsecutiveMonths(months) {
    const groups = [];
    months.forEach((month) => {
      const group = groups.at(-1);
      const previous = group?.at(-1);
      if (previous && monthKey(addMonths(previous, 1)) === monthKey(month)) {
        group.push(month);
      } else {
        groups.push([month]);
      }
    });
    return groups;
  }

  /** @private */
  __loadGroup(months) {
    const requestId = this.__requestId;
    months.forEach((month) => this.__pendingMonths.add(monthKey(month)));
    this.__notify();

    const range = {
      start: extractDateParts(firstOfMonth(months[0])),
      end: extractDateParts(lastOfMonth(months[months.length - 1])),
    };

    let result;
    try {
      result = this.provider(range);
    } catch (error) {
      // Treat a throwing provider the same as a rejected promise: clear the
      // pending state and disable nothing, rather than letting the error
      // propagate out of the scroll/render path that triggered the load.
      console.error(error);
      this.__resolveGroup(months, [], requestId);
      return;
    }

    if (result && typeof result.then === 'function') {
      result.then(
        (dates) => this.__resolveGroup(months, dates, requestId),
        (error) => {
          console.error(error);
          this.__resolveGroup(months, [], requestId);
        },
      );
    } else {
      this.__resolveGroup(months, result, requestId);
    }
  }

  /** @private */
  __resolveGroup(months, entries, requestId) {
    // Ignore results from before the last reset (e.g. provider changed).
    if (requestId !== this.__requestId) {
      return;
    }

    if (Array.isArray(entries)) {
      entries.forEach((entry) => {
        if (entry) {
          this.__metadata.set(`${entry.year}-${entry.month}-${entry.day}`, entry);
        }
      });
    }

    months.forEach((month) => {
      const key = monthKey(month);
      this.__pendingMonths.delete(key);
      this.__loadedMonths.add(key);
    });

    this.__notify();
  }

  /** @private */
  __notify() {
    if (this.__onChange) {
      this.__onChange();
    }
  }
}

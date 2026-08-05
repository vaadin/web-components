/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { microTask } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { issueWarning } from '@vaadin/component-base/src/warnings.js';
import {
  createDate,
  extractDateParts,
  lastOfMonth,
  monthDate,
  monthIndex,
  monthIndexOf,
} from './vaadin-date-picker-helper.js';

// Counted from January of year 0, so a block is one calendar year.
const BLOCK_MONTHS = 12;

function blockStart(month) {
  return Math.floor(month / BLOCK_MONTHS) * BLOCK_MONTHS;
}

const PENDING_MONTH = Object.freeze({ pending: true });

function isValidEntry(entry) {
  if (!entry || !Number.isInteger(entry.year) || !Number.isInteger(entry.month) || !Number.isInteger(entry.day)) {
    return false;
  }
  const date = createDate(entry.year, entry.month, entry.day);
  return date.getFullYear() === entry.year && date.getMonth() === entry.month && date.getDate() === entry.day;
}

function groupEntriesByMonth(months, entries) {
  const result = new Map(months.map((month) => [month, new Map()]));

  if (Array.isArray(entries)) {
    entries.forEach((entry) => {
      if (isValidEntry(entry)) {
        result.get(monthIndexOf(entry.year, entry.month))?.set(entry.day, entry);
      } else {
        issueWarning('Ignored `dateMetadataProvider` entries with an invalid year, month (0-11) or day.');
      }
    });
  } else if (entries != null) {
    issueWarning('Expected `dateMetadataProvider` to return an array of date metadata objects.');
  }

  return result;
}

/**
 * A reactive controller that resolves the metadata (currently the disabled state)
 * for the dates shown by the date-picker's `dateMetadataProvider`.
 *
 * The provider is called for a range of months and may return an array
 * synchronously or a `Promise`, so results from a server (Flow) or a remote
 * availability service can be awaited. Each returned entry is a `DatePickerDate`
 * extended with metadata fields, e.g. `{ year, month, day, disabled: true }`.
 *
 * `ARCHITECTURE.md` in this package records the reasoning behind the request,
 * caching, notification and failure behavior.
 */
export class DateMetadataController {
  /**
   * The controller host element.
   * @type {import('lit').ReactiveControllerHost & HTMLElement}
   */
  host;

  /**
   * The provider function, or `null` when none is set.
   * @type {Function | null}
   */
  provider = null;

  /** @type {(() => void) | undefined} */
  #onChange;

  /**
   * What is known about each month, keyed by month index: a shared marker while its request is in
   * flight, or a record holding the resolved entries by day. A month is absent until it is loaded,
   * and absent again if its request failed.
   * @type {Map<number, { pending: boolean, entries?: Map<number, object> }>}
   */
  #months = new Map();

  /** @type {Set<import('lit').ReactiveElement>} */
  #subscribers = new Set();

  #requestId = 0;

  /** @type {import('@vaadin/component-base/src/debounce.js').Debouncer} */
  #notifyDebouncer;

  constructor(host, onChange) {
    this.host = host;
    this.#onChange = onChange;
  }

  hostConnected() {
    this.#notify();
  }

  /**
   * Registers an element to be re-rendered whenever the resolved metadata or the
   * loading state changes. The element must render from its bindings, and must not be
   * the one whose own observer triggers a load. It stays registered for the
   * controller's lifetime.
   *
   * @param {import('lit').ReactiveElement} element
   */
  subscribe(element) {
    this.#subscribers.add(element);
  }

  /**
   * Whether any month range is currently being fetched.
   * @return {boolean}
   */
  isLoading() {
    for (const { pending } of this.#months.values()) {
      if (pending) {
        return true;
      }
    }
    return false;
  }

  /**
   * Sets the provider function and clears the cache. Passing the same provider again
   * is a no-op, so callers should keep a stable reference.
   *
   * @param {Function | null | undefined} provider
   */
  setProvider(provider) {
    const next = provider ?? null;
    if (this.provider === next) {
      return;
    }
    this.provider = next;
    this.clearCache();
  }

  /**
   * Clears the cache and invalidates any in-flight requests.
   */
  clearCache() {
    this.#months.clear();
    this.#requestId += 1;
    this.#notify();
  }

  /**
   * Whether the provider has answered for the month containing the given date.
   * A month whose request failed is not loaded and will be requested again.
   * @param {Date | null | undefined} date
   * @return {boolean}
   */
  isMonthLoaded(date) {
    return !!this.#resolvedMonth(date);
  }

  /**
   * Whether the month containing the given date is currently being fetched. A month
   * that has not been asked about is not pending, so this reports the same state as
   * `isLoading()` does for the whole cache.
   * @param {Date | null | undefined} date
   * @return {boolean}
   */
  isMonthPending(date) {
    return !!date && !!this.#months.get(monthIndex(date))?.pending;
  }

  /**
   * The metadata resolved for the given date, or `undefined` when the date has
   * no metadata or its month has not been resolved yet. Returns the entry the
   * provider supplied, which the caller must not modify.
   * @param {Date | null | undefined} date
   * @return {object | undefined}
   */
  getMetadata(date) {
    return this.#resolvedMonth(date)?.entries.get(date.getDate());
  }

  /**
   * Whether the given date is disabled by its metadata.
   * @param {Date | null | undefined} date
   * @return {boolean}
   */
  isDateDisabled(date) {
    return !!this.getMetadata(date)?.disabled;
  }

  /**
   * Ensures the provider has been consulted for the inclusive range between the
   * given dates, rounded out to whole blocks of months. Months already loaded or in
   * flight are skipped, and the ones left over are requested with a single call.
   *
   * Each call that finds a missing month issues its own request, so a caller that
   * loads on scroll should debounce.
   *
   * @param {Date | null | undefined} startDate
   * @param {Date | null | undefined} endDate
   */
  ensureRangeLoaded(startDate, endDate) {
    if (!this.provider || !startDate || !endDate) {
      return;
    }

    const first = blockStart(monthIndex(startDate));
    const last = blockStart(monthIndex(endDate)) + BLOCK_MONTHS - 1;

    const months = [];
    for (let month = first; month <= last; month++) {
      if (!this.#months.has(month)) {
        months.push(month);
      }
    }

    if (months.length > 0) {
      this.#loadMonths(months);
    }
  }

  #resolvedMonth(date) {
    const month = date && this.#months.get(monthIndex(date));
    return month && !month.pending ? month : undefined;
  }

  async #loadMonths(months) {
    const requestId = this.#requestId;
    months.forEach((month) => this.#months.set(month, PENDING_MONTH));
    this.#notify();

    const range = {
      start: extractDateParts(monthDate(months[0])),
      end: extractDateParts(lastOfMonth(monthDate(months.at(-1)))),
    };

    let entries;
    try {
      const data = await this.provider(range);
      entries = groupEntriesByMonth(months, data);
    } catch (error) {
      console.error(error);
    }

    if (requestId !== this.#requestId) {
      return;
    }

    months.forEach((month) => {
      if (entries) {
        this.#months.set(month, { pending: false, entries: entries.get(month) });
      } else {
        this.#months.delete(month);
      }
    });

    this.#notify();
  }

  #notify() {
    this.#subscribers.forEach((element) => element.requestUpdate());

    if (this.#onChange) {
      this.#notifyDebouncer = Debouncer.debounce(this.#notifyDebouncer, microTask, () => {
        if (this.host.isConnected) {
          this.#onChange();
        }
      });
    }
  }
}

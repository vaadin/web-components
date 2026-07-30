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

// Months are fetched in fixed blocks rather than in a buffer centred on what was asked for. A
// buffer moves with the request, so it never gets ahead of the user: stepping forward one month
// leaves one new month missing at the far edge, and that is one more request. Rounding out to a
// block instead means stepping around inside it asks for nothing.
//
// Counted from January of year 0, a block is exactly one calendar year, which also means every
// caller asks for the same ranges, so a server can cache the answers. Ranges centred on wherever
// the user happens to be looking are all slightly different and cannot be.
const BLOCK_MONTHS = 12;

// `Math.floor`, not `Math.trunc`, so a month before year 0 rounds down to the start of its block
// rather than towards zero, which would land in the block after it.
function blockStart(month) {
  return Math.floor(month / BLOCK_MONTHS) * BLOCK_MONTHS;
}

// Shared, because a pending month has no entries to hold: `#resolvedMonth` only answers for a
// month that has resolved.
const PENDING_MONTH = Object.freeze({ pending: true });

// Entries are keyed by the month and day they name, so anything that is not a real date would
// silently produce a key that no lookup can ever match. Rebuilding the date and comparing it back
// catches a month outside 0-11, a day outside its month, and February 30 alike.
function isValidEntry(entry) {
  if (!entry || !Number.isInteger(entry.year) || !Number.isInteger(entry.month) || !Number.isInteger(entry.day)) {
    return false;
  }
  const date = createDate(entry.year, entry.month, entry.day);
  return date.getFullYear() === entry.year && date.getMonth() === entry.month && date.getDate() === entry.day;
}

// One fresh bucket per month being loaded, so a month's own answer replaces its entries, and an
// entry for any other month is dropped, including one the range covered but did not load.
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
 * A month is either resolved or not resolved at all, and only a month's own answer
 * decides its dates. A date in a month that has not resolved yet is not disabled.
 *
 * See `ARCHITECTURE.md` for the reasoning behind the caching, notification and
 * failure behavior.
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
    // Changes that resolved while the host was detached were not reported to it,
    // so re-report the current state now that it can act on it again.
    this.#notify();
  }

  /**
   * Registers an element to be re-rendered whenever the resolved metadata or the
   * loading state changes.
   *
   * The element must render from its bindings: it is invalidated with
   * `requestUpdate()`, which leaves the changed properties empty, so `PolylitMixin`
   * does not re-run observers. State applied imperatively from an observer has to be
   * refreshed from the host callback instead.
   *
   * The element must also not be the one whose own observer triggers a load, or it
   * invalidates itself mid-update.
   *
   * There is no `unsubscribe`: a subscriber is retained for the controller's lifetime.
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
   * Sets the provider function and clears the cache. Compared by reference, so a
   * missing provider is normalized to `null` and passing the same provider again is
   * a no-op. Callers should keep a stable provider reference.
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
   * Whether the given date is disabled by its metadata. Only returns `true` for
   * dates in an already-resolved month, and does not consider `min`, `max` or the
   * date-picker's `isDateDisabled` property.
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
   * A range inside one block costs nothing once that block is loaded, so moving
   * around within it does not re-request. Each call that does find a missing month
   * issues its own request, so a caller that loads on scroll should still debounce.
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

    // Ignore an answer from before the last `clearCache()`, e.g. because the provider changed.
    if (requestId !== this.#requestId) {
      return;
    }

    months.forEach((month) => {
      if (entries) {
        this.#months.set(month, { pending: false, entries: entries.get(month) });
      } else {
        // Left absent rather than recorded as empty, so the next range request asks again.
        this.#months.delete(month);
      }
    });

    this.#notify();
  }

  #notify() {
    // Subscribers re-render from their bindings, so invalidate them synchronously.
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

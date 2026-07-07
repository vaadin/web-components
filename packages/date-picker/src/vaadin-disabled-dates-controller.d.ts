/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { ReactiveController, ReactiveControllerHost } from 'lit';
import type { DatePickerDate, DatePickerDateRange } from './vaadin-date-picker-mixin.js';

export type DisabledDatesProvider = (range: DatePickerDateRange) => DatePickerDate[] | Promise<DatePickerDate[]>;

/**
 * A reactive controller that resolves the dates disabled by the date-picker's
 * `disabledDatesProvider`. It calls the provider once for a range of months,
 * caches the resolved months so scrolling back and forth does not re-fetch,
 * and prefetches a buffer of months around the requested range.
 */
export declare class DisabledDatesController implements ReactiveController {
  constructor(host: ReactiveControllerHost, onChange: () => void);

  /**
   * The provider function, or `null` when none is set.
   */
  provider: DisabledDatesProvider | null;

  /**
   * Whether any month range is currently being fetched.
   */
  readonly loading: boolean;

  /**
   * The set of disabled date keys (`year-month-day`, month 0-based). The same
   * set instance is shared and grows as months resolve.
   */
  readonly disabledDates: Set<string>;

  hostConnected(): void;

  hostDisconnected(): void;

  /**
   * Sets the provider function and clears the cache. Passing the same provider
   * again is a no-op. Callers should keep a stable provider reference.
   */
  setProvider(provider: DisabledDatesProvider | null | undefined): void;

  /**
   * Clears the cache and invalidates any in-flight requests.
   */
  reset(): void;

  /**
   * Whether the month containing the given date has been fully resolved.
   */
  isMonthLoaded(date: Date): boolean;

  /**
   * Whether the given date is disabled by the provider. Only returns `true` for
   * dates in an already-resolved month.
   */
  isDateDisabled(date: Date): boolean;

  /**
   * Ensures the provider has been consulted for the inclusive range between the
   * given dates, expanded by a prefetch buffer of months on each side.
   */
  ensureRangeLoaded(startDate: Date, endDate: Date): void;
}

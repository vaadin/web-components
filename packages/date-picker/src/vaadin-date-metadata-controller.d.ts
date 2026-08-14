/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { ReactiveController, ReactiveControllerHost, ReactiveElement } from 'lit';
import type { DatePickerDateMetadata, DatePickerDateMetadataProvider } from './vaadin-date-picker-mixin.js';

/**
 * A reactive controller that resolves the metadata (currently the disabled state)
 * for the dates shown by the date-picker's `dateMetadataProvider`.
 *
 * The provider is called for a range of months and may return an array
 * synchronously or a `Promise`, so results from a server (Flow) or a remote
 * availability service can be awaited. The range and each returned entry identify
 * a date by an ISO 8601 string, e.g. `{ date: '2026-01-01', disabled: true }`.
 *
 * `ARCHITECTURE.md` in this package records the reasoning behind the request,
 * caching, notification and failure behavior.
 */
export class DateMetadataController implements ReactiveController {
  /**
   * The controller host element.
   */
  host: HTMLElement & ReactiveControllerHost;

  /**
   * The provider function, or `null` when none is set.
   */
  provider: DatePickerDateMetadataProvider | null;

  constructor(host: HTMLElement & ReactiveControllerHost, onChange?: () => void);

  hostConnected(): void;

  /**
   * Registers an element to be re-rendered whenever the resolved metadata or the
   * loading state changes. The element must render from its bindings, and must not be
   * the one whose own observer triggers a load. It stays registered for the
   * controller's lifetime.
   */
  subscribe(element: ReactiveElement): void;

  /**
   * Whether any month range is currently being fetched.
   */
  isLoading(): boolean;

  /**
   * Sets the provider function and clears the cache. Passing the same provider again
   * is a no-op, so callers should keep a stable reference.
   */
  setProvider(provider: DatePickerDateMetadataProvider | null | undefined): void;

  /**
   * Clears the cache and invalidates any in-flight requests.
   */
  clearCache(): void;

  /**
   * Whether the provider has answered for the month containing the given date.
   * A month whose request failed is not loaded and will be requested again.
   */
  isMonthLoaded(date: Date | null | undefined): boolean;

  /**
   * Whether the month containing the given date is currently being fetched. A month
   * that has not been asked about is not pending, so this reports the same state as
   * `isLoading()` does for the whole cache.
   */
  isMonthPending(date: Date | null | undefined): boolean;

  /**
   * The metadata resolved for the given date, or `undefined` when the date has
   * no metadata or its month has not been resolved yet. Returns the entry the
   * provider supplied, which the caller must not modify.
   */
  getMetadata(date: Date | null | undefined): DatePickerDateMetadata | undefined;

  /**
   * Whether the given date is disabled by its metadata.
   */
  isDateDisabled(date: Date | null | undefined): boolean;

  /**
   * Ensures the provider has been consulted for the inclusive range between the
   * given dates, rounded out to whole blocks of months. Months already loaded or in
   * flight are skipped, and the ones left over are requested with a single call.
   *
   * Each call that finds a missing month issues its own request, so a caller that
   * loads on scroll should debounce.
   */
  ensureRangeLoaded(startDate: Date | null | undefined, endDate: Date | null | undefined): void;
}

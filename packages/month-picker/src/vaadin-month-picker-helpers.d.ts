/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
export interface YearMonth {
  year: number;
  month: number;
}

export function yearMonthToValue(yearMonth: YearMonth): string;

export function valueToYearMonth(value: string): YearMonth | null;

export function formatValue(yearMonth: YearMonth, i18n: { formats: string[] }): string;

export function parseValue(text: string, i18n: { formats: string[] }): YearMonth | null;

export function monthAllowed(value: string, min: string | undefined, max: string | undefined): boolean;

export function isInvalid(value: string, minYear: string | null, maxYear: string | null): boolean;

export function isYearDisabled(year: number, minYear: string | null, maxYear: string | null): boolean;

export function toRefCentury(year: number): number;

export function applyRefCentury(year: number, referenceCentury: number): number;

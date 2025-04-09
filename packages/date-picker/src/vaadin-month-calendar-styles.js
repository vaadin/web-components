/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const monthCalendarStyles = css`
  :host {
    display: block;
    padding: var(--vaadin-date-picker-month-padding, 0.5rem);
  }

  [part='month-header'] {
    color: var(--vaadin-date-picker-month-header-color, var(--_vaadin-color-strong));
    font-size: var(--vaadin-date-picker-month-header-font-size, 0.9375rem);
    font-weight: var(--vaadin-date-picker-month-header-font-weight, 500);
    line-height: inherit;
    margin-bottom: 0.75rem;
    text-align: center;
  }

  table {
    border-collapse: collapse;
  }

  tr {
    display: flex;
  }

  [part~='weekday'] {
    color: var(--vaadin-date-picker-weekday-color, inherit);
    font-size: var(--vaadin-date-picker-weekday-font-size, 0.75rem);
    font-weight: var(--vaadin-date-picker-weekday-font-weight, 500);
    margin-bottom: 0.375rem;
    width: var(--vaadin-date-picker-date-width, 2rem);
  }

  /* Placeholder for week numbers, hence the width change */
  [part~='weekday']:empty {
    width: var(--vaadin-date-picker-week-number-width, 1.5rem);
  }

  [part~='week-number'] {
    color: var(--vaadin-date-picker-week-number-color, inherit);
    font-size: var(--vaadin-date-picker-week-number-font-size, 0.75rem);
    width: var(--vaadin-date-picker-week-number-width, 1.5rem);
  }

  [part~='weekday'],
  [part~='week-number'],
  [part~='date'] {
    align-items: center;
    display: flex;
    justify-content: center;
    padding: 0;
  }

  [part~='week-number'],
  [part~='date'] {
    height: var(--vaadin-date-picker-date-height, 2rem);
  }

  [part~='date'] {
    border-radius: var(--vaadin-date-picker-date-border-radius, var(--vaadin-radius-m));
    position: relative;
    width: var(--vaadin-date-picker-date-width, 2rem);
  }

  [part~='today'] {
    color: var(--vaadin-date-picker-date-today-color, var(--_vaadin-color-strong));
  }

  [part~='selected'] {
    color: var(--vaadin-date-picker-date-selected-color, var(--_vaadin-background));
  }

  [part~='selected']::after {
    background: var(--vaadin-date-picker-date-selected-background, var(--_vaadin-color-strong));
    border-radius: var(--vaadin-date-picker-date-border-radius, var(--_vaadin-radius-m));
    content: '';
    inset: 0;
    position: absolute;
    z-index: -1;
  }

  [disabled] {
    cursor: not-allowed;
    opacity: 0.5;
    pointer-events: none;
  }

  [hidden] {
    display: none;
  }

  @media (forced-colors: active) {
    [part~='date'][part~='focused'] {
      outline: 1px solid;
    }

    [part~='date'][part~='selected'] {
      outline: 3px solid;
    }
  }
`;

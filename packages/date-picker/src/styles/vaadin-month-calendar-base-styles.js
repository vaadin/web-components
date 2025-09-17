/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const monthCalendarStyles = css`
  :host {
    display: block;
    padding: var(--vaadin-date-picker-month-padding, var(--vaadin-padding-s));
  }

  [part='month-header'] {
    color: var(--vaadin-date-picker-month-header-color, var(--vaadin-text-color));
    font-size: var(--vaadin-date-picker-month-header-font-size, 0.9375rem);
    font-weight: var(--vaadin-date-picker-month-header-font-weight, 500);
    line-height: inherit;
    margin-bottom: 0.75rem;
    text-align: center;
  }

  table {
    border-collapse: collapse;
    display: flex;
    flex-direction: column;
  }

  tr {
    display: flex;
    flex-wrap: wrap;
  }

  [part~='weekday'] {
    color: var(--vaadin-date-picker-weekday-color, var(--vaadin-text-color-secondary));
    font-size: var(--vaadin-date-picker-weekday-font-size, 0.75rem);
    font-weight: var(--vaadin-date-picker-weekday-font-weight, 500);
    margin-bottom: 0.375rem;
    width: var(--vaadin-date-picker-date-width, 2rem);
  }

  /* Week numbers are on a separate row, don't reserve space on weekday row. */
  [part~='weekday']:empty {
    display: none;
  }

  [part~='week-number'] {
    color: var(--vaadin-date-picker-week-number-color, var(--vaadin-text-color-secondary));
    font-size: var(--vaadin-date-picker-week-number-font-size, 0.7rem);
    line-height: 1;
    width: 100%;
    margin-top: 0.125em;
    margin-bottom: 0.125em;
    gap: 0.25em;
  }

  [part~='week-number']::after {
    content: '';
    height: 1px;
    flex: 1;
    background: var(
      --vaadin-date-picker-week-divider-color,
      var(--vaadin-divider-color, var(--vaadin-border-color-secondary))
    );
  }

  [part~='weekday'],
  [part~='week-number'],
  [part~='date'] {
    align-items: center;
    display: flex;
    justify-content: center;
    padding: 0;
  }

  [part~='date'] {
    border-radius: var(--vaadin-date-picker-date-border-radius, var(--vaadin-radius-m));
    position: relative;
    width: var(--vaadin-date-picker-date-width, 2rem);
    height: var(--vaadin-date-picker-date-height, 2rem);
    cursor: var(--vaadin-clickable-cursor);
    outline: none;
  }

  [part~='date']::after {
    border-radius: inherit;
    content: '';
    position: absolute;
    z-index: -1;
    height: inherit;
    aspect-ratio: 1;
  }

  :where([part~='date']:focus)::after {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: calc(var(--vaadin-focus-ring-width) * -1);
  }

  [part~='today'] {
    color: var(--vaadin-date-picker-date-today-color, var(--vaadin-text-color));
  }

  [part~='selected'] {
    color: var(--vaadin-date-picker-date-selected-color, var(--vaadin-background-color));
  }

  [part~='selected']::after {
    background: var(--vaadin-date-picker-date-selected-background, var(--vaadin-text-color));
    outline-offset: 1px;
  }

  [disabled] {
    cursor: var(--vaadin-disabled-cursor);
    color: var(--vaadin-date-picker-date-disabled-color, var(--vaadin-text-color-disabled));
    opacity: 0.7;
  }

  [hidden] {
    display: none;
  }

  @media (forced-colors: active) {
    [part~='week-number']::after {
      background: CanvasText;
    }

    [part~='today'] {
      font-weight: 600;
    }

    [part~='selected'] {
      forced-color-adjust: none;
      --vaadin-date-picker-date-selected-color: SelectedItemText;
      color: SelectedItemText !important;
      --vaadin-date-picker-date-selected-background: SelectedItem;
    }

    [disabled] {
      color: GrayText !important;
    }
  }
`;

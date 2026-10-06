/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const monthCalendarStyles = css`
  :host {
    display: block;
    padding: var(--vaadin-date-picker-month-padding, var(--vaadin-padding-s));
    -webkit-tap-highlight-color: transparent;
    -webkit-user-select: none;
    user-select: none;
  }

  [part='month-header'] {
    color: var(--vaadin-date-picker-month-header-color, var(--vaadin-text-color));
    font-size: var(--vaadin-date-picker-month-header-font-size, 0.9375rem);
    font-weight: var(--vaadin-date-picker-month-header-font-weight, 500);
    line-height: 1;
    margin-bottom: 0.75rem;
    text-align: center;
  }

  table {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
  }

  thead,
  tbody,
  tr {
    display: contents;
  }

  [part~='weekday'] {
    color: var(--vaadin-date-picker-weekday-color, var(--vaadin-text-color-secondary));
    font-size: var(--vaadin-date-picker-weekday-font-size, 0.75rem);
    font-weight: var(--vaadin-date-picker-weekday-font-weight, 500);
    margin-bottom: 0.375rem;
  }

  /* Week numbers are on a separate row, don't reserve space on weekday row. */
  [part~='weekday']:empty {
    display: none;
  }

  [part~='week-number'] {
    grid-column: -1 / 1;
    color: var(--vaadin-date-picker-week-number-color, var(--vaadin-text-color-secondary));
    font-size: var(--vaadin-date-picker-week-number-font-size, 0.7rem);
    line-height: 1;
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
    height: var(--vaadin-date-picker-date-height, 2rem);
    cursor: var(--vaadin-clickable-cursor);
    outline: none;
  }

  [part~='date']:empty {
    pointer-events: none !important;
  }

  [part~='date']::after {
    border-radius: inherit;
    content: '';
    position: absolute;
    z-index: -1;
    height: min(2em, 100%);
    aspect-ratio: 1;
  }

  :where([part~='date']:focus-visible)::after {
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

  /* Range band, drawn behind the date indicators */
  [part~='in-range'] {
    --_range-band: var(
      --vaadin-date-picker-date-in-range-background,
      color-mix(in srgb, var(--vaadin-date-picker-date-selected-background, var(--vaadin-text-color)) 12%, transparent)
    );
    --_range-edge: var(
      --vaadin-date-picker-date-in-range-border-color,
      var(--vaadin-date-picker-date-selected-background, var(--vaadin-text-color))
    );
    /* Optional edges along the band, off by default */
    --_range-edge-width: var(--vaadin-date-picker-date-in-range-border-width, 0px);
    /* Full height, so that the weeks of a range join into one calm area */
    --_range-band-height: 100%;
    isolation: isolate;
    border-radius: 0;
    background: linear-gradient(
        var(--_range-edge) var(--_range-edge-width),
        var(--_range-band) var(--_range-edge-width) calc(100% - var(--_range-edge-width)),
        var(--_range-edge) calc(100% - var(--_range-edge-width))
      )
      center / 100% var(--_range-band-height) no-repeat;
  }

  /* Round the band where it wraps to the next week, or where the month starts or ends */
  [part~='in-range']:is(:nth-child(2), td:empty + *) {
    border-start-start-radius: var(--vaadin-date-picker-date-border-radius, var(--vaadin-radius-m));
    border-end-start-radius: var(--vaadin-date-picker-date-border-radius, var(--vaadin-radius-m));
  }

  [part~='in-range']:is(:last-child, :has(+ td:empty)) {
    border-start-end-radius: var(--vaadin-date-picker-date-border-radius, var(--vaadin-radius-m));
    border-end-end-radius: var(--vaadin-date-picker-date-border-radius, var(--vaadin-radius-m));
  }

  [part~='in-range'][part~='range-start'] {
    background-position: right center;
    background-size: 50% var(--_range-band-height);
  }

  [part~='in-range'][part~='range-end'] {
    background-position: left center;
    background-size: 50% var(--_range-band-height);
  }

  /* Keep the band continuous across disabled dates, only their text is dimmed */
  [part~='in-range'][disabled] {
    opacity: 1;
  }

  [part~='in-range']::after {
    border-radius: var(--vaadin-date-picker-date-border-radius, var(--vaadin-radius-m));
  }

  /* The ends of a range can be dragged to move them */
  [part~='in-range'][part~='range-start'],
  [part~='in-range'][part~='range-end'] {
    cursor: grab;
  }

  /*
   * The end of the range being edited gets a lighter fill than the other end. An
   * outline would look like the focus indicator.
   */
  [part~='range-editing'] {
    color: var(--vaadin-date-picker-date-range-editing-color, var(--vaadin-text-color));
  }

  [part~='range-editing']::after {
    background: var(
      --vaadin-date-picker-date-range-editing-background,
      color-mix(in srgb, var(--_range-edge) 35%, var(--vaadin-background-color))
    );
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

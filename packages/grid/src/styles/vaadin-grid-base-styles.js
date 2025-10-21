/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const gridStyles = css`
  :host {
    display: flex;
    max-width: 100%;
    height: 400px;
    min-height: var(--_grid-min-height, 0);
    flex: 1 1 auto;
    align-self: stretch;
    position: relative;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    background: var(--vaadin-grid-background, var(--vaadin-background-color));
    border: var(--_border-width) solid var(--_border-color);
    cursor: default;
    --_border-color: var(--vaadin-grid-border-color, var(--vaadin-border-color-secondary));
    --_border-width: 0;
    --_row-border-width: var(--vaadin-grid-row-border-width, 4px);
    --_column-border-width: var(--vaadin-grid-column-border-width, 4px);
    border-radius: var(--_border-radius);
    --_border-radius: 0;
  }

  :host([hidden]),
  [hidden] {
    display: none !important;
  }

  :host([disabled]) {
    pointer-events: none;
    opacity: 0.7;
  }

  /* Variant: No outer border */
  :host(:not([theme~='no-border'])) {
    --_border-width: var(--vaadin-grid-border-width, 1px);
    --_border-radius: var(--vaadin-grid-border-radius, var(--vaadin-radius-m));
  }

  :host([all-rows-visible]) {
    height: auto;
    align-self: flex-start;
    min-height: auto;
    flex-grow: 0;
  }

  #scroller {
    /* contain: layout; */
    border-radius: calc(var(--_border-radius) - var(--_border-width));
    position: relative;
    display: flex;
    width: 100%;
    min-width: 0;
    min-height: 0;
    align-self: stretch;
    overflow: hidden;
  }

  #items {
    flex-grow: 1;
    flex-shrink: 0;
    display: block;
    position: sticky;
    width: 100%;
    left: 0;
    min-height: 1px;
    z-index: 1;
  }

  #table {
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow: auto;
    position: relative;
    border-radius: inherit;
    /* Workaround for a Chrome bug: new stacking context here prevents the scrollbar from getting hidden */
    z-index: 0;
  }

  [no-scrollbars]:is([safari], [firefox]) #table {
    overflow: hidden;
  }

  #header,
  #footer {
    display: block;
    position: sticky;
    left: 0;
    width: 100%;
    z-index: 2;
    will-change: transform;
  }

  :host([dir='rtl']) #items,
  :host([dir='rtl']) #header,
  :host([dir='rtl']) #footer {
    left: auto;
  }

  #header {
    top: 0;
  }

  #footer {
    bottom: 0;
  }

  th {
    text-align: inherit;
  }

  #header th,
  [part~='reorder-ghost'] {
    font-size: var(--vaadin-grid-header-font-size, 1em);
    font-weight: var(--vaadin-grid-header-font-weight, 500);
    color: var(--vaadin-grid-header-text-color, var(--vaadin-text-color));
  }

  /* Rows */

  [part~='row'] {
    --_row-background-color: var(--vaadin-grid-row-background-color, var(--vaadin-background-color));
    --_row-background-image: linear-gradient(var(--_row-background-color), var(--_row-background-color));

    display: grid;
    grid-template-columns: var(--_template-columns);
    width: 100%;
    box-sizing: border-box;
    margin: 0;
    position: relative;
  }

  [part~='row']:not(:focus-within) {
    --_non-focused-row-none: none;
  }

  [part~='row'][loading] [part~='body-cell'] ::slotted(vaadin-grid-cell-content) {
    visibility: hidden;
  }

  [part~='row']:where(:not(#sizer)) {
    &::before {
      content: '';
      inset: 0;
      position: absolute;
      grid-column: 1 / -1;
      background-color: var(--_row-background-color);
      background-image: var(--_selected-background-image, none);
      border-block: var(--_row-border-width) solid var(--_border-color);
    }
  }

  [column-rendering='lazy'] [part~='body-cell']:not([frozen]):not([frozen-to-end]) {
    transform: translateX(var(--_grid-lazy-columns-start));
  }

  #items [part~='row']:empty {
    height: 100%;
  }

  [part~='body-row'] {
    &:focus,
    &:focus-within {
      z-index: 4;

      &:not([part~='selected-row']):not([part~='first-row'])::before {
        inset-block-start: var(--_row-border-width);
      }

      &:not([part~='selected-row']):not([part~='last-row'])::before {
        inset-block-end: var(--_row-border-width);
      }
    }

    &:not([part~='first-row'])::before {
      inset-block-start: calc(var(--_row-border-width) * -1);
    }

    &:not([part~='last-row']) {
      padding-bottom: var(--_row-border-width);
    }
  }

  #table[has-header] [part~='first-row'] {
    padding-top: var(--_row-border-width);
  }

  #table[has-footer] [part~='last-row'] {
    padding-bottom: var(--_row-border-width);
  }

  #header [part~='row']:not(:last-child),
  #footer [part~='row']:not(:last-child) {
    padding-bottom: var(--_row-border-width);
  }

  /* Selected row */

  [part~='selected-row'] {
    --_selected-background-color: var(
      --vaadin-grid-row-selected-background-color,
      color-mix(in srgb, currentColor 8%, transparent)
    );
    --_selected-background-image: linear-gradient(var(--_selected-background-color), var(--_selected-background-color));
    z-index: 3;

    &::before {
      /* inset-block-start: calc(var(--_row-border-width) * -1); */
    }
  }

  /* Cells */

  [part~='cell'] {
    padding: 0;
    box-sizing: border-box;
    grid-column-end: span var(--_colspan, 1);
    background: var(--vaadin-grid-cell-background, var(--vaadin-background-color));
  }

  [part~='body-cell'],
  [part~='header-cell'],
  [part~='footer-cell'] {
    flex-shrink: 0;
    flex-grow: 1;
    display: flex;
    width: 100%;
    position: relative;
    align-items: center;
    white-space: nowrap;
    border-inline: var(--_column-border-width) var(--_border-color);
    z-index: 1;

    &:focus {
      z-index: 4;
    }
  }

  /* Column borders */
  [part~='cell']:not([part~='first-column-cell']) {
    border-left-style: solid;
  }

  [part~='last-frozen-cell']:not([part~='last-column-cell']) {
    border-right-style: solid;
  }

  [part~='last-frozen-cell'] + [part~='cell'] {
    border-left-style: none;
  }

  [part~='body-row'] {
    --_highlight-background-color: var(--vaadin-grid-row-highlight-background-color, transparent);
    --_highlight-background-image: linear-gradient(
      var(--_highlight-background-color),
      var(--_highlight-background-color)
    );
  }

  [part~='body-cell'] {
    background:
      var(--_hover-background-image, none) border-box,
      var(--_selected-background-image, none) border-box,
      var(--_highlight-background-image) border-box,
      var(--vaadin-grid-cell-background-color, var(--_row-background-color)) border-box;
  }

  /* Variant: wrap cell contents */

  :host([theme~='wrap-cell-content']) [part~='cell']:not([part~='details-cell']) {
    white-space: normal;
  }

  /* Variant: row stripes */
  [part~='odd-row'] {
    --vaadin-grid-cell-background-color: var(--vaadin-grid-row-odd-background-color, var(--_row-background-color));
  }

  :host([theme~='row-stripes']) [part~='odd-row'] {
    --vaadin-grid-cell-background-color: var(
      --vaadin-grid-row-odd-background-color,
      color-mix(in srgb, var(--vaadin-text-color) 4%, var(--_row-background-color))
    );
  }

  /* Raise highlighted rows above others */

  /* Row hover */
  @media (any-hover: hover) {
    [part~='body-row']:hover {
      --_hover-background-color: var(--vaadin-grid-row-hover-background-color, transparent);
      --_hover-background-image: linear-gradient(var(--_hover-background-color), var(--_hover-background-color));
    }
  }

  [part~='details-cell'] {
    position: absolute;
    bottom: 0;
    width: 100%;
  }

  [part~='cell'] ::slotted(vaadin-grid-cell-content) {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: var(--vaadin-grid-cell-padding, var(--vaadin-padding-container));
    flex: 1;
    min-height: 1lh;
    min-width: 0;
  }

  [frozen],
  [frozen-to-end] {
    z-index: 2;
    will-change: transform;
  }

  /* Empty state */
  #scroller:not([empty-state]) #emptystatebody,
  #scroller[empty-state] #items {
    display: none;
  }

  #emptystatebody {
    display: flex;
    position: sticky;
    inset: 0;
    flex: 1;
    overflow: hidden;
  }

  #emptystaterow {
    display: flex;
    flex: 1;
  }

  #emptystatecell {
    display: block;
    flex: 1;
    overflow: auto;
    padding: var(--vaadin-grid-cell-padding, var(--vaadin-padding-container));
    outline: none;
  }

  #emptystatecell:focus-visible {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: calc(var(--vaadin-focus-ring-width) * -1);
  }

  /* Reordering styles */
  :host([reordering]) [part~='cell'] ::slotted(vaadin-grid-cell-content),
  :host([reordering]) [part~='resize-handle'],
  #scroller[no-content-pointer-events] [part~='cell'] ::slotted(vaadin-grid-cell-content) {
    pointer-events: none;
  }

  [part~='reorder-ghost'] {
    visibility: hidden;
    position: fixed;
    pointer-events: none;
    box-shadow:
      0 0 0 1px hsla(0deg, 0%, 0%, 0.2),
      0 8px 24px -2px hsla(0deg, 0%, 0%, 0.2);
    padding: var(--vaadin-grid-cell-padding, var(--vaadin-padding-container)) !important;
    border-radius: 3px;

    /* Prevent overflowing the grid in Firefox */
    top: 0;
    inset-inline-start: 0;
  }

  :host([reordering]) {
    -webkit-user-select: none;
    user-select: none;
  }

  :host([reordering]) [part~='cell'] {
    /* TODO expose a custom property to control this */
    --_reorder-curtain-filter: brightness(0.9) contrast(1.1);
  }

  :host([reordering]) [part~='cell']::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1;
    -webkit-backdrop-filter: var(--_reorder-curtain-filter);
    backdrop-filter: var(--_reorder-curtain-filter);
    outline: 0;
  }

  :host([reordering]) [part~='cell'][reorder-status='allowed'] {
    /* TODO expose a custom property to control this */
    --_reorder-curtain-filter: brightness(0.94) contrast(1.07);
  }

  :host([reordering]) [part~='cell'][reorder-status='dragging'] {
    --_reorder-curtain-filter: none;
  }

  /* Resizing styles */
  [part~='resize-handle'] {
    position: absolute;
    top: 0;
    inset-inline-end: 0;
    height: 100%;
    cursor: col-resize;
    z-index: 1;
    opacity: 0;
    width: var(--vaadin-focus-ring-width);
    background: var(--vaadin-grid-column-resize-handle-color, var(--vaadin-focus-ring-color));
    transition: opacity 0.2s;
    translate: var(--_column-border-width);
  }

  [part~='last-column-cell'] [part~='resize-handle'] {
    translate: 0;
  }

  :host(:not([reordering])) *:not([column-resizing]) [part='resize-handle']:hover,
  [part='resize-handle']:active {
    opacity: 1;
    transition-delay: 0.15s;
  }

  [part~='resize-handle']::before {
    position: absolute;
    content: '';
    height: 100%;
    width: 16px;
    translate: calc(-50% + var(--vaadin-focus-ring-width) / 2);
  }

  :host([dir='rtl']) [part~='resize-handle']::before {
    translate: calc(50% - var(--vaadin-focus-ring-width) / 2);
  }

  [first-frozen-to-end] [part~='resize-handle']::before,
  :is([last-column], [last-frozen]) [part~='resize-handle']::before {
    width: 8px;
    translate: 0;
  }

  :is([last-column], [last-frozen]) [part~='resize-handle']::before {
    inset-inline-end: 0;
  }

  [frozen-to-end] :is([part~='resize-handle'], [part~='resize-handle']::before) {
    inset-inline: 0 auto;
  }

  [frozen-to-end] [part~='resize-handle'] {
    translate: calc(var(--_column-border-width) * -1);
  }

  [first-frozen-to-end] {
    margin-inline-start: auto;
  }

  #scroller:is([column-resizing], [range-selecting]) {
    -webkit-user-select: none;
    user-select: none;
  }

  /* Focus outline element, also used for d'n'd indication */
  :is([part~='row'], [part~='cell'])::after {
    position: absolute;
    z-index: 3;
    pointer-events: none;
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: calc(var(--vaadin-focus-ring-width) * -1);
  }

  [part~='cell']::after {
    inset: calc(var(--_row-border-width) * -1) calc(var(--_column-border-width) * -1);
  }

  [part~='first-column-cell']::after {
    inset-inline-start: 0;
  }

  [part~='last-column-cell']::after {
    inset-inline-end: 0;
  }

  [part~='row']::after {
    inset-block: calc(var(--_row-border-width) * -1) 0;
    inset-inline: 0;
  }

  #header [part~='row']:first-child::after,
  #header [part~='row']:first-child [part~='cell']::after {
    inset-block-start: 0;
  }

  /* #table:has(#header > tr:not([hidden])) {
    [part~='first-row']::after {
      inset-block-start: 0;
    }
  } */

  :host([navigating]) [part~='row']:focus,
  :host([navigating]) [part~='cell']:focus {
    outline: 0;
  }

  [part~='row']::after {
    transform: translateX(var(--_grid-horizontal-scroll-position));
  }

  [part~='row']:focus-visible,
  [part~='cell']:focus-visible {
    outline: 0;
  }

  [part~='row']:focus-visible::after,
  [part~='cell']:focus-visible::after,
  :host([navigating]) [part~='row']:focus::after,
  :host([navigating]) [part~='cell']:focus::after {
    content: '';
  }

  /* Drag'n'drop styles */
  :host([dragover]) {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: calc(var(--_border-width) * -1);
  }

  [part~='row'] {
    &[dragover] {
      z-index: 100 !important;
    }

    &[dragover]::after {
      content: '';
    }

    &[dragover='above']::after {
      top: calc(var(--vaadin-focus-ring-width) / -2);
      border-top: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
      outline: 0;
    }

    &[dragover='below']::after {
      bottom: calc(var(--vaadin-focus-ring-width) / -2 + var(--_row-border-width) * -1);
      border-bottom: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
      outline: 0;
    }
  }

  /* Grid with header */
  /* #table:has(#header > tr:not([hidden])) [part~='first-row'][dragover='above']::after {
    top: 0;
  } */

  /* Grid with footer */
  /* #table:has(#footer > tr:not([hidden])) [part~='last-row'][dragover='below']::after {
    bottom: 0;
  } */

  [part~='row'][dragstart] {
    border-block: var(--_row-border-width) solid transparent !important;
  }

  [part~='row'][dragstart] [part~='cell'][last-column] {
    border-radius: 0 3px 3px 0;
  }

  [part~='row'][dragstart] [part~='cell'][first-column] {
    border-radius: 3px 0 0 3px;
  }

  /* Indicates the number of dragged rows */
  /* TODO export custom properties to control styles */
  #scroller [part~='row'][dragstart]:not([dragstart=''])::before {
    position: absolute;
    left: var(--_grid-drag-start-x);
    top: var(--_grid-drag-start-y);
    z-index: 100;
    content: attr(dragstart);
    box-sizing: border-box;
    padding: 0.3em;
    color: white;
    background-color: red;
    border-radius: 1em;
    font-size: 0.75rem;
    line-height: 1;
    font-weight: 500;
    min-width: 1.6em;
    text-align: center;
  }

  /* Sizer styles */
  #sizer {
    visibility: hidden;
    border: none !important;
    grid-template-rows: none !important;
  }

  #sizer [part~='details-cell'],
  #sizer [part~='cell'] ::slotted(vaadin-grid-cell-content) {
    display: none !important;
  }

  #sizer [part~='cell'] {
    display: block;
    flex-shrink: 0;
    line-height: 0;
    height: 0 !important;
    min-height: 0 !important;
    max-height: 0 !important;
    padding: 0 !important;
    border: none !important;
  }

  #sizer [part~='cell']::before {
    content: '-';
  }

  @media (forced-colors: active) {
    :host([overflow~='top']) [part~='last-header-row-cell'] {
      border-bottom: var(--_row-border-width) solid;
      margin-bottom: calc(var(--_row-border-width) * -1);
    }

    :host([overflow~='bottom']) [part~='first-footer-row-cell'] {
      border-top: var(--_row-border-width) solid;
      margin-top: calc(var(--_row-border-width) * -1);
    }
  }
`;

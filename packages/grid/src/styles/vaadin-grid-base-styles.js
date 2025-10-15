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
    --_row-border-width: var(--vaadin-grid-row-border-width, 1px);
    --_column-border-width: var(--vaadin-grid-column-border-width, 0px);
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

  [part~='row'] {
    display: inline-flex;
    min-width: 100%;
    box-sizing: border-box;
    margin: 0;
    position: relative;
    background: var(--vaadin-grid-cell-background, var(--vaadin-background-color));
    border-block: var(--_row-border-width) solid var(--_border-color);
  }

  #header:not(:empty):not(:has(tr:not([hidden]))) {
    margin-block-start: calc(var(--_row-border-width) * -1);
    padding-block-start: var(--_row-border-width);
    pointer-events: none;
  }

  #header [part~='row'] {
    border-block-start-style: none;

    &:first-child,
    &:first-child [part~='cell'] {
      /* Focus outline */
      &::after {
        inset-block-start: 0;
      }
    }

    &:last-child {
      background: transparent;
    }
  }

  #footer [part~='row'] {
    border-block-end-style: none;

    &:first-child {
      border-block-start-style: none;

      /* Footer top border */
      &::before {
        content: '';
        display: none;
        height: var(--_row-border-width);
        background: var(--_border-color);
        position: absolute;
        inset-block-start: calc(-1 * var(--_row-border-width));
        inset-inline: 0;
      }
    }

    &:last-child,
    &:last-child [part~='cell'] {
      /* Focus outline */
      &::after {
        inset-block-end: 0;
      }
    }
  }

  #items [part~='row'] {
    border-block-start-style: none;

    &:empty {
      height: 100%;
    }
  }

  /* Grid without header */
  #table:not(:has(#header > tr:not([hidden]))) {
    [part~='first-row'],
    [part~='first-row'] [part~='cell'] {
      /* Focus outline */
      &::after {
        inset-block-start: 0;
      }
    }
  }

  :host([overflow~='top']) #table:not(:has(#footer > tr:not([hidden]))) {
    [part~='last-row'] {
      border-block-end-style: none;
    }

    [part~='last-row'],
    [part~='last-row'] [part~='cell'] {
      /* Focus outline */
      &::after {
        inset-block-end: 0;
      }
    }
  }

  :host(:is([overflow~='top'], [overflow~='bottom'])) {
    #table:has(#footer > tr:not([hidden])) {
      [part~='last-row'] {
        border-block-end-color: transparent;
      }
    }

    /* Footer top border */
    #footer [part~='row']::before {
      display: block;
    }
  }

  #scroller[empty-state] {
    #table:has(#header > tr:not([hidden])) {
      #emptystatebody {
        margin-top: calc(var(--_row-border-width) * -1);
      }

      #emptystatecell {
        border-block: var(--_row-border-width) solid transparent;
      }
    }

    /* Footer top border */
    #footer [part~='row']::before {
      display: block;
    }
  }

  [part~='row']:not(:focus-within) {
    --_non-focused-row-none: none;
  }

  [part~='row'][loading] [part~='body-cell'] ::slotted(vaadin-grid-cell-content) {
    visibility: hidden;
  }

  [column-rendering='lazy'] [part~='body-cell']:not([frozen]):not([frozen-to-end]) {
    transform: translateX(var(--_grid-lazy-columns-start));
  }

  [part~='cell'] {
    box-sizing: border-box;
    background: var(--vaadin-grid-cell-background, var(--vaadin-background-color));
  }

  [part~='cell']:where(:not([part~='details-cell'])) {
    flex-shrink: 0;
    flex-grow: 1;
    display: flex;
    width: 100%;
    position: relative;
    align-items: center;
    white-space: nowrap;
    border-inline: var(--_column-border-width) var(--_border-color);
    border-inline-start-style: solid;
  }

  [part~='first-column-cell'] {
    border-inline-start-style: none;
  }

  [part~='last-frozen-cell'] {
    border-inline-end-style: solid;

    & + [part~='cell'] {
      border-inline-start-style: none;
    }
  }

  [part~='body-cell']:where(:not([part~='details-cell'])) {
    --_highlight-background-color: var(--vaadin-grid-row-highlight-background-color, transparent);
    --_highlight-background-image: linear-gradient(
      var(--_highlight-background-color),
      var(--_highlight-background-color)
    );
    background:
      var(--_hover-background-image, none), var(--_selected-background-image, none), var(--_highlight-background-image),
      var(--vaadin-grid-cell-background-color, var(--vaadin-background-color));
  }

  /* Variant: wrap cell contents */

  :host([theme~='wrap-cell-content']) [part~='cell']:not([part~='details-cell']) {
    white-space: normal;
  }

  /* Variant: row stripes */
  [part~='odd-row'] {
    --vaadin-grid-cell-background-color: var(--vaadin-grid-row-odd-background-color, var(--vaadin-background-color));
  }

  :host([theme~='row-stripes']) [part~='odd-row'] {
    --vaadin-grid-cell-background-color: var(
      --vaadin-grid-row-odd-background-color,
      color-mix(in srgb, var(--vaadin-text-color) 4%, var(--vaadin-background-color))
    );
  }

  /* Raise highlighted rows above others */

  [part~='row']:focus,
  [part~='row']:focus-within,
  [part~='body-row']:where([selected]) {
    z-index: 3;
  }

  @container style(--vaadin-grid-row-odd-background-color) {
    [part~='odd-row'] {
      z-index: 1;
    }
  }

  /* Row hover */
  @media (any-hover: hover) {
    @container style(--vaadin-grid-row-hover-background-color) {
      [part~='body-row']:hover {
        z-index: 2;
      }
    }

    [part~='body-row']:hover [part~='cell']:where(:not([part~='details-cell'])) {
      --_hover-background-color: var(--vaadin-grid-row-hover-background-color, transparent);
      --_hover-background-image: linear-gradient(var(--_hover-background-color), var(--_hover-background-color));
    }
  }

  [part~='details-cell'] {
    position: absolute;
    bottom: 0;
    width: 100%;
    margin-top: 0;
    border-top: 0;
  }

  /* [part~='last-row-cell'] + [part~='details-cell'] {
    border-bottom: 0;
  } */

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

  /* Selected row */
  [part~='body-row'][selected] {
    --_selected-background-color: var(
      --vaadin-grid-row-selected-background-color,
      color-mix(in srgb, currentColor 8%, transparent)
    );
    --_selected-background-image: linear-gradient(var(--_selected-background-color), var(--_selected-background-color));
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
    inset-block: calc(-1 * var(--_row-border-width));
    inset-inline: 0;
    z-index: 3;
    pointer-events: none;
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: calc(var(--vaadin-focus-ring-width) * -1);
  }

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

  [part~='row'][dragover] {
    z-index: 100 !important;
  }

  [part~='row'][dragover]::after {
    content: '';
  }

  [part~='row'][dragover='above']::after {
    outline: 0;
    border-top: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
  }

  [part~='row']:not([part*='first-row'])[dragover='above']::after,
  table:has(#header > tr:not([hidden])) [part*='first-row'][dragover='above']::after {
    top: calc(var(--vaadin-focus-ring-width) / -2);
  }

  [part~='row'][dragover='below']::after {
    outline: 0;
    border-bottom: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
  }

  [part~='row']:not([part*='last-row'])[dragover='below']::after,
  table:has(#footer > tr:not([hidden])) [part*='last-row'][dragover='below']::after {
    bottom: calc(var(--vaadin-focus-ring-width) / -2);
  }

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
    display: flex;
    visibility: hidden;
    border: none !important;
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

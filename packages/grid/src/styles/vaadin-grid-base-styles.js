/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const gridStyles = css`
  /* stylelint-disable no-duplicate-selectors */
  :host {
    display: flex;
    max-width: 100%;
    height: 400px;
    min-height: var(--_grid-min-height, 0);
    flex: 1 1 auto;
    align-self: stretch;
    position: relative;
    box-sizing: border-box;
    overflow: hidden;
    -webkit-tap-highlight-color: transparent;
    background: var(--vaadin-grid-background, var(--vaadin-background-color));
    border: var(--vaadin-grid-border-width, 1px) solid var(--_border-color);
    cursor: default;
    --_border-color: var(--vaadin-grid-border-color, var(--vaadin-border-color-secondary));
    --_row-border-width: var(--vaadin-grid-row-border-width, 1px);
    --_column-border-width: var(--vaadin-grid-column-border-width, 0px);
    border-radius: var(--vaadin-grid-border-radius, var(--vaadin-radius-m));
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
  :host([theme~='no-border']) {
    border-width: 0;
    border-radius: 0;
  }

  :host([all-rows-visible]) {
    height: auto;
    align-self: flex-start;
    min-height: auto;
    flex-grow: 0;
    flex-shrink: 0;
  }

  #scroller {
    contain: layout;
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
    display: flex;
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

  [column-rendering='lazy'] [part~='body-cell']:not([frozen]):not([frozen-to-end]) {
    transform: translateX(var(--_grid-lazy-columns-start));
  }

  #items [part~='row']:empty {
    height: 100%;
  }

  [part~='cell'] {
    padding: 0;
    box-sizing: border-box;
  }

  [part~='cell']:where(:not([part~='details-cell'])) {
    flex-shrink: 0;
    flex-grow: 1;
    display: flex;
    width: 100%;
    position: relative;
    align-items: center;
    white-space: nowrap;
  }

  /*
    Block borders

    ::after - row and cell focus outline
    ::before - header bottom and footer top borders that only appear when scrolling
  */

  [part~='row']::after {
    top: 0;
    bottom: calc(var(--_row-border-width) * -1);
  }

  [part~='body-row'] {
    scroll-margin-bottom: var(--_row-border-width);
  }

  [part~='cell'] {
    border-block: var(--_row-border-width) var(--_border-color);
    border-top-style: solid;
  }

  [part~='cell']::after {
    top: calc(var(--_row-border-width) * -1);
    bottom: calc(var(--_row-border-width) * -1);
  }

  /* Block borders / Last header row and first footer row */

  [part~='last-header-row']::before,
  [part~='first-footer-row']::before {
    position: absolute;
    inset-inline: 0;
    border-block: var(--_row-border-width) var(--_border-color);
    transform: translateX(var(--_grid-horizontal-scroll-position));
  }

  /* Block borders / First header row */

  [part~='first-header-row-cell'] {
    border-top-style: none;
  }

  [part~='first-header-row-cell']::after {
    top: 0;
  }

  /* Block borders / Last header row */

  :host([overflow~='top']) [part~='last-header-row']::before {
    content: '';
    bottom: calc(var(--_row-border-width) * -1);
    border-bottom-style: solid;
  }

  /* Block borders / First body row */

  #table:not([has-header]) [part~='first-row-cell'] {
    border-top-style: none;
  }

  #table:not([has-header]) [part~='first-row-cell']::after {
    top: 0;
  }

  /* Block borders / Last body row */

  [part~='last-row']::after {
    bottom: 0;
  }

  [part~='last-row'] [part~='details-cell'],
  [part~='last-row-cell']:not([part~='details-opened-row-cell']) {
    border-bottom-style: solid;
  }

  /* Block borders / Last body row without footer */

  :host([all-rows-visible]),
  :host([overflow~='top']),
  :host([overflow~='bottom']) {
    #table:not([has-footer]) [part~='last-row'] [part~='details-cell'],
    #table:not([has-footer]) [part~='last-row-cell']:not([part~='details-opened-row-cell']) {
      border-bottom-style: none;

      &::after {
        bottom: 0;
      }
    }
  }

  /* Block borders / First footer row */

  [part~='first-footer-row']::after {
    top: calc(var(--_row-border-width) * -1);
  }

  [part~='first-footer-row-cell'] {
    border-top-style: none;
  }

  :host([overflow~='bottom']),
  :host(:not([overflow~='top']):not([all-rows-visible])) #scroller:not([empty-state]) {
    [part~='first-footer-row']::before {
      content: '';
      top: calc(var(--_row-border-width) * -1);
      border-top-style: solid;
    }
  }

  /* Block borders / Last footer row */

  [part~='last-footer-row']::after,
  [part~='last-footer-row-cell']::after {
    bottom: 0;
  }

  /* Inline borders */

  [part~='cell'] {
    border-inline: var(--_column-border-width) var(--_border-color);
  }

  [part~='header-cell']:not([part~='first-column-cell']),
  [part~='footer-cell']:not([part~='first-column-cell']),
  [part~='body-cell']:not([part~='first-column-cell']) {
    border-inline-start-style: solid;
  }

  [part~='last-frozen-cell']:not([part~='last-column-cell']) {
    border-inline-end-style: solid;

    & + [part~='cell'] {
      border-inline-start-style: none;
    }
  }

  /* Row and cell background */

  [part~='row'] {
    background-color: var(--vaadin-grid-row-background-color, var(--vaadin-background-color));
  }

  [part~='cell'] {
    background-color: inherit;
    background-repeat: no-repeat;
    background-origin: padding-box;
    background-image: linear-gradient(
      var(--vaadin-grid-cell-background-color, transparent),
      var(--vaadin-grid-cell-background-color, transparent)
    );
  }

  [part~='body-cell'] {
    background-image:
      linear-gradient(var(--_row-hover-background-color, transparent), var(--_row-hover-background-color, transparent)),
      linear-gradient(
        var(--_row-selected-background-color, transparent),
        var(--_row-selected-background-color, transparent)
      ),
      linear-gradient(
        var(--vaadin-grid-row-highlight-background-color, transparent),
        var(--vaadin-grid-row-highlight-background-color, transparent)
      ),
      linear-gradient(var(--_row-odd-background-color, transparent), var(--_row-odd-background-color, transparent)),
      linear-gradient(
        var(--vaadin-grid-cell-background-color, transparent),
        var(--vaadin-grid-cell-background-color, transparent)
      );
  }

  [part~='body-row'][selected] {
    --_row-selected-background-color: var(
      --vaadin-grid-row-selected-background-color,
      color-mix(in srgb, currentColor 8%, transparent)
    );
  }

  @media (any-hover: hover) {
    [part~='body-row']:hover {
      --_row-hover-background-color: var(--vaadin-grid-row-hover-background-color, transparent);
    }
  }

  :host([theme~='row-stripes']) [part~='odd-row'] {
    --_row-odd-background-color: var(
      --vaadin-grid-row-odd-background-color,
      color-mix(in srgb, var(--vaadin-text-color) 4%, transparent)
    );
  }

  /* Variant: wrap cell contents */

  :host([theme~='wrap-cell-content']) [part~='cell']:not([part~='details-cell']) {
    white-space: normal;
  }

  /* Raise highlighted rows above others */
  [part~='row'],
  [part~='frozen-cell'],
  [part~='frozen-to-end-cell'] {
    &:focus,
    &:focus-within {
      z-index: 3;
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
    border-block: var(--_row-border-width) var(--_border-color);
  }

  #table[has-header] #emptystatecell {
    border-top-style: solid;
  }

  #table[has-footer] #emptystatecell {
    border-bottom-style: solid;
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
    inset-inline: 0;
    pointer-events: none;
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: calc(var(--vaadin-focus-ring-width) * -1);
  }

  [part~='row']::after {
    transform: translateX(var(--_grid-horizontal-scroll-position));
  }

  [part~='cell']:where(:not([part~='details-cell']))::after {
    inset-inline: calc(var(--_column-border-width) * -1);
  }

  [part~='first-column-cell']::after {
    inset-inline-start: 0;
  }

  [part~='last-column-cell']::after {
    inset-inline-end: 0;
  }

  :host([navigating]) [part~='row']:focus,
  :host([navigating]) [part~='cell']:focus {
    outline: 0;
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
    outline-offset: calc(var(--vaadin-grid-border-width, 1px) * -1);
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

  [part~='row']:not([part~='first-row'])[dragover='above']::after {
    top: calc(var(--vaadin-focus-ring-width) / -2);
  }

  [part~='row'][dragover='below']::after {
    outline: 0;
    border-bottom: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
  }

  [part~='row']:not([part~='last-row'])[dragover='below']::after {
    bottom: calc(var(--vaadin-focus-ring-width) / -2);
  }

  [part~='row'][dragstart] [part~='cell'] {
    border-block: none !important;
    padding-block: var(--_row-border-width) !important;
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
`;

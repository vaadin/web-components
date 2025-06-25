/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/style-props.js';
import { css } from 'lit';

export const gridStyles = css`
  @layer base {
    @keyframes vaadin-grid-appear {
      to {
        opacity: 1;
      }
    }

    :host {
      display: flex;
      animation: 1ms vaadin-grid-appear;
      max-width: 100%;
      height: 400px;
      min-height: var(--_grid-min-height, 0);
      flex: 1 1 auto;
      align-self: stretch;
      position: relative;
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
      background: var(--vaadin-grid-background, var(--vaadin-background-color));
      border: var(--_border-width) solid var(--vaadin-grid-border-color, var(--vaadin-border-color));
      cursor: default;
      --_border-width: 0;
      --_row-border-width: var(--vaadin-grid-cell-border-width, 1px);
      --_column-border-width: var(--vaadin-grid-cell-border-width, 0);
      --_cell-padding: var(--vaadin-grid-cell-padding, var(--_vaadin-padding-container));
      --_reorder-background-image: none;
      --_selection-background-image: none;
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
      --_border-radius: var(--vaadin-grid-border-radius, var(--_vaadin-radius-l));
    }

    :host([all-rows-visible]) {
      height: auto;
      align-self: flex-start;
      min-height: auto;
      flex-grow: 0;
    }

    #scroller {
      contain: layout;
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
      z-index: 1;
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
      color: var(--vaadin-grid-header-color, var(--vaadin-color));
    }

    [part~='row'] {
      display: flex;
      width: 100%;
      box-sizing: border-box;
      margin: 0;
      position: relative;
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
      box-sizing: border-box;
      background:
        var(--_reorder-background-image), var(--_selection-background-image),
        var(--vaadin-grid-cell-background, var(--vaadin-background-color));
      padding: 0;
    }

    [part~='cell']:not([part~='details-cell']) {
      flex-shrink: 0;
      flex-grow: 1;
      box-sizing: border-box;
      display: flex;
      width: 100%;
      position: relative;
      align-items: center;
      white-space: nowrap;
    }

    :focus-visible,
    [part~='row']::after {
      outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
      outline-offset: calc(var(--vaadin-focus-ring-width) * -1);
    }

    [part~='row']:focus-visible {
      z-index: 1;
    }

    /* Used for focus outline and drag'n'drop target indication */
    [part~='row']::after {
      content: '';
      position: absolute;
      inset: calc(var(--_row-border-width) * -1) 0;
      z-index: 3;
      transform: translateX(var(--_grid-horizontal-scroll-position));
      pointer-events: none;
      visibility: hidden;
    }

    [part~='row']:focus-visible::after {
      visibility: visible;
    }

    /* Variant: wrap cell contents */

    :host([theme~='wrap-cell-content']) [part~='cell']:not([part~='details-cell']) {
      white-space: normal;
    }

    /* Variant: row & column borders */

    :host([theme~='no-row-borders']) {
      --_row-border-width: 0;
    }

    :host([theme~='column-borders']) {
      --_column-border-width: var(--vaadin-grid-cell-border-width, 1px);
    }

    [part~='cell']:not([part~='last-column-cell'], [part~='details-cell']) {
      border-inline-end: var(--_column-border-width, 0) solid
        var(--vaadin-grid-cell-border-color, var(--vaadin-border-color));
    }

    [part~='cell']:where(:not([part~='details-cell'], [part~='first-row-cell'])) {
      border-top: var(--_row-border-width) solid var(--vaadin-grid-cell-border-color, var(--vaadin-border-color));
    }

    [part~='first-header-row-cell'] {
      border-top: 0;
    }

    [part~='last-header-row-cell'] {
      border-bottom: var(--_row-border-width, 1px) solid
        var(--vaadin-grid-cell-border-color, var(--vaadin-border-color));
    }

    [part~='first-footer-row-cell'] {
      border-top: var(--_row-border-width, 1px) solid var(--vaadin-grid-cell-border-color, var(--vaadin-border-color));
    }

    /* Variant: row stripes */
    :host([theme~='row-stripes']) [part~='odd-row'],
    :host([theme~='row-stripes']) [part~='odd-row'] [part~='body-cell'],
    :host([theme~='row-stripes']) [part~='odd-row'] [part~='details-cell'] {
      background:
        var(--_reorder-background-image), var(--_selection-background-image),
        var(--vaadin-grid-alternate-cell-background, var(--vaadin-background-container));
    }

    [part~='cell'] > [tabindex] {
      display: flex;
      align-items: inherit;
      width: 100%;
    }

    [part~='details-cell'] {
      position: absolute;
      bottom: 0;
      width: 100%;
    }

    [part~='cell'] ::slotted(vaadin-grid-cell-content) {
      display: block;
      width: 100%;
      box-sizing: border-box;
      overflow: hidden;
      text-overflow: ellipsis;
      padding: var(--_cell-padding);
    }

    [frozen],
    [frozen-to-end] {
      z-index: 2;
      will-change: transform;
    }

    /* Selected row */
    [part~='row'][selected] [part~='body-cell']:not([part~='details-cell']) {
      --_selection-background-image: var(
        --vaadin-grid-row-selected-background-image,
        linear-gradient(rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.08))
      );
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
      padding: var(--_cell-padding);
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
      padding: var(--_cell-padding) !important;
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
      --_reorder-background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1));
    }

    :host([reordering]) [part~='cell'][reorder-status='allowed'] {
      /* TODO expose a custom property to control this */
      --_reorder-background-image: linear-gradient(rgba(0, 0, 0, 0.04), rgba(0, 0, 0, 0.04));
    }

    :host([reordering]) [part~='cell'][reorder-status='dragging'] {
      --_reorder-background-image: none;
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

    [first-frozen-to-end] {
      margin-inline-start: auto;
    }

    /* Hide resize handle if scrolled to end */
    :host(:not([overflow~='end'])) [first-frozen-to-end] [part~='resize-handle'] {
      display: none;
    }

    #scroller:is([column-resizing], [range-selecting]) {
      -webkit-user-select: none;
      user-select: none;
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
      visibility: visible;
    }

    [part~='row'][dragover='above']::after {
      outline: 0;
      border-top: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
      top: calc(var(--vaadin-focus-ring-width) / -2);
    }

    [part~='row'][dragover='below']::after {
      outline: 0;
      border-bottom: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
      bottom: calc(var(--vaadin-focus-ring-width) / -2);
    }

    :is([part~='row']:first-child, [part~='first-row'])::after {
      top: 0;
    }

    :is([part~='row']:last-child, [part~='last-row'])::after {
      bottom: 0;
    }

    [part~='row'][dragstart] [part~='cell'] {
      border-top: 0 !important;
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
  }
`;

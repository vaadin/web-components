/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const pdfViewerToolbarStyles = css`
  /* The header and the toolbar take the height they need, but scroll when
     the pages would get less than their minimum height, e.g. with large text. */
  .top-area {
    flex: 0 1 auto;
    overflow-y: auto;
    container-type: inline-size;
    /* Keeps the focus ring of a control that is scrolled into view visible */
    scroll-padding-block: calc(var(--vaadin-focus-ring-width) * 2 + 2px);
  }

  /* The title in the middle, the button that collapses the toolbar at the end */
  [part='header'] {
    display: grid;
    grid-template-columns: 1fr minmax(0, max-content) 1fr;
    align-items: center;
    gap: var(--vaadin-gap-xs);
    padding: var(--vaadin-padding-xs) var(--vaadin-padding-s);
    border-block-end: 1px solid var(--vaadin-pdf-viewer-border-color, var(--vaadin-border-color-secondary));
    background: var(--vaadin-pdf-viewer-toolbar-background, var(--vaadin-background-color));
  }

  /* The full title is in the title attribute, for titles that don't fit */
  [part='title'] {
    grid-column: 2;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* No extra space around the button, so that the row is not taller than the title needs */
  ::slotted([slot='toolbar-toggle']) {
    grid-column: 3;
    justify-self: end;
    margin-block: 0;
  }

  [part='header'][hidden] {
    display: none;
  }

  /* Navigation at the start, viewing options in the middle and actions at the end */
  [part='toolbar'] {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: var(--vaadin-pdf-viewer-toolbar-gap, var(--vaadin-gap-s));
    padding: var(--vaadin-pdf-viewer-toolbar-padding, var(--vaadin-padding-xs));
    border-block-end: 1px solid var(--vaadin-pdf-viewer-border-color, var(--vaadin-border-color-secondary));
    background: var(--vaadin-pdf-viewer-toolbar-background, var(--vaadin-background-color));
  }

  [part='toolbar'][hidden] {
    display: none;
  }

  [part='toolbar-group'] {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    max-width: 100%;
    align-items: center;
    gap: var(--vaadin-gap-xs);
  }

  .navigation {
    grid-column: 1;
    justify-self: start;
  }

  .viewing {
    grid-column: 2;
    justify-self: center;
  }

  .actions {
    grid-column: 3;
    justify-self: end;
  }

  /* When the groups don't fit next to each other, they wrap and start from the
     start edge, with more space between the groups than between their controls. */
  @container (max-width: 41rem) {
    [part='toolbar'] {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      column-gap: var(--vaadin-gap-l);
    }

    [part='toolbar-group'] {
      justify-content: flex-start;
    }
  }

  /* The zoom select with its buttons looks like one field with step buttons. */
  [part~='zoom-controls'] {
    display: flex;
    align-items: stretch;
    box-sizing: border-box;
    min-width: 0;
    max-width: 100%;
    border: var(--vaadin-input-field-border-width, 1px) solid
      var(--vaadin-input-field-border-color, var(--vaadin-border-color));
    border-radius: var(--vaadin-input-field-border-radius, var(--vaadin-radius-m));
    background: var(--vaadin-input-field-background, var(--vaadin-background-color));
  }

  [part~='zoom-controls'][part~='disabled'] {
    border-color: transparent;
    background: var(--vaadin-input-field-disabled-background, var(--vaadin-background-container-strong));
  }

  /* The box draws the background and the border of the select, also when disabled. */
  ::slotted(vaadin-select[slot='toolbar-zoom']) {
    flex: 0 1 auto;
    min-width: 0;
    --vaadin-input-field-background: transparent;
    --vaadin-input-field-disabled-background: transparent;
    --vaadin-input-field-invalid-background: transparent;
    --vaadin-input-field-border-width: 0px;
    --vaadin-input-field-border-color: transparent;
  }

  /* The buttons take the height of the select, like the step buttons of a number field */
  ::slotted(vaadin-pdf-viewer-button[slot='toolbar-zoom']) {
    height: auto;
    min-height: 0;
    margin-block: 0;
    padding-block: 0;
  }

  /* Next to the page field, so that the toolbar keeps its height */
  ::slotted([slot='page-error']) {
    align-self: center;
    font-size: var(--vaadin-input-field-error-font-size, 0.875em);
    color: var(--vaadin-input-field-error-color, var(--vaadin-text-color));
  }

  /* Kept for assistive technology while empty, so that the error is announced when it appears */
  ::slotted([slot='page-error']:empty) {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }

  /* Wide enough for the page number, at least two digits for a page that was mistyped, and the page count after it, e.g. "12 / 34" */
  ::slotted(vaadin-integer-field) {
    width: var(--vaadin-pdf-viewer-page-field-width, calc((2 * var(--_page-digits, 1) + 2) * 1ch + 1.5em));
  }

  ::slotted(vaadin-select) {
    width: var(--vaadin-pdf-viewer-zoom-select-width, 10em);
    max-width: 100%;
  }

  /* On touch devices, pages are zoomed by pinching and changed by scrolling, like in other PDF viewers
     on phones. The zoom buttons stay for zooming without two fingers. */
  @media (pointer: coarse) {
    ::slotted(
      :is(vaadin-select[slot='toolbar-zoom'], [slot='toolbar-page'], [slot='page-field'], [slot='page-error'])
    ) {
      display: none;
    }

    /* The remaining controls fit on one line: navigation at the start, zoom in the middle, actions at the end. */
    [part='toolbar'] {
      display: flex;
      justify-content: space-between;
    }
  }
`;

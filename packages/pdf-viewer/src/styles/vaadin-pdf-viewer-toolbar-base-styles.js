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
  [part~='header'] {
    display: flex;
    align-items: center;
    gap: var(--vaadin-gap-xs);
    width: 100%;
    margin: 0;
    padding: var(--vaadin-padding-xs) var(--vaadin-padding-s);
    border: 0;
    border-block-end: 1px solid var(--vaadin-pdf-viewer-border-color, var(--vaadin-border-color-secondary));
    background: var(--vaadin-pdf-viewer-toolbar-background, var(--vaadin-background-color));
    color: inherit;
    font: inherit;
    text-align: start;
    cursor: var(--vaadin-clickable-cursor);
    -webkit-user-select: none;
    user-select: none;
  }

  /* Inside the header, as the top area clips anything outside it */
  [part~='header']:focus-visible {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: calc(var(--vaadin-focus-ring-width) * -1);
  }

  /* The full title is in the title attribute, for titles that don't fit */
  [part~='title'] {
    flex: 1;
    min-width: 0;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  [part~='header-toggle'] {
    flex: none;
    width: var(--vaadin-icon-size, 1lh);
    height: var(--vaadin-icon-size, 1lh);
    background: currentColor;
    mask: var(--_vaadin-icon-chevron-down) 50% / var(--vaadin-icon-visual-size, 100%) no-repeat;
  }

  [part~='header'][aria-expanded='true'] [part~='header-toggle'] {
    scale: 1 -1;
  }

  [part~='toolbar'] {
    display: flex;
    min-width: fit-content;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: var(--vaadin-pdf-viewer-toolbar-gap, var(--vaadin-gap-s));
    padding: var(--vaadin-pdf-viewer-toolbar-padding, var(--vaadin-padding-xs));
    border-block-end: 1px solid var(--vaadin-pdf-viewer-border-color, var(--vaadin-border-color-secondary));
    background: var(--vaadin-pdf-viewer-toolbar-background, var(--vaadin-background-color));
    -webkit-user-select: none;
    user-select: none;
  }

  :is([part~='header'], [part~='toolbar'])[hidden] {
    display: none;
  }

  [part~='toolbar-group'] {
    display: flex;
    flex-wrap: wrap;
    max-width: 100%;
    align-items: center;
    gap: var(--vaadin-gap-xs);
  }

  /* Room for the page count, a page number of at least two digits, and 1.5em for the padding and gap */
  ::slotted(vaadin-integer-field) {
    --vaadin-field-default-width: calc((max(var(--_page-digits), 2) + var(--_page-digits) + 2) * 1ch + 1.5em);
  }

  ::slotted(vaadin-select) {
    --vaadin-field-default-width: 9em;
  }

  @media (forced-colors: active) {
    [part~='header-toggle'] {
      background: CanvasText;
    }
  }
`;

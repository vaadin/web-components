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

  [part~='toolbar-group'] {
    display: flex;
    flex-wrap: wrap;
    max-width: 100%;
    align-items: center;
    gap: var(--vaadin-gap-xs);
  }

  ::slotted(vaadin-integer-field) {
    --vaadin-field-default-width: calc(8ch + 1.5em);
  }
`;

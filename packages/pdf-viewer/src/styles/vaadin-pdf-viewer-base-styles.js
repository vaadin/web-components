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
import { css } from 'lit';

export const pdfViewerStyles = css`
  :host {
    display: block;
  }

  :host([hidden]) {
    display: none !important;
  }
`;

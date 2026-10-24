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

export const pdfViewerPrintStyles = css`
  /* In the middle of the pages, over the find bar and the sidebar that is shown over the pages */
  [part='print-progress'] {
    position: absolute;
    inset: 50% auto auto 50%;
    translate: -50% -50%;
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--vaadin-gap-s);
    width: min(20rem, 80%);
    max-height: calc(100% - 2 * var(--vaadin-padding-l));
    overflow: auto;
    padding: var(--vaadin-padding-l);
    border-radius: var(--vaadin-radius-l);
    background: var(--vaadin-background-color);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  }

  [part='print-progress'][hidden] {
    display: none;
  }

  ::slotted(vaadin-progress-bar) {
    width: 100%;
  }

  @media (forced-colors: active) {
    [part='print-progress'] {
      border: 1px solid CanvasText;
    }
  }
`;

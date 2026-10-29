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

export const pdfViewerFindStyles = css`
  .find-layer {
    position: absolute;
    inset: 0;
    pointer-events: none;
    /* Keeps the text under the highlights readable */
    mix-blend-mode: multiply;
  }

  .find-match {
    position: absolute;
    border-radius: 2px;
    background: var(--vaadin-pdf-viewer-match-background, color-mix(in srgb, Mark 40%, transparent));
  }

  /* Orange, like the current match of browser find, with a darker outline of at least 3:1 contrast */
  .find-match.current {
    --_current-match-background: var(--vaadin-pdf-viewer-current-match-background, #ff9632);
    background: var(--_current-match-background);
    outline: 2px solid color-mix(in srgb, var(--_current-match-background), black 50%);
  }

  @media (forced-colors: active) {
    .find-layer {
      mix-blend-mode: normal;
    }

    .find-match {
      forced-color-adjust: none;
      background: transparent;
      outline: 1px solid Highlight;
    }

    .find-match.current {
      background: transparent;
      outline: 3px solid Highlight;
    }
  }
`;

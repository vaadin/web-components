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

export const pdfViewerFindStyles = css`
  /* Over the top end of the pages, next to the scrollbar, like the find of browsers.
     Below the sidebar that is shown over the pages in a narrow viewer. */
  [part='find-bar'] {
    --_inset: var(--vaadin-gap-s);
    position: absolute;
    inset-block-start: var(--_inset);
    inset-inline-end: calc(var(--_scrollbar-width, 0px) + var(--_inset));
    z-index: 1;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: var(--vaadin-gap-xs);
    box-sizing: border-box;
    max-width: calc(100% - var(--_scrollbar-width, 0px) - 2 * var(--_inset));
    padding: var(--vaadin-padding-xs);
    border: 1px solid var(--vaadin-pdf-viewer-border-color, var(--vaadin-border-color-secondary));
    border-radius: var(--vaadin-radius-m);
    background: var(--vaadin-pdf-viewer-toolbar-background, var(--vaadin-background-color));
    box-shadow: var(--vaadin-overlay-shadow, 0 8px 24px -4px rgba(0, 0, 0, 0.3));
  }

  [part='find-bar'][hidden] {
    display: none;
  }

  /* The field gets smaller in a narrow viewer, and takes a row of its own when the buttons don't fit next to it */
  ::slotted(vaadin-text-field[slot='find']) {
    /* The width sizes the find bar, the smaller basis decides when the buttons wrap */
    flex: 1 1 min(100%, 10em);
    width: var(--vaadin-pdf-viewer-find-field-width, 16em);
    min-width: min(100%, 10em);
    margin-block: 0;
    padding-block: 0;
  }

  /* The buttons stay together when they wrap below the field */
  .find-actions {
    display: flex;
    flex: none;
    align-items: center;
    gap: var(--vaadin-gap-xs);
  }

  /* Space above the first page while finding, for a match that the find bar would cover otherwise */
  #pages {
    margin-block-start: var(--_find-space, 0);
  }

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

  /* Orange, like the current match of browser find, with an outline of at least 3:1 contrast */
  .find-match.current {
    background: var(--vaadin-pdf-viewer-current-match-background, #ff9632);
    outline: 2px solid var(--vaadin-pdf-viewer-current-match-outline-color, color-mix(in srgb, #ff9632, black 50%));
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

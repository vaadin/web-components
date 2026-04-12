/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const breadcrumbOverlayStyles = css`
  [part='content'] {
    display: flex;
    flex-direction: column;
  }

  [part='content'] a,
  [part='content'] span {
    display: block;
    padding: 0.25em 0.5em;
    text-decoration: none;
    color: inherit;
    white-space: nowrap;
    cursor: pointer;
    outline: none;
  }

  [part='content'] a:hover,
  [part='content'] a:focus {
    background: var(--vaadin-overlay-hover-background, rgba(0, 0, 0, 0.04));
  }

  [part='content'] a:focus-visible {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: -1px;
  }

  [part='content'] span[aria-disabled='true'] {
    opacity: 0.5;
    cursor: default;
  }

  @media (forced-colors: active) {
    [part='content'] a {
      color: LinkText;
    }

    [part='content'] a:hover,
    [part='content'] a:focus {
      background: Highlight;
      color: HighlightText;
    }

    [part='content'] span[aria-disabled='true'] {
      color: GrayText;
      opacity: 1;
    }
  }
`;

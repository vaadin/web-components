/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const tabsStyles = css`
  :host {
    display: flex;
    align-items: center;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host([orientation='vertical']) {
    display: block;
  }

  :host([orientation='horizontal']) [part='tabs'] {
    display: flex;
    flex-grow: 1;
    align-self: stretch;
    -webkit-overflow-scrolling: touch;
    overflow-x: auto;
  }

  /* This seems more future-proof than \\\`overflow: -moz-scrollbars-none\\\` which is marked obsolete
         and is no longer guaranteed to work:
         https://developer.mozilla.org/en-US/docs/Web/CSS/overflow#Mozilla_Extensions */
  @-moz-document url-prefix() {
    :host([orientation='horizontal']) [part='tabs'] {
      overflow: hidden;
    }
  }

  :host([orientation='horizontal']) [part='tabs']::-webkit-scrollbar {
    display: none;
  }

  :host([orientation='vertical']) [part='tabs'] {
    height: 100%;
    -webkit-overflow-scrolling: touch;
    overflow-y: auto;
  }

  [part='back-button'],
  [part='forward-button'] {
    cursor: default;
    opacity: 0;
    pointer-events: none;
  }

  :host([overflow~='start']) [part='back-button'],
  :host([overflow~='end']) [part='forward-button'] {
    opacity: 1;
    pointer-events: auto;
  }

  [part='back-button']::after {
    content: '\\\\25C0';
  }

  [part='forward-button']::after {
    content: '\\\\25B6';
  }

  :host([orientation='vertical']) [part='back-button'],
  :host([orientation='vertical']) [part='forward-button'] {
    display: none;
  }

  /* RTL specific styles */

  :host([dir='rtl']) [part='back-button']::after {
    content: '\\\\25B6';
  }

  :host([dir='rtl']) [part='forward-button']::after {
    content: '\\\\25C0';
  }
`;

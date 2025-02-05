/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const formLayoutStyles = css`
  :host {
    display: block;
    max-width: 100%;
    /* CSS API for host */
    --vaadin-form-item-label-width: 8em;
    --vaadin-form-item-label-spacing: 1em;
    --vaadin-form-layout-row-spacing: 1em;
    --vaadin-form-layout-column-spacing: 2em; /* (default) */
    align-self: stretch;
    padding-block: calc(var(--vaadin-form-layout-row-spacing) / 2);
  }

  :host([hidden]) {
    display: none !important;
  }

  #layout {
    display: flex;

    align-items: baseline; /* default \`stretch\` is not appropriate */

    flex-wrap: wrap; /* the items should wrap */

    gap: var(--vaadin-form-layout-row-spacing) var(--vaadin-form-layout-column-spacing);
  }

  #layout ::slotted(*) {
    /* Items should neither grow nor shrink. */
    flex-grow: 0;
    flex-shrink: 0;
  }

  #layout ::slotted(br) {
    display: none;
  }
`;

export const formItemStyles = css`
  :host {
    display: inline-flex;
    flex-direction: row;
    align-items: baseline;
    /*
      WARNING: --vaadin-form-item-row-spacing is deprecated since 24.7. Instead you should now:
      1. Use --vaadin-form-layout-row-spacing on the <vaadin-form-layout> component to control the gap between rows.
      2. Use standard CSS margin on <vaadin-form-layout> to control the spacing around the form layout itself.
    */
    margin: calc((var(--vaadin-form-item-row-spacing) - var(--vaadin-form-layout-row-spacing)) / 2) 0;
  }

  :host([label-position='top']) {
    flex-direction: column;
    align-items: stretch;
  }

  :host([hidden]) {
    display: none !important;
  }

  #label {
    width: var(--vaadin-form-item-label-width, 8em);
    flex: 0 0 auto;
  }

  :host([label-position='top']) #label {
    width: auto;
  }

  #spacing {
    width: var(--vaadin-form-item-label-spacing, 1em);
    flex: 0 0 auto;
  }

  #content {
    flex: 1 1 auto;
  }

  #content ::slotted(.full-width) {
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
  }
`;

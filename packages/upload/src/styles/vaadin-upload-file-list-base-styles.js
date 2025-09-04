/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const uploadFileListStyles = css`
  :host {
    display: block;
    overflow: auto;
  }

  :host([has-items]) {
    min-height: 50px; /* TODO needs some min-height */
    max-height: 85vh;
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='list'] {
    list-style-type: none;
    margin: 0;
    padding: 0;
    position: relative;
    width: 100%;
  }

  ::slotted(*) {
    width: 100%;
  }

  ::slotted(:first-child) {
    padding-top: var(--vaadin-upload-gap, var(--vaadin-gap-s));
  }

  ::slotted(li:not(:last-of-type)) {
    border-bottom: var(
      --vaadin-upload-file-list-border,
      var(--vaadin-upload-file-list-border-width, 1px) solid
        var(--vaadin-upload-file-list-border-color, var(--vaadin-border-color-subtle))
    );
  }
`;

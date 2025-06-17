/**
 * @license
 * Copyright (c) 2025 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const masterDetailLayoutStyles = css`
  :host {
    display: flex;
    box-sizing: border-box;
    height: 100%;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host(:not([has-detail])) [part='detail'],
  [part='backdrop'] {
    display: none;
  }

  :host([orientation='horizontal']) [part='master'] {
    max-width: 100%;
  }

  /* Drawer mode */
  :host(:is([drawer], [stack])) {
    position: relative;
  }

  :host(:is([drawer], [stack])[containment='layout']) [part='detail'],
  :host([drawer][containment='layout']) [part='backdrop'] {
    position: absolute;
  }

  :host(:is([drawer], [stack])[containment='viewport']) [part='detail'],
  :host([drawer][containment='viewport']) [part='backdrop'] {
    position: fixed;
  }

  :host([drawer][has-detail]) [part='backdrop'] {
    display: block;
    inset: 0;
    z-index: 1;
  }

  :host(:is([drawer], [stack])) [part='detail'] {
    z-index: 1;
  }

  :host([drawer][orientation='horizontal']) [part='detail'] {
    inset-inline-end: 0;
    height: 100%;
    width: var(--_detail-min-size, min-content);
    max-width: 100%;
  }

  :host([drawer][orientation='horizontal'][containment='viewport']) [part='detail'] {
    inset-block-start: 0;
  }

  /* No fixed size */
  :host(:not([has-master-size])) [part='master'],
  :host(:not([has-detail-size])) [part='detail'] {
    flex-grow: 1;
    flex-basis: 50%;
  }

  /* Fixed size */
  :host([has-master-size]) [part='master'],
  :host([has-detail-size]) [part='detail'] {
    flex-shrink: 0;
  }

  :host([has-master-size][orientation='horizontal']) [part='master'] {
    width: var(--_master-size);
  }

  :host([has-detail-size][orientation='horizontal']:not([stack])) [part='detail'] {
    width: var(--_detail-size);
  }

  :host([has-master-size][has-detail-size]) [part='master'] {
    flex-grow: 1;
    flex-basis: var(--_master-size);
  }

  :host([has-master-size][has-detail-size]) [part='detail'] {
    flex-grow: 1;
    flex-basis: var(--_detail-size);
  }

  /* Min size */
  :host([has-master-min-size][has-detail][orientation='horizontal']:not([drawer]):not([stack])) [part='master'] {
    min-width: var(--_master-min-size);
  }

  :host([has-detail-min-size][orientation='horizontal']:not([drawer]):not([stack])) [part='detail'] {
    min-width: var(--_detail-min-size);
  }

  :host([has-master-min-size]) [part='master'],
  :host([has-detail-min-size]) [part='detail'] {
    flex-shrink: 0;
  }

  /* Vertical */
  :host([orientation='vertical']) {
    flex-direction: column;
  }

  :host([orientation='vertical'][drawer]) [part='master'] {
    max-height: 100%;
  }

  :host([orientation='vertical'][drawer]) [part='detail'] {
    inset-block-end: 0;
    width: 100%;
    height: var(--_detail-min-size, min-content);
  }

  :host([drawer][orientation='vertical'][containment='viewport']) [part='detail'] {
    inset-inline-start: 0;
  }

  /* Fixed size */
  :host([has-master-size][orientation='vertical']) [part='master'] {
    height: var(--_master-size);
  }

  :host([has-detail-size][orientation='vertical']:not([stack])) [part='detail'] {
    height: var(--_detail-size);
  }

  /* Min size */
  :host([has-master-min-size][orientation='vertical']:not([drawer])) [part='master'],
  :host([has-master-min-size][orientation='vertical'][drawer]) {
    min-height: var(--_master-min-size);
  }

  :host([has-detail-min-size][orientation='vertical']:not([drawer]):not([stack])) [part='detail'] {
    min-height: var(--_detail-min-size);
  }

  /* Stack mode */
  :host([stack]) [part='master'] {
    max-height: 100%;
  }

  :host([stack]) [part='detail'] {
    inset: 0;
  }
`;

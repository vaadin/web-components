/**
 * @license
 * Copyright (c) 2025 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const masterDetailLayoutStyles = css`
  /* Layout and positioning styles */

  :host {
    display: flex;
    box-sizing: border-box;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    position: relative; /* Keep the positioning context stable across all modes */
    z-index: 0; /* Create a new stacking context, don't let "layout contained" detail element stack outside it */
    overflow: hidden;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host([orientation='vertical']) {
    flex-direction: column;
  }

  [part='_detail-internal'] {
    display: contents;
    justify-content: end;
  }

  :host([orientation='vertical']) [part='_detail-internal'] {
    align-items: end;
  }

  :host(:is([drawer], [stack])) [part='_detail-internal'],
  :host(:is([drawer], [stack])[has-detail]) [part='backdrop'] {
    display: flex;
    position: absolute;
    z-index: 1;
    inset: 0;
    overscroll-behavior: contain;
  }

  :host(:not([has-detail])) [part='_detail-internal'],
  [part='backdrop'] {
    display: none;
  }

  :host([orientation='horizontal'][drawer]) [part='detail'] {
    margin-inline-start: 50px;
  }

  :host([orientation='vertical'][drawer]) [part='detail'] {
    margin-top: 50px;
  }

  :host(:is([drawer], [stack])[containment='viewport']) :is([part='_detail-internal'], [part='backdrop']) {
    position: fixed;
  }

  :host(:is([drawer], [stack])[containment='viewport']) [part='detail'] {
    padding-top: var(--safe-area-inset-top);
    padding-bottom: var(--safe-area-inset-bottom);
  }

  :host([containment='viewport']:dir(ltr)) [part='detail'] {
    padding-right: var(--safe-area-inset-right);
  }

  :host([containment='viewport']:dir(rtl)) [part='detail'] {
    padding-left: var(--safe-area-inset-left);
  }

  :host([stack][containment='viewport']) [part='detail'] {
    padding-left: var(--safe-area-inset-left);
    padding-right: var(--safe-area-inset-right);
  }

  /* Sizing styles */

  [part] {
    box-sizing: border-box;
    max-width: 100%;
    max-height: 100%;
  }

  /* No fixed size */
  :host(:not([has-master-size])) [part='master'],
  :host(:not([has-detail-size]):not([drawer], [stack])) [part='detail'] {
    flex-grow: 1;
    flex-basis: 50%;
  }

  /* Fixed size */
  :host([has-master-size]) [part='master'],
  :host([has-detail-size]) [part='detail'] {
    flex-shrink: 0;
  }

  :host([orientation='horizontal'][has-master-size][has-detail]) [part='master'] {
    width: var(--_master-size);
  }

  :host([orientation='vertical'][has-master-size][has-detail]) [part='master'] {
    height: var(--_master-size);
  }

  :host([orientation='horizontal'][has-detail-size]:not([stack])) [part='detail'] {
    width: var(--_detail-size);
  }

  :host([orientation='vertical'][has-detail-size]:not([stack])) [part='detail'] {
    height: var(--_detail-size);
  }

  :host([has-master-size][has-detail-size]) [part='master'] {
    flex-grow: 1;
    flex-basis: var(--_master-size);
  }

  :host([has-master-size][has-detail-size]:not([drawer], [stack])) [part='detail'] {
    flex-grow: 1;
    flex-basis: var(--_detail-size);
  }

  /* Min size */
  :host([orientation='horizontal'][has-master-min-size]) [part='master'] {
    min-width: min(100%, var(--_master-min-size));
  }

  :host([orientation='vertical'][has-master-min-size]) [part='master'] {
    min-height: min(100%, var(--_master-min-size));
  }

  :host([orientation='horizontal'][has-detail-min-size]) [part='detail'] {
    min-width: min(100%, var(--_detail-min-size));
  }

  :host([orientation='vertical'][has-detail-min-size]) [part='detail'] {
    min-height: min(100%, var(--_detail-min-size));
  }

  :host([drawer]) [part='master'],
  :host([stack]) [part] {
    width: 100% !important;
    height: 100% !important;
    min-width: auto !important;
    min-height: auto !important;
    max-width: 100% !important;
    max-height: 100% !important;
  }

  /* Decorative/visual styles */

  [part='backdrop'] {
    background: var(--vaadin-overlay-backdrop-background, rgba(0, 0, 0, 0.2));
    forced-color-adjust: none;
  }

  :host(:is([drawer], [stack])) [part='detail'] {
    background: var(--vaadin-master-detail-layout-detail-background, var(--vaadin-background-color));
    box-shadow: var(--vaadin-master-detail-layout-detail-shadow, 0 0 20px 0 rgba(0, 0, 0, 0.3));
  }

  :host([orientation='horizontal']:not([drawer], [stack])) [part='detail'] {
    border-inline-start: var(--vaadin-master-detail-layout-border-width, 1px) solid
      var(--vaadin-master-detail-layout-border-color, var(--vaadin-border-color-secondary));
  }

  :host([orientation='vertical']:not([drawer], [stack])) [part='detail'] {
    border-top: var(--vaadin-master-detail-layout-border-width, 1px) solid
      var(--vaadin-master-detail-layout-border-color, var(--vaadin-border-color-secondary));
  }

  @media (forced-colors: active) {
    :host(:is([drawer], [stack])) [part='detail'] {
      outline: 3px solid !important;
    }

    [part='detail'] {
      background: Canvas !important;
    }
  }
`;

/**
 * @license
 * Copyright (c) 2022 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const tooltipOverlayStyles = css`
  :host {
    --_vaadin-tooltip-default-offset: 4px;
    line-height: normal;
  }

  [part='overlay'] {
    max-width: var(--vaadin-tooltip-max-width, 40ch);
    padding: var(
      --vaadin-tooltip-padding,
      var(--vaadin-padding-block-container) var(--vaadin-padding-inline-container)
    );
    border: var(--vaadin-tooltip-border-width, var(--vaadin-overlay-border-width, 1px)) solid
      var(--vaadin-tooltip-border-color, var(--vaadin-overlay-border-color, var(--vaadin-border-color-secondary)));
    border-radius: var(--vaadin-tooltip-border-radius, var(--vaadin-radius-m));
    background: var(--vaadin-tooltip-background, var(--vaadin-background-color));
    color: var(--vaadin-tooltip-text-color, inherit);
    font-size: var(--vaadin-tooltip-font-size, 0.9em);
    font-weight: var(--vaadin-tooltip-font-weight, inherit);
    line-height: var(--vaadin-tooltip-line-height, inherit);
    box-shadow: var(--vaadin-tooltip-shadow, 0 3px 8px -1px rgba(0, 0, 0, 0.2));
  }

  :host(:not([markdown])) [part='content'] {
    white-space: pre-wrap;
  }

  :host([position^='top'][top-aligned]) [part='overlay'],
  :host([position^='bottom'][top-aligned]) [part='overlay'] {
    margin-top: var(--vaadin-tooltip-offset-top, var(--_vaadin-tooltip-default-offset));
  }

  :host([position^='top'][bottom-aligned]) [part='overlay'],
  :host([position^='bottom'][bottom-aligned]) [part='overlay'] {
    margin-bottom: var(--vaadin-tooltip-offset-bottom, var(--_vaadin-tooltip-default-offset));
  }

  :host([position^='start'][start-aligned]) [part='overlay'],
  :host([position^='end'][start-aligned]) [part='overlay'] {
    margin-inline-start: var(--vaadin-tooltip-offset-start, var(--_vaadin-tooltip-default-offset));
  }

  :host([position^='start'][end-aligned]) [part='overlay'],
  :host([position^='end'][end-aligned]) [part='overlay'] {
    margin-inline-end: var(--vaadin-tooltip-offset-end, var(--_vaadin-tooltip-default-offset));
  }

  @media (forced-colors: active) {
    [part='overlay'] {
      border: 1px dashed !important;
    }
  }
`;

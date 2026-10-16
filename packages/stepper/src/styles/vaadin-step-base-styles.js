/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const stepStyles = css`
  :host {
    --_gap: var(--vaadin-stepper-gap, 0px);
    --_size: var(--vaadin-stepper-indicator-size, 1.75rem);
    --_padding-block: var(--vaadin-padding-xs);
    --_padding-inline: var(--vaadin-padding-xs);
    --_connector-width: var(--vaadin-stepper-connector-width, 1px);
    --_accent-color: var(--vaadin-stepper-accent-color, var(--vaadin-text-color));
    --_error-color: var(--vaadin-stepper-error-color, var(--vaadin-text-color));
    --_icon-exclamation: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v9"/><path d="M12 19h.01"/></svg>');
    display: flex;
    align-items: center;
    flex: 1 1 auto;
    min-width: 0;
    position: relative;
    color: var(--vaadin-text-color-secondary);
    -webkit-tap-highlight-color: transparent;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host(:last-of-type) {
    flex: 0 1 auto;
  }

  :host(:is([current], [completed])) {
    color: var(--vaadin-text-color);
  }

  :host([disabled]) {
    color: var(--vaadin-text-color-disabled);
  }

  [part='link'],
  [part='nolink'] {
    display: flex;
    align-items: center;
    gap: var(--vaadin-gap-s);
    min-width: 0;
    padding: var(--_padding-block) var(--_padding-inline);
    border-radius: var(--vaadin-radius-m);
    color: inherit;
  }

  [part='link'] {
    text-decoration: none;
    outline: none;
    cursor: var(--vaadin-clickable-cursor);

    &:focus-visible {
      outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    }
  }

  :host([disabled]) [part='link'] {
    cursor: var(--vaadin-disabled-cursor);
  }

  @media (any-hover: hover) {
    :host(:not([disabled])) [part='link']:hover [part='label'] {
      text-decoration: underline;
    }
  }

  /* Indicator */

  [part='indicator'] {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;
    width: var(--_size);
    height: var(--_size);
    border: 1px solid var(--vaadin-stepper-indicator-border-color, var(--vaadin-border-color));
    border-radius: var(--vaadin-stepper-indicator-border-radius, 50%);
    background: var(--vaadin-stepper-indicator-background, var(--vaadin-background-color));
    font-size: var(--vaadin-stepper-indicator-font-size, 0.875em);
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }

  :host([current]) [part='indicator'] {
    border: 2px solid var(--_accent-color);
    color: var(--_accent-color);
  }

  :host([completed]) [part='indicator'] {
    border-color: var(--_accent-color);
    background: var(--_accent-color);
    color: var(--vaadin-stepper-accent-contrast-color, var(--vaadin-background-color));
  }

  :host([invalid]) [part='indicator'] {
    border-color: var(--_error-color);
    background: var(--_error-color);
    color: var(--vaadin-stepper-error-contrast-color, var(--vaadin-background-color));
  }

  :host(:is([completed], [invalid])) [part='indicator']::before {
    content: '';
    width: 60%;
    height: 60%;
    background: currentColor;
    mask: var(--vaadin-stepper-completed-icon, var(--_vaadin-icon-checkmark)) center / contain no-repeat;
  }

  :host([invalid]) [part='indicator']::before {
    mask-image: var(--vaadin-stepper-invalid-icon, var(--_icon-exclamation));
  }

  :host([disabled]) [part='indicator'] {
    opacity: 0.5;
  }

  /* Label and description */

  [part='content'] {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  [part='label'] {
    font-weight: 500;
  }

  :host([current]) [part='label'] {
    font-weight: 600;
  }

  :host([invalid]) [part='label'] {
    color: var(--_error-color);
  }

  [part='description'] {
    font-size: 0.875em;
    color: var(--vaadin-text-color-secondary);
  }

  :host([disabled]) [part='description'] {
    color: inherit;
  }

  /* Connector */

  [part='connector'] {
    flex: 1 1 0;
    min-width: var(--vaadin-gap-l);
    border-top: var(--_connector-width) solid
      var(--vaadin-stepper-connector-color, var(--vaadin-border-color-secondary));
  }

  :host([completed]:not([invalid])) [part='connector'] {
    border-color: var(--_accent-color);
  }

  /* Vertical orientation */

  :host([orientation='vertical']) {
    display: block;
    flex: none;
  }

  :host([orientation='vertical']:not(:last-of-type)) {
    padding-bottom: var(--vaadin-gap-m);
  }

  :host([orientation='vertical']) :is([part='link'], [part='nolink']) {
    align-items: flex-start;
  }

  :host([orientation='vertical']) [part='content'] {
    padding-top: max(0px, (var(--_size) - 1lh) / 2);
  }

  :host([orientation='vertical']) [part='connector'] {
    position: absolute;
    inset-inline-start: calc(var(--_padding-inline) + (var(--_size) - var(--_connector-width)) / 2);
    top: calc(var(--_padding-block) + var(--_size) + var(--vaadin-gap-xs));
    bottom: calc(var(--vaadin-gap-xs) - var(--_gap) - var(--_padding-block));
    min-width: 0;
    border-top: none;
    border-inline-start: var(--_connector-width) solid
      var(--vaadin-stepper-connector-color, var(--vaadin-border-color-secondary));
  }

  :host([orientation='vertical'][completed]:not([invalid])) [part='connector'] {
    border-color: var(--_accent-color);
  }

  @media (forced-colors: active) {
    [part='indicator']::before {
      background: CanvasText !important;
    }

    :host([current]) [part='indicator'] {
      border-color: Highlight;
    }

    [part='connector'] {
      border-color: CanvasText !important;
    }
  }
`;

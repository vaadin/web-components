/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';
import { gridStyles } from '@vaadin/grid/src/styles/vaadin-grid-base-styles.js';

const gridPro = css`
  [part~='body-cell'] {
    --_highlight-color: color-mix(in srgb, currentColor 5%, transparent);
    --_highlight-color2: color-mix(in srgb, currentColor 10%, transparent);
    --_highlight-bg: linear-gradient(var(--_highlight-color), var(--_highlight-color));
  }

  [part~='editable-cell'] {
    display: flex;
    align-items: inherit;
    align-self: stretch;
    flex-grow: 1;
    min-width: 0;
    cursor: var(--vaadin-clickable-cursor);
    outline: 0;
  }

  :host([navigating]) [part~='editable-cell']:focus {
    margin-block: calc(var(--_row-border-width) * -1);
    padding-block: var(--_row-border-width);
    margin-inline: calc(var(--_column-border-width) * -1);
    padding-inline: var(--_column-border-width);
  }

  :host([navigating]) [part~='last-column-cell'] [part~='editable-cell'] {
    margin-inline-end: 0;
  }

  [part~='editable-cell']:hover,
  :host([navigating]) [part~='editable-cell']:focus {
    background: var(--vaadin-grid-pro-editable-cell-background-hover, var(--_highlight-bg));
  }

  /* Indicate editable cells */

  :host([theme~='highlight-editable-cells']) [part~='editable-cell'] {
    background: var(--vaadin-grid-pro-editable-cell-background, var(--_highlight-bg));
  }

  :host([theme~='highlight-editable-cells']) [part~='editable-cell']:is(:hover, :focus-visible) {
    background:
      var(--vaadin-grid-pro-editable-cell-background-hover, var(--_highlight-bg)),
      var(--vaadin-grid-pro-editable-cell-background, var(--_highlight-bg));
  }

  /* Indicate read-only cells */

  :host([theme~='highlight-read-only-cells']) [part~='body-cell']:not(:has([part~='editable-cell'])) {
    --_highlight-background-image: repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 30%,
      var(--_highlight-color2) 30%,
      var(--_highlight-color2) 50%
    );
    background-size: 6px 6px;
  }

  /* Loading editor cell styles are used by Flow GridPro */
  :host([loading-editor]) [part~='focused-cell']::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    box-shadow: inset 0 0 0 var(--vaadin-focus-ring-width) var(--vaadin-focus-ring-color);
    animation: loading-editor 1.4s infinite;
    opacity: 0;
  }

  @keyframes loading-editor {
    50% {
      opacity: 1;
    }
  }

  [part~='updating-cell']::after {
    content: '';
    position: absolute;
    inset: var(--_cell-padding);
    margin: var(--vaadin-focus-ring-width);
    border-radius: 4px;
    background-size: max(4em, 50%);
    background-repeat: no-repeat;
    background-position: min(-200%, -4em) 0;
    background-image: linear-gradient(90deg, transparent, currentColor, transparent);
    animation: updating-cell 1.3s ease-out infinite;
    opacity: 0.1;
  }

  @keyframes updating-cell {
    100% {
      background-position: max(300%, 8em) 0;
    }
  }

  :host([loading-editor]) [part~='focused-cell'] ::slotted(vaadin-grid-cell-content),
  [part~='updating-cell'] ::slotted(vaadin-grid-cell-content) {
    opacity: 0;
    pointer-events: none;
  }
`;

export const gridProStyles = [gridPro, gridStyles];

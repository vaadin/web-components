import '@vaadin/vaadin-lumo-styles/font-icons.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import { color } from '@vaadin/vaadin-lumo-styles/color.js';
import { typography } from '@vaadin/vaadin-lumo-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const richTextEditor = css`
  :host {
    min-height: calc(var(--lumo-size-m) * 8);
  }

  [part='toolbar'] {
    background-color: var(--lumo-contrast-5pct);
    padding: calc(var(--lumo-space-s) - 1px) var(--lumo-space-xs);
  }

  [part~='toolbar-group'] {
    margin: 0 calc(var(--lumo-space-l) / 2 - 1px);
  }

  [part~='toolbar-button'] {
    width: var(--lumo-size-m);
    height: var(--lumo-size-m);
    border-radius: var(--lumo-border-radius-m);
    color: var(--lumo-contrast-60pct);
    margin: 2px 1px;
    cursor: var(--lumo-clickable-cursor);
    transition: background-color 100ms, color 100ms;
  }

  [part~='toolbar-button']:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--lumo-primary-color-50pct);
  }

  [part~='toolbar-button']:hover {
    background-color: var(--lumo-contrast-5pct);
    color: var(--lumo-contrast-80pct);
    box-shadow: none;
  }

  @media (hover: none) {
    [part~='toolbar-button']:hover {
      background-color: transparent;
    }
  }

  [part~='toolbar-button'][on] {
    background-color: var(--lumo-primary-color-10pct);
    color: var(--lumo-primary-text-color);
  }

  [part~='toolbar-button']:active {
    background-color: var(--lumo-contrast-10pct);
    color: var(--lumo-contrast-90pct);
  }

  [part~='toolbar-button']::before {
    font-family: 'lumo-icons', var(--lumo-font-family);
    font-size: var(--lumo-icon-size-m);
  }

  [part~='toolbar-button-undo']::before {
    content: var(--lumo-icons-undo);
  }

  [part~='toolbar-button-redo']::before {
    content: var(--lumo-icons-redo);
  }

  [part~='toolbar-button-bold']::before,
  [part~='toolbar-button-italic']::before,
  [part~='toolbar-button-underline']::before,
  [part~='toolbar-button-strike']::before {
    font-size: var(--lumo-font-size-m);
    font-weight: 600;
  }

  [part~='toolbar-button-bold']::before {
    font-weight: 700;
  }

  [part~='toolbar-button-h1']::before,
  [part~='toolbar-button-h2']::before,
  [part~='toolbar-button-h3']::before {
    font-weight: 600;
  }

  [part~='toolbar-button-h1']::before {
    font-size: var(--lumo-font-size-m);
  }

  [part~='toolbar-button-h2']::before {
    font-size: var(--lumo-font-size-s);
  }

  [part~='toolbar-button-h3']::before {
    font-size: var(--lumo-font-size-xs);
  }

  [part~='toolbar-button-subscript']::before,
  [part~='toolbar-button-superscript']::before {
    font-weight: 600;
    font-size: var(--lumo-font-size-s);
  }

  [part~='toolbar-button-subscript']::after,
  [part~='toolbar-button-superscript']::after {
    font-size: 0.625em;
    font-weight: 700;
  }

  [part~='toolbar-button-list-ordered']::before {
    content: var(--lumo-icons-ordered-list);
  }

  [part~='toolbar-button-list-bullet']::before {
    content: var(--lumo-icons-unordered-list);
  }

  [part~='toolbar-button-align-left']::before {
    content: var(--lumo-icons-align-left);
  }

  [part~='toolbar-button-align-center']::before {
    content: var(--lumo-icons-align-center);
  }

  [part~='toolbar-button-align-right']::before {
    content: var(--lumo-icons-align-right);
  }

  [part~='toolbar-button-blockquote']::before {
    font-size: var(--lumo-font-size-xxl);
  }

  [part~='toolbar-button-code-block']::before {
    content: var(--lumo-icons-angle-left) var(--lumo-icons-angle-right);
    font-size: var(--lumo-font-size-l);
    letter-spacing: -0.5em;
    margin-left: -0.25em;
    font-weight: 600;
  }

  [part~='toolbar-button-image']::before {
    content: var(--lumo-icons-photo);
  }

  [part~='toolbar-button-link']::before {
    font-family: 'vaadin-rte-icons';
    font-size: var(--lumo-icon-size-m);
  }

  [part~='toolbar-button-clean']::before {
    font-family: 'vaadin-rte-icons';
    font-size: var(--lumo-font-size-l);
  }

  [part='content'] {
    background-color: var(--lumo-base-color);
  }

  /* TODO unsupported selector */
  [part='content'] > .ql-editor {
    padding: 0 var(--lumo-space-m);
    line-height: inherit;
  }

  /* Theme variants */

  /* No border */
  :host(:not([theme~='no-border'])) {
    border: 1px solid var(--lumo-contrast-20pct);
  }

  :host(:not([theme~='no-border']):not([readonly])) [part='content'] {
    border-top: 1px solid var(--lumo-contrast-20pct);
  }

  :host([theme~='no-border']) [part='toolbar'] {
    padding-top: var(--lumo-space-s);
    padding-bottom: var(--lumo-space-s);
  }

  /* Compact */
  :host([theme~='compact']) {
    min-height: calc(var(--lumo-size-m) * 6);
  }

  :host([theme~='compact']) [part='toolbar'] {
    padding: var(--lumo-space-xs) 0;
  }

  :host([theme~='compact'][theme~='no-border']) [part='toolbar'] {
    padding: calc(var(--lumo-space-xs) + 1px) 0;
  }

  :host([theme~='compact']) [part~='toolbar-button'] {
    width: var(--lumo-size-s);
    height: var(--lumo-size-s);
  }

  :host([theme~='compact']) [part~='toolbar-group'] {
    margin: 0 calc(var(--lumo-space-m) / 2 - 1px);
  }

  /* RTL specific styles */
  :host([dir='rtl']) [part~='toolbar-button-redo']::before {
    content: var(--lumo-icons-undo);
  }

  :host([dir='rtl']) [part~='toolbar-button-undo']::before {
    content: var(--lumo-icons-redo);
  }
`;

registerStyles('vaadin-rich-text-editor', [color, typography, richTextEditor], {
  moduleId: 'lumo-rich-text-editor',
});

import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';
import '../vaadin-dialog-layout-overlay-styles.js';

registerStyles(
  'vaadin-crud-edit',
  css`
    :host {
      font-family: 'lumo-icons', var(--lumo-font-family);
      font-size: var(--lumo-icon-size-m);
      line-height: 1;
      color: var(--lumo-primary-text-color);
      position: relative;
      background-color: var(--lumo-contrast-5pct);
      border-radius: var(--lumo-border-radius);
      width: var(--lumo-size-s);
      height: var(--lumo-size-s);
    }

    :host::before {
      content: var(--lumo-icons-edit);
      width: var(--lumo-size-m);
      height: var(--lumo-size-m);
      line-height: var(--lumo-size-m);
      text-align: center;
      position: absolute;
      top: calc((var(--lumo-size-m) - var(--lumo-size-s)) / -2);
      left: calc((var(--lumo-size-m) - var(--lumo-size-s)) / -2);
    }

    :host::after {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      background-color: currentColor;
      opacity: 0;
      transition: opacity 100ms;
    }

    :host(:hover)::after {
      opacity: 0.05;
    }

    :host(:active)::after {
      opacity: 0.12;
    }
  `,
  { moduleId: 'lumo-crud-grid-edit' }
);

registerStyles(
  'vaadin-crud',
  css`
    :host {
      font-family: var(--lumo-font-family);
    }

    [part='toolbar'] {
      padding: var(--lumo-space-s) var(--lumo-space-m);
      background-color: var(--lumo-contrast-5pct);
      border: 1px solid var(--lumo-contrast-10pct);
      border-top: none;
    }

    :host(:not([dir='rtl'])) [part='toolbar'] ::slotted(*:not(:first-child)) {
      margin-left: var(--lumo-space-s);
    }

    :host([dir='rtl']) [part='toolbar'] ::slotted(*:not(:first-child)) {
      margin-right: var(--lumo-space-s);
    }

    :host([theme~='no-border']) [part='toolbar'] {
      border: 0;
    }

    vaadin-grid-cell-content {
      text-overflow: ellipsis;
    }
  `,
  { moduleId: 'lumo-crud' }
);

registerStyles(
  'vaadin-dialog-layout',
  css`
    [part='header'] ::slotted(*) {
      margin-top: var(--lumo-space-s);
      margin-bottom: var(--lumo-space-s);
    }

    [part='scroller'] {
      padding: var(--lumo-space-l);
    }

    [part='footer'] {
      background-color: var(--lumo-contrast-5pct);
      padding: var(--lumo-space-s) var(--lumo-space-s);
    }

    [part='footer'] ::slotted(*) {
      margin-left: var(--lumo-space-s);
      margin-right: var(--lumo-space-s);
    }

    [part='editor'] {
      background: var(--lumo-base-color);
      box-sizing: border-box;
    }

    :host(:not([editor-position=''])) [part='editor']:not([hidden]) {
      box-shadow: var(--lumo-box-shadow-m);
    }

    :host(:not([theme~='no-border']):not([editor-position=''])) [part='editor']:not([hidden]) {
      border: 1px solid var(--lumo-contrast-20pct);
    }

    :host(:not([theme~='no-border'])[editor-position='bottom']) [part='editor']:not([hidden]) {
      border-top: 0;
    }

    :host(:not([dir='rtl'])[editor-position='aside']) [part='editor']:not([hidden]) {
      border-left: 0;
    }

    :host([dir='rtl']:not([theme~='no-border'])[editor-position='aside']) [part='editor']:not([hidden]) {
      border-right: 0;
    }
  `,
  { moduleId: 'lumo-dialog-layout' }
);

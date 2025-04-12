import '@vaadin/vaadin-lumo-styles/typography.js';
import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import { dialogOverlay } from '@vaadin/dialog/theme/lumo/vaadin-dialog-styles.js';
import { overlay } from '@vaadin/vaadin-lumo-styles/mixins/overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-crud-edit',
  css`
    :host {
      font-family: 'lumo-icons', var(--lumo-font-family);
      font-size: var(--lumo-icon-size-m);
      height: var(--lumo-size-s);
      line-height: 1;
      margin: 0;
      min-width: auto;
      outline: none;
      position: relative;
      width: var(--lumo-size-s);
    }

    [part='icon']::before {
      content: var(--lumo-icons-edit);
      height: var(--lumo-size-m);
      left: calc((var(--lumo-size-m) - var(--lumo-size-s)) / -2);
      line-height: var(--lumo-size-m);
      position: absolute;
      text-align: center;
      top: calc((var(--lumo-size-m) - var(--lumo-size-s)) / -2);
      width: var(--lumo-size-m);
    }
  `,
  { moduleId: 'lumo-crud-grid-edit' },
);

/**
 * Shared styles used for the CRUD editor content and buttons regardless of `editorPosition`.
 * They are applied to both `vaadin-crud` and `vaadin-crud-dialog-overlay` components.
 */
const editorStyles = css`
  [part='header'] ::slotted(h3) {
    margin-top: 0 !important;
  }

  :host(:not([dir='rtl'])) ::slotted([slot='delete-button']) {
    margin-right: auto;
  }

  :host([dir='rtl']) ::slotted([slot='delete-button']) {
    margin-left: auto;
  }
`;

registerStyles(
  'vaadin-crud',
  [
    editorStyles,
    css`
      :host {
        --_focus-ring-color: var(--vaadin-focus-ring-color, var(--lumo-primary-color-50pct));
        --_focus-ring-width: var(--vaadin-focus-ring-width, 2px);
        font-family: var(--lumo-font-family);
      }

      [part='scroller'] {
        padding: var(--lumo-space-l);
      }

      [part='toolbar'] {
        background-color: var(--lumo-contrast-5pct);
        border: 1px solid var(--lumo-contrast-10pct);
        border-top: none;
        padding: var(--lumo-space-s) var(--lumo-space-m);
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

      [part='footer'] {
        background-color: var(--lumo-contrast-5pct);
        padding: var(--lumo-space-s);
      }

      [part='footer'] ::slotted(*) {
        margin-left: var(--lumo-space-s);
        margin-right: var(--lumo-space-s);
      }

      [part='editor'] {
        background: var(--lumo-base-color);
        box-sizing: border-box;
        position: relative;
      }

      [part='editor']:focus::before {
        box-shadow: inset 0 0 0 var(--_focus-ring-width) var(--_focus-ring-color);
        content: '';
        inset: 0;
        pointer-events: none;
        position: absolute;
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
  ],
  { moduleId: 'lumo-crud' },
);

registerStyles(
  'vaadin-crud-dialog-overlay',
  [
    overlay,
    dialogOverlay,
    editorStyles,
    css`
      [part='header'] ::slotted(h3) {
        margin-bottom: 0 !important;
        margin-inline-start: var(--lumo-space-s);
        margin-top: 0 !important;
      }
    `,
  ],
  {
    moduleId: 'lumo-crud-dialog-overlay',
  },
);

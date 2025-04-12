import '@vaadin/vaadin-material-styles/typography.js';
import '@vaadin/vaadin-material-styles/color.js';
import { dialogOverlay } from '@vaadin/dialog/theme/material/vaadin-dialog-styles.js';
import { overlay } from '@vaadin/vaadin-material-styles/mixins/overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-crud-edit',
  css`
    :host {
      position: relative;
      display: block;
      width: 2em;
      min-width: auto;
      height: 2em;
      border-radius: 4px;
      background-color: var(--material-secondary-background-color);
      color: var(--material-text-color);
      font-size: var(--material-button-font-size);
      -webkit-font-smoothing: auto;
      -moz-font-smoothing: auto;
      /* Reset button styles */
      letter-spacing: normal;
      line-height: 1;
      outline: none;
    }

    [part='icon']::before {
      position: absolute;
      top: 0;
      left: 0;
      width: 2em;
      height: 2em;
      color: var(--material-primary-text-color);
      content: '\\\\270E';
      font-family: serif;
      font-size: var(--material-button-font-size);
      line-height: 2em;
      text-align: center;
    }
  `,
  { moduleId: 'material-crud-grid-edit' },
);

/**
 * Shared styles used for the CRUD editor content and buttons regardless of `editorPosition`.
 * They are applied to both `vaadin-crud` and `vaadin-crud-dialog-overlay` components.
 */
const editorStyles = css`
  [part='footer'] {
    background-color: var(--material-secondary-background-color);
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
        font-family: var(--material-font-family);
      }

      [part='scroller'] {
        padding: 16px;
        background: var(--material-background-color);
      }

      [part='editor'] {
        position: relative;
      }

      [part='editor']:focus::before {
        position: absolute;
        box-shadow: inset 0 0 0 2px var(--material-primary-color);
        content: '';
        inset: 0;
        pointer-events: none;
      }

      [part='toolbar'] {
        padding: 8px;
        background-color: var(--material-secondary-background-color);
      }

      [part='footer'] {
        padding: 8px 4px;
      }

      [part='footer'] ::slotted(*) {
        margin-right: 4px;
        margin-left: 4px;
      }

      :host(:not([editor-position=''])) [part='editor']:not([hidden]) {
        box-shadow: var(--material-shadow-elevation-12dp);
      }

      :host(:not([dir='rtl'])) [part='toolbar'] ::slotted(*:not(:first-child)) {
        margin-left: 0.5em;
      }

      :host([dir='rtl']) [part='toolbar'] ::slotted(*:not(:first-child)) {
        margin-right: 0.5em;
      }
    `,
  ],
  { moduleId: 'material-crud' },
);

registerStyles(
  'vaadin-crud-dialog-overlay',
  [
    overlay,
    dialogOverlay,
    editorStyles,
    css`
      [part='overlay'] {
        min-width: 20em;
        max-width: 54em;
      }

      @keyframes material-overlay-dummy-animation {
        0% {
          opacity: 1;
        }

        100% {
          opacity: 1;
        }
      }

      :host([opening]),
      :host([closing]) {
        animation: 0.25s material-overlay-dummy-animation;
      }

      [part='header'] ::slotted(h3) {
        margin-top: 0 !important;
        margin-bottom: 0 !important;
      }

      [part='content'] {
        padding: 0 16px 16px;
      }
    `,
  ],
  { moduleId: 'material-crud-dialog-overlay' },
);

import '@vaadin/vaadin-material-styles/typography.js';
import '@vaadin/vaadin-material-styles/color.js';
import { dialogOverlay } from '@vaadin/dialog/theme/material/vaadin-dialog-styles.js';
import { overlay } from '@vaadin/vaadin-material-styles/mixins/overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-crud-edit',
  css`
    :host {
      background-color: var(--material-secondary-background-color);
      border-radius: 4px;
      color: var(--material-text-color);
      display: block;
      font-size: var(--material-button-font-size);
      -webkit-font-smoothing: auto;
      -moz-font-smoothing: auto;
      height: 2em;
      /* Reset button styles */
      letter-spacing: normal;
      line-height: 1;
      min-width: auto;
      outline: none;
      position: relative;
      width: 2em;
    }

    [part='icon']::before {
      color: var(--material-primary-text-color);
      content: '\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\270E';
      font-family: serif;
      font-size: var(--material-button-font-size);
      height: 2em;
      left: 0;
      line-height: 2em;
      position: absolute;
      text-align: center;
      top: 0;
      width: 2em;
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
        background: var(--material-background-color);
        padding: 16px;
      }

      [part='editor'] {
        position: relative;
      }

      [part='editor']:focus::before {
        box-shadow: inset 0 0 0 2px var(--material-primary-color);
        content: '';
        inset: 0;
        pointer-events: none;
        position: absolute;
      }

      [part='toolbar'] {
        background-color: var(--material-secondary-background-color);
        padding: 8px;
      }

      [part='footer'] {
        padding: 8px 4px;
      }

      [part='footer'] ::slotted(*) {
        margin-left: 4px;
        margin-right: 4px;
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
        max-width: 54em;
        min-width: 20em;
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
        margin-bottom: 0 !important;
        margin-top: 0 !important;
      }

      [part='content'] {
        padding: 0 16px 16px;
      }
    `,
  ],
  { moduleId: 'material-crud-dialog-overlay' },
);

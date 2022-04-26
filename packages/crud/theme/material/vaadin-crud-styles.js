import '@vaadin/vaadin-material-styles/typography.js';
import '@vaadin/vaadin-material-styles/color.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-crud-edit',
  css`
    :host {
      display: block;
      min-width: auto;
      font-size: var(--material-button-font-size);
      line-height: 1;
      color: var(--material-text-color);
      position: relative;
      background-color: var(--material-secondary-background-color);
      border-radius: 4px;
      width: 2em;
      height: 2em;
      outline: none;
      /* Reset button styles */
      letter-spacing: normal;
      -webkit-font-smoothing: auto;
      -moz-font-smoothing: auto;
    }

    [part='icon']::before {
      font-family: serif;
      font-size: var(--material-button-font-size);
      color: var(--material-primary-text-color);
      content: '✎';
      width: 2em;
      height: 2em;
      line-height: 2em;
      text-align: center;
      position: absolute;
      top: 0;
      left: 0;
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

      [part='toolbar'] {
        padding: 8px;
        background-color: var(--material-secondary-background-color);
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

      vaadin-text-field[theme~='small'] {
        height: 24px;
        font-size: var(--material-small-font-size);
        margin: 0;
        padding: 0;
      }
    `,
  ],
  { moduleId: 'material-crud' },
);

registerStyles(
  'vaadin-crud-dialog-overlay',
  [
    editorStyles,
    css`
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

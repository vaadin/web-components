import '@vaadin/vaadin-material-styles/color.js';
import { typography } from '@vaadin/vaadin-material-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const richTextEditor = css`
  :host {
    background-color: var(--material-background-color);
    min-height: 288px;
  }

  [part='toolbar'] {
    background-color: var(--material-secondary-background-color);
    padding: 0;
    border: 0;
    overflow: hidden;
  }

  [part~='toolbar-group'] {
    margin: 8px 0;
    padding: 0 8px;
  }

  [part~='toolbar-group'] + [part~='toolbar-group'] {
    box-shadow: -1px 0 0 0 rgba(0, 0, 0, 0.1);
  }

  [part~='toolbar-button'] {
    border-radius: 3px;
    color: var(--material-secondary-text-color);
    font-family: 'vaadin-rte-icons', var(--material-font-family);
    font-weight: 600;
    margin: -4px 2px;
  }

  [part~='toolbar-button']:hover {
    background-color: transparent;
    color: inherit;
  }

  [part~='toolbar-button'][on] {
    background-color: rgba(0, 0, 0, 0.1);
    color: inherit;
  }

  @media (hover: none) {
    [part~='toolbar-button']:hover {
      color: var(--material-secondary-text-color);
    }
  }

  /* SVG icons */
  [part~='toolbar-button-undo']::before,
  [part~='toolbar-button-redo']::before,
  [part~='toolbar-button-list-ordered']::before,
  [part~='toolbar-button-list-bullet']::before,
  [part~='toolbar-button-align-left']::before,
  [part~='toolbar-button-align-center']::before,
  [part~='toolbar-button-align-right']::before,
  [part~='toolbar-button-image']::before,
  [part~='toolbar-button-link']::before,
  [part~='toolbar-button-clean']::before {
    font-size: 24px;
    font-weight: 400;
  }

  /* Text icons */
  [part~='toolbar-button-bold']::before,
  [part~='toolbar-button-italic']::before,
  [part~='toolbar-button-underline']::before,
  [part~='toolbar-button-strike']::before {
    font-size: 20px;
  }

  /* TODO unsupported selector */
  [part='content'] > .ql-editor {
    padding: 0 16px;
    line-height: inherit;
  }

  /* Theme variants */
  :host(:not([theme~='no-border'])) {
    border: 1px solid rgba(0, 0, 0, 0.12);
  }

  :host(:not([theme~='no-border']):not([readonly])) [part='content'] {
    border-top: 1px solid rgba(0, 0, 0, 0.12);
  }

  /* Content */
  b,
  strong {
    font-weight: 600;
  }
`;

registerStyles('vaadin-rich-text-editor', [typography, richTextEditor], {
  moduleId: 'material-rich-text-editor',
});

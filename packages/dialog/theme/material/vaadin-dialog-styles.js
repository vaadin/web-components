import '@vaadin/vaadin-material-styles/shadow.js';
import '@vaadin/vaadin-material-styles/color.js';
import { overlay } from '@vaadin/vaadin-material-styles/mixins/overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const dialogOverlay = css`
  [part='overlay'] {
    box-shadow: var(--material-shadow-elevation-24dp);
    outline: none;
    max-width: 560px;
    min-width: 280px;
    -webkit-tap-highlight-color: transparent;
    border-radius: 8px;
  }

  [part='overlay']:focus-visible {
    box-shadow: 0 0 0 2px var(--material-primary-color), var(--material-shadow-elevation-24dp);
  }

  [part='content'] {
    padding: 24px;
  }

  :host(:is([has-header], [has-title])) [part='header'] {
    padding: 16px;
  }

  :host(:is([has-header], [has-title])) [part='header'] + [part='content'] {
    padding-top: 0;
  }

  [part='header'],
  [part='header-content'],
  [part='footer'] {
    gap: 8px;
    line-height: 1.2;
  }

  [part='title'] {
    font-size: var(--material-h5-font-size);
    font-weight: 500;
  }

  [part='title'] {
    margin-inline-start: 8px;
  }

  :host([has-footer]) [part='footer'] {
    padding: 8px;
  }

  @media (min-height: 320px) {
    :host(:is([has-header], [has-title])) [part='header'] {
      box-shadow: 0 1px 0 0 var(--material-divider-color);
    }

    :host([has-footer]) [part='footer'] {
      box-shadow: 0 -1px 0 0 var(--material-divider-color);
    }

    /* "scroll divider" */

    :host([has-footer]) [part='content'] {
      height: 100%;
      padding-bottom: 0;
    }

    :host([has-footer]) [part='content'] slot {
      display: block;
      min-height: calc(100% - 26px);
    }

    :host(:is([has-header], [has-title])) [part='content']::before {
      content: '';
      display: block;
      width: calc(100% + 24px * 2);
      height: 200px;
      background: var(--material-background-color);
      margin-top: -199px;
      margin-left: -24px;
      margin-right: -24px;
      position: relative;
      z-index: 1;
    }

    :host([has-footer]) [part='content']::after {
      content: '';
      display: block;
      width: calc(100% + 24px * 2);
      height: 1px;
      background: var(--material-background-color);
      margin-top: 24px;
      margin-left: -24px;
      margin-right: -24px;
      position: relative;
      z-index: 2;
    }
  }

  /* No padding */
  :host([theme~='no-padding']) [part='content'] {
    padding: 0;
  }
`;

registerStyles('vaadin-dialog-overlay', [overlay, dialogOverlay], {
  moduleId: 'material-dialog'
});

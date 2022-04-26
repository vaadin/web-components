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
  }

  [part='content'] {
    padding: 24px;
  }

  [part='header'] {
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
    margin-inline-start: 8px;
  }

  [part='footer'] {
    padding: 8px;
  }

  @media (min-height: 320px) {
    :host([overflow~='top']) [part='header'] {
      box-shadow: 0 1px 0 0 var(--material-divider-color);
    }

    :host([overflow~='bottom']) [part='footer'] {
      box-shadow: 0 -1px 0 0 var(--material-divider-color);
    }
  }

  /* No padding */
  :host([theme~='no-padding']) [part='content'] {
    padding: 0;
  }
`;

registerStyles('vaadin-dialog-overlay', [overlay, dialogOverlay], {
  moduleId: 'material-dialog',
});

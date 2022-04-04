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

  :host([has-header]) [part='header'],
  :host([has-title]) [part='header'] {
    padding: 9px 24px;
    font-weight: 500;
    gap: 8px;
    border-bottom: 1px solid var(--material-divider-color);
  }

  :host([has-footer]) [part='footer'] {
    padding: 8px;
    border-top: 1px solid var(--material-divider-color);
  }

  /* No padding */
  :host([theme~='no-padding']) [part='content'] {
    padding: 0;
  }
`;

registerStyles('vaadin-dialog-overlay', [overlay, dialogOverlay], {
  moduleId: 'material-dialog'
});

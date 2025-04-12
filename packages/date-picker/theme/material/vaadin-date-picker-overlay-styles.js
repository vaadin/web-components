import { overlay } from '@vaadin/vaadin-material-styles/mixins/overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const datePickerOverlay = css`
  :host([fullscreen]) {
    /* stylelint-enable declaration-block-no-redundant-longhand-properties */
    align-items: stretch;
    bottom: var(--vaadin-overlay-viewport-bottom) !important;
    justify-content: stretch;
    left: 0 !important;
    right: 0 !important;
    /* stylelint-disable declaration-block-no-redundant-longhand-properties */
    top: 0 !important;
  }

  [part='overlay'] {
    overflow: hidden;
    -webkit-overflow-scrolling: auto;
  }

  :host(:not([fullscreen])) [part='overlay'] {
    border-radius: 0 4px 4px;
    max-height: 500px;
    width: 360px;
  }

  :host(:not([dir='rtl']):not([fullscreen])[end-aligned]) [part='overlay'],
  :host([dir='rtl']:not([fullscreen])[start-aligned]) [part='overlay'] {
    border-radius: 4px 0 4px 4px;
  }

  :host(:not([fullscreen])[bottom-aligned]) [part='overlay'] {
    border-radius: 4px;
  }

  :host(:not([fullscreen])[show-week-numbers]) [part='overlay'] {
    width: 396px;
  }

  [part='content'] {
    padding: 0;
  }
`;

registerStyles('vaadin-date-picker-overlay', [overlay, datePickerOverlay], {
  moduleId: 'material-date-picker-overlay',
});

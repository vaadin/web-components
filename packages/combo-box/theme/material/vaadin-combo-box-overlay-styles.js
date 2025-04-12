import '@vaadin/vaadin-material-styles/color.js';
import { loader } from '@vaadin/vaadin-material-styles/mixins/loader.js';
import { menuOverlay } from '@vaadin/vaadin-material-styles/mixins/menu-overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const comboBoxOverlay = css`
  [part='overlay'] {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    position: relative;
  }

  /* Overflow needs to be auto by default to make overlay sizing logic work */
  /* When loading, overflow needs to be visible to make loading indicator visible */
  :host([loading]) [part='overlay'] {
    overflow: visible;
  }

  [part='content'] {
    padding: 0;
  }
`;

const comboBoxLoader = css`
  [part~='loader'] {
    left: 0;
    position: absolute;
    right: 0;
    top: -2px;
    z-index: 1;
  }
`;

registerStyles(
  'vaadin-combo-box-overlay',
  [
    menuOverlay,
    comboBoxOverlay,
    loader,
    comboBoxLoader,
    css`
      :host {
        --_vaadin-combo-box-items-container-border-width: 8px 0;
        --_vaadin-combo-box-items-container-border-style: solid;
      }
    `,
  ],
  { moduleId: 'material-combo-box-overlay' },
);

export { comboBoxLoader, comboBoxOverlay };

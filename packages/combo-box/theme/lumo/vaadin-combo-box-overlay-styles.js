import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import { loader } from '@vaadin/vaadin-lumo-styles/mixins/loader.js';
import { menuOverlayCore } from '@vaadin/vaadin-lumo-styles/mixins/menu-overlay.js';
import { overlay } from '@vaadin/vaadin-lumo-styles/mixins/overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const comboBoxOverlay = css`
  [part='content'] {
    padding: 0;
  }

  /* When items are empty, the spinner needs some room */
  :host(:not([closing])) [part~='content'] {
    min-height: calc(2 * var(--lumo-space-s) + var(--lumo-icon-size-s));
  }

  [part~='overlay'] {
    position: relative;
  }

  :host([top-aligned]) [part~='overlay'] {
    margin-top: var(--lumo-space-xs);
  }

  :host([bottom-aligned]) [part~='overlay'] {
    margin-bottom: var(--lumo-space-xs);
  }
`;

const comboBoxLoader = css`
  [part~='loader'] {
    position: absolute;
    z-index: 1;
    inset-inline: var(--lumo-space-s);
    top: var(--lumo-space-s);
    margin-inline: auto 0;
  }
`;

registerStyles(
  'vaadin-combo-box-overlay',
  [
    overlay,
    menuOverlayCore,
    comboBoxOverlay,
    loader,
    comboBoxLoader,
    css`
      :host {
        --_vaadin-combo-box-items-container-border-width: var(--lumo-space-xs);
        --_vaadin-combo-box-items-container-border-style: solid;
      }
    `,
  ],
  { moduleId: 'lumo-combo-box-overlay' },
);

export { comboBoxLoader, comboBoxOverlay };

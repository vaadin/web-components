import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import { menuOverlay } from '@vaadin/vaadin-lumo-styles/mixins/menu-overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const datePickerOverlay = css`
  [part='overlay'] {
    flex-direction: column;
    height: 100%;
    max-height: calc(var(--lumo-size-m) * 14);
    overflow: hidden;
    -webkit-tap-highlight-color: transparent;
    /*
  Width:
      date cell widths
    + month calendar side padding
    + year scroller width
  */
    /* prettier-ignore */
    width:
    calc(
        var(--lumo-size-m) * 7
      + var(--lumo-space-xs) * 2
      + 57px
    );
  }

  [part='content'] {
    height: 100%;
    -webkit-mask-image: none;
    mask-image: none;
    overflow: hidden;
    padding: 0;
  }

  :host([top-aligned]) [part~='overlay'] {
    margin-top: var(--lumo-space-xs);
  }

  :host([bottom-aligned]) [part~='overlay'] {
    margin-bottom: var(--lumo-space-xs);
  }

  @media (max-width: 450px), (max-height: 450px) {
    [part='overlay'] {
      height: 70vh;
      max-height: 70vh;
      width: 100vw;
    }
  }
`;

registerStyles('vaadin-date-picker-overlay', [menuOverlay, datePickerOverlay], {
  moduleId: 'lumo-date-picker-overlay',
});

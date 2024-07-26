import { overlay } from '@vaadin/vaadin-material-styles/mixins/overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const popoverOverlay = css`
  :host {
    --vaadin-popover-offset-top: 0.25rem;
    --vaadin-popover-offset-bottom: 0.25rem;
    --vaadin-popover-offset-start: 0.25rem;
    --vaadin-popover-offset-end: 0.25rem;
  }

  [part='content'] {
    padding: 0.25rem 0.5rem;
  }
`;

registerStyles('vaadin-popover-overlay', [overlay, popoverOverlay], { moduleId: 'material-popover-overlay' });

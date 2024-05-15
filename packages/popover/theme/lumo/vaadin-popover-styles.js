import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import { overlay } from '@vaadin/vaadin-lumo-styles/mixins/overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const popoverOverlay = css`
  :host {
    --vaadin-popover-offset-top: var(--lumo-space-xs);
    --vaadin-popover-offset-bottom: var(--lumo-space-xs);
    --vaadin-popover-offset-start: var(--lumo-space-xs);
    --vaadin-popover-offset-end: var(--lumo-space-xs);
  }

  [part='content'] {
    padding: var(--lumo-space-xs) var(--lumo-space-s);
  }
`;

registerStyles('vaadin-popover-overlay', [overlay, popoverOverlay], { moduleId: 'lumo-popover-overlay' });

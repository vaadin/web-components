import '@vaadin/vaadin-lumo-styles/spacing.js';
import { overlayContent } from '@vaadin/vaadin-lumo-styles/mixins/overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const popoverOverlay = css`
  [part='content'] {
    padding: var(--lumo-space-xs) var(--lumo-space-s);
  }
`;

registerStyles('vaadin-native-popover-overlay', [overlayContent, popoverOverlay], { moduleId: 'lumo-native-popover' });

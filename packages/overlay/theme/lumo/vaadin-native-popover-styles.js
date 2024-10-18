import '@vaadin/vaadin-lumo-styles/spacing.js';
import { overlayContent } from '@vaadin/vaadin-lumo-styles/mixins/overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const popoverOverlay = css`
  [part='content'] {
    padding: var(--lumo-space-xs) var(--lumo-space-s);
  }
`;

const popover = css`
  :host {
    --vaadin-popover-offset-top: var(--_vaadin-popover-default-offset);
    --vaadin-popover-offset-bottom: var(--_vaadin-popover-default-offset);
    --vaadin-popover-offset-start: var(--_vaadin-popover-default-offset);
    --vaadin-popover-offset-end: var(--_vaadin-popover-default-offset);
    --_vaadin-popover-default-offset: var(--lumo-space-xs);
  }
`;

registerStyles('vaadin-native-popover-overlay', [overlayContent, popoverOverlay], {
  moduleId: 'lumo-native-popover-overlay',
});

registerStyles('vaadin-native-popover', popover, { moduleId: 'lumo-native-popover' });

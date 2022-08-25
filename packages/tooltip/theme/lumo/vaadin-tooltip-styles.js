import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import { overlay } from '@vaadin/vaadin-lumo-styles/mixins/overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const tooltipOverlay = css`
  [part='overlay'] {
    background-color: var(--lumo-contrast);
    color: var(--lumo-primary-contrast-color);
    font-size: var(--lumo-font-size-xs);
  }

  :host([position^='top']) [part='overlay'],
  :host([position^='bottom']) [part='overlay'] {
    margin: var(--lumo-space-xs) 0;
  }

  :host([position^='start']) [part='overlay'],
  :host([position^='end']) [part='overlay'] {
    margin: 0 var(--lumo-space-xs);
  }

  [part='content'] {
    padding: var(--lumo-space-xs) var(--lumo-space-s);
  }
`;

registerStyles('vaadin-tooltip-overlay', [overlay, tooltipOverlay], { moduleId: 'lumo-tooltip-overlay' });

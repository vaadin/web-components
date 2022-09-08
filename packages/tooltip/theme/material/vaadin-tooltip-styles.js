import { overlay } from '@vaadin/vaadin-material-styles/mixins/overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const tooltipOverlay = css`
  :host {
    --vaadin-tooltip-offset-top: 0.25rem;
    --vaadin-tooltip-offset-bottom: 0.25rem;
    --vaadin-tooltip-offset-start: 0.25rem;
    --vaadin-tooltip-offset-end: 0.25rem;
  }

  [part='overlay'] {
    background-color: rgba(97, 97, 97, 0.92);
    color: #fff;
    font-size: 0.6875rem;
  }

  [part='content'] {
    padding: 0.25rem 0.5rem;
  }
`;

registerStyles('vaadin-tooltip-overlay', [overlay, tooltipOverlay], { moduleId: 'material-tooltip-overlay' });

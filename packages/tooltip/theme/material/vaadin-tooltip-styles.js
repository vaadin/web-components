import { overlay } from '@vaadin/vaadin-material-styles/mixins/overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const tooltipOverlay = css`
  [part='overlay'] {
    background-color: rgba(97, 97, 97, 0.92);
    color: #fff;
    font-size: 0.6875rem;
  }

  :host([position^='top']) [part='overlay'],
  :host([position^='bottom']) [part='overlay'] {
    margin: 0.25rem 0;
  }

  :host([position^='start']) [part='overlay'],
  :host([position^='end']) [part='overlay'] {
    margin: 0 0.25rem;
  }

  [part='content'] {
    padding: 0.25rem 0.5rem;
  }
`;

registerStyles('vaadin-tooltip-overlay', [overlay, tooltipOverlay], { moduleId: 'material-tooltip-overlay' });

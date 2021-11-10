import '@vaadin/vaadin-material-styles/color.js';
import { details } from '@vaadin/details/theme/material/vaadin-details-styles.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const accordionPanel = css`
  :host(:not([opened])) [part='summary']::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 1px;
    opacity: 1;
    z-index: 1;
    background-color: var(--material-divider-color);
  }

  :host([opened]) [part='summary']::before {
    opacity: 0;
  }

  :host([opened]:not(:first-child)) {
    margin-top: 16px;
  }

  :host([opened]:not(:last-child)) {
    margin-bottom: 16px;
  }

  [part='summary-content'] {
    display: flex;
    width: 100%;
    font-weight: normal;
  }

  [part='summary-content'] ::slotted(*) {
    display: flex;
    margin-right: 16px;
    color: var(--material-body-text-color);
  }

  [part='summary-content'] ::slotted([theme='primary']) {
    flex-basis: 33.33%;
    flex-shrink: 0;
  }

  [part='summary-content'] ::slotted([theme='secondary']) {
    color: var(--material-secondary-text-color);
  }
`;

registerStyles('vaadin-accordion-panel', [details, accordionPanel], {
  moduleId: 'material-accordion-panel'
});

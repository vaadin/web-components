import '@vaadin/vaadin-material-styles/color.js';
import { detailsSummary } from '@vaadin/details/theme/material/vaadin-details-summary-styles.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const accordionHeading = css`
  :host(:not([opened]))::after {
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

  :host([opened])::before {
    opacity: 0;
  }

  [part='content'] {
    font-weight: normal;
  }

  [part='content'] ::slotted(*) {
    display: flex;
    margin-right: 16px;
    color: var(--material-body-text-color);
  }

  [part='content'] ::slotted([theme='primary']) {
    flex-basis: 33.33%;
    flex-shrink: 0;
  }

  [part='content'] ::slotted([theme='secondary']) {
    color: var(--material-secondary-text-color);
  }
`;

registerStyles('vaadin-accordion-heading', [detailsSummary, accordionHeading], {
  moduleId: 'material-accordion-heading',
});

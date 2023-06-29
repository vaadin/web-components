import { detailsSummary } from '@vaadin/details/theme/lumo/vaadin-details-summary-styles.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const accordionHeading = css`
  :host {
    padding: 0;
  }

  [part='content'] {
    padding: var(--lumo-space-s) 0;
  }

  :host([theme~='filled']) {
    padding-top: 0;
    padding-bottom: 0;
  }
`;

registerStyles('vaadin-accordion-heading', [detailsSummary, accordionHeading], { moduleId: 'lumo-accordion-heading' });

import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import { details } from '@vaadin/details/theme/lumo/vaadin-details-styles.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const accordionPanel = css`
  :host {
    margin: 0;
    border-bottom: solid 1px var(--lumo-contrast-10pct);
  }

  :host(:last-child) {
    border-bottom: none;
  }

  :host([theme~='filled']) {
    border-bottom: none;
  }

  :host([theme~='filled']:not(:last-child)) {
    margin-bottom: 2px;
  }
`;

registerStyles('vaadin-accordion-panel', [details, accordionPanel], { moduleId: 'lumo-accordion-panel' });

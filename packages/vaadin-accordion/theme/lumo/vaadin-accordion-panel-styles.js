import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-details/theme/lumo/vaadin-details-styles.js';

registerStyles(
  'vaadin-accordion-panel',
  css`
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
  `,
  { include: ['lumo-details'], moduleId: 'lumo-accordion-panel' }
);

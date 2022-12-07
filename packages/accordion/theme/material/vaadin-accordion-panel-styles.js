import '@vaadin/vaadin-material-styles/color.js';
import { details } from '@vaadin/details/theme/material/vaadin-details-styles.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const accordionPanel = css`
  :host([opened]:not(:first-child)) {
    margin-top: 16px;
  }

  :host([opened]:not(:last-child)) {
    margin-bottom: 16px;
  }
`;

registerStyles('vaadin-accordion-panel', [details, accordionPanel], {
  moduleId: 'material-accordion-panel',
});

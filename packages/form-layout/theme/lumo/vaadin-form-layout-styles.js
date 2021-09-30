import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';

registerStyles(
  'vaadin-form-layout',
  css`
    :host {
      --vaadin-form-layout-column-spacing: var(--lumo-space-l);
    }
  `,
  { moduleId: 'lumo-form-layout' }
);

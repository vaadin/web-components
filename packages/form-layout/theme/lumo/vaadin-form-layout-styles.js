import '@vaadin/vaadin-lumo-styles/spacing.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-form-layout',
  css`
    :host {
      --vaadin-form-layout-column-spacing: var(--lumo-space-l);
      --vaadin-form-layout-row-spacing: 0;
    }
  `,
  { moduleId: 'lumo-form-layout' },
);

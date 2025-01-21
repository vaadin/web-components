import '@vaadin/vaadin-lumo-styles/spacing.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const verticalLayout = css`
  :host {
    --vaadin-spacing-xs: var(--lumo-space-xs);
    --vaadin-spacing-s: var(--lumo-space-s);
    --vaadin-spacing-m: var(--lumo-space-m);
    --vaadin-spacing-l: var(--lumo-space-l);
    --vaadin-spacing-xl: var(--lumo-space-xl);
  }

  :host([theme~='margin']) {
    margin: var(--lumo-space-m);
  }

  :host([theme~='padding']) {
    padding: var(--lumo-space-m);
  }

  :host([theme~='spacing-xs']) {
    gap: var(--lumo-space-xs);
  }

  :host([theme~='spacing-s']) {
    gap: var(--lumo-space-s);
  }

  :host([theme~='spacing']) {
    gap: var(--lumo-space-m);
  }

  :host([theme~='spacing-l']) {
    gap: var(--lumo-space-l);
  }

  :host([theme~='spacing-xl']) {
    gap: var(--lumo-space-xl);
  }

  :host([theme~='wrap']) {
    flex-wrap: wrap;
  }
`;

registerStyles('vaadin-vertical-layout', verticalLayout, { moduleId: 'lumo-vertical-layout' });

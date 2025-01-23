import '@vaadin/vaadin-lumo-styles/spacing.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const horizontalLayout = css`
  :host([theme~='margin']) {
    margin: var(--lumo-space-m);
  }

  :host([theme~='padding']) {
    padding: var(--lumo-space-m);
  }

  :host([theme~='spacing-xs']) {
    --_gap: var(--lumo-space-xs);
  }

  :host([theme~='spacing-s']) {
    --_gap: var(--lumo-space-s);
  }

  :host([theme*='spacing']) {
    gap: var(--_gap);
  }

  :host([theme~='spacing-l']) {
    --_gap: var(--lumo-space-l);
  }

  :host([theme~='spacing-xl']) {
    --_gap: var(--_vaadin-spacing-xl);
  }

  :host([theme~='wrap']) {
    flex-wrap: wrap;
  }
`;

registerStyles('vaadin-horizontal-layout', horizontalLayout, { moduleId: 'lumo-horizontal-layout' });

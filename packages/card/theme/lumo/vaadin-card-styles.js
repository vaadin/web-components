import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import { addGlobalThemeStyles, css, registerStyles } from '@vaadin/vaadin-themable-mixin/register-styles.js';

const cardProps = css`
  html {
    --vaadin-card-background: var(--lumo-shade-5pct);
    --vaadin-card-border-radius: var(--lumo-border-radius-l);
    --vaadin-card-border-width: 0;
    --vaadin-card-border-color: var(--lumo-contrast-20pct);
    --vaadin-card-padding: var(--lumo-space-m);
    --vaadin-card-gap: var(--lumo-space-m);
  }
`;

addGlobalThemeStyles('card-props', cardProps);

const card = css`
  :host {
    background: var(--vaadin-card-background);
    border-radius: var(--vaadin-card-border-radius);
    box-shadow: var(--vaadin-card-box-shadow);
    position: relative;
  }

  /* Could be an inset outline on the host as well, but rounded outlines only work since Safari 16.4 */
  :host::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-radius: inherit;
    border: var(--vaadin-card-border, var(--vaadin-card-border-width) solid var(--vaadin-card-border-color));
  }

  :host([theme~='outlined']) {
    --vaadin-card-border-width: 1px;
    --vaadin-card-background: transparent;
  }

  :host([theme~='elevated']) {
    --vaadin-card-background: var(--lumo-tint-10pct);
    --vaadin-card-box-shadow: var(--lumo-box-shadow-xs);
    /* TODO I would like to update --lumo-box-shadow-xs to this (30pct instead of 50pct): */
    --lumo-box-shadow-xs: 0 1px 4px -1px var(--lumo-shade-30pct);
  }

  :host([theme~='elevated'][theme~='outlined']) {
    box-shadow:
      inset 0 -1px 0 0 var(--lumo-shade-10pct),
      var(--vaadin-card-box-shadow);
  }

  :host(:where([theme~='stretch-media'])) ::slotted([slot='media']:is(img, video, svg, vaadin-icon)) {
    border-radius: var(--lumo-border-radius-m);
  }

  ::slotted([slot='title']) {
    font-size: var(--lumo-font-size-l);
    line-height: var(--lumo-line-height-xs);
    font-weight: 600;
    color: var(--lumo-header-text-color);
  }

  ::slotted([slot='subtitle']) {
    font-size: var(--lumo-font-size-m);
    line-height: var(--lumo-line-height-xs);
    color: var(--lumo-secondary-text-color);
  }
`;

registerStyles('vaadin-card', card, { moduleId: 'lumo-card' });

export { card };

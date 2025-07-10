import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import { addGlobalThemeStyles, css, registerStyles } from '@vaadin/vaadin-themable-mixin/register-styles.js';

const cardProps = css`
  html {
    --vaadin-card-background: var(--lumo-contrast-5pct);
    --vaadin-card-border-radius: var(--lumo-border-radius-l);
    --vaadin-card-border-width: 0;
    --vaadin-card-border-color: var(--lumo-contrast-20pct);
    --vaadin-card-padding: var(--lumo-space-m);
    --vaadin-card-gap: var(--lumo-space-m);
    --vaadin-card-shadow: none;
  }
`;

addGlobalThemeStyles('card-props', cardProps);

const card = css`
  :host {
    background: var(--vaadin-card-background);
    border-radius: var(--vaadin-card-border-radius);
    box-shadow: var(--vaadin-card-shadow);
    position: relative;
  }

  /* Could be an inset outline on the host as well, but rounded outlines only work since Safari 16.4 */
  :host::before {
    content: '';
    position: absolute;
    inset: var(--_card-border-inset, 0);
    border-radius: var(--_card-border-pseudo-radius, inherit);
    border: var(--vaadin-card-border, var(--vaadin-card-border-width) solid var(--vaadin-card-border-color));
    pointer-events: none;
  }

  :host([theme~='outlined']) {
    --vaadin-card-border-width: 1px;
    --vaadin-card-background: var(--lumo-base-color);
  }

  :host([theme~='elevated']) {
    --vaadin-card-background: linear-gradient(var(--lumo-tint-5pct), var(--lumo-tint-5pct)) var(--lumo-base-color);
    --vaadin-card-shadow: var(--lumo-box-shadow-xs);
    --vaadin-card-border-width: 1px;
    --_card-border-inset: calc(-1 * var(--vaadin-card-border-width));
    --_card-border-pseudo-radius: calc(var(--vaadin-card-border-radius) + var(--vaadin-card-border-width));
  }

  :host([theme~='elevated']:not([theme~='outlined'])) {
    --vaadin-card-border-color: var(--lumo-contrast-10pct);
  }

  :host(:where([theme~='stretch-media'])) ::slotted([slot='media']:is(img, video, svg, vaadin-icon)) {
    border-radius: var(--lumo-border-radius-m);
  }

  :host([theme~='elevated'][theme~='cover-media']) ::slotted([slot='media']:is(img, video, svg, vaadin-icon)) {
    margin-top: calc((var(--_padding) + var(--vaadin-card-border-width)) * -1);
    margin-inline: calc((var(--_padding) + var(--vaadin-card-border-width)) * -1);
    width: calc(100% + (var(--_padding) + var(--vaadin-card-border-width)) * 2);
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

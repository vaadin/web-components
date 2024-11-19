import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/shadow.js';
import { addGlobalThemeStyles, css, registerStyles } from '@vaadin/vaadin-themable-mixin/register-styles.js';

const cardProps = css`
  html {
    --vaadin-card-background: var(--material-secondary-background-color);
    --vaadin-card-border-radius: 8px;
    --vaadin-card-border-width: 0;
    --vaadin-card-border-color: var(--material-divider-color);
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
    z-index: 999;
    pointer-events: none;
    border-radius: inherit;
    border: var(--vaadin-card-border, var(--vaadin-card-border-width) solid var(--vaadin-card-border-color));
  }

  :host([theme~='outlined']) {
    --vaadin-card-border-width: 1px;
    --vaadin-card-background: transparent;
  }

  :host([theme~='elevated']) {
    --vaadin-card-background: var(--material-background-color);
    --vaadin-card-box-shadow: var(--material-shadow-elevation-2dp);
  }
`;

registerStyles('vaadin-card', card, { moduleId: 'material-card' });

export { card };

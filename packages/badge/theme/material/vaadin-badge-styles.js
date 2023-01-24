import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { loader } from '@vaadin/vaadin-material-styles/mixins/loader.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const badge = css`
  span {
    padding: 0.4em 0.5em;
    color: var(--material-primary-text-color);
    background-color: var(--material-primary-color-10pct);
    border-radius: var(--material-border-radius-s);
    font-family: var(--material-font-family);
    font-size: var(--material-small-font-size);
    min-width: calc(1em + 0.45em);
  }

  /* Colors */

  :host([theme~='success']) span {
  }

  :host([theme~='error']) span {
  }

  :host([theme~='contrast']) span {
  }

  /* Primary */

  :host([theme~='primary']) span {
    color: var(--material-primary-contrast-color);
    background-color: var(--material-primary-color);
  }

  :host([theme~='success'][theme~='primary']) span {
  }

  :host([theme~='error'][theme~='primary']) span {
  }

  :host([theme~='contrast'][theme~='primary']) span {
  }
`;

registerStyles('vaadin-badge', [badge, loader], { moduleId: 'material-badge' });

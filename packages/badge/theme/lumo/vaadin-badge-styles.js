import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import { loader } from '@vaadin/vaadin-lumo-styles/mixins/loader.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const badge = css`
  span {
    padding: 0.4em calc(0.5em + var(--lumo-border-radius-s) / 4);
    color: var(--lumo-primary-text-color);
    background-color: var(--lumo-primary-color-10pct);
    border-radius: var(--lumo-border-radius-s);
    font-family: var(--lumo-font-family);
    font-size: var(--lumo-font-size-s);
    min-width: calc(var(--lumo-line-height-xs) * 1em + 0.45em);
  }

  :host([theme~='small']) span {
    font-size: var(--lumo-font-size-xxs);
    line-height: 1;
  }

  /* Colors */

  :host([theme~='success']) span {
    color: var(--lumo-success-text-color);
    background-color: var(--lumo-success-color-10pct);
  }

  :host([theme~='error']) span {
    color: var(--lumo-error-text-color);
    background-color: var(--lumo-error-color-10pct);
  }

  :host([theme~='contrast']) span {
    color: var(--lumo-contrast-80pct);
    background-color: var(--lumo-contrast-5pct);
  }

  /* Primary */

  :host([theme~='primary']) span {
    color: var(--lumo-primary-contrast-color);
    background-color: var(--lumo-primary-color);
  }

  :host([theme~='success'][theme~='primary']) span {
    color: var(--lumo-success-contrast-color);
    background-color: var(--lumo-success-color);
  }

  :host([theme~='error'][theme~='primary']) span {
    color: var(--lumo-error-contrast-color);
    background-color: var(--lumo-error-color);
  }

  :host([theme~='contrast'][theme~='primary']) span {
    color: var(--lumo-base-color);
    background-color: var(--lumo-contrast);
  }

  /* Icon */

  iron-icon {
    margin: -0.25em 0;
    --iron-icon-width: 1.5em;
    --iron-icon-height: 1.5em;
  }

  iron-icon:first-child {
    margin-left: -0.375em;
  }

  iron-icon:last-child {
    margin-right: -0.375em;
  }

  [icon] {
    min-width: 0;
    padding: 0;
    font-size: 1rem;
    --iron-icon-width: var(--lumo-icon-size-m);
    --iron-icon-height: var(--lumo-icon-size-m);
  }

  [icon][theme~='small'] {
    --iron-icon-width: var(--lumo-icon-size-s);
    --iron-icon-height: var(--lumo-icon-size-s);
  }

  /* Empty */

  :not([icon]):empty {
    min-width: 0;
    width: 1em;
    height: 1em;
    padding: 0;
    border-radius: 50%;
    background-color: var(--lumo-primary-color);
  }

  :host([theme~='small']) :not([icon]):empty {
    width: 0.75em;
    height: 0.75em;
  }

  :host([theme~='contrast']) :not([icon]):empty {
    background-color: var(--lumo-contrast);
  }

  :host([theme~='success']) :not([icon]):empty {
    background-color: var(--lumo-success-color);
  }

  :host([theme~='error']) :not([icon]):empty {
    background-color: var(--lumo-error-color);
  }

  /* Pill */

  :host([theme~='pill']) {
    --lumo-border-radius-s: 1em;
  }
`;

registerStyles('vaadin-badge', [badge, loader], { moduleId: 'lumo-badge' });

export { badge };

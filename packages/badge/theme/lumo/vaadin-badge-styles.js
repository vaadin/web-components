import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import { loader } from '@vaadin/vaadin-lumo-styles/mixins/loader.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const badge = css`
  :host {
    --_padding: 0.4em;
    padding: 0 var(--_padding);
    color: var(--lumo-primary-text-color);
    background-color: var(--lumo-primary-color-10pct);
    border-radius: var(--lumo-border-radius-s);
    font-family: var(--lumo-font-family);
    font-size: var(--lumo-font-size-s);
    font-weight: 500;
    gap: calc(var(--_padding) - 0.1em);
    min-height: 1.5rem;
    min-width: 1.5rem;
  }

  /* Compensate for gap */
  :host::before {
    margin-inline-start: calc(var(--_padding) * -1 + 0.1em);
  }

  :host([theme~='small']) {
    font-size: var(--lumo-font-size-xxs);
    min-height: 1.25rem;
    min-width: 1.25rem;
  }

  /* Colors */

  :host([theme~='success']) {
    color: var(--lumo-success-text-color);
    background-color: var(--lumo-success-color-10pct);
  }

  :host([theme~='error']) {
    color: var(--lumo-error-text-color);
    background-color: var(--lumo-error-color-10pct);
  }

  :host([theme~='contrast']) {
    color: var(--lumo-contrast-80pct);
    background-color: var(--lumo-contrast-5pct);
  }

  /* Primary */

  :host([theme~='primary']) {
    color: var(--lumo-primary-contrast-color);
    background-color: var(--lumo-primary-color);
  }

  :host([theme~='success'][theme~='primary']) {
    color: var(--lumo-success-contrast-color);
    background-color: var(--lumo-success-color);
  }

  :host([theme~='error'][theme~='primary']) {
    color: var(--lumo-error-contrast-color);
    background-color: var(--lumo-error-color);
  }

  :host([theme~='contrast'][theme~='primary']) {
    color: var(--lumo-base-color);
    background-color: var(--lumo-contrast);
  }

  /* Empty */

  :host(:empty) {
    min-width: 0;
    min-height: 0;
    width: 1rem;
    height: 1rem;
    padding: 0;
    border-radius: 50%;
    background-color: var(--lumo-primary-color);
  }

  :host([theme~='small']:empty) {
    width: 0.75rem;
    height: 0.75rem;
  }

  :host([theme~='contrast']:empty) {
    background-color: var(--lumo-contrast);
  }

  :host([theme~='success']:empty) {
    background-color: var(--lumo-success-color);
  }

  :host([theme~='error']:empty) {
    background-color: var(--lumo-error-color);
  }

  /* Pill */

  :host([theme~='pill']) {
    border-radius: 1em;
    --_padding: 0.6em;
  }

  /* Icon */

  ::slotted(vaadin-icon) {
    margin: 0 calc(var(--_padding) * -1 + 0.2em);
  }

  ::slotted(vaadin-icon:only-child) {
    margin: 0 calc(var(--_padding) * -1);
  }
`;

registerStyles('vaadin-badge', [badge, loader], { moduleId: 'lumo-badge' });

export { badge };

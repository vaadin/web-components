import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-form-item',
  css`
    /* font-weight, margin-bottom, transition and line-height same as for part label in text-field */
    [part='label'] {
      margin-top: var(--lumo-space-m);
      margin-bottom: var(--lumo-space-xs);
      margin-left: calc(var(--lumo-border-radius-m) / 4);
      transition: color 0.4s;
      color: var(--lumo-secondary-text-color);
      font-family: var(--lumo-font-family);
      font-size: var(--lumo-font-size-s);
      font-weight: 500;
      line-height: 1.333;
    }

    [part='required-indicator']::after {
      content: var(--lumo-required-field-indicator, '\\\\\\\\2022');
      position: relative;
      width: 1em;
      transition: opacity 0.2s;
      opacity: 0;
      color: var(--lumo-required-field-indicator-color, var(--lumo-primary-text-color));
      text-align: center;
    }

    :host([required]) [part='required-indicator']::after {
      opacity: 1;
    }

    :host([invalid]) [part='required-indicator']::after {
      color: var(--lumo-required-field-indicator-color, var(--lumo-error-text-color));
    }
  `,
  { moduleId: 'lumo-form-item' },
);

import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import { requiredField } from '@vaadin/vaadin-lumo-styles/mixins/required-field.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const formItem = css`
  :host {
    --vaadin-form-item-row-spacing: 0;
  }

  /* font-weight, margin-bottom, transition and line-height same as for part label in text-field */
  [part='label'] {
    color: var(--lumo-secondary-text-color);
    font-family: var(--lumo-font-family);
    font-size: var(--lumo-font-size-s);
    font-weight: 500;
    margin-top: var(--lumo-space-m);
    margin-left: calc(var(--lumo-border-radius-m) / 4);
    margin-bottom: var(--lumo-space-xs);
    transition: color 0.4s;
    line-height: 1.333;
  }

  [part='required-indicator']::after {
    position: relative;
  }
`;

registerStyles('vaadin-form-item', [requiredField, formItem], { moduleId: 'lumo-form-item' });

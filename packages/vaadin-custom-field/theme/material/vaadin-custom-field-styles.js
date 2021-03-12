import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/typography.js';
import '@vaadin/vaadin-material-styles/mixins/required-field.js';
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

registerStyles(
  'vaadin-custom-field',
  css`
    :host {
      display: inline-flex;
      position: relative;
      margin-bottom: 8px;
      outline: none;
      color: var(--material-body-text-color);
      font-size: var(--material-body-font-size);
      font-family: var(--material-font-family);
      line-height: 48px;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* align with text-field label */
    :host([has-label]) {
      padding-top: 16px;
    }

    /* align with text-field error message */
    [part='error-message']:not(:empty),
    :host([has-helper]) [part='helper-text'] {
      margin-top: -8px;
    }

    :host([disabled]) [part='label'] {
      color: var(--material-disabled-text-color);
      -webkit-text-fill-color: var(--material-disabled-text-color);
    }

    :host([focused]:not([invalid])) [part='label'] {
      color: var(--material-primary-text-color);
    }

    /* According to material theme guidelines, helper text should be hidden when error message is set and input is invalid */
    :host([has-helper][invalid][has-error-message]) [part='helper-text'] {
      display: none;
    }

    :host([has-helper]) [part='helper-text']::before {
      content: '';
      display: block;
      height: 6px;
    }

    [part='helper-text'],
    [part='helper-text'] ::slotted(*) {
      font-size: 0.75em;
      line-height: 1;
      color: var(--material-secondary-text-color);
    }
  `,
  { include: ['material-required-field'], moduleId: 'material-custom-field' }
);

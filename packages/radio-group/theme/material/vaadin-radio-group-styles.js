import '@vaadin/vaadin-material-styles/color.js';
import { helper } from '@vaadin/vaadin-material-styles/mixins/helper.js';
import { requiredField } from '@vaadin/vaadin-material-styles/mixins/required-field.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const radioGroup = css`
  :host {
    display: inline-flex;
    position: relative;
    padding-top: 8px;
    margin-bottom: 8px;
    outline: none;
    color: var(--material-body-text-color);
    font-size: var(--material-body-font-size);
    line-height: 24px;
    font-family: var(--material-font-family);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  :host::before {
    line-height: 32px;
  }

  :host([has-label]) {
    padding-top: 24px;
  }

  :host([theme~='vertical']) [part='group-field'] {
    display: flex;
    flex-direction: column;
  }

  :host([disabled]) [part='label'] {
    color: var(--material-disabled-text-color);
    -webkit-text-fill-color: var(--material-disabled-text-color);
  }

  :host([focused]:not([invalid])) [part='label'] {
    color: var(--material-primary-text-color);
  }
`;

registerStyles('vaadin-radio-group', [requiredField, helper, radioGroup], { moduleId: 'material-radio-group' });

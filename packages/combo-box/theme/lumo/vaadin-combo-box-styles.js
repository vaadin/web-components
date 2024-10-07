import '@vaadin/input-container/theme/lumo/vaadin-input-container-styles.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';
import { inputFieldShared } from '@vaadin/vaadin-lumo-styles/mixins/input-field-shared.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const comboBox = css`
  [part='toggle-button']::before {
    content: var(--lumo-icons-dropdown);
  }
`;

registerStyles('vaadin-combo-box', [inputFieldShared, comboBox], { moduleId: 'lumo-combo-box' });

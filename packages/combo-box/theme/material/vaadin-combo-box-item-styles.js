import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/font-icons.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { item } from '@vaadin/item/theme/material/vaadin-item-styles.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const comboBoxItem = css`
  :host {
    --_material-item-selected-icon-display: block;
    cursor: pointer;
    padding: 4px 10px;
    -webkit-tap-highlight-color: transparent;
  }
`;

registerStyles('vaadin-combo-box-item', [item, comboBoxItem], {
  moduleId: 'material-combo-box-item',
});

export { comboBoxItem };

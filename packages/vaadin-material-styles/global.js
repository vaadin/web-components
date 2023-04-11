import { addGlobalThemeStyles } from '@vaadin/vaadin-themable-mixin/register-styles';

export const addMaterialGlobalStyles = (id, ...styles) => {
  addGlobalThemeStyles(id, 'material-', styles);
};

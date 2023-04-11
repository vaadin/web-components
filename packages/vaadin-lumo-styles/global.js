import { addGlobalThemeStyles } from '@vaadin/vaadin-themable-mixin/register-styles';

export const addLumoGlobalStyles = (id, ...styles) => {
  addGlobalThemeStyles(id, 'lumo-', styles);
};

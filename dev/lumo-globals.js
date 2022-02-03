import { color, typography } from '@vaadin/vaadin-lumo-styles';

const style = document.createElement('style');
style.innerHTML = `${color.toString()} ${typography.toString()}`;
document.head.appendChild(style);

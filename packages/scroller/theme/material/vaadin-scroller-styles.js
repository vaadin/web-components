import '@vaadin/vaadin-material-styles/color.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const scroller = css`
  :host(:focus) {
    outline: none;
    box-shadow: inset 0 0 0 2px var(--material-primary-color);
  }
`;

registerStyles('vaadin-scroller', scroller, { moduleId: 'lumo-scroller' });

export { scroller };

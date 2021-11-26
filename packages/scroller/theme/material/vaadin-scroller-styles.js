import '@vaadin/vaadin-material-styles/color.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const scroller = css`
  :host {
    outline: none;
  }

  :host([focus-ring]) {
    box-shadow: 0 0 0 2px var(--material-primary-color);
  }
`;

registerStyles('vaadin-scroller', scroller, { moduleId: 'material-scroller' });

export { scroller };

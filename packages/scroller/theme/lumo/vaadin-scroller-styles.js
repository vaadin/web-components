import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const scroller = css`
  :host {
    --_focus-ring-color: var(--vaadin-focus-ring-color, var(--lumo-primary-color-50pct));
    --_focus-ring-width: var(--vaadin-focus-ring-width, 2px);
    outline: none;
  }

  :host([focus-ring]) {
    box-shadow: 0 0 0 var(--_focus-ring-width) var(--_focus-ring-color);
  }

  /* Show dividers when content overflows */

  :host([theme~='overflow-indicators'])::before,
  :host([theme~='overflow-indicators'])::after {
    position: sticky;
    z-index: 9999;
    display: none;
    height: 1px;
    margin-bottom: -1px;
    background: var(--lumo-contrast-10pct);
    content: '';
    inset: 0;
  }

  :host([theme~='overflow-indicators'])::after {
    margin-top: -1px;
    margin-bottom: 0;
  }

  :host([theme~='overflow-indicators'][overflow~='top'])::before,
  :host([theme~='overflow-indicators'][overflow~='bottom'])::after {
    display: block;
  }
`;

registerStyles('vaadin-scroller', scroller, { moduleId: 'lumo-scroller' });

export { scroller };

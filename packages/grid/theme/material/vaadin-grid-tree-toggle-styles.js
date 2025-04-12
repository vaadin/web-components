import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/font-icons.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-grid-tree-toggle',
  css`
    :host {
      --_material-grid-tree-toggle-collapsed-icon-transform: rotate(0);
    }

    :host([dir='rtl']) {
      --_material-grid-tree-toggle-collapsed-icon-transform: rotate(180deg);
    }

    [part='toggle'] {
      position: relative;
      align-self: stretch; /* NOTE(platosha): helps to maintain baseline */
      width: calc(var(--material-icon-font-size) + 8px);
    }

    [part='toggle']::before {
      position: absolute; /* NOTE(platosha): helps to maintain baseline */
      width: var(--material-icon-font-size);
      transform: var(--_material-grid-tree-toggle-collapsed-icon-transform);
      transition: transform 0.1s cubic-bezier(0.4, 0, 0.2, 0.1);
      font-family: 'material-icons';
      font-size: var(--material-icon-font-size);
    }

    :host(:not([expanded])) [part='toggle']::before,
    :host([expanded]) [part='toggle']::before {
      content: var(--material-icons-chevron-right);
    }

    :host([expanded]) [part='toggle']::before {
      transform: rotate(90deg);
    }
  `,
  { moduleId: 'material-grid-tree-toggle' },
);

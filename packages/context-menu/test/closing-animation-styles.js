import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

// Emulate the exit animation that themes such as Lumo apply to the context menu
// overlay. The duration is long enough for asynchronous interactions to happen
// while the animation runs.
registerStyles(
  'vaadin-context-menu-overlay',
  css`
    :host([closing]) {
      animation: 5s context-menu-dummy-animation;
    }

    @keyframes context-menu-dummy-animation {
      to {
        opacity: 0.99;
      }
    }
  `,
);

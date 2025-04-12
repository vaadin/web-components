import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { loader } from '@vaadin/vaadin-material-styles/mixins/loader.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const tabsheet = css`
  :host {
    font-family: var(--material-font-family);
  }

  :host([theme~='bordered']) {
    border: 1px solid var(--material-divider-color);
    border-radius: 4px;
  }

  [part='tabs-container'] {
    padding: 4px 8px;
    box-shadow: inset 0 -1px 0 0 var(--material-divider-color);
    gap: 8px;
  }

  ::slotted([slot='tabs']) {
    margin: -4px -8px;
  }

  [part='content'] {
    padding: 24px;
    border-bottom-right-radius: inherit;
    border-bottom-left-radius: inherit;
  }

  :host([loading]) [part='content'] {
    overflow: visible;
  }

  [part='loader'] {
    position: absolute;
    z-index: 1;
    top: 0;
    right: 0;
    left: 0;
    transform: translate(0, -100%);
  }
`;

registerStyles('vaadin-tabsheet', [tabsheet, loader], { moduleId: 'material-tabsheet' });

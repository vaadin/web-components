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
    box-shadow: inset 0 -1px 0 0 var(--material-divider-color);
    gap: 8px;
    padding: 4px 8px;
  }

  ::slotted([slot='tabs']) {
    margin: -4px -8px;
  }

  [part='content'] {
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;
    padding: 24px;
  }

  :host([loading]) [part='content'] {
    overflow: visible;
  }

  [part='loader'] {
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    transform: translate(0, -100%);
    z-index: 1;
  }
`;

registerStyles('vaadin-tabsheet', [tabsheet, loader], { moduleId: 'material-tabsheet' });

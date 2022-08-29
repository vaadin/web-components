import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { loader } from '@vaadin/vaadin-material-styles/mixins/loader.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const tabsheet = css`
  /* Needed to align the tabs nicely on the baseline */
  ::slotted([slot='tabs'])::before {
    content: '\\2003';
    width: 0;
    display: inline-block;
  }

  [part='tabs-container'] {
    border-bottom: 1px solid var(--material-divider-color);
    font-family: var(--material-font-family);
  }

  [part='content'] {
    font-family: var(--material-font-family);
    padding: 8px 24px 24px;
  }

  :host([loading]) [part='content'] {
    overflow: visible;
  }

  [part~='loader'] {
    position: absolute;
    z-index: 1;
    top: -3px;
    left: 0;
    right: 0;
  }
`;

registerStyles('vaadin-tabsheet', [tabsheet, loader], { moduleId: 'material-tabsheet' });

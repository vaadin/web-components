import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import { loader } from '@vaadin/vaadin-lumo-styles/mixins/loader.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const tabsheet = css`
  ::slotted([slot='tabs']) {
    box-shadow: initial;
  }

  /* Needed to align the tabs nicely on the baseline */
  ::slotted([slot='tabs'])::before {
    content: '\\2003';
    width: 0;
    display: inline-block;
  }

  [part='tabs-container'] {
    box-shadow: inset 0 -1px 0 0 var(--lumo-contrast-10pct);
    font-family: var(--lumo-font-family);
  }

  [part='content'] {
    padding: var(--lumo-space-xs) var(--lumo-space-m) var(--lumo-space-s);
    font-size: var(--lumo-font-size-m);
    line-height: var(--lumo-line-height-m);
    font-family: var(--lumo-font-family);
  }

  :host([theme~='content-borders']) [part='content'] {
    border: 1px solid var(--lumo-contrast-10pct);
    border-top: none;
  }

  :host([loading]) [part='loader'] {
    margin-left: calc(var(--lumo-icon-size-s) / -2);
    margin-top: calc(var(--lumo-icon-size-s) / -2);
    left: 50%;
    top: 50%;
    position: absolute;
  }
`;

registerStyles('vaadin-tabsheet', [tabsheet, loader], { moduleId: 'lumo-tabsheet' });

export { tabsheet };

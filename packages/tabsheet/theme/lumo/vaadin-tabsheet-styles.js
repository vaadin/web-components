import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
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
    padding: var(--lumo-space-xs) var(--lumo-space-m) 0;
    box-shadow: inset 0 -1px 0 0 var(--lumo-contrast-10pct);
  }

  [part='content'] {
    padding: var(--lumo-space-xs) var(--lumo-space-m) var(--lumo-space-s);
    font-size: var(--lumo-font-size-m);
    line-height: var(--lumo-line-height-m);
  }

  :host([theme~='content-borders']) {
    border: 1px solid var(--lumo-contrast-20pct);
  }
`;

registerStyles('vaadin-tabsheet', tabsheet, { moduleId: 'lumo-tabsheet' });

export { tabsheet };

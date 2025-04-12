import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import { loader } from '@vaadin/vaadin-lumo-styles/mixins/loader.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const tabsheet = css`
  :host {
    font-family: var(--lumo-font-family);
    font-size: var(--lumo-font-size-m);
    line-height: var(--lumo-line-height-m);
  }

  :host([theme~='bordered']) {
    border: 1px solid var(--lumo-contrast-20pct);
    border-radius: var(--lumo-border-radius-l);
  }

  [part='tabs-container'] {
    padding: var(--lumo-space-xs) var(--lumo-space-s);
    box-shadow: inset 0 -1px 0 0 var(--lumo-contrast-10pct);
    gap: var(--lumo-space-s);
  }

  ::slotted([slot='tabs']) {
    margin: calc(var(--lumo-space-xs) * -1) calc(var(--lumo-space-s) * -1);
    box-shadow: initial;
  }

  [part='content'] {
    padding: var(--lumo-space-s) var(--lumo-space-m);
    border-bottom-right-radius: inherit;
    border-bottom-left-radius: inherit;
  }

  :host([loading]) [part='content'] {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :host([theme~='no-padding']) [part='content'] {
    padding: 0;
  }
`;

registerStyles('vaadin-tabsheet', [tabsheet, loader], { moduleId: 'lumo-tabsheet' });

export { tabsheet };

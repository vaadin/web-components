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
    box-shadow: inset 0 -1px 0 0 var(--lumo-contrast-10pct);
    gap: var(--lumo-space-s);
    padding: var(--lumo-space-xs) var(--lumo-space-s);
  }

  ::slotted([slot='tabs']) {
    box-shadow: initial;
    margin: calc(var(--lumo-space-xs) * -1) calc(var(--lumo-space-s) * -1);
  }

  [part='content'] {
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;
    padding: var(--lumo-space-s) var(--lumo-space-m);
  }

  :host([loading]) [part='content'] {
    align-items: center;
    display: flex;
    justify-content: center;
  }

  :host([theme~='no-padding']) [part='content'] {
    padding: 0;
  }
`;

registerStyles('vaadin-tabsheet', [tabsheet, loader], { moduleId: 'lumo-tabsheet' });

export { tabsheet };

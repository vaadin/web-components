import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const gridProEditor = css`
  :host([theme~='grid-pro-editor']) {
    --lumo-text-field-size: 27px;
    /* outline similar to what grid uses */
    box-shadow: inset 0 0 0 var(--_focus-ring-width) var(--_focus-ring-color);
    font-size: inherit;
    inset: 0;
    padding: 0;
    position: absolute;
    will-change: transform;
  }

  :host([theme~='grid-pro-editor']) [part='input-field'] {
    --vaadin-input-field-border-color: transparent;
    border-radius: 0;
    flex-grow: 1;
    font-weight: 400;
    padding: 0;
  }

  /* reset outline inherited from text-field */
  :host([theme~='grid-pro-editor'][focus-ring]) [part='input-field'] {
    box-shadow: none;
  }

  :host([theme~='grid-pro-editor']) ::slotted(input) {
    font-size: inherit;
    padding: 0 var(--lumo-space-m);
  }
`;

registerStyles('', gridProEditor, { moduleId: 'lumo-grid-pro-editor' });

export { gridProEditor };

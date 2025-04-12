import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const gridProEditor = css`
  :host([theme~='grid-pro-editor']) {
    --lumo-text-field-size: 27px;
    position: absolute;
    padding: 0;
    /* outline similar to what grid uses */
    box-shadow: inset 0 0 0 var(--_focus-ring-width) var(--_focus-ring-color);
    font-size: inherit;
    inset: 0;
    will-change: transform;
  }

  :host([theme~='grid-pro-editor']) [part='input-field'] {
    --vaadin-input-field-border-color: transparent;
    flex-grow: 1;
    padding: 0;
    border-radius: 0;
    font-weight: 400;
  }

  /* reset outline inherited from text-field */
  :host([theme~='grid-pro-editor'][focus-ring]) [part='input-field'] {
    box-shadow: none;
  }

  :host([theme~='grid-pro-editor']) ::slotted(input) {
    padding: 0 var(--lumo-space-m);
    font-size: inherit;
  }
`;

registerStyles('', gridProEditor, { moduleId: 'lumo-grid-pro-editor' });

export { gridProEditor };

import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const gridProEditor = css`
  :host([theme~='grid-pro-editor']) {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0;
    will-change: transform;
    font-size: inherit;
    --lumo-text-field-size: 27px;
    /* outline similar to what grid uses */
    box-shadow: inset 0 0 0 2px var(--lumo-primary-color-50pct);
  }

  :host([theme~='grid-pro-editor']) [part='input-field'] {
    padding: 0;
    border-radius: 0;
    flex-grow: 1;
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

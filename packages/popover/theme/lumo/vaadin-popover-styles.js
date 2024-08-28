import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import { overlay } from '@vaadin/vaadin-lumo-styles/mixins/overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const popoverOverlay = css`
  :host {
    --vaadin-popover-offset-top: var(--_vaadin-popover-default-offset);
    --vaadin-popover-offset-bottom: var(--_vaadin-popover-default-offset);
    --vaadin-popover-offset-start: var(--_vaadin-popover-default-offset);
    --vaadin-popover-offset-end: var(--_vaadin-popover-default-offset);
    --vaadin-popover-arrow-size: 0.5rem;
    --_vaadin-popover-default-offset: var(--lumo-space-xs);
  }

  [part='overlay'] {
    outline: none;
  }

  [part='content'] {
    padding: var(--lumo-space-xs) var(--lumo-space-s);
  }

  :host([theme~='no-padding']) [part='content'] {
    padding: 0;
  }

  :host([theme~='arrow']) {
    --_vaadin-popover-default-offset: calc(var(--lumo-space-s) + var(--vaadin-popover-arrow-size) / 2);
  }

  /* top / bottom position */
  :host([theme~='arrow'][position^='top']) [part='arrow'],
  :host([theme~='arrow'][position^='bottom']) [part='arrow'] {
    border-left: var(--vaadin-popover-arrow-size) solid transparent;
    border-right: var(--vaadin-popover-arrow-size) solid transparent;
  }

  :host([theme~='arrow'][position^='bottom'][bottom-aligned]) [part='arrow'],
  :host([theme~='arrow'][position^='top'][bottom-aligned]) [part='arrow'] {
    bottom: calc(var(--vaadin-popover-arrow-size) * -1);
    border-top: var(--vaadin-popover-arrow-size) solid var(--lumo-base-color);
    filter: drop-shadow(0 2px 1px var(--lumo-shade-10pct));
  }

  :host([theme~='arrow'][position^='bottom'][top-aligned]) [part='arrow'],
  :host([theme~='arrow'][position^='top'][top-aligned]) [part='arrow'] {
    top: calc(var(--vaadin-popover-arrow-size) * -1);
    border-bottom: var(--vaadin-popover-arrow-size) solid var(--lumo-base-color);
    filter: drop-shadow(0 -2px 1px var(--lumo-shade-10pct));
  }

  :host([theme~='arrow'][position^='bottom'][start-aligned]) [part='arrow'],
  :host([theme~='arrow'][position^='top'][start-aligned]) [part='arrow'] {
    transform: translateX(-50%);
    inset-inline-start: 1.5rem;
  }

  :host([theme~='arrow'][position^='bottom'][end-aligned]) [part='arrow'],
  :host([theme~='arrow'][position^='top'][end-aligned]) [part='arrow'] {
    transform: translateX(50%);
    inset-inline-end: 1.5rem;
  }

  :host([theme~='arrow'][position^='bottom'][arrow-centered]) [part='arrow'],
  :host([theme~='arrow'][position^='top'][arrow-centered]) [part='arrow'] {
    transform: translateX(-50%);
    inset-inline-start: 50%;
  }

  /* start / end position */
  :host([theme~='arrow'][position^='start']) [part='arrow'],
  :host([theme~='arrow'][position^='end']) [part='arrow'] {
    border-top: var(--vaadin-popover-arrow-size) solid transparent;
    border-bottom: var(--vaadin-popover-arrow-size) solid transparent;
  }

  :host([theme~='arrow'][position^='start'][start-aligned]) [part='arrow'],
  :host([theme~='arrow'][position^='end'][start-aligned]) [part='arrow'] {
    inset-inline-start: calc(var(--vaadin-popover-arrow-size) * -1);
    border-right: var(--vaadin-popover-arrow-size) solid var(--lumo-base-color);
    filter: drop-shadow(-2px 0 1px var(--lumo-shade-10pct));
  }

  :host([theme~='arrow'][position^='start'][end-aligned]) [part='arrow'],
  :host([theme~='arrow'][position^='end'][end-aligned]) [part='arrow'] {
    inset-inline-end: calc(var(--vaadin-popover-arrow-size) * -1);
    border-left: var(--vaadin-popover-arrow-size) solid var(--lumo-base-color);
    filter: drop-shadow(2px 0 1px var(--lumo-shade-10pct));
  }

  :host([theme~='arrow'][position^='start'][top-aligned]) [part='arrow'],
  :host([theme~='arrow'][position^='end'][top-aligned]) [part='arrow'] {
    top: 0.5rem;
  }

  :host([theme~='arrow'][position='start'][top-aligned]) [part='arrow'],
  :host([theme~='arrow'][position='end'][top-aligned]) [part='arrow'] {
    top: 50%;
    transform: translateY(-50%);
  }

  :host([theme~='arrow'][position^='start'][bottom-aligned]) [part='arrow'],
  :host([theme~='arrow'][position^='end'][bottom-aligned]) [part='arrow'] {
    bottom: 0.5rem;
  }
`;

registerStyles('vaadin-popover-overlay', [overlay, popoverOverlay], { moduleId: 'lumo-popover-overlay' });

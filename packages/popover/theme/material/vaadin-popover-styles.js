import '@vaadin/vaadin-material-styles/color.js';
import { overlay } from '@vaadin/vaadin-material-styles/mixins/overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const popoverOverlay = css`
  :host {
    --vaadin-popover-offset-top: var(--_vaadin-popover-default-offset);
    --vaadin-popover-offset-bottom: var(--_vaadin-popover-default-offset);
    --vaadin-popover-offset-start: var(--_vaadin-popover-default-offset);
    --vaadin-popover-offset-end: var(--_vaadin-popover-default-offset);
    --vaadin-popover-arrow-size: 0.5rem;
    --_vaadin-popover-default-offset: 0.25rem;
  }

  [part='overlay'] {
    outline: none;
  }

  [part='content'] {
    padding: 0.25rem 0.5rem;
  }

  :host([theme~='no-padding']) [part='content'] {
    padding: 0;
  }

  :host([theme~='arrow']) {
    --_vaadin-popover-default-offset: calc(0.25rem + var(--vaadin-popover-arrow-size) / 1.25);
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
    border-top: var(--vaadin-popover-arrow-size) solid var(--material-background-color);
    filter: drop-shadow(0 2px 1px rgba(0, 0, 0, 0.14));
  }

  :host([theme~='arrow'][position^='bottom'][top-aligned]) [part='arrow'],
  :host([theme~='arrow'][position^='top'][top-aligned]) [part='arrow'] {
    top: calc(var(--vaadin-popover-arrow-size) * -1);
    border-bottom: var(--vaadin-popover-arrow-size) solid var(--material-background-color);
    filter: drop-shadow(0 -2px 1px rgba(0, 0, 0, 0.14));
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
    border-right: var(--vaadin-popover-arrow-size) solid var(--material-background-color);
    filter: drop-shadow(-2px 0 1px rgba(0, 0, 0, 0.14));
  }

  :host([theme~='arrow'][position^='start'][end-aligned]) [part='arrow'],
  :host([theme~='arrow'][position^='end'][end-aligned]) [part='arrow'] {
    inset-inline-end: calc(var(--vaadin-popover-arrow-size) * -1);
    border-left: var(--vaadin-popover-arrow-size) solid var(--material-background-color);
    filter: drop-shadow(2px 0 1px rgba(0, 0, 0, 0.14));
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

registerStyles('vaadin-popover-overlay', [overlay, popoverOverlay], { moduleId: 'material-popover-overlay' });

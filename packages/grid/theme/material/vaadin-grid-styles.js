import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-grid',
  css`
    :host {
      background-color: var(--material-background-color);
      color: var(--material-body-text-color);
      font-family: var(--material-font-family);
      font-size: var(--material-small-font-size);
      line-height: 20px;
    }

    :host([disabled]) {
      opacity: 0.7;
    }

    [part~='cell'] {
      --_cell-padding: var(--vaadin-grid-cell-padding, var(--_cell-default-padding));
      --_cell-default-padding: 8px 16px;
      min-height: 48px;
      -webkit-tap-highlight-color: transparent;
    }

    [part~='cell'] ::slotted(vaadin-grid-cell-content) {
      padding: var(--_cell-padding);
    }

    [part~='details-cell'] {
      --_cell-default-padding: 14px 16px;
    }

    [part~='header-cell'],
    [part~='footer-cell'] {
      background-color: var(--vaadin-grid-cell-background, var(--material-background-color));
      color: var(--material-secondary-text-color);
      font-size: var(--material-caption-font-size);
      font-weight: 500;
    }

    /* Header and footer divider between body rows */

    [part~='body-cell'],
    [part~='details-cell'],
    [part~='row']:last-child > [part~='header-cell'] {
      border-bottom: 1px solid var(--material-divider-color);
    }

    [part~='row']:first-child > [part~='footer-cell'] {
      border-top: 1px solid var(--material-divider-color);
    }

    /* Body rows/cells */

    [part~='body-cell'] {
      background-color: var(--vaadin-grid-cell-background, var(--material-background-color));
    }

    [part~='row']:hover > [part~='body-cell'] {
      background: var(
        --vaadin-grid-cell-background,
        linear-gradient(
            var(--_material-grid-row-hover-background-color, rgba(0, 0, 0, 0.04)),
            var(--_material-grid-row-hover-background-color, rgba(0, 0, 0, 0.04))
          )
          var(--material-background-color)
      );
    }

    @media (hover: none) {
      [part~='row']:hover > [part~='body-cell'] {
        background: var(--material-background-color);
      }
    }

    /* Selected row */

    [part~='body-cell']::before {
      background-color: var(--material-primary-color);
      content: '';
      inset: 0;
      opacity: 0;
      pointer-events: none;
      position: absolute;
      transition: opacity 0.1s cubic-bezier(0.4, 0, 0.2, 0.1);
    }

    :host(:not([reordering])) [part~='row'][selected] > [part~='body-cell']::before {
      opacity: var(--_material-grid-row-selected-overlay-opacity, 0.08);
    }

    [part~='body-cell'] ::slotted(vaadin-grid-cell-content) {
      /* NOTE(platosha): Raise cell content above background cell pseudo elements */
      position: relative;
    }

    /* Column reordering */

    :host([reordering]) [part~='cell'] {
      background: var(--material-secondary-background-color);
    }

    :host([reordering]) [part~='cell'][reorder-status='allowed'] {
      background: var(--material-background-color);
    }

    :host([reordering]) [part~='cell'][reorder-status='dragging'] {
      background: var(--material-background-color);
    }

    /* Frozen columns */

    [part~='cell'][last-frozen] {
      border-right: 1px solid var(--material-divider-color);
    }

    [part~='cell'][first-frozen-to-end] {
      border-left: 1px solid var(--material-divider-color);
    }

    /* Column resizing */

    [part~='cell']:not([last-frozen]) [part='resize-handle'] {
      border-right: 1px solid var(--material-divider-color);
    }

    /* Keyboard navigation */

    [part~='row'] {
      position: relative;
    }

    [part~='row']:focus,
    [part~='focused-cell']:focus {
      outline: none;
    }

    :host([navigating]) [part~='row']:focus::before,
    :host([navigating]) [part~='focused-cell']:focus {
      box-shadow: inset 0 0 0 2px var(--material-primary-color);
    }

    :host([navigating]) [part~='row']:focus::before {
      content: '';
      inset: 0;
      pointer-events: none;
      position: absolute;
      transform: translateX(calc(-1 * var(--_grid-horizontal-scroll-position)));
      z-index: 3;
    }

    /* Empty state */
    [part~='empty-state'] {
      color: var(--material-secondary-text-color);
      padding: 16px;
    }

    /* Drag and Drop styles */
    :host([dragover])::after {
      box-shadow: inset 0 0 0 2px var(--material-primary-color);
      content: '';
      inset: 0;
      pointer-events: none;
      position: absolute;
      z-index: 100;
    }

    [part~='row'][dragover] {
      z-index: 100 !important;
    }

    [part~='row'][dragover] [part~='cell'] {
      overflow: visible;
    }

    [part~='row'][dragover] [part~='cell']::after {
      background: var(--material-primary-color);
      content: '';
      height: 3px;
      inset: 0;
      pointer-events: none;
      position: absolute;
    }

    [part~='row'][dragover='below'] [part~='cell']::after {
      bottom: auto;
      margin-top: -1px;
      top: 100%;
    }

    :host([all-rows-visible]) [part~='last-row'][dragover='below'] [part~='cell']::after {
      height: 1px;
    }

    [part~='row'][dragover='above'] [part~='cell']::after {
      bottom: 100%;
      margin-bottom: -1px;
      top: auto;
    }

    [part~='row'][details-opened][dragover='below'] [part~='cell']:not([part~='details-cell'])::after,
    [part~='row'][details-opened][dragover='above'] [part~='details-cell']::after {
      display: none;
    }

    [part~='row'][dragover][dragover='on-top'] [part~='cell']::after {
      height: 100%;
      opacity: 0.5;
    }

    [part~='row'][dragstart] {
      opacity: 0.9;
      z-index: 100 !important;
    }

    [part~='row'][dragstart] [part~='cell'] {
      border: none !important;
      box-shadow: none !important;
    }

    #scroller [part~='row'][dragstart]:not([dragstart=''])::after {
      align-items: center;
      background-color: var(--material-error-color);
      border-radius: 2px;
      box-sizing: border-box;
      color: var(--material-primary-contrast-color);
      content: attr(dragstart);
      display: block;
      font-size: var(--material-caption-font-size);
      justify-content: center;
      left: var(--_grid-drag-start-x);
      line-height: 1;
      min-width: 24px;
      padding: 4px;
      position: absolute;
      text-align: center;
      top: var(--_grid-drag-start-y);
      z-index: 100;
    }

    /* RTL specific styles */

    :host([dir='rtl']) [part~='cell'][last-frozen] {
      border-left: 1px solid var(--material-divider-color);
      border-right: none;
    }

    :host([dir='rtl']) [part~='cell'][first-frozen-to-end] {
      border-left: none;
      border-right: 1px solid var(--material-divider-color);
    }

    :host([dir='rtl']) [part~='cell']:not([last-frozen]) [part='resize-handle'] {
      border-left: 1px solid var(--material-divider-color);
      border-right: none;
    }

    :host([dir='rtl']) #scroller [part~='row'][dragstart]:not([dragstart=''])::after {
      left: auto;
      right: var(--_grid-drag-start-x);
    }
  `,
  { moduleId: 'material-grid' },
);

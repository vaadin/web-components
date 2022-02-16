import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-grid',
  css`
    :host {
      background-color: var(--material-background-color);
      font-family: var(--material-font-family);
      font-size: var(--material-small-font-size);
      line-height: 20px;
      color: var(--material-body-text-color);
    }

    :host([disabled]) {
      opacity: 0.7;
    }

    [part~='cell'] {
      min-height: 48px;
      -webkit-tap-highlight-color: transparent;
    }

    [part~='cell'] ::slotted(vaadin-grid-cell-content) {
      padding: 8px 16px;
    }

    [part~='details-cell'] ::slotted(vaadin-grid-cell-content) {
      padding: 14px 16px;
    }

    [part~='header-cell'],
    [part~='footer-cell'] {
      background-color: var(--material-background-color);
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
      background-color: var(--material-background-color);
    }

    [part~='row']:hover > [part~='body-cell'] {
      background: linear-gradient(
          var(--_material-grid-row-hover-background-color, rgba(0, 0, 0, 0.04)),
          var(--_material-grid-row-hover-background-color, rgba(0, 0, 0, 0.04))
        )
        var(--material-background-color);
    }

    @media (hover: none) {
      [part~='row']:hover > [part~='body-cell'] {
        background: var(--material-background-color);
      }
    }

    /* Selected row */

    [part~='body-cell']::before {
      content: '';
      pointer-events: none;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: var(--material-primary-color);
      opacity: 0;
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

    /* Column resizing */

    [part~='cell']:not([last-frozen]) [part='resize-handle'] {
      border-right: 1px solid var(--material-divider-color);
    }

    /* Keyboard navigation */

    [part~='row'] {
      position: relative;
    }

    [part~='row']:focus,
    [part~='cell']:focus {
      outline: none;
    }

    :host([navigating]) [part~='row']:focus::before,
    :host([navigating]) [part~='cell']:focus {
      box-shadow: inset 0 0 0 2px var(--material-primary-color);
    }

    :host([navigating]) [part~='row']:focus::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      pointer-events: none;
      transform: translateX(calc(-1 * var(--_grid-horizontal-scroll-position)));
      z-index: 3;
    }

    /* Drag and Drop styles */
    :host([dragover])::after {
      content: '';
      position: absolute;
      z-index: 100;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      pointer-events: none;
      box-shadow: inset 0 0 0 2px var(--material-primary-color);
    }

    [part~='row'][dragover] {
      z-index: 100 !important;
    }

    [part~='row'][dragover] [part~='cell'] {
      overflow: visible;
    }

    [part~='row'][dragover] [part~='cell']::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      height: 3px;
      pointer-events: none;
      background: var(--material-primary-color);
    }

    [part~='row'][dragover='below'] [part~='cell']::after {
      top: 100%;
      bottom: auto;
      margin-top: -1px;
    }

    :host([all-rows-visible]) [part~='row'][last][dragover='below'] [part~='cell']::after {
      height: 1px;
    }

    [part~='row'][dragover='above'] [part~='cell']::after {
      top: auto;
      bottom: 100%;
      margin-bottom: -1px;
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
      z-index: 100 !important;
      opacity: 0.9;
    }

    [part~='row'][dragstart] [part~='cell'] {
      border: none !important;
      box-shadow: none !important;
    }

    [ios] [part~='row'][dragstart] [part~='cell'] {
      background: var(--material-primary-color);
    }

    #scroller:not([ios]) [part~='row'][dragstart]:not([dragstart=''])::after {
      display: block;
      position: absolute;
      left: var(--_grid-drag-start-x);
      top: var(--_grid-drag-start-y);
      z-index: 100;
      content: attr(dragstart);
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      padding: 4px;
      color: var(--material-primary-contrast-color);
      background-color: var(--material-error-color);
      min-width: 24px;
      border-radius: 2px;
      font-size: var(--material-caption-font-size);
      text-align: center;
      line-height: 1;
    }

    /* RTL specific styles */

    :host([dir='rtl']) [part~='cell'][last-frozen] {
      border-right: none;
      border-left: 1px solid var(--material-divider-color);
    }

    :host([dir='rtl']) [part~='cell']:not([last-frozen]) [part='resize-handle'] {
      border-right: none;
      border-left: 1px solid var(--material-divider-color);
    }

    :host([dir='rtl']) #scroller:not([ios]) [part~='row'][dragstart]:not([dragstart=''])::after {
      left: auto;
      right: var(--_grid-drag-start-x);
    }
  `,
  { moduleId: 'material-grid' }
);

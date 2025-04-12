import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import '@vaadin/button/theme/lumo/vaadin-button-styles.js';
import './vaadin-date-picker-year-styles.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-date-picker-overlay-content',
  css`
    :host {
      /* Background for the year scroller, placed here as we are using a mask image on the actual years part */
      background-image: linear-gradient(var(--lumo-shade-5pct), var(--lumo-shade-5pct));
      background-position: top right;
      background-repeat: no-repeat;
      background-size: 57px 100%;
      cursor: default;
      position: relative;
    }

    ::slotted([slot='months']) {
      /* Month calendar height:
      header height + margin-bottom
    + weekdays height + margin-bottom
    + date cell heights
    + small margin between month calendars
*/
      /* prettier-ignore */
      --vaadin-infinite-scroller-item-height:
          calc(
              var(--lumo-font-size-l) + var(--lumo-space-m)
            + var(--lumo-font-size-xs) + var(--lumo-space-s)
            + var(--lumo-size-m) * 6
            + var(--lumo-space-s)
          );
      --vaadin-infinite-scroller-buffer-offset: 10%;
      margin-right: 57px;
      -webkit-mask-image: linear-gradient(transparent, #000 10%, #000 85%, transparent);
      mask-image: linear-gradient(transparent, #000 10%, #000 85%, transparent);
      position: relative;
    }

    ::slotted([slot='years']) {
      /* TODO get rid of fixed magic number */
      --vaadin-infinite-scroller-buffer-width: 97px;
      bottom: 0;
      box-shadow: inset 2px 0 4px 0 var(--lumo-shade-5pct);
      cursor: var(--lumo-clickable-cursor);
      font-size: var(--lumo-font-size-s);
      height: auto;
      -webkit-mask-image: linear-gradient(transparent, #000 35%, #000 65%, transparent);
      mask-image: linear-gradient(transparent, #000 35%, #000 65%, transparent);
      top: 0;
      width: 57px;
    }

    ::slotted([slot='years']:hover) {
      --_lumo-date-picker-year-opacity: 1;
    }

    /* TODO unsupported selector */
    #scrollers {
      display: block;
      position: static;
    }

    /* TODO fix this in vaadin-date-picker that it adapts to the width of the year scroller */
    :host([desktop]) ::slotted([slot='months']) {
      right: auto;
    }

    /* Year scroller position indicator */
    ::slotted([slot='years'])::before {
      background-color: var(--lumo-base-color);
      background-image: linear-gradient(var(--lumo-tint-5pct), var(--lumo-tint-5pct));
      border: none;
      border-top-right-radius: var(--lumo-border-radius-s);
      box-shadow: 2px -2px 6px 0 var(--lumo-shade-5pct);
      height: 1em;
      transform: translate(-75%, -50%) rotate(45deg);
      width: 1em;
      z-index: 1;
    }

    [part='toolbar'] {
      border-bottom-left-radius: var(--lumo-border-radius-l);
      margin-right: 57px;
      padding: var(--lumo-space-s);
    }

    [part='toolbar'] ::slotted(vaadin-button) {
      margin: 0;
    }

    /* Narrow viewport mode (fullscreen) */

    :host([fullscreen]) [part='toolbar'] {
      background-color: var(--lumo-base-color);
      order: -1;
    }

    :host([fullscreen]) [part='overlay-header'] {
      height: var(--lumo-size-m);
      justify-content: center;
      left: 0;
      order: -2;
      padding: var(--lumo-space-s);
      position: absolute;
      right: 0;
    }

    :host([fullscreen]) [part='toggle-button'],
    :host([fullscreen]) [part='clear-button'],
    [part='overlay-header'] [part='label'] {
      display: none;
    }

    /* Very narrow screen (year scroller initially hidden) */

    [part='years-toggle-button'] {
      align-items: center;
      border-radius: var(--lumo-border-radius-m);
      color: var(--lumo-primary-text-color);
      display: flex;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      font-weight: 500;
      height: var(--lumo-size-s);
      padding: 0 0.5em;
      z-index: 3;
    }

    :host([years-visible]) [part='years-toggle-button'] {
      background-color: var(--lumo-primary-color);
      color: var(--lumo-primary-contrast-color);
    }

    /* TODO magic number (same as used for media-query in vaadin-date-picker-overlay-content) */
    @media screen and (max-width: 374px) {
      :host {
        background-image: none;
      }

      [part='toolbar'],
      ::slotted([slot='months']) {
        margin-right: 0;
      }

      /* TODO make date-picker adapt to the width of the years part */
      ::slotted([slot='years']) {
        --vaadin-infinite-scroller-buffer-width: 90px;
        background-color: var(--lumo-shade-5pct);
        width: 50px;
      }

      :host([years-visible]) ::slotted([slot='months']) {
        padding-left: 50px;
      }
    }
  `,
  { moduleId: 'lumo-date-picker-overlay-content' },
);

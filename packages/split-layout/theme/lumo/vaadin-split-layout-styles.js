import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-split-layout',
  css`
    [part='splitter'] {
      min-width: var(--lumo-space-s);
      min-height: var(--lumo-space-s);
      background-color: var(--lumo-contrast-5pct);
      transition: 0.1s background-color;
    }

    [part='handle'] {
      display: flex;
      width: var(--lumo-size-m);
      height: var(--lumo-size-m);
      align-items: center;
      justify-content: center;
    }

    [part='handle']::after {
      --_handle-size: 4px;
      display: block;
      width: var(--_handle-size);
      max-width: 100%;
      height: 100%;
      max-height: 100%;
      border-radius: var(--lumo-border-radius-s);
      background-color: var(--lumo-contrast-30pct);
      content: '';
      transition:
        0.1s opacity,
        0.1s background-color;
    }

    :host([orientation='vertical']) [part='handle']::after {
      width: 100%;
      height: var(--_handle-size);
    }

    /* Hover style */
    @media (any-hover: hover) {
      [part='splitter']:hover [part='handle']::after {
        background-color: var(--lumo-contrast-40pct);
      }
    }

    /* Active style */
    [part='splitter']:active [part='handle']::after {
      background-color: var(--lumo-contrast-50pct);
    }

    /* Small/minimal */
    :host([theme~='small']) > [part='splitter'] {
      border-top: 1px solid var(--lumo-contrast-10pct);
      border-left: 1px solid var(--lumo-contrast-10pct);
    }

    :host(:is([theme~='small'], [theme~='minimal'])) > [part='splitter'] {
      min-width: 0;
      min-height: 0;
      background-color: transparent;
    }

    :host(:is([theme~='small'], [theme~='minimal'])) > [part='splitter']::after {
      position: absolute;
      content: '';
      inset: -4px;
    }

    :host(:is([theme~='small'], [theme~='minimal'])) > [part='splitter'] > [part='handle'] {
      top: calc(50% - 0.5px);
      left: calc(50% - 0.5px);
    }

    :host(:is([theme~='small'], [theme~='minimal'])) > [part='splitter'] > [part='handle']::after {
      --_handle-size: 5px;
      opacity: 0;
    }

    :host(:is([theme~='small'], [theme~='minimal'])) > [part='splitter']:hover > [part='handle']::after,
    :host(:is([theme~='small'], [theme~='minimal'])) > [part='splitter']:active > [part='handle']::after {
      opacity: 1;
    }
  `,
  { moduleId: 'lumo-split-layout' },
);

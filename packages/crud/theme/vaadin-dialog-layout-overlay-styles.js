import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/*
  DISCLAIMER: These are the styles of an internal implementation of a web
  component, hence its API and implementation details might change without
  any advise in future releases.
*/
registerStyles(
  'vaadin-dialog-overlay',
  css`
    :host([theme~='layout']) [part='overlay'],
    :host([theme~='layout']) [part='content'] {
      display: flex;
      flex-direction: column;
      padding: 0;
      max-height: 100vh;
    }

    :host([theme~='layout']) [part='overlay'] {
      max-width: 54em;
      min-width: 20em;
    }

    @media (max-width: 600px), (max-height: 600px) {
      :host([theme~='layout']) {
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 0;
      }

      :host([theme~='layout']) [part='overlay'] {
        height: 100vh;
        width: 100vw;
        border-radius: 0 !important;
      }

      :host([theme~='layout']) [part='content'] {
        flex: 1;
      }
    }
  `,
  { moduleId: 'vaadin-dialog-layout-overlay' }
);

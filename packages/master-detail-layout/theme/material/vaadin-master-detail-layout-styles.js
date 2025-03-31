import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/style.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-master-detail-layout',
  css`
    :host(:is([overlay], [stack])) [part='detail'] {
      background-color: var(--material-background-color);
    }

    :host([overlay]) [part='detail'] {
      box-shadow: var(--material-shadow-elevation-4dp);
    }

    :host([overlay][orientation='horizontal']) [part='detail'] {
      border-inline-start: 1px solid var(--material-divider-color);
    }

    :host([overlay][orientation='vertical']) [part='detail'] {
      border-block-start: 1px solid var(--material-divider-color);
    }

    :host([overlay]) [part='backdrop'] {
      background-color: var(--material-secondary-background-color);
      opacity: 0.5;
    }
  `,
  { moduleId: 'material-master-detail-layout' },
);

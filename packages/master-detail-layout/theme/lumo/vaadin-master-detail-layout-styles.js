import '@vaadin/vaadin-lumo-styles/color.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-master-detail-layout',
  css`
    :host(:is([overlay], [stack])) [part='detail'] {
      background-color: var(--lumo-base-color);
    }

    :host([overlay]) [part='detail'] {
      box-shadow: var(--lumo-box-shadow-s);
    }

    :host([overlay][orientation='horizontal']) [part='detail'] {
      border-inline-start: 1px solid var(--lumo-contrast-10pct);
    }

    :host([overlay][orientation='vertical']) [part='detail'] {
      border-block-start: 1px solid var(--lumo-contrast-10pct);
    }

    :host([overlay]) [part='backdrop'] {
      background-color: var(--lumo-shade-20pct);
    }
  `,
  { moduleId: 'lumo-master-detail-layout' },
);

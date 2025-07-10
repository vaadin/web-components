import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/shadow.js';
import '@vaadin/vaadin-material-styles/style.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-master-detail-layout',
  css`
    :host(:is([drawer], [stack])) [part='detail'] {
      background-color: var(--material-background-color);
      box-shadow:
        0 0 0 1px var(--material-divider-color),
        var(--material-shadow-elevation-4dp);
    }

    :host([orientation='horizontal']:not([drawer], [stack])) [part='detail'] {
      border-inline-start: 1px solid var(--material-divider-color);
    }

    :host([orientation='vertical']:not([drawer], [stack])) [part='detail'] {
      border-top: 1px solid var(--material-divider-color);
    }

    [part='backdrop'] {
      background-color: var(--material-secondary-background-color);
      opacity: 0.5;
    }
  `,
  { moduleId: 'material-master-detail-layout' },
);

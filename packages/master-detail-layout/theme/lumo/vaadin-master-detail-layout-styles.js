import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-master-detail-layout',
  css`
    :host(:is([drawer], [stack])) [part='detail'] {
      background-color: var(--lumo-base-color);
      box-shadow:
        0 0 0 1px var(--lumo-shade-5pct),
        var(--lumo-box-shadow-m);
    }

    [part='detail'] {
      border-color: var(--lumo-contrast-10pct);
    }

    [part='backdrop'] {
      background-color: var(--lumo-shade-20pct);
    }
  `,
  { moduleId: 'lumo-master-detail-layout' },
);

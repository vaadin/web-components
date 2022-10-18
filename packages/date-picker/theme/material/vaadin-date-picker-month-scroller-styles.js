import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-date-picker-month-scroller',
  css`
    :host {
      --vaadin-infinite-scroller-item-height: 328px;
      text-align: center;
    }
  `,
  { moduleId: 'material-date-picker-month-scroller' },
);

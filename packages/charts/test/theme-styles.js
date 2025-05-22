import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-chart',
  css`
    :host([theme='custom']) .highcharts-column-series rect.highcharts-point {
      stroke: rgb(255, 0, 0);
    }
  `,
);

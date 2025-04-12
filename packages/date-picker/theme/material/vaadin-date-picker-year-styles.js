import '@vaadin/vaadin-material-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-date-picker-year',
  css`
    [part='year-number'] {
      font-size: var(--material-small-font-size);
      line-height: 10px; /* NOTE(platosha): chosen to align years to months */
    }

    [part='year-separator'] {
      align-items: center;
      display: flex;
      height: calc(100% - 10px);
      justify-content: center;
    }

    [part='year-separator']::before {
      background-color: currentColor;
      border-radius: 50%;
      content: '';
      height: 4px;
      width: 4px;
    }
  `,
  { moduleId: 'material-date-picker-year' },
);

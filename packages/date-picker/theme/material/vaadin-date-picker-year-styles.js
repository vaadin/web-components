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
      display: flex;
      align-items: center;
      justify-content: center;
      height: calc(100% - 10px);
    }

    [part='year-separator']::before {
      content: '';
      background-color: currentColor;
      width: 4px;
      height: 4px;
      border-radius: 50%;
    }
  `,
  { moduleId: 'material-date-picker-year' },
);

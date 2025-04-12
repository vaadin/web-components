import '@vaadin/vaadin-lumo-styles/color.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-date-picker-year',
  css`
    :host([current]) [part='year-number'] {
      color: var(--lumo-primary-text-color);
    }

    :host(:not([current])) [part='year-number'],
    [part='year-separator'] {
      transition: 0.2s opacity;
      opacity: var(--_lumo-date-picker-year-opacity, 0.7);
    }

    [part='year-number'],
    [part='year-separator'] {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 50%;
      transform: translateY(-50%);
    }

    [part='year-separator']::after {
      content: '\\\\\\\\2022';
      color: var(--lumo-disabled-text-color);
    }
  `,
  { moduleId: 'lumo-date-picker-year' },
);

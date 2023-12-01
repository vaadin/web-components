import { css } from 'lit';
import { registerStyles } from '@vaadin/vaadin-themable-mixin/register-styles';

registerStyles(
  'vaadin-positioned-overlay',
  css`
    @keyframes slidein {
      0% {
        transform: translateY(10px);
      }
    }

    :host(.animated) [part='overlay'] {
      animation: slidein 0.2s;
    }
  `,
);

import './post-finalize-styles.common.ts';
import { css, LitElement } from 'lit';

customElements.define(
  'test-element',
  class extends LitElement {
    static get styles() {
      return css`
        :host {
          display: block;
        }
      `;
    }

    render() {
      return '';
    }
  },
);

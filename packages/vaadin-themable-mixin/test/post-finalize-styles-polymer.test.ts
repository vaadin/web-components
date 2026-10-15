import './post-finalize-styles.common.ts';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

customElements.define(
  'test-element',
  class extends PolymerElement {
    static get template() {
      return html`
        <style>
          :host {
            display: block;
          }
        </style>
      `;
    }
  },
);

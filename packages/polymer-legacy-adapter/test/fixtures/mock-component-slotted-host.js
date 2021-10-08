import { PolymerElement, html } from '@polymer/polymer';

import './mock-component.js';

export class MockComponentSlottedHost extends PolymerElement {
  static get template() {
    return html`
      <mock-component id="component">
        <slot name="template">
          <template>fallback</template>
        </slot>
      </mock-component>
    `;
  }
}

customElements.define('mock-component-slotted-host', MockComponentSlottedHost);

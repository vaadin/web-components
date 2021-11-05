import './mock-component.js';
import { html, PolymerElement } from '@polymer/polymer';

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

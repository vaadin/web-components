import './mock-component.js';
import { html, PolymerElement } from '@polymer/polymer';

export class MockComponentHost extends PolymerElement {
  static get template() {
    return html`
      <mock-component id="component">
        <template>
          [[value]]
          <input value="{{value::input}}" />
          <button on-click="onClick"></button>
        </template>
      </mock-component>
    `;
  }

  static get properties() {
    return {
      value: String,
    };
  }

  onClick() {}
}

customElements.define('mock-component-host', MockComponentHost);

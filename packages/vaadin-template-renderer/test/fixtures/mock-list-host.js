import { PolymerElement, html } from '@polymer/polymer';

import './mock-list.js';

export class MockListHost extends PolymerElement {
  static get template() {
    return html`
      <mock-list id="list" items="[[items]]">
        <template>
          <div class="item-text">[[item]]</div>

          <div class="value-text">[[value]]</div>

          <input value="{{value::input}}" />

          <button on-click="onClick"></button>
        </template>
      </mock-list>
    `;
  }

  static get properties() {
    return {
      value: String,

      items: {
        type: Array,
        value() {
          return ['item1', 'item2'];
        }
      }
    };
  }

  onClick() {}
}

customElements.define('mock-list-host', MockListHost);

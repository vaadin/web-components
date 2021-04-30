import { PolymerElement, html } from '@polymer/polymer';

import './x-list.js';

export class XListHost extends PolymerElement {
  static get template() {
    return html`
      <x-list id="list" items="[[items]]">
        <template>
          <div class="item-text">[[item]]</div>

          <div class="value-text">[[value]]</div>

          <input value="{{value::input}}" />

          <button on-click="onClick"></button>
        </template>
      </x-list>
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

customElements.define('x-list-host', XListHost);

import './mock-list.js';
import { html, PolymerElement } from '@polymer/polymer';

export class MockListHost extends PolymerElement {
  static get template() {
    return html`
      <mock-list id="list" items="[[items]]">
        <template>
          <div class="title">[[item.title]]</div>

          <div class="value">[[value]]</div>
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
          return [{ title: 'title0' }, { title: 'title1' }];
        },
      },
    };
  }

  onClick() {}
}

customElements.define('mock-list-host', MockListHost);

import { PolymerElement, html } from '@polymer/polymer';

import './x-component.js';

export class XPolymerHost extends PolymerElement {
  static get template() {
    return html`
      <x-component id="component">
        <template>
          [[value]]
          <input value="{{value::input}}" />
          <button on-click="onClick"></button>
        </template>
      </x-component>
    `;
  }

  static get properties() {
    return {
      value: String
    };
  }

  onClick() {}
}

customElements.define('x-polymer-host', XPolymerHost);

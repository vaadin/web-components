import { PolymerElement, html } from '@polymer/polymer';

import '@vaadin/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-column';

export class MockGridHost extends PolymerElement {
  static get template() {
    return html`
      <vaadin-grid id="grid" items="[[items]]">
        <vaadin-grid-column>
          <template class="header">header</template>
          <template class="footer">footer</template>
          <template class="content">[[item]]</template>
        </vaadin-grid-column>

        <!-- <vaadin-grid-column>
          <template>
            <div>[[value]]</div>

            <input value="{{value::input}}" />

            <button on-click="onClick"></button>
          </template>
        </vaadin-grid-column> -->

        <vaadin-grid-column>
          <slot name="header-template"></slot>
          <slot name="footer-template"></slot>
          <slot name="content-template"></slot>
        </vaadin-grid-column>
      </vaadin-grid>
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

customElements.define('mock-grid-host', MockGridHost);

import '@vaadin/grid-pro';
import '@vaadin/grid-pro/vaadin-grid-pro-edit-column';
import { html, PolymerElement } from '@polymer/polymer';

export class MockGridProHost extends PolymerElement {
  static get template() {
    return html`
      <vaadin-grid-pro id="grid" items="[[items]]">
        <vaadin-grid-pro-edit-column path="title">
          <template class="body">[[item.title]]</template>
          <template class="editor">
            <input value="{{item.title::input}}" />
          </template>
        </vaadin-grid-pro-edit-column>
      </vaadin-grid-pro>
    `;
  }

  static get properties() {
    return {
      items: {
        type: Array,
        value() {
          return [{ title: 'item0' }, { title: 'item1' }];
        },
      },
    };
  }

  onClick() {}
}

customElements.define('mock-grid-pro-host', MockGridProHost);

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
          <template class="body">[[item.title]]</template>
        </vaadin-grid-column>

        <vaadin-grid-column>
          <template>
            <div class="parent-property">[[parentProperty]]</div>
            <input class="parent-property" value="{{parentProperty::input}}" />

            <div class="item-title">[[item.title]]</div>
            <input class="item-title" value="{{item.title::input}}" />

            <vaadin-checkbox class="selected" checked="{{selected}}" />
            <vaadin-checkbox class="expanded" checked="{{expanded}}" />
            <vaadin-checkbox class="details-opened" checked="{{detailsOpened}}" />
          </template>
        </vaadin-grid-column>

        <vaadin-grid-column>
          <template>
            <div class="parent-property">[[parentProperty]]</div>

            <div class="item-title">[[item.title]]</div>

            <vaadin-checkbox class="selected" checked="{{selected}}" />
            <vaadin-checkbox class="expanded" checked="{{expanded}}" />
            <vaadin-checkbox class="details-opened" checked="{{detailsOpened}}" />
          </template>
        </vaadin-grid-column>
      </vaadin-grid>
    `;
  }

  static get properties() {
    return {
      parentProperty: String,

      items: {
        type: Array,
        value() {
          return [{ title: 'item1' }, { title: 'item2' }];
        }
      }
    };
  }

  onClick() {}
}

customElements.define('mock-grid-host', MockGridHost);

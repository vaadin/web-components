import '@vaadin/grid';
import '@vaadin/checkbox';
import '@vaadin/grid/vaadin-grid-column';
import '@vaadin/grid/vaadin-grid-tree-column';
import { html, PolymerElement } from '@polymer/polymer';

export class MockGridHost extends PolymerElement {
  static get template() {
    return html`
      <vaadin-grid id="grid" items="[[items]]">
        <vaadin-grid-column>
          <template>
            <input class="parent-property" value="{{parentProperty::input}}" />
            <input class="title" value="{{item.title::input}}" />
            <vaadin-checkbox class="selected" checked="{{selected}}"></vaadin-checkbox>
            <vaadin-checkbox class="expanded" checked="{{expanded}}"></vaadin-checkbox>
            <vaadin-checkbox class="details-opened" checked="{{detailsOpened}}"></vaadin-checkbox>
          </template>
        </vaadin-grid-column>

        <vaadin-grid-column>
          <template>
            <div class="index">[[index]]</div>
            <div class="parent-property">[[parentProperty]]</div>
            <div class="title">[[item.title]]</div>
            <div class="selected">[[selected]]</div>
            <div class="expanded">[[expanded]]</div>
            <div class="details-opened">[[detailsOpened]]</div>
          </template>
        </vaadin-grid-column>

        <vaadin-grid-tree-column></vaadin-grid-tree-column>

        <template class="row-details">
          <div class="index">[[index]]</div>
          <input class="title" value="{{item.title::input}}" />
          <vaadin-checkbox class="selected" checked="{{selected}}"></vaadin-checkbox>
          <vaadin-checkbox class="expanded" checked="{{expanded}}"></vaadin-checkbox>
          <vaadin-checkbox class="details-opened" checked="{{detailsOpened}}"></vaadin-checkbox>
        </template>
      </vaadin-grid>
    `;
  }

  static get properties() {
    return {
      parentProperty: {
        type: String,
        value() {
          return 'parentValue';
        },
      },

      items: {
        type: Array,
        value() {
          return [{ title: 'item0' }, { title: 'item1' }];
        },
      },
    };
  }
}

customElements.define('mock-grid-host', MockGridHost);

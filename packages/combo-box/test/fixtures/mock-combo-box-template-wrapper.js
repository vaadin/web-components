import '../../vaadin-combo-box.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

class MockComboBoxTemplateWrapper extends PolymerElement {
  static get template() {
    return html`
      <vaadin-combo-box id="comboBox" items="[[items]]">
        <template>
          <div>index: [[index]]</div>
          <div>item: [[item]]</div>
          <div>selected: [[selected]]</div>
          <div>focused: [[focused]]</div>
          <div>parentProperty: [[parentProperty]]</div>
          <div>parentProperty.foo: [[parentProperty.foo]]</div>
          <div>parentMethod: [[parentMethod()]]</div>
          <button on-click="parentEventHandler"></button>
        </template>
      </vaadin-combo-box>
    `;
  }

  static get properties() {
    return {
      items: Array,
    };
  }

  parentMethod() {
    return 'quux';
  }

  parentEventHandler() {
    // Do nothing
  }
}

customElements.define('mock-combo-box-template-wrapper', MockComboBoxTemplateWrapper);

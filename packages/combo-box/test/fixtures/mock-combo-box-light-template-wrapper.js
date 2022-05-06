import '../../vaadin-combo-box-light.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

class MockComboBoxLightTemplateWrapper extends PolymerElement {
  static get template() {
    return html`
      <vaadin-combo-box-light id="comboBox" items="[[items]]">
        <vaadin-text-field></vaadin-text-field>

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
      </vaadin-combo-box-light>
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

customElements.define('mock-combo-box-light-template-wrapper', MockComboBoxLightTemplateWrapper);

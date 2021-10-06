import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '../../vaadin-combo-box-light.js';

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
      items: Array
    };
  }

  parentMethod() {
    return 'quux';
  }

  parentEventHandler() {
    // do nothing
  }
}

customElements.define('mock-combo-box-light-template-wrapper', MockComboBoxLightTemplateWrapper);

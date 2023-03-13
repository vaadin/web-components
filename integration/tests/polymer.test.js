import { expect } from '@esm-bundle/chai';
import '@vaadin/multi-select-combo-box';
import '@vaadin/combo-box';
import { html } from '@polymer/polymer';
import { templatize } from '@polymer/polymer/lib/utils/templatize.js';

it('should not throw when templatized', () => {
  // Use Templatizer to create a new instances
  const TemplateClass = templatize(html`<div>
    <vaadin-combo-box></vaadin-combo-box>
    <vaadin-multi-select-combo-box></vaadin-multi-select-combo-box>
  </div>`);

  const instance = new TemplateClass();
  const wrapper = instance.root.querySelector('div');
  // Add the new instances to the document body
  expect(() => document.body.appendChild(wrapper)).not.to.throw();

  // Clean up
  wrapper.remove();
});

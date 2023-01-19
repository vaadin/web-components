import { expect } from '@esm-bundle/chai';
import './not-animated-styles.js';
import '../vaadin-combo-box.js';
import { html } from '@polymer/polymer';
import { templatize } from '@polymer/polymer/lib/utils/templatize.js';

it('should not throw when templatized', () => {
  // Use Templatizer to create a new combo-box instance
  const TemplateClass = templatize(html`<vaadin-combo-box></vaadin-combo-box>`);
  const instance = new TemplateClass();
  const comboBox = instance.root.querySelector('vaadin-combo-box');
  // Add the new combo-box instance to the document body
  expect(() => document.body.appendChild(comboBox)).not.to.throw();

  // Clean up
  comboBox.remove();
});

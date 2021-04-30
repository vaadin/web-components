import { PolymerElement } from '@polymer/polymer';
import { templatize } from '@polymer/polymer/lib/utils/templatize';

export class Templatizer extends PolymerElement {
  static create(template) {
    const templatizer = new Templatizer();
    templatizer.__template = template;
    return templatizer;
  }

  static get is() {
    return 'vaadin-template-renderer-templatizer';
  }

  constructor() {
    super();

    this.__template = null;
    this.__TemplateClass = null;
    this.__templateInstances = new Set();
  }

  render(element, properties) {
    // If the template instance exists and has been instantiated by this templatizer,
    // it only re-renders the instance with the new properties.
    if (this.__templateInstances.has(element.__templateInstance)) {
      element.__templateInstance.setProperties(properties);
      return;
    }

    // Otherwise, it instantiates a new template instance
    // with the given properties and then renders the result to the element
    const templateInstance = this.__createTemplateInstance(properties);
    element.innerHTML = '';
    element.__templateInstance = templateInstance;
    element.appendChild(templateInstance.root);
  }

  __createTemplateInstance(properties) {
    this.__createTemplateClass();

    const instance = new this.__TemplateClass(properties);
    this.__templateInstances.add(instance);
    return instance;
  }

  __createTemplateClass() {
    if (this.__TemplateClass) return;

    this.__TemplateClass = templatize(this.__template, this, {
      // When changing a property of the data host component, this callback forwards
      // the changed property to the template instances so that cause their re-rendering.
      forwardHostProp(prop, value) {
        this.__templateInstances.forEach((instance) => {
          instance.forwardHostProp(prop, value);
        });
      }
    });
  }
}

customElements.define(Templatizer.is, Templatizer);

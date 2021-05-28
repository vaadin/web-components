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

  render(element, properties = {}) {
    // If the template instance exists and has been instantiated by this templatizer,
    // it only re-renders the instance with the new properties.
    if (this.__templateInstances.has(element.__templateInstance)) {
      this.__updateProperties(element.__templateInstance, properties);
      return;
    }

    // Otherwise, it instantiates a new template instance
    // with the given properties and then renders the result to the element
    const templateInstance = this.__createTemplateInstance(properties);
    element.innerHTML = '';
    element.__templateInstance = templateInstance;
    element.appendChild(templateInstance.root);
  }

  __updateProperties(instance, properties) {
    // The Polymer uses `===` to check whether a property is changed and should be re-rendered.
    // This means, object properties won't be re-rendered when mutated inside.
    // This workaround forces the `item` property to re-render even
    // the new item is stricly equal to the old item.
    if (instance.item === properties.item) {
      instance._setPendingProperty('item');
    }

    instance.setProperties(properties);
  }

  __createTemplateInstance(properties) {
    this.__createTemplateClass(properties);

    const instance = new this.__TemplateClass(properties);
    this.__templateInstances.add(instance);
    return instance;
  }

  __createTemplateClass(properties) {
    if (this.__TemplateClass) return;

    const instanceProps = Object.keys(properties).reduce((accum, key) => {
      return { ...accum, [key]: true };
    }, {});

    this.__TemplateClass = templatize(this.__template, this, {
      // This property prevents the template instance properties
      // from passing into the `forwardHostProp` callback
      instanceProps,

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

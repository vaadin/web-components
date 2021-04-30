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

  static get properties() {
    return {
      __template: Object,
      __TemplateClass: Object,
      __templateInstance: Object
    };
  }

  /**
   * @public
   */
  render(element) {
    // TODO: Support creating multiple instances of the template
    if (!this.__templateInstance) {
      this.__createTemplateInstance();

      element.__templateInstance = this.__templateInstance;
      element.replaceChildren(this.__templateInstance.root);
    }
  }

  /**
   * @private
   */
  __createTemplateInstance() {
    this.__createTemplateClass();

    this.__templateInstance = new this.__TemplateClass();
  }

  /**
   * @private
   */
  __createTemplateClass() {
    if (this.__TemplateClass) {
      return;
    }

    this.__TemplateClass = templatize(this.__template, this, {
      forwardHostProp(prop, value) {
        if (this.__templateInstance) {
          this.__templateInstance.forwardHostProp(prop, value);
        }
      }
    });
  }
}

customElements.define(Templatizer.is, Templatizer);

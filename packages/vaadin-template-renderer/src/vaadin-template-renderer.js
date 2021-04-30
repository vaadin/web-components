import './vaadin-template-renderer-templatizer.js';
import { Templatizer } from './vaadin-template-renderer-templatizer.js';

function createRenderer(template) {
  const templatizer = Templatizer.create(template);

  return (root, _owner, model) => {
    template.__templatizer = templatizer;
    template.__templatizer.render(root, model);
  };
}

function processTemplate(component, template) {
  component.renderer = createRenderer(template);
}

function processTemplates(component) {
  [...component.children]
    .filter((child) => {
      return child instanceof HTMLTemplateElement;
    })
    .forEach((template) => {
      // Ignore templates which have been processed earlier
      if (template.__templatizer) {
        return;
      }

      processTemplate(component, template);
    });
}

const observer = new MutationObserver((mutations) => {
  mutations.forEach(({ target }) => {
    processTemplates(target);
  });
});

window.Vaadin = window.Vaadin || {};
window.Vaadin.templateRendererCallback = (component) => {
  processTemplates(component);

  // The observer stops observing automatically as the component node is removed
  observer.observe(component, { childList: true });
};

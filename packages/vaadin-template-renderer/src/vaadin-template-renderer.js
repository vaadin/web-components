import './vaadin-template-renderer-templatizer.js';
import { Templatizer } from './vaadin-template-renderer-templatizer.js';

function createRenderer(template) {
  const templatizer = Templatizer.create(template);

  return (root) => {
    template.__templatizer = templatizer;
    template.__templatizer.render(root);
  };
}

function processTemplate(component, template) {
  component.renderer = createRenderer(template);
}

function processTemplates(component, children) {
  [...children]
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
  mutations.forEach(({ target, addedNodes }) => {
    processTemplates(target, addedNodes);
  });
});

window.Vaadin = window.Vaadin || {};
window.Vaadin.templateRendererCallback = (component) => {
  processTemplates(component, component.children);

  // The observer stops observing automatically as the component node is removed
  observer.observe(component, { childList: true });
};

import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';

import './vaadin-template-renderer-templatizer.js';

import { Templatizer } from './vaadin-template-renderer-templatizer.js';

function createRenderer(component, template) {
  const templatizer = Templatizer.create(component, template);

  const renderer = (root, _owner, model) => {
    templatizer.render(root, model);
  };

  template.__templatizer = templatizer;
  renderer.__templatizer = templatizer;

  return renderer;
}

function processTemplate(component, template) {
  const renderer = createRenderer(component, template);

  if (template.matches('.header')) {
    component.headerRenderer = renderer;
    return;
  }

  if (template.matches('.footer')) {
    component.footerRenderer = renderer;
    return;
  }

  if (template.matches('.row-details')) {
    component.rowDetailsRenderer = renderer;
    return;
  }

  component.renderer = renderer;
}

function processTemplates(component) {
  FlattenedNodesObserver.getFlattenedNodes(component)
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

function observeTemplates(component) {
  if (component.__templateObserver) return;

  component.__templateObserver = new FlattenedNodesObserver(component, () => {
    processTemplates(component);
  });
}

window.Vaadin = window.Vaadin || {};
window.Vaadin.templateRendererCallback = (component) => {
  processTemplates(component);
  observeTemplates(component);
};

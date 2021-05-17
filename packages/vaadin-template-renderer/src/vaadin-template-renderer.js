import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';

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

import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';

import './vaadin-template-renderer-templatizer.js';
import './vaadin-template-renderer-grid-templatizer.js';

import { Templatizer } from './vaadin-template-renderer-templatizer.js';
import { GridTemplatizer } from './vaadin-template-renderer-grid-templatizer.js';

function createRenderer(component, template, TemplatizerClass = Templatizer) {
  const templatizer = TemplatizerClass.create(component, template);

  const renderer = (root, _owner, model) => {
    templatizer.render(root, model);
  };

  template.__templatizer = templatizer;
  renderer.__templatized = true;

  return renderer;
}

function assignRenderer(component, rendererName, renderer) {
  const oldRenderer = component[rendererName];

  if (oldRenderer && !oldRenderer.__templatized) {
    const tag = component.localName;

    throw new Error(`Cannot use both a template and a renderer for <${tag} />.`);
  }

  component[rendererName] = renderer;
}

function processGridTemplate(grid, template) {
  if (template.matches('.row-details')) {
    const renderer = createRenderer(grid, template, GridTemplatizer);
    assignRenderer(grid, 'rowDetailsRenderer', renderer);
    return;
  }
}

function processGridColumnTemplate(column, template) {
  if (template.matches('.header')) {
    const renderer = createRenderer(column, template);
    assignRenderer(column, 'headerRenderer', renderer);
    return;
  }

  if (template.matches('.footer')) {
    const renderer = createRenderer(column, template);
    assignRenderer(column, 'footerRenderer', renderer);
    return;
  }

  if (template.matches('.editor')) {
    const renderer = createRenderer(column, template, GridTemplatizer);
    assignRenderer(column, 'editModeRenderer', renderer);
    return;
  }

  const renderer = createRenderer(column, template, GridTemplatizer);
  assignRenderer(column, 'renderer', renderer);
}

function processTemplate(component, template) {
  if (component.__gridElement) {
    processGridTemplate(component, template);
    return;
  }

  if (component.__gridColumnElement) {
    processGridColumnTemplate(component, template);
    return;
  }

  const renderer = createRenderer(component, template);
  assignRenderer(component, 'renderer', renderer);
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

import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import './fixtures/mock-component.js';
import { html, render } from 'lit';
import { mockRenderer } from './fixtures/mock-renderer.js';

describe('lit-renderer', () => {
  let container, component;

  beforeEach(() => {
    container = fixtureSync('<div></div>');
  });

  describe('no dependencies', () => {
    function renderComponent(content) {
      render(html`<mock-component ${mockRenderer(() => html`${content}`)}></mock-component>`, container);
    }

    beforeEach(() => {
      renderComponent('content');
      component = container.querySelector('mock-component');
    });

    it('should render the content with the renderer', () => {
      expect(component.$.content.textContent).to.equal('content');
    });

    it('should not re-render the content', () => {
      renderComponent('new content');
      expect(component.$.content.textContent).to.equal('content');
    });
  });

  describe('single dependency', () => {
    function renderComponent(content, dependency) {
      render(html`<mock-component ${mockRenderer(() => html`${content}`, dependency)}></mock-component>`, container);
    }

    beforeEach(() => {
      renderComponent('content', 'dep');
      component = container.querySelector('mock-component');
    });

    it('should render the content with the renderer', () => {
      expect(component.$.content.textContent).to.equal('content');
    });

    it('should re-render the content if the dependency has changed', () => {
      renderComponent('new content', 'new dep');
      expect(component.$.content.textContent).to.equal('new content');
    });

    it('should not re-render the content if the dependency has not changed', () => {
      renderComponent('new content', 'dep');
      expect(component.$.content.textContent).to.equal('content');
    });
  });

  describe('multiple dependencies', () => {
    function renderComponent(content, dependencies) {
      render(html`<mock-component ${mockRenderer(() => html`${content}`, dependencies)}></mock-component>`, container);
    }

    beforeEach(() => {
      renderComponent('content', ['dep']);
      component = container.querySelector('mock-component');
    });

    it('should render the content with the renderer', () => {
      expect(component.$.content.textContent).to.equal('content');
    });

    it('should not re-render the content if no dependencies have changed', () => {
      renderComponent('new content', ['dep']);
      expect(component.$.content.textContent).to.equal('content');
    });

    it('should re-render the content if a dependency has changed', () => {
      renderComponent('new content', ['new dep']);
      expect(component.$.content.textContent).to.equal('new content');
    });

    it('should re-render the content when adding a dependency', () => {
      renderComponent('new content', ['dep', 'dep 2']);
      expect(component.$.content.textContent).to.equal('new content');
    });

    it('should re-render the content when removing a dependency', () => {
      renderComponent('new content', []);
      expect(component.$.content.textContent).to.equal('new content');
    });
  });

  describe('conditional', () => {
    function renderComponent(content, condition) {
      render(
        html`<mock-component ${condition ? mockRenderer(() => html`${content}`, content) : null}></mock-component>`,
        container,
      );
    }

    it('should add the renderer when the directive is attached', () => {
      renderComponent('content', true);
      component = container.querySelector('mock-component');
      expect(component.renderer).to.exist;
    });

    it('should remove the renderer when the directive is detached', () => {
      renderComponent('content', true);
      renderComponent('content', false);
      component = container.querySelector('mock-component');
      expect(component.renderer).not.to.exist;
    });
  });
});

import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './fixtures/mock-component.js';
import { html, LitElement, render } from 'lit';
import { mockRenderer } from './fixtures/mock-renderer.js';

describe('lit-renderer', () => {
  let component;

  describe('basic', () => {
    let container;

    function renderComponent(content) {
      render(html`<mock-component ${mockRenderer(() => html`${content}`)}></mock-component>`, container);
    }

    beforeEach(() => {
      container = fixtureSync('<div></div>');
      renderComponent('content');
      component = container.querySelector('mock-component');
    });

    it('should render the content with the renderer', () => {
      expect(component.$.content.textContent).to.equal('content');
    });

    it('should not re-render the content when no dependencies are specified', () => {
      renderComponent('new content');
      expect(component.$.content.textContent).to.equal('content');
    });
  });

  describe('single dependency', () => {
    let container;

    function renderComponent(content, dependency) {
      render(html`<mock-component ${mockRenderer(() => html`${content}`, dependency)}></mock-component>`, container);
    }

    beforeEach(() => {
      container = fixtureSync('<div></div>');
      renderComponent('content', 'dep');
      component = container.querySelector('mock-component');
    });

    it('should render the content with the renderer', () => {
      expect(component.$.content.textContent).to.equal('content');
    });

    it('should re-render the content when the dependency has changed', () => {
      renderComponent('new content', 'new dep');
      expect(component.$.content.textContent).to.equal('new content');
    });

    it('should not re-render the content when the dependency has not changed', () => {
      renderComponent('new content', 'dep');
      expect(component.$.content.textContent).to.equal('content');
    });
  });

  describe('multiple dependencies', () => {
    let container;

    function renderComponent(content, dependencies) {
      render(html`<mock-component ${mockRenderer(() => html`${content}`, dependencies)}></mock-component>`, container);
    }

    beforeEach(() => {
      container = fixtureSync('<div></div>');
      renderComponent('content', ['dep']);
      component = container.querySelector('mock-component');
    });

    it('should render the content with the renderer', () => {
      expect(component.$.content.textContent).to.equal('content');
    });

    it('should not re-render the content when no dependencies have changed', () => {
      renderComponent('new content', ['dep']);
      expect(component.$.content.textContent).to.equal('content');
    });

    it('should re-render the content when a dependency has changed', () => {
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
    let container;

    function renderComponent(content, condition) {
      render(
        html`<mock-component ${condition ? mockRenderer(() => html`${content}`, content) : null}></mock-component>`,
        container,
      );
    }

    beforeEach(() => {
      container = fixtureSync('<div></div>');
      renderComponent('content', true);
      component = container.querySelector('mock-component');
    });

    it('should add the renderer when the directive is attached', () => {
      expect(component.renderer).to.exist;
    });

    it('should remove the renderer when the directive is detached', () => {
      renderComponent('content', false);
      expect(component.renderer).not.to.exist;
    });
  });

  describe('events', () => {
    let hostComponent;

    class HostComponent extends LitElement {
      render() {
        return html`<mock-component
          ${mockRenderer(() => html`<button @click=${this.onButtonClick}>Button</button>`)}
        ></mock-component>`;
      }

      onButtonClick(event) {
        const customEvent = new CustomEvent('button-click', {
          detail: {
            target: event.target,
          },
        });
        this.dispatchEvent(customEvent);
      }
    }

    customElements.define('host-component', HostComponent);

    beforeEach(async () => {
      hostComponent = fixtureSync('<host-component></host-component>');
      await hostComponent.updateComplete;
      component = hostComponent.shadowRoot.querySelector('mock-component');
    });

    it('should allow using host methods as event listeners', () => {
      const spy = sinon.spy();
      hostComponent.addEventListener('button-click', spy);

      const button = component.$.content.querySelector('button');
      button.click();

      expect(spy.calledOnce).to.be.true;
      expect(spy.firstCall.firstArg).to.be.instanceOf(CustomEvent);
      expect(spy.firstCall.firstArg.detail.target).to.equal(button);
    });
  });
});

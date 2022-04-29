import { directive } from 'lit/directive.js';
import { LitRendererDirective } from '../../src/lit-renderer.js';

class MockRendererDirective extends LitRendererDirective {
  addRenderer() {
    this.element.renderer = (root) => {
      this.renderRenderer(root);
    };
  }

  runRenderer() {
    this.element.requestContentUpdate();
  }

  removeRenderer() {
    this.element.renderer = null;
  }
}

export const mockRenderer = directive(MockRendererDirective);

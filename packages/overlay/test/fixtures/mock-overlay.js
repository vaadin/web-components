import { html, LitElement } from 'lit';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { overlayStyles } from '../../src/styles/vaadin-overlay-base-styles.js';
import { OverlayMixin } from '../../src/vaadin-overlay-mixin.js';

// TODO: remove LumoInjectionMixin - currently, it forces style recalculation in WebKit
// that re-evaluates nested `@media`. Without it, "prefers-reduced-motion" test fails.

class MockOverlay extends OverlayMixin(DirMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
  static get is() {
    return 'mock-overlay';
  }

  static get styles() {
    return overlayStyles;
  }

  /** @protected */
  render() {
    return html`
      <div id="backdrop" part="backdrop" ?hidden="${!this.withBackdrop}"></div>
      <div part="overlay" id="overlay" tabindex="0">
        <div part="content" id="content">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

customElements.define(MockOverlay.is, MockOverlay);

export { MockOverlay };

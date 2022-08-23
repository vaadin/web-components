import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../vaadin-tooltip.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { TooltipController } from '../src/vaadin-tooltip-controller.js';

customElements.define(
  'tooltip-host',
  class extends ControllerMixin(PolymerElement) {
    static get template() {
      return html`
        <slot></slot>
        <slot name="tooltip"></slot>
      `;
    }
  },
);

describe('TooltipController', () => {
  let host, tooltip;

  beforeEach(() => {
    host = fixtureSync(`
      <tooltip-host>
        <div>Target</div>
        <vaadin-tooltip slot="tooltip"></vaadin-tooltip>
      </tooltip-host>
    `);
    tooltip = host.querySelector('vaadin-tooltip');
    host.addController(new TooltipController(host));
  });

  it('should set tooltip target to the host itself by default', () => {
    expect(tooltip.target).to.eql(host);
  });

  it('should update tooltip target on tooltip-target-changed event', () => {
    const target = host.querySelector('div');
    host.dispatchEvent(new CustomEvent('tooltip-target-changed', { detail: { target } }));
    expect(tooltip.target).to.eql(target);
  });
});

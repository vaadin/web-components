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
  let host, tooltip, controller;

  beforeEach(() => {
    host = fixtureSync(`
      <tooltip-host>
        <div>Target</div>
        <vaadin-tooltip slot="tooltip"></vaadin-tooltip>
      </tooltip-host>
    `);
    tooltip = host.querySelector('vaadin-tooltip');
    controller = new TooltipController(host);
    host.addController(controller);
  });

  it('should set tooltip target to the host itself by default', () => {
    expect(tooltip.target).to.eql(host);
  });

  it('should update tooltip target using controller setTarget method', () => {
    const target = host.querySelector('div');
    controller.setTarget(target);
    expect(tooltip.target).to.eql(target);
  });

  it('should update tooltip context using controller setContext method', () => {
    const context = { foo: 'bar' };
    controller.setContext(context);
    expect(tooltip.context).to.eql(context);
  });

  it('should update tooltip manual using controller setManual method', () => {
    controller.setManual(true);
    expect(tooltip.manual).to.be.true;

    controller.setManual(false);
    expect(tooltip.manual).to.be.false;
  });

  it('should update tooltip opened using controller setOpened method', () => {
    controller.setOpened(true);
    expect(tooltip.opened).to.be.true;

    controller.setOpened(false);
    expect(tooltip.opened).to.be.false;
  });
});

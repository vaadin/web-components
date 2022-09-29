import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ControllerMixin } from '../src/controller-mixin.js';
import { TooltipController } from '../src/tooltip-controller.js';

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

  describe('slotted tooltip', () => {
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

    it('should update tooltip shouldShow using controller shouldShow method', () => {
      const shouldShow = () => true;
      controller.setShouldShow(shouldShow);
      expect(tooltip.shouldShow).to.be.eql(shouldShow);
    });

    it('should update tooltip _position using controller setPosition method', () => {
      controller.setPosition('top-start');
      expect(tooltip._position).to.eql('top-start');
    });

    it('should not set position property using controller setPosition method', () => {
      controller.setPosition('top-start');
      expect(tooltip.position).to.not.eql('top-start');
    });
  });

  describe('slotted tooltip', () => {
    beforeEach(() => {
      host = fixtureSync(`
        <tooltip-host>
          <div>Target</div>
        </tooltip-host>
      `);
      controller = new TooltipController(host);
      host.addController(controller);

      tooltip = document.createElement('vaadin-tooltip');
      tooltip.setAttribute('slot', 'tooltip');
    });

    it('should set tooltip target on the lazy tooltip to the host itself', async () => {
      host.appendChild(tooltip);
      await nextFrame();
      expect(tooltip.target).to.eql(host);
    });

    it('should update lazy tooltip target using controller setTarget method', async () => {
      const target = host.querySelector('div');
      controller.setTarget(target);

      host.appendChild(tooltip);
      await nextFrame();

      expect(tooltip.target).to.eql(target);
    });

    it('should update lazy tooltip context using controller setContext method', async () => {
      const context = { foo: 'bar' };
      controller.setContext(context);

      host.appendChild(tooltip);
      await nextFrame();

      expect(tooltip.context).to.eql(context);
    });

    it('should update lazy tooltip manual using controller setManual method', async () => {
      controller.setManual(true);

      host.appendChild(tooltip);
      await nextFrame();

      expect(tooltip.manual).to.be.true;

      controller.setManual(false);
      expect(tooltip.manual).to.be.false;
    });

    it('should update lazy tooltip opened using controller setOpened method', async () => {
      controller.setOpened(true);

      host.appendChild(tooltip);
      await nextFrame();

      expect(tooltip.opened).to.be.true;

      controller.setOpened(false);
      expect(tooltip.opened).to.be.false;
    });

    it('should update lazy tooltip shouldShow using controller shouldShow method', async () => {
      const shouldShow = () => true;
      controller.setShouldShow(shouldShow);

      host.appendChild(tooltip);
      await nextFrame();

      expect(tooltip.shouldShow).to.be.eql(shouldShow);
    });

    it('should update lazy tooltip _position using controller setPosition method', async () => {
      controller.setPosition('top-start');

      host.appendChild(tooltip);
      await nextFrame();

      expect(tooltip._position).to.eql('top-start');
    });
  });
});

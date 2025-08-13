import { expect } from '@vaadin/chai-plugins';
import { defineLit, fire, fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { PolylitMixin } from '../src/polylit-mixin.js';
import { TooltipController } from '../src/tooltip-controller.js';

describe('TooltipController', () => {
  const tag = defineLit(
    'tooltip-host',
    `<slot></slot><slot name="tooltip"></slot>
    `,
    (Base) => class extends PolylitMixin(Base) {},
  );

  let host, tooltip, controller;

  describe('slotted tooltip', () => {
    beforeEach(() => {
      host = fixtureSync(`
        <${tag}>
          <div>Target</div>
          <vaadin-tooltip slot="tooltip"></vaadin-tooltip>
        </${tag}>
      `);
      tooltip = host.querySelector('vaadin-tooltip');
      controller = new TooltipController(host);
      host.addController(controller);
    });

    it('should set has-tooltip attribute on the host', () => {
      expect(host.hasAttribute('has-tooltip')).to.be.true;
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

    it('should update tooltip ariaTarget using controller setAriaTarget method', () => {
      const input = document.createElement('input');
      host.appendChild(input);
      controller.setAriaTarget(input);
      expect(tooltip.ariaTarget).to.equal(input);
    });
  });

  describe('lazy tooltip', () => {
    beforeEach(() => {
      host = fixtureSync(`
        <${tag}>
          <div>Target</div>
        </${tag}>
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

    it('should fire tooltip-changed event when the tooltip is added', async () => {
      const spy = sinon.spy();
      controller.addEventListener('tooltip-changed', spy);
      host.appendChild(tooltip);
      await nextFrame();
      expect(spy).to.be.calledOnce;
    });

    it('should fire tooltip-changed event when the tooltip is removed', async () => {
      const spy = sinon.spy();
      controller.addEventListener('tooltip-changed', spy);
      host.appendChild(tooltip);
      await nextFrame();

      host.removeChild(tooltip);
      await nextFrame();
      expect(spy).to.be.calledTwice;
    });

    it('should fire tooltip-changed event on tooltip content-changed', async () => {
      const spy = sinon.spy();
      controller.addEventListener('tooltip-changed', spy);
      host.appendChild(tooltip);
      await nextFrame();

      spy.resetHistory();
      fire(tooltip, 'content-changed');
      await nextFrame();
      expect(spy).to.be.calledOnce;
    });

    it('should not fire tooltip-changed event on tooltip content-changed after removing', async () => {
      const spy = sinon.spy();
      controller.addEventListener('tooltip-changed', spy);
      host.appendChild(tooltip);
      await nextFrame();

      host.removeChild(tooltip);
      await nextFrame();

      spy.resetHistory();
      fire(tooltip, 'content-changed');
      await nextFrame();
      expect(spy).to.be.not.called;
    });

    it('should set has-tooltip attribute on the host when tooltip is added', async () => {
      expect(host.hasAttribute('has-tooltip')).to.be.false;
      host.appendChild(tooltip);
      await nextFrame();
      expect(host.hasAttribute('has-tooltip')).to.be.true;
    });

    it('should remove has-tooltip attribute from the host when tooltip is removed', async () => {
      host.appendChild(tooltip);
      await nextFrame();

      host.removeChild(tooltip);
      await nextFrame();
      expect(host.hasAttribute('has-tooltip')).to.be.false;
    });
  });
});

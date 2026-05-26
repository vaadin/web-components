import { expect } from '@vaadin/chai-plugins';
import { defineLit, fixtureSync, nextFrame, nextUpdate } from '@vaadin/testing-helpers';
import '@vaadin/tooltip/src/vaadin-tooltip.js';
import { AutoTooltipController } from '../src/auto-tooltip-controller.js';
import { AutoTooltipMixin } from '../src/auto-tooltip-mixin.js';
import { PolylitMixin } from '../src/polylit-mixin.js';

describe('AutoTooltipMixin', () => {
  const tag = defineLit(
    'auto-tooltip-mixin-host',
    '<slot></slot><slot name="tooltip"></slot>',
    (Base) => class extends AutoTooltipMixin(PolylitMixin(Base)) {},
  );

  let host;

  const getAutoTooltip = () => host.querySelector('vaadin-tooltip');

  describe('property', () => {
    beforeEach(async () => {
      host = fixtureSync(`<${tag}>Label</${tag}>`);
      await nextFrame();
    });

    it('should default autoTooltip to false', () => {
      expect(host.autoTooltip).to.be.false;
    });

    it('should not create a tooltip by default', () => {
      expect(getAutoTooltip()).to.be.null;
    });

    it('should not reflect autoTooltip attribute when false', () => {
      expect(host.hasAttribute('auto-tooltip')).to.be.false;
    });

    it('should reflect autoTooltip attribute when set to true', async () => {
      host.autoTooltip = true;
      await nextUpdate(host);
      expect(host.hasAttribute('auto-tooltip')).to.be.true;
    });
  });

  describe('toggling autoTooltip', () => {
    beforeEach(async () => {
      host = fixtureSync(`<${tag}>Label</${tag}>`);
      await nextFrame();
    });

    it('should create the auto tooltip when autoTooltip becomes true', async () => {
      host.autoTooltip = true;
      await nextUpdate(host);
      await nextFrame();
      expect(getAutoTooltip()).to.be.ok;
      expect(getAutoTooltip().getAttribute('text')).to.equal('Label');
    });

    it('should remove the auto tooltip when autoTooltip becomes false', async () => {
      host.autoTooltip = true;
      await nextUpdate(host);
      await nextFrame();
      host.autoTooltip = false;
      await nextUpdate(host);
      await nextFrame();
      expect(getAutoTooltip()).to.be.null;
    });

    it('should set ariaTarget to null on the auto tooltip', async () => {
      host.autoTooltip = true;
      await nextUpdate(host);
      await nextFrame();
      expect(getAutoTooltip().ariaTarget).to.equal(null);
    });

    it('should not add aria-describedby on the host', async () => {
      host.autoTooltip = true;
      await nextUpdate(host);
      await nextFrame();
      expect(host.hasAttribute('aria-describedby')).to.be.false;
    });
  });

  describe('initial autoTooltip via attribute', () => {
    beforeEach(async () => {
      host = fixtureSync(`<${tag} auto-tooltip>Label</${tag}>`);
      await nextFrame();
    });

    it('should reflect the property from the attribute', () => {
      expect(host.autoTooltip).to.be.true;
    });

    it('should create the auto tooltip on ready', () => {
      expect(getAutoTooltip()).to.be.ok;
      expect(getAutoTooltip().getAttribute('text')).to.equal('Label');
    });
  });

  describe('controller exposure', () => {
    beforeEach(async () => {
      host = fixtureSync(`<${tag}>Label</${tag}>`);
      await nextFrame();
    });

    it('should expose the AutoTooltipController as _tooltipController', () => {
      expect(host._tooltipController).to.be.instanceOf(AutoTooltipController);
    });
  });

  describe('custom _getAutoTooltipOptions', () => {
    const customTag = defineLit(
      'auto-tooltip-mixin-custom-host',
      '<slot></slot><slot name="tooltip"></slot>',
      (Base) =>
        class extends AutoTooltipMixin(PolylitMixin(Base)) {
          _getAutoTooltipOptions() {
            return { getText: () => 'Forced text' };
          }
        },
    );

    it('should pass the options to the controller', async () => {
      const customHost = fixtureSync(`<${customTag} auto-tooltip>Ignored</${customTag}>`);
      await nextFrame();
      expect(customHost.querySelector('vaadin-tooltip').getAttribute('text')).to.equal('Forced text');
    });
  });
});

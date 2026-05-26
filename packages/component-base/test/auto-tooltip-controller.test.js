import { expect } from '@vaadin/chai-plugins';
import { defineLit, fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '@vaadin/tooltip/src/vaadin-tooltip.js';
import { AutoTooltipController } from '../src/auto-tooltip-controller.js';
import { PolylitMixin } from '../src/polylit-mixin.js';

describe('AutoTooltipController', () => {
  const tag = defineLit(
    'auto-tooltip-host',
    '<slot></slot><slot name="tooltip"></slot>',
    (Base) => class extends PolylitMixin(Base) {},
  );

  let host, controller;

  beforeEach(() => {
    host = fixtureSync(`<${tag}>Label text</${tag}>`);
    controller = new AutoTooltipController(host);
    host.addController(controller);
  });

  const getAutoTooltip = () => host.querySelector('vaadin-tooltip');

  describe('disabled by default', () => {
    it('should not create a tooltip when controller is added', async () => {
      await nextFrame();
      expect(getAutoTooltip()).to.be.null;
    });

    it('should not set has-tooltip on the host', async () => {
      await nextFrame();
      expect(host.hasAttribute('has-tooltip')).to.be.false;
    });
  });

  describe('enabled', () => {
    beforeEach(async () => {
      controller.setEnabled(true);
      await nextFrame();
    });

    it('should create a tooltip slotted into the tooltip slot', () => {
      const tooltip = getAutoTooltip();
      expect(tooltip).to.be.ok;
      expect(tooltip.getAttribute('slot')).to.equal('tooltip');
    });

    it('should set the tooltip text from the host default slot', () => {
      expect(getAutoTooltip().getAttribute('text')).to.equal('Label text');
    });

    it('should set ariaTarget to null on the auto tooltip', () => {
      expect(getAutoTooltip().ariaTarget).to.equal(null);
    });

    it('should not add aria-describedby on the host', () => {
      expect(host.hasAttribute('aria-describedby')).to.be.false;
    });

    it('should remove the auto tooltip when disabled', async () => {
      controller.setEnabled(false);
      await nextFrame();
      expect(getAutoTooltip()).to.be.null;
    });

    it('should reuse the same auto tooltip node when re-enabled', async () => {
      const tooltip = getAutoTooltip();
      controller.setEnabled(false);
      await nextFrame();
      controller.setEnabled(true);
      await nextFrame();
      expect(getAutoTooltip()).to.equal(tooltip);
    });

    it('should update the tooltip text when the host text changes', async () => {
      host.textContent = 'Updated text';
      await nextFrame();
      expect(getAutoTooltip().getAttribute('text')).to.equal('Updated text');
    });

    it('should remove the auto tooltip when host text becomes empty', async () => {
      host.textContent = '';
      await nextFrame();
      expect(getAutoTooltip()).to.be.null;
    });

    it('should remove the auto tooltip when a custom tooltip is slotted', async () => {
      const custom = document.createElement('vaadin-tooltip');
      custom.setAttribute('slot', 'tooltip');
      host.appendChild(custom);
      await nextFrame();
      const tooltips = host.querySelectorAll('vaadin-tooltip');
      expect(tooltips.length).to.equal(1);
      expect(tooltips[0]).to.equal(custom);
    });

    it('should restore the auto tooltip when the custom tooltip is removed', async () => {
      const custom = document.createElement('vaadin-tooltip');
      custom.setAttribute('slot', 'tooltip');
      host.appendChild(custom);
      await nextFrame();

      custom.remove();
      await nextFrame();

      expect(getAutoTooltip()).to.be.ok;
      expect(getAutoTooltip().getAttribute('text')).to.equal('Label text');
    });
  });

  describe('initial state with text', () => {
    it('should create the auto tooltip immediately when enabled in setup', async () => {
      // Fresh host so we observe initial enable behavior.
      const freshHost = fixtureSync(`<${tag}>Initial</${tag}>`);
      const freshController = new AutoTooltipController(freshHost);
      freshHost.addController(freshController);
      freshController.setEnabled(true);
      await nextFrame();
      expect(freshHost.querySelector('vaadin-tooltip').getAttribute('text')).to.equal('Initial');
    });
  });

  describe('pre-existing custom tooltip', () => {
    let preHost, preController;

    beforeEach(async () => {
      preHost = fixtureSync(`
        <${tag}>
          Label text
          <vaadin-tooltip slot="tooltip" text="User"></vaadin-tooltip>
        </${tag}>
      `);
      preController = new AutoTooltipController(preHost);
      preHost.addController(preController);
      preController.setEnabled(true);
      await nextFrame();
    });

    it('should not create an auto tooltip when a custom one is already slotted', () => {
      const tooltips = preHost.querySelectorAll('vaadin-tooltip');
      expect(tooltips.length).to.equal(1);
      expect(tooltips[0].getAttribute('text')).to.equal('User');
    });
  });

  describe('host with no default slot', () => {
    const tooltipOnlyTag = defineLit(
      'auto-tooltip-host-no-default-slot',
      '<slot name="tooltip"></slot>',
      (Base) => class extends PolylitMixin(Base) {},
    );

    it('should not create an auto tooltip when host has no default slot', async () => {
      const slotlessHost = fixtureSync(`<${tooltipOnlyTag}></${tooltipOnlyTag}>`);
      const slotlessController = new AutoTooltipController(slotlessHost);
      slotlessHost.addController(slotlessController);
      slotlessController.setEnabled(true);
      await nextFrame();
      expect(slotlessHost.querySelector('vaadin-tooltip')).to.be.null;
    });
  });

  describe('custom getText option', () => {
    let customHost, customController;

    beforeEach(async () => {
      customHost = fixtureSync(`<${tag}>Default slot text</${tag}>`);
      customController = new AutoTooltipController(customHost, {
        getText: () => 'Computed text',
      });
      customHost.addController(customController);
      customController.setEnabled(true);
      await nextFrame();
    });

    it('should use the provided getText function', () => {
      expect(customHost.querySelector('vaadin-tooltip').getAttribute('text')).to.equal('Computed text');
    });

    it('should pass the host as the first argument to getText', () => {
      let received;
      const probeHost = fixtureSync(`<${tag}></${tag}>`);
      const probeController = new AutoTooltipController(probeHost, {
        getText: (h) => {
          received = h;
          return 'x';
        },
      });
      probeHost.addController(probeController);
      probeController.setEnabled(true);
      expect(received).to.equal(probeHost);
    });
  });
});

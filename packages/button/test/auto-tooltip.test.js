import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextUpdate } from '@vaadin/testing-helpers';
import '../src/vaadin-button.js';
import '@vaadin/tooltip/src/vaadin-tooltip.js';

describe('auto-tooltip', () => {
  let button;

  const getAutoTooltip = () => button.querySelector('vaadin-tooltip');

  describe('default', () => {
    beforeEach(async () => {
      button = fixtureSync('<vaadin-button>Label</vaadin-button>');
      await nextFrame();
    });

    it('should have autoTooltip set to false by default', () => {
      expect(button.autoTooltip).to.be.false;
    });

    it('should not create an auto tooltip by default', () => {
      expect(getAutoTooltip()).to.be.null;
    });

    it('should not have the auto-tooltip attribute by default', () => {
      expect(button.hasAttribute('auto-tooltip')).to.be.false;
    });
  });

  describe('toggling', () => {
    beforeEach(async () => {
      button = fixtureSync('<vaadin-button>Label</vaadin-button>');
      await nextFrame();
    });

    it('should reflect the auto-tooltip attribute when enabled', async () => {
      button.autoTooltip = true;
      await nextUpdate(button);
      expect(button.hasAttribute('auto-tooltip')).to.be.true;
    });

    it('should remove the auto-tooltip attribute when disabled', async () => {
      button.autoTooltip = true;
      await nextUpdate(button);
      button.autoTooltip = false;
      await nextUpdate(button);
      expect(button.hasAttribute('auto-tooltip')).to.be.false;
    });
  });

  describe('enabled', () => {
    beforeEach(async () => {
      button = fixtureSync('<vaadin-button>Label</vaadin-button>');
      button.autoTooltip = true;
      await nextUpdate(button);
      await nextFrame();
    });

    it('should create exactly one auto tooltip slotted into the tooltip slot', () => {
      const tooltips = button.querySelectorAll('vaadin-tooltip');
      expect(tooltips.length).to.equal(1);
      expect(tooltips[0].getAttribute('slot')).to.equal('tooltip');
    });

    it('should set the tooltip text from the label', () => {
      expect(getAutoTooltip().getAttribute('text')).to.equal('Label');
    });

    it('should set ariaTarget to null on the auto tooltip', () => {
      expect(getAutoTooltip().ariaTarget).to.equal(null);
    });

    it('should set has-tooltip on the host', () => {
      expect(button.hasAttribute('has-tooltip')).to.be.true;
    });

    it('should not set aria-describedby on the host', () => {
      expect(button.hasAttribute('aria-describedby')).to.be.false;
    });

    it('should remove the auto tooltip and has-tooltip when disabled', async () => {
      button.autoTooltip = false;
      await nextUpdate(button);
      await nextFrame();
      expect(getAutoTooltip()).to.be.null;
      expect(button.hasAttribute('has-tooltip')).to.be.false;
    });

    it('should reuse the same auto tooltip node when re-enabled', async () => {
      const before = getAutoTooltip();
      button.autoTooltip = false;
      await nextUpdate(button);
      await nextFrame();
      button.autoTooltip = true;
      await nextUpdate(button);
      await nextFrame();
      const after = getAutoTooltip();
      expect(after).to.equal(before);
    });
  });

  describe('initial state', () => {
    it('should create the auto tooltip on ready when enabled in markup', async () => {
      button = fixtureSync('<vaadin-button auto-tooltip>Label</vaadin-button>');
      await nextFrame();
      const tooltip = getAutoTooltip();
      expect(tooltip).to.be.ok;
      expect(tooltip.getAttribute('text')).to.equal('Label');
    });
  });

  describe('custom slotted tooltip', () => {
    beforeEach(async () => {
      button = fixtureSync(`
        <vaadin-button auto-tooltip>
          Label
          <vaadin-tooltip slot="tooltip" text="Custom"></vaadin-tooltip>
        </vaadin-button>
      `);
      await nextFrame();
    });

    it('should not create an auto tooltip when a custom one is slotted', () => {
      const tooltips = button.querySelectorAll('vaadin-tooltip');
      expect(tooltips.length).to.equal(1);
      expect(tooltips[0].getAttribute('text')).to.equal('Custom');
    });
  });

  describe('label visibility', () => {
    beforeEach(async () => {
      button = fixtureSync('<vaadin-button auto-tooltip>Label</vaadin-button>');
      await nextFrame();
    });

    it('should visually hide the label part when auto-tooltip is set', () => {
      expect(button.hasAttribute('auto-tooltip')).to.be.true;
      const label = button.shadowRoot.querySelector('[part="label"]');
      const style = getComputedStyle(label);
      expect(style.position).to.equal('absolute');
      expect(style.width).to.equal('1px');
    });
  });
});

import { expect } from '@esm-bundle/chai';
import {
  arrowDown,
  arrowRight,
  escKeyDown,
  fire,
  fixtureSync,
  focusin,
  focusout,
  mousedown,
  nextRender,
  tabKeyDown,
} from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/menu-bar';
import { Tooltip } from '@vaadin/tooltip';
import { mouseenter, mouseleave } from '@vaadin/tooltip/test/helpers.js';

export function mouseover(target) {
  fire(target, 'mouseover');
}

function getTooltipText() {
  const overlay = document.querySelector('vaadin-tooltip-overlay:not([hidden])');
  return overlay && overlay.textContent;
}

describe('menu-bar with tooltip', () => {
  let menuBar, tooltip, buttons;

  before(() => {
    Tooltip.setDefaultFocusDelay(0);
    Tooltip.setDefaultHoverDelay(0);
    Tooltip.setDefaultHideDelay(0);
  });

  beforeEach(async () => {
    menuBar = fixtureSync(`
      <vaadin-menu-bar>
        <vaadin-tooltip slot="tooltip"></vaadin-tooltip>
      </vaadin-menu-bar>
    `);
    menuBar.items = [
      { text: 'Edit', tooltip: 'Edit tooltip' },
      {
        text: 'Share',
        children: [{ text: 'By email' }],
      },
      {
        text: 'Move',
        tooltip: 'Move tooltip',
        children: [{ text: 'To folder' }],
      },
    ];

    await nextRender();
    buttons = menuBar._buttons;

    tooltip = menuBar.querySelector('vaadin-tooltip');
  });

  it('should set manual on the tooltip to true', () => {
    expect(tooltip.manual).to.be.true;
  });

  it('should show tooltip on menu button mouseover', () => {
    mouseover(buttons[0]);
    expect(tooltip.opened).to.be.true;
  });

  it('should use the tooltip property of an item as tooltip', () => {
    mouseover(buttons[0]);
    expect(getTooltipText()).to.equal('Edit tooltip');
  });

  it('should not show tooltip for an item which has no tooltip', () => {
    mouseover(buttons[1]);
    expect(getTooltipText()).not.to.be.ok;
  });

  it('should not show tooltip on another parent menu button mouseover when open', async () => {
    mouseover(buttons[1]);
    buttons[1].click();
    await nextRender();
    mouseover(buttons[2]);
    await nextRender();
    expect(tooltip.opened).to.be.false;
  });

  it('should hide tooltip on menu bar mouseleave', () => {
    mouseover(buttons[0]);
    mouseleave(menuBar);
    expect(tooltip.opened).to.be.false;
  });

  it('should hide tooltip on menu bar container mouseover', () => {
    mouseover(buttons[0]);
    mouseover(menuBar._container);
    expect(tooltip.opened).to.be.false;
  });

  it('should show tooltip again on menu bar button mouseover', () => {
    mouseover(buttons[0]);
    mouseover(menuBar._container);
    mouseover(buttons[1]);
    expect(tooltip.opened).to.be.true;
  });

  it('should set tooltip target on menu button mouseover', () => {
    mouseover(buttons[0]);
    expect(tooltip.target).to.be.equal(buttons[0]);
  });

  it('should set tooltip context on menu button mouseover', () => {
    mouseover(buttons[0]);
    expect(tooltip.context).to.be.instanceOf(Object);
    expect(tooltip.context.item.text).to.equal('Edit');
  });

  it('should change tooltip context on another menu button mouseover', () => {
    mouseover(buttons[0]);
    mouseover(buttons[1]);
    expect(tooltip.context.item.text).to.equal('Share');
  });

  it('should hide tooltip on menu button mousedown', () => {
    mouseover(buttons[0]);
    mousedown(buttons[0]);
    expect(tooltip.opened).to.be.false;
  });

  it('should hide tooltip on mouseleave from overlay to outside', () => {
    const overlay = tooltip._overlayElement;
    mouseover(buttons[0]);
    mouseenter(overlay);
    mouseleave(overlay);
    expect(overlay.opened).to.be.false;
  });

  it('should not show tooltip on focus without keyboard interaction', async () => {
    buttons[0].focus();
    await nextRender();
    expect(tooltip.opened).to.be.false;
  });

  it('should show tooltip on menu button keyboard focus', () => {
    tabKeyDown(document.body);
    focusin(buttons[0]);
    expect(tooltip.opened).to.be.true;
  });

  it('should not show tooltip on another parent menu button focus when open', async () => {
    buttons[0].focus();
    arrowRight(buttons[0]);
    arrowDown(buttons[1]);
    arrowRight(buttons[1]);
    await nextRender();
    expect(tooltip.opened).to.be.false;
  });

  it('should set tooltip target on menu button keyboard focus', () => {
    tabKeyDown(document.body);
    focusin(buttons[0]);
    expect(tooltip.target).to.be.equal(buttons[0]);
  });

  it('should set tooltip context on menu button keyboard focus', () => {
    tabKeyDown(document.body);
    focusin(buttons[0]);
    expect(tooltip.context).to.be.instanceOf(Object);
    expect(tooltip.context.item.text).to.equal('Edit');
  });

  it('should hide tooltip on menu-bar focusout', () => {
    tabKeyDown(document.body);
    focusin(buttons[0]);
    focusout(menuBar);
    expect(tooltip.opened).to.be.false;
  });

  it('should hide tooltip on menuBar menu button content Esc', () => {
    tabKeyDown(document.body);
    focusin(buttons[0]);
    escKeyDown(buttons[0]);
    expect(tooltip.opened).to.be.false;
  });

  it('should set tooltip opened to false when the menuBar is removed', () => {
    mouseover(buttons[0]);

    menuBar.remove();

    expect(tooltip.opened).to.be.false;
  });

  it('should not set tooltip properties if there is no tooltip', async () => {
    const spyTarget = sinon.spy(menuBar._tooltipController, 'setTarget');
    const spyContent = sinon.spy(menuBar._tooltipController, 'setContext');
    const spyOpened = sinon.spy(menuBar._tooltipController, 'setOpened');

    tooltip.remove();
    await nextRender();

    mouseover(buttons[0]);

    expect(spyTarget.called).to.be.false;
    expect(spyContent.called).to.be.false;
    expect(spyOpened.called).to.be.false;
  });

  it('should not override a custom generator', () => {
    tooltip.generator = () => 'Custom tooltip';
    mouseover(buttons[0]);
    expect(getTooltipText()).to.equal('Custom tooltip');
  });

  describe('overflow button', () => {
    beforeEach(async () => {
      // Reduce the width by the width of the last visible button
      menuBar.style.display = 'inline-block';
      menuBar.style.width = `${menuBar.offsetWidth - buttons[2].offsetWidth}px`;
      await nextRender();
      await nextRender();
      // Increase the width by the width of the overflow button
      menuBar.style.width = `${menuBar.offsetWidth + menuBar._overflow.offsetWidth}px`;
      await nextRender();
      await nextRender();
    });

    it('should not show tooltip on overflow button mouseover', () => {
      mouseover(buttons[buttons.length - 1]);
      expect(tooltip.opened).to.be.false;
    });

    it('should close tooltip on overflow button mouseover', () => {
      mouseover(buttons[0]);
      mouseover(buttons[buttons.length - 1]);
      expect(tooltip.opened).to.be.false;
    });

    it('should close tooltip on overflow button keyboard navigation', () => {
      buttons[0].focus();
      arrowRight(buttons[0]);
      expect(tooltip.opened).to.be.true;
      arrowRight(buttons[1]);
      expect(tooltip.opened).to.be.false;
    });

    it('should not show tooltip on overflow button keyboard focus', () => {
      buttons[0].focus();
      arrowRight(buttons[0]);
      arrowRight(buttons[1]);
      tabKeyDown(document.body);
      focusin(buttons[buttons.length - 1]);
      expect(tooltip.opened).to.be.false;
    });
  });

  describe('open on hover', () => {
    beforeEach(() => {
      menuBar.openOnHover = true;
    });

    it('should show tooltip on mouseover for button without children', () => {
      menuBar.openOnHover = true;
      mouseover(buttons[0]);
      expect(tooltip.opened).to.be.true;
    });

    it('should not show tooltip on mouseover for button with children', () => {
      menuBar.openOnHover = true;
      mouseover(buttons[1]);
      expect(tooltip.opened).to.be.false;
    });
  });

  describe('delay', () => {
    const DEFAULT_DELAY = 500;

    let clock;

    beforeEach(() => {
      clock = sinon.useFakeTimers({
        shouldClearNativeTimers: true,
      });
    });

    afterEach(() => {
      // Wait for cooldown
      clock.tick(DEFAULT_DELAY);
      clock.restore();
    });

    it('should use hover delay on menu button mouseover', () => {
      tooltip.hoverDelay = 100;

      mouseover(buttons[0]);
      expect(tooltip.opened).to.be.false;

      clock.tick(100);
      expect(tooltip.opened).to.be.true;
    });

    it('should use hide delay on menu button mouseleave', () => {
      tooltip.hideDelay = 100;

      mouseover(buttons[0]);
      clock.tick(DEFAULT_DELAY);

      mouseleave(menuBar);
      expect(tooltip.opened).to.be.true;

      clock.tick(100);
      expect(tooltip.opened).to.be.false;
    });

    it('should not use hide delay on menu button mousedown', () => {
      tooltip.hideDelay = 100;

      mouseover(buttons[0]);
      clock.tick(DEFAULT_DELAY);

      mousedown(buttons[0]);
      expect(tooltip.opened).to.be.false;
    });

    it('should use focus delay on menu button keyboard focus', () => {
      tooltip.focusDelay = 100;

      tabKeyDown(document.body);
      focusin(buttons[0]);
      expect(tooltip.opened).to.be.false;

      clock.tick(100);
      expect(tooltip.opened).to.be.true;
    });

    it('should not use hide delay on menu button Esc', () => {
      tooltip.hideDelay = 100;

      tabKeyDown(document.body);
      focusin(buttons[0]);
      clock.tick(DEFAULT_DELAY);

      escKeyDown(buttons[0]);
      expect(tooltip.opened).to.be.false;
    });
  });
});

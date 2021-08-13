import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync, isIOS, fire } from '@vaadin/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { makeItems } from './helpers.js';
import './not-animated-styles.js';
import '../vaadin-combo-box.js';

class XFixed extends PolymerElement {
  static get template() {
    return html`
      <div style="position: fixed;">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('x-fixed', XFixed);

describe('overlay', () => {
  let comboBox;

  let wh, ww, xCenter, xStart, xEnd, yCenter, yTop, yBottom;

  // The ideal test would be to resize the window, but testing system disallows
  // resizing the iframe, but moving the combo-box using styles and firing
  // window.onresize event is equivalent.
  function moveComboBox(left, top, width) {
    comboBox.style.position = 'fixed';
    comboBox.style.width = width + 'px';
    comboBox.style.top = top + 'px';
    comboBox.style.left = left + 'px';
    window.dispatchEvent(new Event('resize'));
  }

  function dropContent() {
    return comboBox.$.overlay.$.dropdown.$.overlay;
  }

  function dropContentRect() {
    return dropContent().getBoundingClientRect();
  }

  function inputContentRect() {
    return comboBox.$.input.getBoundingClientRect();
  }

  beforeEach(async () => {
    comboBox = fixtureSync(`<vaadin-combo-box label='comboBox' style='width: 300px;' items='[1]'></vaadin-combo-box>`);
    const comboBoxRect = comboBox.getBoundingClientRect();
    comboBox.items = makeItems(20);

    // Subtract the combo-box size from the coordinates range in order not to
    // move it outside the viewport boundaries when changing top and left.
    // Otherwise it is not nice for debugging.
    wh = window.innerHeight - comboBoxRect.height;
    ww = window.innerWidth - comboBoxRect.width;
    xCenter = ww * 0.5;
    yCenter = wh * 0.5;
    xEnd = ww;
    xStart = 0;
    yTop = 0;
    yBottom = wh;

    await aTimeout(0);
  });

  // clean out <vaadin-overlay> elements from body.
  afterEach(() => {
    comboBox.close();
  });

  describe('overlay position', () => {
    it('should match the input container width', () => {
      comboBox.open();

      expect(dropContentRect().width).to.be.closeTo(inputContentRect().width, 1);
    });

    it('should be below the input box', () => {
      comboBox.open();

      expect(dropContentRect().top).to.be.closeTo(inputContentRect().bottom, 1);
    });

    it('should position correctly if items are populated after opening', async () => {
      comboBox.items = [];
      comboBox.open();
      await aTimeout(1);
      comboBox.items = [1, 2, 3];
      await aTimeout(1);
      expect(dropContentRect().top).to.be.closeTo(inputContentRect().bottom, 1);
    });

    it('should reposition on scroll', () => {
      comboBox.opened = true;
      // comboBox.$.overlay.updateViewportBoundaries = sinon.spy();

      fire(document, 'scroll');

      // expect(comboBox.$.overlay.updateViewportBoundaries.callCount).to.eql(1);
    });

    it('should be aligned with input container', () => {
      comboBox.open();

      expect(dropContentRect().left).to.equal(inputContentRect().left);
    });

    it('when the input position moves in the view port the overlay position should change', () => {
      moveComboBox(xCenter, yTop, 100);

      comboBox.open();

      expect(Math.round(dropContentRect().left)).to.be.closeTo(Math.round(inputContentRect().left), 1);

      expect(dropContentRect().top).to.be.closeTo(inputContentRect().bottom, 1);
    });

    it('when the input position width changes overlay width should change', () => {
      moveComboBox(xCenter, yBottom, 150);

      comboBox.open();

      expect(dropContentRect().width).to.equal(inputContentRect().width);
    });

    it('should not translate in sub-pixels', () => {
      comboBox.style.paddingTop = '0.75px';
      comboBox.open();

      const pixelRatio = window.devicePixelRatio || 1;
      expect((comboBox.$.overlay.$.dropdown._translateY * pixelRatio) % 1).to.be.closeTo(0, 0.1);
      expect((comboBox.$.overlay.$.dropdown._translateX * pixelRatio) % 1).to.be.closeTo(0, 0.1);
    });

    it('should have custom width bigger than input', () => {
      comboBox.style.setProperty('--vaadin-combo-box-overlay-width', '400px');

      comboBox.open();

      expect(dropContentRect().width).to.equal(400);
      expect(dropContentRect().width).to.be.above(inputContentRect().width);
    });

    it('should have custom width smaller than input', () => {
      comboBox.style.setProperty('--vaadin-combo-box-overlay-width', '130px');

      comboBox.open();

      expect(dropContentRect().width).to.equal(130);
      expect(dropContentRect().width).to.be.below(inputContentRect().width);
    });
  });

  (isIOS ? describe.skip : describe)('overlay alignment', () => {
    describe('horizontal alignment', () => {
      const inputWidth = 150;

      beforeEach(() => comboBox.$.overlay.style.setProperty('--vaadin-combo-box-overlay-width', inputWidth * 2 + 'px'));

      it('should be on the left side of the input', async () => {
        moveComboBox(xEnd, yCenter, inputWidth);

        comboBox.open();
        await aTimeout(1);
        expect(dropContentRect().right).to.closeTo(inputContentRect().right, 1);
      });

      it('should be on the right side of the input', async () => {
        moveComboBox(xStart, yCenter, inputWidth);

        comboBox.open();
        await aTimeout(1);
        expect(dropContentRect().left).to.closeTo(inputContentRect().left, 1);
      });
    });

    it('should be above input', async () => {
      moveComboBox(xCenter, yBottom, 300);

      comboBox.open();
      await aTimeout(1);
      expect(comboBox.$.overlay.$.dropdown.alignedAbove).to.be.true;
      expect(dropContentRect().bottom).to.closeTo(inputContentRect().top, 1);
    });

    it('should reposition after filtering', async () => {
      moveComboBox(xCenter, yBottom, 300);

      comboBox.inputElement.value = 'item 1';
      fire(comboBox.inputElement, 'input');

      comboBox.open();
      await aTimeout(0);
      expect(dropContentRect().bottom).to.closeTo(inputContentRect().top, 1);
    });
  });

  describe('overlay resizing', () => {
    const minHeight = 116;
    const inputUnderline = 2;

    it('should resize to bottom of the screen', () => {
      comboBox.open();

      moveComboBox(xCenter, yBottom - minHeight - inputContentRect().height - inputUnderline, 300);

      expect(dropContentRect().bottom).to.be.at.most(window.innerHeight);
    });

    it('should resize to top of the screen', () => {
      moveComboBox(xCenter, yBottom, 300);
      comboBox.open();

      moveComboBox(xCenter, minHeight + inputUnderline, 300);

      expect(dropContentRect().top).to.be.at.least(0);
    });
  });
});

describe('fixed position target', () => {
  function position(node) {
    return window.getComputedStyle(node).position;
  }

  let comboBox;

  afterEach(() => {
    comboBox.close();
  });

  describe('parent has position fixed', () => {
    let parent;

    beforeEach(() => {
      parent = fixtureSync(`
        <div style="position: fixed;">
          <div>
            <vaadin-combo-box label='comboBox' style='width: 300px;'></vaadin-combo-box>
          </div>
        </div>
      `);

      comboBox = parent.querySelector('vaadin-combo-box');
    });

    it('should have same position when parent has fixed', async () => {
      comboBox.open();
      await aTimeout(1);
      expect(position(comboBox.$.overlay.$.dropdown.$.overlay)).to.eql('fixed');
    });
  });

  describe('parent component has position fixed', () => {
    let parent;

    beforeEach(() => {
      parent = fixtureSync(`
        <x-fixed>
          <vaadin-combo-box label='comboBox' style='width: 300px;'></vaadin-combo-box>
        </x-fixed>
      `);

      comboBox = parent.querySelector('vaadin-combo-box');
    });

    it('should have same position when parent component has fixed', async () => {
      comboBox.open();
      await aTimeout(1);
      expect(position(comboBox.$.overlay.$.dropdown.$.overlay)).to.eql('fixed');
    });
  });

  describe('no fixed parent', () => {
    beforeEach(() => {
      comboBox = fixtureSync(
        `<vaadin-combo-box label='comboBox' style='width: 300px;' items='[1]'></vaadin-combo-box>`
      );
    });

    it('should have position absolute by default', async () => {
      comboBox.open();
      await aTimeout(1);
      expect(position(comboBox.$.overlay.$.dropdown.$.overlay)).to.eql('absolute');
    });
  });
});

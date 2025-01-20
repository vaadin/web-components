import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextFrame, nextRender, track } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { html, render } from 'lit';

const initialSizes = { width: 128, height: 128 };

let splitLayout, first, second;

describe('split layout', () => {
  beforeEach(async () => {
    splitLayout = fixtureSync(`
      <vaadin-split-layout>
        <div id="first">some content</div>
        <div id="second">some content</div>
      </vaadin-split-layout>
    `);
    await nextRender();
  });

  describe('container', () => {
    it('should be a flex container', () => {
      expect(getComputedStyle(splitLayout).display).to.equal('flex');
    });
  });

  describe('splitter', () => {
    it('should have overflow visible', () => {
      expect(getComputedStyle(splitLayout.$.splitter).overflow).to.equal('visible');
    });
  });

  describe('content elements', () => {
    let splitter;

    beforeEach(() => {
      first = splitLayout.$.primary.assignedNodes({ flatten: true })[0];
      second = splitLayout.$.secondary.assignedNodes({ flatten: true })[0];
      splitter = splitLayout.$.splitter;
    });

    it('should be distributed', () => {
      expect(first.id).to.equal('first');
      expect(second.id).to.equal('second');
      expect(first.parentNode).to.equal(splitLayout);
      expect(second.parentNode).to.equal(splitLayout);
    });

    it('should have flex auto', () => {
      function getComputedFlexStyle(el) {
        const style = getComputedStyle(el);
        return style.flex || [style.flexGrow, style.flexShrink, style.flexBasis].join(' ');
      }
      expect(getComputedFlexStyle(first)).to.equal('1 1 auto');
      expect(getComputedFlexStyle(second)).to.equal('1 1 auto');
    });

    it('should have a splitter in between', () => {
      const previous = splitter.previousElementSibling;
      const next = splitter.nextElementSibling;
      expect(previous.assignedNodes({ flatten: true })[0]).to.equal(first);
      expect(next.assignedNodes({ flatten: true })[0]).to.equal(second);
    });

    it('should set pointer-events: none on down event and restore on up event', () => {
      first.style.pointerEvents = 'visible';
      second.style.pointerEvents = 'visible';

      splitter.dispatchEvent(new Event('down', { bubbles: true }));
      expect(getComputedStyle(first).pointerEvents).to.equal('none');
      expect(getComputedStyle(second).pointerEvents).to.equal('none');

      splitter.dispatchEvent(new Event('up', { bubbles: true }));
      expect(getComputedStyle(first).pointerEvents).to.equal('visible');
      expect(getComputedStyle(second).pointerEvents).to.equal('visible');
    });

    describe('elements with slot pre-defined', () => {
      it('should respect pre-defined slot values in both elements', async () => {
        const layout = fixtureSync(`
          <vaadin-split-layout>
            <div id="second" slot="secondary">secondary</div>
            <div id="first" slot="primary">primary</div>
          </vaadin-split-layout>
        `);
        await nextRender();
        expect(layout.querySelector('#first').slot).to.be.equal('primary');
        expect(layout.querySelector('#second').slot).to.be.equal('secondary');
      });

      it('should assign a slot if only one element has "secondary" slot pre-defined', async () => {
        const layout = fixtureSync(`
          <vaadin-split-layout>
            <div id="second" slot="secondary">secondary</div>
            <div id="first">primary</div>
          </vaadin-split-layout>
        `);
        await nextRender();
        expect(layout.querySelector('#first').slot).to.be.equal('primary');
        expect(layout.querySelector('#second').slot).to.be.equal('secondary');
      });

      it('should assign a slot if only element has "primary" slot pre-defined', async () => {
        const layout = fixtureSync(`
          <vaadin-split-layout>
            <div id="second">secondary</div>
            <div id="first" slot="primary">primary</div>
          </vaadin-split-layout>
        `);
        await nextRender();
        expect(layout.querySelector('#first').slot).to.be.equal('primary');
        expect(layout.querySelector('#second').slot).to.be.equal('secondary');
      });

      it('should respect assigned slot if only one element has slot pre-defined after order is inverted', async () => {
        const layout = fixtureSync(`
          <vaadin-split-layout>
            <div id="second">secondary</div>
            <div id="first" slot="primary">primary</div>
          </vaadin-split-layout>
        `);
        await nextRender();

        const first = layout.querySelector('#first');
        layout.prepend(first);
        await nextRender();

        expect(layout.querySelector('#first').slot).to.be.equal('primary');
        expect(layout.querySelector('#second').slot).to.be.equal('secondary');
      });

      it('should swap slots if children without pre-defined slots invert order', async () => {
        const layout = fixtureSync(`
          <vaadin-split-layout>
            <div id="second">secondary</div>
            <div id="first">primary</div>
          </vaadin-split-layout>
        `);
        await nextRender();

        const second = layout.querySelector('#second');
        layout.prepend(second);
        await nextRender();

        expect(layout.querySelector('#first').slot).to.be.equal('secondary');
        expect(layout.querySelector('#second').slot).to.be.equal('primary');
      });

      it('should assign slots only for direct children', async () => {
        const layout = fixtureSync(`
          <vaadin-split-layout>
            <div id="first">primary</div>
            <vaadin-split-layout id="second">
              <div id="nested-first" slot="primary"></div>
              <div id="nested-second" slot="secondary"></div>
            </vaadin-split-layout>
          </vaadin-split-layout>
        `);
        await nextRender();

        const first = layout.querySelector('#first');
        expect(first.slot).to.be.equal('primary');
        const second = layout.querySelector('#second');
        expect(second.slot).to.be.equal('secondary');
      });
    });
  });
});

function testDimensions(isVertical) {
  const size = isVertical ? 'height' : 'width';
  const crossSize = isVertical ? 'width' : 'height';
  let splitLayoutRect;

  beforeEach(() => {
    splitLayoutRect = splitLayout.getBoundingClientRect();
  });

  describe('content elements', () => {
    let firstRect, secondRect;

    beforeEach(() => {
      firstRect = first.getBoundingClientRect();
      secondRect = second.getBoundingClientRect();
    });

    it('should have equal initial size', () => {
      expect(Math.abs(firstRect[size] - secondRect[size])).to.be.at.most(1);
    });

    it('should have have crossSize of container', () => {
      expect(firstRect[crossSize]).to.equal(splitLayoutRect[crossSize]);
    });

    it('should respect initial css size', () => {
      const initialTotalSize = initialSizes[size] - 8;
      const cssPrimarySize = 0.25;
      const cssSecondarySize = 1 - cssPrimarySize;
      first.style[size] = `${cssPrimarySize * 100}%`;
      second.style[size] = `${cssSecondarySize * 100}%`;

      expect(Math.abs(first.getBoundingClientRect()[size] / initialTotalSize - cssPrimarySize)).to.be.at.most(0.01);
      expect(Math.abs(second.getBoundingClientRect()[size] / initialTotalSize - cssSecondarySize)).to.be.at.most(0.01);
    });
  });

  describe('splitter', () => {
    let splitterRect;

    beforeEach(() => {
      splitterRect = splitLayout.$.splitter.getBoundingClientRect();
    });

    it('should have size of 8', () => {
      expect(splitterRect[size]).to.be.within(7.5, 8.5);
    });

    it('should have crossSize of container', () => {
      expect(splitterRect[crossSize]).to.equal(splitLayoutRect[crossSize]);
    });
  });

  describe('handle drag', () => {
    const distance = 30;
    const initialSize = (initialSizes[size] - 8) / 2;

    function dragHandle(d) {
      track(splitLayout.$.splitter, isVertical ? 0 : d, isVertical ? d : 0);
    }

    it('should resize forwards', () => {
      dragHandle(distance);

      expect(Math.abs(first.getBoundingClientRect()[size] - (initialSize + distance))).to.be.at.most(1);
      expect(Math.abs(second.getBoundingClientRect()[size] - (initialSize - distance))).to.be.at.most(1);
    });

    it('should resize backwards', () => {
      dragHandle(distance);
      dragHandle(-distance);

      expect(Math.abs(first.getBoundingClientRect()[size] - initialSize)).to.be.at.most(1);
      expect(Math.abs(second.getBoundingClientRect()[size] - initialSize)).to.be.at.most(1);
    });

    it('should collapse primary', () => {
      dragHandle(-initialSize);

      expect(first.getBoundingClientRect()[size]).to.equal(0);
    });

    it('should reveal primary', () => {
      dragHandle(-initialSize);
      dragHandle(initialSize);

      expect(Math.abs(first.getBoundingClientRect()[size] - initialSize)).to.be.at.most(1);
    });

    it('should collapse secondary', () => {
      dragHandle(initialSize);

      expect(second.getBoundingClientRect()[size]).to.equal(0);
    });

    it('should reveal secondary', () => {
      dragHandle(initialSize);
      dragHandle(-initialSize);

      expect(Math.abs(second.getBoundingClientRect()[size] - initialSize)).to.be.at.most(1);
    });

    it('should respect the container boundaries', () => {
      dragHandle(-initialSize * 2);

      expect(first.getBoundingClientRect()[size]).to.equal(0);
      expect(Math.abs(second.getBoundingClientRect()[size] - initialSize * 2)).to.be.at.most(0.1);

      dragHandle(initialSize * 2);

      expect(Math.abs(first.getBoundingClientRect()[size] - initialSize * 2)).to.be.at.most(0.1);
      expect(second.getBoundingClientRect()[size]).to.equal(0);
    });

    describe('min and max css limits', () => {
      const min = 20;
      const max = 40;
      const minSize = isVertical ? 'minHeight' : 'minWidth';
      const maxSize = isVertical ? 'maxHeight' : 'maxWidth';

      function testCssLimits(element, directionToMinimum) {
        dragHandle(directionToMinimum * initialSize * 2);

        expect(Math.abs(element.getBoundingClientRect()[size] - min)).to.be.at.most(0.1);

        dragHandle(-directionToMinimum * initialSize * 2);

        expect(Math.abs(element.getBoundingClientRect()[size] - max)).to.be.at.most(0.1);
      }

      it('should be respected on the first element', () => {
        first.style[minSize] = `${min}px`;
        first.style[maxSize] = `${max}px`;
        testCssLimits(first, -1);
      });

      it('should be  respected on the second element', () => {
        second.style[minSize] = `${min}px`;
        second.style[maxSize] = `${max}px`;
        testCssLimits(second, 1);
      });
    });

    it('should dispatch `splitter-dragend` event', () => {
      const spy = sinon.spy();
      splitLayout.addEventListener('splitter-dragend', spy);
      dragHandle(distance);
      expect(spy.called).to.be.true;
    });

    describe('RTL mode', () => {
      beforeEach(() => {
        splitLayout.setAttribute('dir', 'rtl');
      });

      it('should resize forwards', () => {
        dragHandle(distance);

        expect(
          Math.abs((isVertical ? first : second).getBoundingClientRect()[size] - (initialSize + distance)),
        ).to.be.at.most(1);
        expect(
          Math.abs((isVertical ? second : first).getBoundingClientRect()[size] - (initialSize - distance)),
        ).to.be.at.most(1);
      });

      it('should resize backwards', () => {
        dragHandle(distance);
        dragHandle(-distance);

        expect(Math.abs((isVertical ? first : second).getBoundingClientRect()[size] - initialSize)).to.be.at.most(1);
        expect(Math.abs((isVertical ? second : first).getBoundingClientRect()[size] - initialSize)).to.be.at.most(1);
      });
    });
  });
}

describe('horizontal mode', () => {
  beforeEach(async () => {
    splitLayout = fixtureSync(`
      <vaadin-split-layout>
        <div id="first">some content</div>
        <div id="second">some content</div>
      </vaadin-split-layout>
    `);
    splitLayout.style.width = `${initialSizes.width}px`;
    splitLayout.style.height = `${initialSizes.height}px`;
    await aTimeout(1);
    first = splitLayout.$.primary.assignedNodes({ flatten: true })[0];
    second = splitLayout.$.secondary.assignedNodes({ flatten: true })[0];
  });

  testDimensions(false);
});

describe('vertical mode', () => {
  beforeEach(async () => {
    splitLayout = fixtureSync(`
      <vaadin-split-layout>
        <div id="first">some content</div>
        <div id="second">some content</div>
      </vaadin-split-layout>
    `);
    splitLayout.style.width = `${initialSizes.width}px`;
    splitLayout.style.height = `${initialSizes.height}px`;
    splitLayout.orientation = 'vertical';
    await aTimeout(1);
    first = splitLayout.$.primary.assignedNodes({ flatten: true })[0];
    second = splitLayout.$.secondary.assignedNodes({ flatten: true })[0];
  });

  testDimensions(true);
});

describe('layout with one child', () => {
  beforeEach(async () => {
    splitLayout = fixtureSync(`
      <vaadin-split-layout>
        <div id="first">some content</div>
      </vaadin-split-layout>
    `);
    await aTimeout(1);
    first = splitLayout.$.primary.assignedNodes({ flatten: true })[0];
  });

  it('does not throw when setting and removing pointer-events', () => {
    const splitter = splitLayout.$.splitter;

    const downAndUp = () => {
      splitter.dispatchEvent(new Event('down', { bubbles: true }));
      splitter.dispatchEvent(new Event('up', { bubbles: true }));
    };

    expect(downAndUp).to.not.throw(Error);
  });
});

describe('removing nodes', () => {
  beforeEach(async () => {
    splitLayout = fixtureSync(`
      <vaadin-split-layout>
        <div id="first">some content</div>
        <div id="second">some content</div>
      </vaadin-split-layout>
    `);
    await aTimeout(0);
    first = splitLayout.$.primary.assignedNodes({ flatten: true })[0];
    second = splitLayout.$.secondary.assignedNodes({ flatten: true })[0];
  });

  it('should remove slot attribute from the removed node', async () => {
    splitLayout.removeChild(first);
    await nextFrame();
    expect(first.hasAttribute('slot')).to.be.false;
  });

  it('should not update splitter position on the removed node', async () => {
    splitLayout.removeChild(second);
    await nextFrame();
    track(splitLayout.$.splitter, -10, 0);
    expect(second.style.flex).to.be.not.ok;
  });

  it('should not dispatch `splitter-dragend` event if node is removed', async () => {
    const spy = sinon.spy();
    splitLayout.addEventListener('splitter-dragend', spy);
    splitLayout.removeChild(second);
    await nextFrame();
    track(splitLayout.$.splitter, -10, 0);
    expect(spy.called).to.be.false;
  });
});

describe('moving nodes between layouts', () => {
  beforeEach(async () => {
    splitLayout = fixtureSync(`
      <vaadin-split-layout>
        <div id="first">some content</div>
        <div id="second">some content</div>
      </vaadin-split-layout>
    `);
    await aTimeout(0);
    first = splitLayout.$.primary.assignedNodes({ flatten: true })[0];
    second = splitLayout.$.secondary.assignedNodes({ flatten: true })[0];
  });

  it('should not clear slot attribute when moving to a different split layout', async () => {
    const otherLayout = fixtureSync(`
      <vaadin-split-layout></vaadin-split-layout>
    `);
    otherLayout.appendChild(second);
    otherLayout.appendChild(first);
    await nextFrame();
    expect(second.getAttribute('slot')).to.equal('primary');
    expect(first.getAttribute('slot')).to.equal('secondary');
  });

  describe('nested Lit template', () => {
    let root;

    beforeEach(() => {
      root = fixtureSync('<div></div>');
    });

    it('should not throw when re-rendering child element conditionally', async () => {
      const fooTpl = html`<div>Foo</div>`;
      const nestedTpl = (foo) => (foo ? html`${fooTpl}` : html`<div>Bar</div>`);
      const parentTpl = (foo) => html`<vaadin-split-layout>${nestedTpl(foo)}</vaadin-split-layout>`;

      render(parentTpl(true), root);
      await nextFrame();

      render(parentTpl(false), root);
      await nextFrame();
    });
  });
});

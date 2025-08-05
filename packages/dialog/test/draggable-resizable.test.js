import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './draggable-resizable-styles.js';
import '../src/vaadin-dialog.js';

customElements.define(
  'internally-draggable',
  class extends HTMLElement {
    constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = `
        <div class="draggable">
          <span>draggable</span>
        </div>
      `;
    }
  },
);

function dispatchMouseEvent(target, type, coords = { x: 0, y: 0 }, button = 0) {
  const e = new MouseEvent(type, {
    view: window,
    bubbles: true,
    cancelable: true,
    clientX: coords.x,
    clientY: coords.y,
    composed: true,
    buttons: 1,
    button,
  });
  target.dispatchEvent(e);
}

function resize(target, dx, dy, mouseButton = 0) {
  const bounds = target.getBoundingClientRect();
  const fromXY = {
    x: Math.floor(bounds.left + bounds.width / 2),
    y: Math.floor(bounds.top + bounds.height / 2),
  };
  const toXY = { x: fromXY.x + dx, y: fromXY.y + dy };
  dispatchMouseEvent(target, 'mousedown', fromXY, mouseButton);
  dispatchMouseEvent(target, 'mousemove', fromXY, mouseButton);
  dispatchMouseEvent(target, 'mousemove', toXY, mouseButton);
  dispatchMouseEvent(target, 'mouseup', toXY, mouseButton);
}

describe('helper methods', () => {
  let wrapper, dialogs, dialog1, dialog2, overlay, overlayPart, container;

  beforeEach(async () => {
    wrapper = fixtureSync(`
      <div>
        <vaadin-dialog modeless draggable opened></vaadin-dialog>
        <vaadin-dialog modeless draggable opened></vaadin-dialog>
      </div>
    `);
    await nextRender();
    dialogs = wrapper.children;
    dialog1 = dialogs[0];
    dialog1.renderer = (root) => {
      root.innerHTML = '<div>Modeless dialog 1</div>';
    };
    await nextUpdate(dialog1);
    dialog2 = dialogs[1];
    dialog2.renderer = (root) => {
      root.innerHTML = '<div>Modeless dialog 2</div>';
    };
    await nextUpdate(dialog2);
    overlay = dialog1.$.overlay;
    overlayPart = overlay.$.overlay;
    container = overlay.$.resizerContainer;
  });

  it('should set bounds correctly', () => {
    const overlayBounds = dialog1.$.overlay.getBounds();
    dialog1.$.overlay.setBounds(overlayBounds);
    expect(parseFloat(overlayPart.style.top)).to.be.closeTo(overlayBounds.top, 1);
    expect(parseFloat(overlayPart.style.left)).to.be.closeTo(overlayBounds.left, 1);
    expect(parseFloat(overlayPart.style.width)).to.be.closeTo(overlayBounds.width, 1);
    expect(parseFloat(overlayPart.style.height)).to.be.closeTo(overlayBounds.height, 1);
  });

  it('should move dialog to top when dragged', () => {
    expect(dialog2.$.overlay._last).to.be.true;
    dispatchMouseEvent(overlay.$.content, 'mousedown');
    expect(dialog1.$.overlay._last).to.be.true;
  });

  it('should move dialog to top when content is clicked', () => {
    const div = dialog1.querySelector('div');
    expect(dialog2.$.overlay._last).to.be.true;
    dispatchMouseEvent(div, 'mousedown');
    expect(dialog1.$.overlay._last).to.be.true;
  });

  it('should move dialog to top when resized', () => {
    const resizer = overlayPart.querySelector('.n');
    expect(dialog2.$.overlay._last).to.be.true;
    dispatchMouseEvent(resizer, 'mousedown');
    expect(dialog1.$.overlay._last).to.be.true;
  });

  it('should not move to top if not modeless', async () => {
    dialog1.modeless = false;
    await nextUpdate(dialog1);
    const spy = sinon.spy(dialog1.$.overlay, 'bringToFront');
    dispatchMouseEvent(container, 'mousedown');
    expect(spy.called).to.be.false;
    expect(dialog1.$.overlay._last).to.be.false;
  });
});

describe('resizable', () => {
  let dialog, overlayPart, bounds, dx;

  beforeEach(async () => {
    dialog = fixtureSync(`
      <vaadin-dialog resizable modeless></vaadin-dialog>
    `);
    await nextRender();
    dialog.renderer = (root) => {
      root.innerHTML = '<div>Resizable dialog</div>';
    };
    dialog.opened = true;
    await nextRender();
    overlayPart = dialog.$.overlay.$.overlay;
    bounds = overlayPart.getBoundingClientRect();
    dx = 30;
  });

  it('should resize dialog from top right corner', async () => {
    resize(overlayPart.querySelector('.ne'), dx, -dx);
    await nextRender();
    const resizedBounds = overlayPart.getBoundingClientRect();
    expect(Math.floor(resizedBounds.top)).to.be.eql(Math.floor(bounds.top - dx));
    expect(Math.floor(resizedBounds.left)).to.be.eql(Math.floor(bounds.left));
    expect(Math.floor(resizedBounds.width)).to.be.eql(Math.floor(bounds.width + dx));
    expect(Math.floor(resizedBounds.height)).to.be.eql(Math.floor(bounds.height + dx));
  });

  it('should resize dialog from bottom right corner', async () => {
    resize(overlayPart.querySelector('.se'), dx, dx);
    await nextRender();
    const resizedBounds = overlayPart.getBoundingClientRect();
    expect(Math.floor(resizedBounds.top)).to.be.eql(Math.floor(bounds.top));
    expect(Math.floor(resizedBounds.left)).to.be.eql(Math.floor(bounds.left));
    expect(Math.floor(resizedBounds.width)).to.be.eql(Math.floor(bounds.width + dx));
    expect(Math.floor(resizedBounds.height)).to.be.eql(Math.floor(bounds.height + dx));
  });

  it('should resize dialog from bottom left corner', async () => {
    resize(overlayPart.querySelector('.sw'), -dx, dx);
    await nextRender();
    const resizedBounds = overlayPart.getBoundingClientRect();
    expect(Math.floor(resizedBounds.top)).to.be.eql(Math.floor(bounds.top));
    expect(Math.floor(resizedBounds.left)).to.be.eql(Math.floor(bounds.left - dx));
    expect(Math.floor(resizedBounds.width)).to.be.eql(Math.floor(bounds.width + dx));
    expect(Math.floor(resizedBounds.height)).to.be.eql(Math.floor(bounds.height + dx));
  });

  it('should resize dialog from top left corner', async () => {
    resize(overlayPart.querySelector('.nw'), -dx, -dx);
    await nextRender();
    const resizedBounds = overlayPart.getBoundingClientRect();
    expect(Math.floor(resizedBounds.top)).to.be.eql(Math.floor(bounds.top - dx));
    expect(Math.floor(resizedBounds.left)).to.be.eql(Math.floor(bounds.left - dx));
    expect(Math.floor(resizedBounds.width)).to.be.eql(Math.floor(bounds.width + dx));
    expect(Math.floor(resizedBounds.height)).to.be.eql(Math.floor(bounds.height + dx));
  });

  it('should resize dialog from top edge', async () => {
    resize(overlayPart.querySelector('.n'), 0, -dx);
    await nextRender();
    const resizedBounds = overlayPart.getBoundingClientRect();
    expect(Math.floor(resizedBounds.top)).to.be.eql(Math.floor(bounds.top - dx));
    expect(Math.floor(resizedBounds.left)).to.be.eql(Math.floor(bounds.left));
    expect(Math.floor(resizedBounds.width)).to.be.eql(Math.floor(bounds.width));
    expect(Math.floor(resizedBounds.height)).to.be.eql(Math.floor(bounds.height + dx));
  });

  it('should resize dialog from right edge', async () => {
    resize(overlayPart.querySelector('.e'), dx, 0);
    await nextRender();
    const resizedBounds = overlayPart.getBoundingClientRect();
    expect(Math.floor(resizedBounds.top)).to.be.eql(Math.floor(bounds.top));
    expect(Math.floor(resizedBounds.left)).to.be.eql(Math.floor(bounds.left));
    expect(Math.floor(resizedBounds.width)).to.be.eql(Math.floor(bounds.width + dx));
    expect(Math.floor(resizedBounds.height)).to.be.eql(Math.floor(bounds.height));
  });

  it('should resize dialog from bottom edge', async () => {
    resize(overlayPart.querySelector('.s'), 0, dx);
    await nextRender();
    const resizedBounds = overlayPart.getBoundingClientRect();
    expect(Math.floor(resizedBounds.top)).to.be.eql(Math.floor(bounds.top));
    expect(Math.floor(resizedBounds.left)).to.be.eql(Math.floor(bounds.left));
    expect(Math.floor(resizedBounds.width)).to.be.eql(Math.floor(bounds.width));
    expect(Math.floor(resizedBounds.height)).to.be.eql(Math.floor(bounds.height + dx));
  });

  it('should resize dialog from left edge', async () => {
    resize(overlayPart.querySelector('.w'), -dx, 0);
    await nextRender();
    const resizedBounds = overlayPart.getBoundingClientRect();
    expect(Math.floor(resizedBounds.top)).to.be.eql(Math.floor(bounds.top));
    expect(Math.floor(resizedBounds.left)).to.be.eql(Math.floor(bounds.left - dx));
    expect(Math.floor(resizedBounds.width)).to.be.eql(Math.floor(bounds.width + dx));
    expect(Math.floor(resizedBounds.height)).to.be.eql(Math.floor(bounds.height));
  });

  it('should resize content part when the overlay is resized', async () => {
    resize(overlayPart.querySelector('.w'), -dx, 0);
    await nextRender();

    const resizedBounds = overlayPart.getBoundingClientRect();
    const contentPartBounds = dialog.$.overlay.$.content.getBoundingClientRect();
    expect(Math.floor(resizedBounds.top)).to.be.eql(Math.floor(contentPartBounds.top));
    expect(Math.floor(resizedBounds.left)).to.be.eql(Math.floor(contentPartBounds.left));
    expect(Math.floor(resizedBounds.width)).to.be.eql(Math.floor(contentPartBounds.width));
    expect(Math.floor(resizedBounds.height)).to.be.eql(Math.floor(contentPartBounds.height));
  });

  it('should resize content part when the overlay is expanded vertically', async () => {
    resize(overlayPart.querySelector('.s'), 0, 10);
    await nextRender();

    const resizedBounds = overlayPart.getBoundingClientRect();
    const contentPartBounds = dialog.$.overlay.$.content.getBoundingClientRect();
    expect(Math.floor(resizedBounds.top)).to.be.eql(Math.floor(contentPartBounds.top));
    expect(Math.floor(resizedBounds.left)).to.be.eql(Math.floor(contentPartBounds.left));
    expect(Math.floor(resizedBounds.width)).to.be.eql(Math.floor(contentPartBounds.width));
    expect(Math.floor(resizedBounds.height)).to.be.eql(Math.floor(contentPartBounds.height));
  });

  it('should support scrollable full size content', () => {
    const container = dialog.firstElementChild;
    container.style.height = '100%';
    container.style.width = '100%';
    container.style.overflow = 'auto';
    container.textContent = new Array(10000).fill('foo').join(' ');

    const resizeContainer = dialog.$.overlay.$.resizerContainer;
    expect(container.offsetHeight).to.equal(resizeContainer.offsetHeight);
  });

  it('should scroll if the content overflows', () => {
    // Fill the content with a lot of text so that it overflows the viewport
    dialog.firstElementChild.textContent = new Array(10000).fill('foo').join(' ');

    const resizeContainer = dialog.$.overlay.$.resizerContainer;
    resizeContainer.scrollTop = 1;
    expect(resizeContainer.scrollTop).to.equal(1);

    // TODO change to this with base styles
    // const content = dialog.$.overlay.$.content;
    // content.scrollTop = 1;
    // expect(content.scrollTop).to.equal(1);
  });

  it('should expand content with relative height', () => {
    resize(overlayPart.querySelector('.s'), 0, 10);

    // Set the dialog content to have 100% height
    dialog.firstElementChild.style.height = '100%';

    const contentBounds = dialog.firstElementChild.getBoundingClientRect();
    const overlayBounds = overlayPart.getBoundingClientRect();
    expect(Math.floor(contentBounds.height)).to.equal(Math.floor(overlayBounds.height));
  });

  it('should not resize dialog if not left mouse button', () => {
    resize(overlayPart.querySelector('.w'), -dx, 0, 1);
    const resizedBounds = overlayPart.getBoundingClientRect();
    expect(Math.floor(resizedBounds.top)).to.be.eql(Math.floor(bounds.top));
    expect(Math.floor(resizedBounds.left)).to.be.eql(Math.floor(bounds.left));
    expect(Math.floor(resizedBounds.width)).to.be.eql(Math.floor(bounds.width));
    expect(Math.floor(resizedBounds.height)).to.be.eql(Math.floor(bounds.height));
  });

  it('should remove mousemove and mouseup event handlers after resize', () => {
    const resizer = overlayPart.querySelector('.n');
    resize(resizer, 0, -dx);
    dialog._resizeListeners.resize.n = sinon.spy();
    dialog._resizeListeners.stop.n = sinon.spy();
    dispatchMouseEvent(resizer, 'mousemove');
    dispatchMouseEvent(resizer, 'mouseup');
    expect(dialog._resizeListeners.resize.n.called).to.be.false;
    expect(dialog._resizeListeners.stop.n.called).to.be.false;
  });

  it('should not resize dialog past window left edge', () => {
    dx = Math.floor(window.innerWidth + dx);
    resize(overlayPart.querySelector('.w'), -dx, 0);
    const resizedBounds = overlayPart.getBoundingClientRect();
    expect(Math.floor(resizedBounds.top)).to.be.eql(Math.floor(bounds.top));
    expect(Math.floor(resizedBounds.left)).to.be.eql(Math.floor(bounds.left));
    expect(Math.floor(resizedBounds.width)).to.be.eql(Math.floor(bounds.width));
    expect(Math.floor(resizedBounds.height)).to.be.eql(Math.floor(bounds.height));
  });

  it('should be able to resize dialog to be wider than window', async () => {
    dialog.$.overlay.$.content.style.padding = '20px';
    dx = 20;
    dialog.$.overlay.setBounds({ left: -dx });
    dx = Math.floor(window.innerWidth - bounds.width + 5);
    resize(overlayPart.querySelector('.e'), dx, 0);
    await nextRender();
    const resizedBounds = overlayPart.getBoundingClientRect();
    expect(Math.floor(resizedBounds.width)).to.be.eql(Math.floor(bounds.width + dx));
  });

  it('should dispatch resize event with correct details', () => {
    const onResize = sinon.spy();
    dialog.addEventListener('resize', onResize);

    resize(overlayPart.querySelector('.w'), -dx, 0);

    const { detail } = onResize.firstCall.args[0];
    const resizedBounds = overlayPart.getBoundingClientRect();

    expect(onResize.calledOnce).to.be.true;
    expect(Math.floor(resizedBounds.width)).to.be.eql(parseInt(detail.width));
    expect(Math.floor(resizedBounds.height)).to.be.eql(parseInt(detail.height));
    expect(Math.floor(resizedBounds.left)).to.be.eql(parseInt(detail.left));
    expect(Math.floor(resizedBounds.top)).to.be.eql(parseInt(detail.top));
  });

  it('should update "width" and "height" properties on resize', async () => {
    resize(overlayPart.querySelector('.sw'), -dx, dx);
    await nextRender();
    const overlay = dialog.$.overlay.$.overlay;
    const bounds = overlay.getBoundingClientRect();
    expect(dialog.width).to.be.equal(bounds.width);
    expect(dialog.height).to.be.equal(bounds.height);
  });

  it('should set height on resize if "width" has been defined', async () => {
    dialog.width = '200px';
    const overlay = dialog.$.overlay.$.overlay;
    const bounds = overlay.getBoundingClientRect();
    resize(overlayPart.querySelector('.w'), dx, 0);
    await nextRender();
    expect(Math.floor(bounds.height)).to.equal(parseInt(overlay.style.height));
  });

  it('should set width on resize if "height" has been defined', async () => {
    dialog.height = '100px';
    const overlay = dialog.$.overlay.$.overlay;
    const bounds = overlay.getBoundingClientRect();
    resize(overlayPart.querySelector('.s'), 0, dx);
    await nextRender();
    expect(Math.floor(bounds.width)).to.equal(parseInt(overlay.style.width));
  });

  it('should set overlay max-width to none on resize', async () => {
    resize(overlayPart.querySelector('.s'), 0, dx);
    await nextRender();
    expect(getComputedStyle(dialog.$.overlay.$.overlay).maxWidth).to.equal('none');
  });
});

describe('draggable', () => {
  let dialog, container, content, button, bounds, dx;

  function drag(target, mouseButton = 0) {
    const bounds = target.getBoundingClientRect();
    const fromXY = {
      x: Math.floor(bounds.left + bounds.width / 2),
      y: Math.floor(bounds.top + bounds.height / 2),
    };
    const toXY = { x: fromXY.x + dx, y: fromXY.y + dx };
    dispatchMouseEvent(target, 'mousedown', fromXY, mouseButton);
    dispatchMouseEvent(target, 'mousemove', fromXY, mouseButton);
    dispatchMouseEvent(target, 'mousemove', toXY, mouseButton);
    dispatchMouseEvent(target, 'mouseup', toXY, mouseButton);
  }

  beforeEach(async () => {
    dialog = fixtureSync(`
      <vaadin-dialog draggable modeless></vaadin-dialog>
    `);
    await nextRender();
    dialog.renderer = (root) => {
      root.innerHTML = `
        <div>Draggable dialog</div>
        <div class="draggable">Draggable area</div>
        <internally-draggable></internally-draggable>
        <button>OK</button>
      `;
    };
    await nextUpdate(dialog);

    dialog.opened = true;
    await nextRender();

    container = dialog.$.overlay.$.resizerContainer;
    content = dialog.$.overlay.$.content;
    button = dialog.querySelector('button');
    bounds = container.getBoundingClientRect();
    dx = 100;
  });

  it('should drag and move dialog if mousedown on .resizer-container', async () => {
    drag(container);
    await nextRender();
    const draggedBounds = container.getBoundingClientRect();
    expect(Math.floor(draggedBounds.top)).to.be.eql(Math.floor(bounds.top + dx));
    expect(Math.floor(draggedBounds.left)).to.be.eql(Math.floor(bounds.left + dx));
  });

  it('should drag and move dialog if mousedown on [part="content"]', async () => {
    drag(content);
    await nextRender();
    const draggedBounds = container.getBoundingClientRect();
    expect(Math.floor(draggedBounds.top)).to.be.eql(Math.floor(bounds.top + dx));
    expect(Math.floor(draggedBounds.left)).to.be.eql(Math.floor(bounds.left + dx));
  });

  it('should drag and move dialog if mousedown on element with [class="draggable"]', async () => {
    drag(dialog.querySelector('.draggable'));
    await nextRender();
    const draggedBounds = container.getBoundingClientRect();
    expect(Math.floor(draggedBounds.top)).to.be.eql(Math.floor(bounds.top + dx));
    expect(Math.floor(draggedBounds.left)).to.be.eql(Math.floor(bounds.left + dx));
  });

  it('should only change "position", "top", and "left" values on drag', () => {
    drag(content);
    const overlay = dialog.$.overlay.$.overlay;
    const style = overlay.style;
    expect(style.length).to.be.eql(3);
    expect(style.position).to.be.ok;
    expect(style.top).to.be.ok;
    expect(style.left).to.be.ok;
  });

  it('should drag and move dialog if mousedown on element with [class="draggable"] in another shadow root', async () => {
    drag(dialog.querySelector('internally-draggable').shadowRoot.querySelector('.draggable'));
    await nextRender();
    const draggedBounds = container.getBoundingClientRect();
    expect(Math.floor(draggedBounds.top)).to.be.eql(Math.floor(bounds.top + dx));
    expect(Math.floor(draggedBounds.left)).to.be.eql(Math.floor(bounds.left + dx));
  });

  it('should not drag by a draggable-leaf-only if it is not the drag event target', () => {
    const draggable = dialog.querySelector('internally-draggable').shadowRoot.querySelector('.draggable');
    draggable.classList.add('draggable-leaf-only');
    const child = draggable.firstElementChild;
    drag(child);
    const draggedBounds = container.getBoundingClientRect();
    expect(Math.floor(draggedBounds.top)).to.be.eql(Math.floor(bounds.top));
    expect(Math.floor(draggedBounds.left)).to.be.eql(Math.floor(bounds.left));
  });

  it('should drag by a draggable-leaf-only if it is directly the dragged element', async () => {
    const draggable = dialog.querySelector('internally-draggable').shadowRoot.querySelector('.draggable');
    draggable.classList.add('draggable-leaf-only');
    drag(draggable);
    await nextRender();
    const draggedBounds = container.getBoundingClientRect();
    expect(Math.floor(draggedBounds.top)).to.be.eql(Math.floor(bounds.top + dx));
    expect(Math.floor(draggedBounds.left)).to.be.eql(Math.floor(bounds.left + dx));
  });

  it('should drag by a draggable-leaf-only child if it is marked as draggable', async () => {
    const draggable = dialog.querySelector('internally-draggable').shadowRoot.querySelector('.draggable');
    draggable.classList.add('draggable-leaf-only');
    const child = draggable.firstElementChild;
    child.classList.add('draggable');
    drag(child);
    await nextRender();
    const draggedBounds = container.getBoundingClientRect();
    expect(Math.floor(draggedBounds.top)).to.be.eql(Math.floor(bounds.top + dx));
    expect(Math.floor(draggedBounds.left)).to.be.eql(Math.floor(bounds.left + dx));
  });

  it('should drag by a draggable-leaf-only child if it is marked as draggable-leaf-only', async () => {
    const draggable = dialog.querySelector('internally-draggable').shadowRoot.querySelector('.draggable');
    draggable.classList.add('draggable-leaf-only');
    const child = draggable.firstElementChild;
    child.classList.add('draggable-leaf-only');
    drag(child);
    await nextRender();
    const draggedBounds = container.getBoundingClientRect();
    expect(Math.floor(draggedBounds.top)).to.be.eql(Math.floor(bounds.top + dx));
    expect(Math.floor(draggedBounds.left)).to.be.eql(Math.floor(bounds.left + dx));
  });

  it('should drag by a child of a draggable node ', async () => {
    const draggable = dialog.querySelector('internally-draggable').shadowRoot.querySelector('.draggable');
    const child = draggable.firstElementChild;
    drag(child);
    await nextRender();
    const draggedBounds = container.getBoundingClientRect();
    expect(Math.floor(draggedBounds.top)).to.be.eql(Math.floor(bounds.top + dx));
    expect(Math.floor(draggedBounds.left)).to.be.eql(Math.floor(bounds.left + dx));
  });

  it('should drag and move dialog after resizing', async () => {
    resize(container.querySelector('.s'), 0, dx);
    await nextRender();
    const bounds = container.getBoundingClientRect();
    const coords = { y: bounds.top + bounds.height / 2, x: bounds.left + bounds.width / 2 };
    const target = dialog.$.overlay.shadowRoot.elementFromPoint(coords.x, coords.y);
    drag(target);
    await nextRender();
    const draggedBounds = container.getBoundingClientRect();
    expect(Math.floor(draggedBounds.top)).to.be.eql(Math.floor(bounds.top + dx));
    expect(Math.floor(draggedBounds.left)).to.be.eql(Math.floor(bounds.left + dx));
  });

  it('should not drag dialog if mousedown not on [part="content"] or .resizer-container', () => {
    drag(content.querySelector('slot'));
    const draggedBounds = container.getBoundingClientRect();
    expect(Math.floor(draggedBounds.top)).to.be.eql(Math.floor(bounds.top));
    expect(Math.floor(draggedBounds.left)).to.be.eql(Math.floor(bounds.left));
  });

  it('should not drag dialog if mousedown on .resizer-container scrollbar', () => {
    const boundsSpy = sinon.spy(dialog.$.overlay, 'setBounds');
    content.style.width = `${content.clientWidth * 4}px`;
    const scrollbarHeight = container.offsetHeight - container.clientHeight;
    const containerBounds = container.getBoundingClientRect();
    dispatchMouseEvent(container, 'mousedown', {
      x: containerBounds.left + containerBounds.width / 2,
      y: containerBounds.top + containerBounds.height - scrollbarHeight / 2,
    });
    expect(boundsSpy.called).to.equal(!scrollbarHeight);
  });

  it('should not drag dialog if not left mouse button', () => {
    drag(container, 1);
    const draggedBounds = container.getBoundingClientRect();
    expect(Math.floor(draggedBounds.top)).to.be.eql(Math.floor(bounds.top));
    expect(Math.floor(draggedBounds.left)).to.be.eql(Math.floor(bounds.left));
  });

  it('should fire button click event when draggable', () => {
    const onClick = sinon.spy();
    button.addEventListener('click', onClick);
    button.dispatchEvent(new MouseEvent('click'));
    expect(onClick.calledOnce).to.be.true;
  });

  it('should remove mousemove and mouseup event handlers after drag', () => {
    drag(content);
    dialog._drag = sinon.spy();
    dialog._stopDrag = sinon.spy();
    dispatchMouseEvent(content, 'mousemove');
    dispatchMouseEvent(content, 'mouseup');
    expect(dialog._drag.called).to.be.false;
    expect(dialog._stopDrag.called).to.be.false;
  });

  it('should not drag dialog past window left edge', () => {
    dx = -Math.floor(window.innerWidth + dx);
    drag(container);
    const draggedBounds = container.getBoundingClientRect();
    expect(Math.floor(draggedBounds.top)).to.be.eql(Math.floor(bounds.top));
    expect(Math.floor(draggedBounds.left)).to.be.eql(Math.floor(bounds.left));
    expect(Math.floor(draggedBounds.width)).to.be.eql(Math.floor(bounds.width));
    expect(Math.floor(draggedBounds.height)).to.be.eql(Math.floor(bounds.height));
  });

  it('should not reset scroll position on dragstart', async () => {
    dialog.modeless = true;
    button.style.marginBottom = '200px';
    dialog.$.overlay.setBounds({ height: '100px' });
    await nextUpdate(dialog);
    // TODO use dialog.$.overlay.$.content.scrollTop with base styles
    container.scrollTop = 100;
    expect(container.scrollTop).to.equal(100);
    drag(container);
    expect(container.scrollTop).to.equal(100);
  });

  it('should update "top" and "left" properties on drag', async () => {
    drag(container);
    await nextRender();
    const overlay = dialog.$.overlay.$.overlay;
    const bounds = overlay.getBoundingClientRect();
    expect(dialog.top).to.be.equal(bounds.top);
    expect(dialog.left).to.be.equal(bounds.left);
  });

  it('should fire "dragged" event on drag', async () => {
    const onDragged = sinon.spy();
    dialog.addEventListener('dragged', onDragged);
    drag(container);
    await nextRender();
    expect(onDragged.calledOnce).to.be.true;
    const { detail } = onDragged.args[0][0];
    expect(detail.top).to.be.equal(dialog.top);
    expect(detail.left).to.be.equal(dialog.left);
  });

  it('should not set overlay max-width to none on drag', async () => {
    drag(container);
    await nextRender();
    expect(getComputedStyle(dialog.$.overlay.$.overlay).maxWidth).to.equal('100%');
  });
});

describe('touch', () => {
  function dispatchTouchEvent(target, type, coords = { x: 0, y: 0 }, multitouch = false) {
    const e = new CustomEvent(type, {
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    e.touches = [
      {
        clientX: coords.x,
        clientY: coords.y,
        pageX: coords.x,
        pageY: coords.y,
      },
    ];

    if (multitouch) {
      e.touches.push({
        clientX: coords.x + 10,
        clientY: coords.y + 10,
        pageX: coords.x + 10,
        pageY: coords.y + 10,
      });
    }
    target.dispatchEvent(e);
    return e;
  }

  function touchDrag(target, dx = 1, dy = 1, multitouch = false) {
    const bounds = target.getBoundingClientRect();
    const fromXY = {
      x: Math.floor(bounds.left + bounds.width / 2),
      y: Math.floor(bounds.top + bounds.height / 2),
    };
    const toXY = { x: fromXY.x + dx, y: fromXY.y + dy };
    dispatchTouchEvent(target, 'touchstart', fromXY, multitouch);
    dispatchTouchEvent(target, 'touchmove', toXY, multitouch);
    dispatchTouchEvent(target, 'touchend', toXY);
  }

  function touchResize(target, dx = 1, dy = 1, multitouch = false) {
    const bounds = target.getBoundingClientRect();
    const fromXY = {
      x: Math.floor(bounds.left + bounds.width / 2),
      y: Math.floor(bounds.top + bounds.height / 2),
    };

    const toXY = { x: fromXY.x + dx, y: fromXY.y + dy };
    dispatchTouchEvent(target, 'touchstart', fromXY, multitouch);
    dispatchTouchEvent(target, 'touchmove', toXY, multitouch);
    dispatchTouchEvent(target, 'touchend', toXY);
  }

  function getFrontmostDialogFromScreenCenter() {
    let elementFromPoint = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
    while (elementFromPoint && elementFromPoint.localName !== 'vaadin-dialog') {
      elementFromPoint = elementFromPoint.host || elementFromPoint.parentNode;
    }
    return elementFromPoint;
  }

  let resizable,
    draggable,
    resizableOverlay,
    resizableOverlayPart,
    draggableOverlay,
    resizableContainer,
    draggableContainer;

  beforeEach(async () => {
    resizable = fixtureSync('<vaadin-dialog resizable modeless></vaadin-dialog>');
    resizable.renderer = (root) => {
      root.innerHTML = `<div>Resizable dialog</div>`;
    };

    draggable = fixtureSync('<vaadin-dialog draggable modeless></vaadin-dialog>');
    draggable.renderer = (root) => {
      root.innerHTML = `
        <div>Draggable dialog</div>
        <div class="draggable">Draggable area</div>
        <internally-draggable></internally-draggable>
        <button>OK</button>
      `;
    };
    await nextRender();

    resizableOverlay = resizable.$.overlay;
    draggableOverlay = draggable.$.overlay;
    resizableContainer = resizableOverlay.$.resizerContainer;
    draggableContainer = draggableOverlay.$.resizerContainer;
    resizableOverlayPart = resizableOverlay.$.overlay;
    resizable.opened = true;
    draggable.opened = true;
    await nextRender();
  });

  it('should prevent default of the touchstart when dragged on desktop', () => {
    draggable._touchDevice = false;
    const e = dispatchTouchEvent(draggableOverlay.$.content, 'touchstart');
    expect(e.defaultPrevented).to.be.true;
  });

  it('should not prevent default of the touchmove events', () => {
    const e = dispatchTouchEvent(draggableOverlay.$.content, 'touchmove');
    expect(e.defaultPrevented).to.be.false;
  });

  it('should bring to front on touch start', () => {
    dispatchTouchEvent(resizableContainer, 'touchstart');
    expect(getFrontmostDialogFromScreenCenter()).to.equal(resizable);
  });

  it('should not move dialog if there more than two fingers used', () => {
    const d = 1;
    const bounds = draggableContainer.getBoundingClientRect();
    touchDrag(draggableContainer, d, d, true);
    const draggedBounds = draggableContainer.getBoundingClientRect();
    ['top', 'left'].forEach((prop) => expect(Math.floor(draggedBounds[prop])).to.be.eql(Math.floor(bounds[prop])));
  });

  it('should not resize dialog if there more than two fingers used', () => {
    const d = 100;
    const bounds = resizableContainer.getBoundingClientRect();
    touchResize(resizableOverlayPart.querySelector('.ne'), d, -d, true);
    const resizedBounds = resizableContainer.getBoundingClientRect();
    ['top', 'left', 'width', 'height'].forEach((prop) =>
      expect(Math.floor(resizedBounds[prop])).to.be.eql(Math.floor(bounds[prop])),
    );
  });

  it('should drag and move dialog', async () => {
    const d = 1;
    const bounds = draggableContainer.getBoundingClientRect();
    touchDrag(draggableContainer, d, d);
    await nextRender();
    const draggedBounds = draggableContainer.getBoundingClientRect();
    expect(Math.floor(draggedBounds.top)).to.be.eql(Math.floor(bounds.top + d));
    expect(Math.floor(draggedBounds.left)).to.be.eql(Math.floor(bounds.left + d));
  });

  it('should remove event handlers after drag', () => {
    touchDrag(draggableContainer);
    const bounds = draggableContainer.getBoundingClientRect();
    dispatchTouchEvent(draggableContainer, 'touchmove', { x: 1, y: 1 });
    const draggedBounds = draggableContainer.getBoundingClientRect();
    expect(draggedBounds.left).to.eql(bounds.left);
    expect(draggedBounds.top).to.eql(bounds.top);
  });

  it('should resize dialog from top right corner', async () => {
    const d = 100;
    const bounds = resizableOverlayPart.getBoundingClientRect();
    touchResize(resizableOverlayPart.querySelector('.ne'), d, -d);
    await nextRender();
    const resizedBounds = resizableOverlayPart.getBoundingClientRect();
    expect(Math.floor(resizedBounds.top)).to.be.eql(Math.floor(bounds.top - d));
    expect(Math.floor(resizedBounds.left)).to.be.eql(Math.floor(bounds.left));
    expect(Math.floor(resizedBounds.width)).to.be.eql(Math.floor(bounds.width + d));
    expect(Math.floor(resizedBounds.height)).to.be.eql(Math.floor(bounds.height + d));
  });

  it('should remove event handlers after resize', () => {
    touchResize(resizableOverlayPart.querySelector('.ne'));
    const bounds = resizableContainer.getBoundingClientRect();
    dispatchTouchEvent(resizableOverlayPart.querySelector('.ne'), 'touchmove', { x: 1, y: 1 });
    const resizedBounds = resizableContainer.getBoundingClientRect();
    expect(resizedBounds.left).to.eql(bounds.left);
    expect(resizedBounds.top).to.eql(bounds.top);

    const removeSpy = sinon.spy(resizable, '_stopResize');
    dispatchTouchEvent(resizableOverlayPart.querySelector('.ne'), 'touchend', { x: 1, y: 1 });
    expect(removeSpy.called).to.be.false;
  });
});

describe('bring to front', () => {
  let wrapper, modalDialog, modelessDialog;

  beforeEach(async () => {
    wrapper = fixtureSync(`
      <div>
        <vaadin-dialog id="modalDialog"></vaadin-dialog>
        <vaadin-dialog id="modelessDialog" modeless></vaadin-dialog>
      </div>
    `);
    await nextRender();
    [modalDialog, modelessDialog] = wrapper.children;

    modalDialog.renderer = (root) => {
      root.textContent = 'MODAL_DIALOG';
    };

    modelessDialog.renderer = (root) => {
      root.textContent = 'MODELESS_DIALOG';
    };
  });

  it('modal should not bring to front and close if a modeless dialog is on top', async () => {
    modalDialog.opened = true;
    modelessDialog.opened = true;
    await nextRender();

    const expectedTextContent = modelessDialog.innerText.trim();

    const windowCenterHeight = window.innerHeight / 2;
    const windowCenterWidth = window.innerWidth / 2;

    let actualTextContent = document.elementFromPoint(windowCenterWidth, windowCenterHeight).innerText.trim();
    expect(actualTextContent).to.be.equals(expectedTextContent);

    const modalBackdrop = modalDialog.$.overlay.$.backdrop;
    dispatchMouseEvent(modalBackdrop, 'mousedown');
    dispatchMouseEvent(modalBackdrop, 'click');

    actualTextContent = document.elementFromPoint(windowCenterWidth, windowCenterHeight).innerText.trim();
    expect(actualTextContent).to.be.eql(expectedTextContent);
    expect(modalDialog.opened).to.be.true;
  });
});

describe('overflowing content', () => {
  let dialog, overlay, overlayPart, container;

  beforeEach(async () => {
    dialog = fixtureSync(`
      <vaadin-dialog resizable opened modeless></vaadin-dialog>
    `);
    await nextRender();

    overlay = dialog.$.overlay;
    overlayPart = overlay.$.overlay;
    container = overlay.$.resizerContainer;
  });

  it('should set overflow attribute when adding content that overflows', async () => {
    const div = document.createElement('div');
    div.style.maxWidth = '300px';
    div.textContent = Array(100).join('Lorem ipsum dolor sit amet');
    dialog.appendChild(div);
    await nextRender();
    expect(dialog.hasAttribute('overflow')).to.be.true;
  });

  it('should not overflow when style attribute is set on the overlay part', () => {
    const div = document.createElement('div');
    div.style.maxWidth = '300px';
    div.style.overflow = 'auto';
    div.textContent = Array(100).join('Lorem ipsum dolor sit amet');
    dialog.appendChild(div);
    // Emulate removing "pointer-events: none"
    overlayPart.setAttribute('style', '');
    expect(overlayPart.offsetHeight).to.equal(container.offsetHeight);
  });

  it('should not reset scroll position on resize', async () => {
    const div = document.createElement('div');
    div.textContent = Array(100).join('Lorem ipsum dolor sit amet');
    dialog.appendChild(div);
    dialog.$.overlay.setBounds({ height: 200 });
    await nextFrame();
    overlay.$.content.style.padding = '20px';
    container.scrollTop = 100;
    // TODO change to this with new base styles
    // overlay.$.content.scrollTop = 100;
    resize(overlayPart.querySelector('.s'), 0, -50);
    await nextFrame();
    expect(container.scrollTop).to.equal(100);
    // TODO change to this with new base styles
    // expect(overlay.$.content.scrollTop).to.equal(100);
  });
});

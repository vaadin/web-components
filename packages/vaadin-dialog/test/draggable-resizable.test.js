import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync, nextFrame } from '@open-wc/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '../src/vaadin-dialog.js';

registerStyles(
  'vaadin-dialog-overlay',
  css`
    :host([opening]),
    :host([closing]),
    :host([opening]) [part='overlay'],
    :host([closing]) [part='overlay'] {
      animation: none !important;
    }
  `,
  { moduleId: 'not-animated-dialog-overlay' }
);

customElements.define(
  'internally-draggable',
  class extends PolymerElement {
    static get template() {
      return html` <div class="draggable">
        <span>draggable</span>
      </div>`;
    }
  }
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
    button
  });
  target.dispatchEvent(e);
}

function resize(target, dx, dy, mouseButton = 0) {
  const bounds = target.getBoundingClientRect();
  const fromXY = {
    x: Math.floor(bounds.left + bounds.width / 2),
    y: Math.floor(bounds.top + bounds.height / 2)
  };
  const toXY = { x: fromXY.x + dx, y: fromXY.y + dy };
  dispatchMouseEvent(target, 'mousedown', fromXY, mouseButton);
  dispatchMouseEvent(target, 'mousemove', fromXY, mouseButton);
  dispatchMouseEvent(target, 'mousemove', toXY, mouseButton);
  dispatchMouseEvent(target, 'mouseup', toXY, mouseButton);
}

describe('helper methods', () => {
  let wrapper, dialogs, dialog1, dialog2, overlay, overlayPart, container;

  beforeEach(() => {
    wrapper = fixtureSync(`
      <div>
        <vaadin-dialog modeless draggable opened>
          <template>
            <div>Modeless dialog 1</div>
          </template>
        </vaadin-dialog>
        <vaadin-dialog modeless draggable opened>
          <template>
            <div>Modeless dialog 2</div>
          </template>
        </vaadin-dialog>
      </div>
    `);
    dialogs = wrapper.children;
    dialog1 = dialogs[0];
    dialog2 = dialogs[1];
    overlay = dialog1.$.overlay;
    overlayPart = overlay.$.overlay;
    container = overlay.$.resizerContainer;
  });

  it('should set bounds correctly', () => {
    const overlayBounds = dialog1.$.overlay.getBounds();
    dialog1.$.overlay.setBounds(overlayBounds);
    expect(Math.floor(overlayPart.style.top)).to.be.eql(Math.floor(overlayBounds.top + 'px'));
    expect(Math.floor(overlayPart.style.left)).to.be.eql(Math.floor(overlayBounds.left + 'px'));
    expect(Math.floor(overlayPart.style.width)).to.be.eql(Math.floor(overlayBounds.width + 'px'));
    expect(Math.floor(overlayPart.style.height)).to.be.eql(Math.floor(overlayBounds.height + 'px'));
  });

  it('should move dialog to top when dragged', () => {
    expect(dialog2.$.overlay._last).to.be.true;
    dispatchMouseEvent(overlay.$.content, 'mousedown');
    expect(dialog1.$.overlay._last).to.be.true;
  });

  it('should move dialog to top when content is clicked', () => {
    const div = overlay.querySelector('div');
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

  it('should not move to top if not modeless', () => {
    dialog1.modeless = false;
    const spy = sinon.spy(dialog1.$.overlay, 'bringToFront');
    dispatchMouseEvent(container, 'mousedown');
    expect(spy.called).to.be.false;
    expect(dialog1.$.overlay._last).to.be.false;
  });
});

describe('resizable', () => {
  let dialog, overlayPart, bounds, dx;

  beforeEach(() => {
    dialog = fixtureSync(`
      <vaadin-dialog resizable opened modeless>
        <template>
          <div>Resizable dialog</div>
        </template>
      </vaadin-dialog>
    `);
    overlayPart = dialog.$.overlay.$.overlay;
    bounds = overlayPart.getBoundingClientRect();
    dx = 30;
  });

  it('should resize dialog from top right corner', () => {
    resize(overlayPart.querySelector('.ne'), dx, -dx);
    const resizedBounds = overlayPart.getBoundingClientRect();
    expect(Math.floor(resizedBounds.top)).to.be.eql(Math.floor(bounds.top - dx));
    expect(Math.floor(resizedBounds.left)).to.be.eql(Math.floor(bounds.left));
    expect(Math.floor(resizedBounds.width)).to.be.eql(Math.floor(bounds.width + dx));
    expect(Math.floor(resizedBounds.height)).to.be.eql(Math.floor(bounds.height + dx));
  });

  it('should resize dialog from bottom right corner', () => {
    resize(overlayPart.querySelector('.se'), dx, dx);
    const resizedBounds = overlayPart.getBoundingClientRect();
    expect(Math.floor(resizedBounds.top)).to.be.eql(Math.floor(bounds.top));
    expect(Math.floor(resizedBounds.left)).to.be.eql(Math.floor(bounds.left));
    expect(Math.floor(resizedBounds.width)).to.be.eql(Math.floor(bounds.width + dx));
    expect(Math.floor(resizedBounds.height)).to.be.eql(Math.floor(bounds.height + dx));
  });

  it('should resize dialog from bottom left corner', () => {
    resize(overlayPart.querySelector('.sw'), -dx, dx);
    const resizedBounds = overlayPart.getBoundingClientRect();
    expect(Math.floor(resizedBounds.top)).to.be.eql(Math.floor(bounds.top));
    expect(Math.floor(resizedBounds.left)).to.be.eql(Math.floor(bounds.left - dx));
    expect(Math.floor(resizedBounds.width)).to.be.eql(Math.floor(bounds.width + dx));
    expect(Math.floor(resizedBounds.height)).to.be.eql(Math.floor(bounds.height + dx));
  });

  it('should resize dialog from top left corner', () => {
    resize(overlayPart.querySelector('.nw'), -dx, -dx);
    const resizedBounds = overlayPart.getBoundingClientRect();
    expect(Math.floor(resizedBounds.top)).to.be.eql(Math.floor(bounds.top - dx));
    expect(Math.floor(resizedBounds.left)).to.be.eql(Math.floor(bounds.left - dx));
    expect(Math.floor(resizedBounds.width)).to.be.eql(Math.floor(bounds.width + dx));
    expect(Math.floor(resizedBounds.height)).to.be.eql(Math.floor(bounds.height + dx));
  });

  it('should resize dialog from top edge', () => {
    resize(overlayPart.querySelector('.n'), 0, -dx);
    const resizedBounds = overlayPart.getBoundingClientRect();
    expect(Math.floor(resizedBounds.top)).to.be.eql(Math.floor(bounds.top - dx));
    expect(Math.floor(resizedBounds.left)).to.be.eql(Math.floor(bounds.left));
    expect(Math.floor(resizedBounds.width)).to.be.eql(Math.floor(bounds.width));
    expect(Math.floor(resizedBounds.height)).to.be.eql(Math.floor(bounds.height + dx));
  });

  it('should resize dialog from right edge', () => {
    resize(overlayPart.querySelector('.e'), dx, 0);
    const resizedBounds = overlayPart.getBoundingClientRect();
    expect(Math.floor(resizedBounds.top)).to.be.eql(Math.floor(bounds.top));
    expect(Math.floor(resizedBounds.left)).to.be.eql(Math.floor(bounds.left));
    expect(Math.floor(resizedBounds.width)).to.be.eql(Math.floor(bounds.width + dx));
    expect(Math.floor(resizedBounds.height)).to.be.eql(Math.floor(bounds.height));
  });

  it('should resize dialog from bottom edge', () => {
    resize(overlayPart.querySelector('.s'), 0, dx);
    const resizedBounds = overlayPart.getBoundingClientRect();
    expect(Math.floor(resizedBounds.top)).to.be.eql(Math.floor(bounds.top));
    expect(Math.floor(resizedBounds.left)).to.be.eql(Math.floor(bounds.left));
    expect(Math.floor(resizedBounds.width)).to.be.eql(Math.floor(bounds.width));
    expect(Math.floor(resizedBounds.height)).to.be.eql(Math.floor(bounds.height + dx));
  });

  it('should resize dialog from left edge', () => {
    resize(overlayPart.querySelector('.w'), -dx, 0);
    const resizedBounds = overlayPart.getBoundingClientRect();
    expect(Math.floor(resizedBounds.top)).to.be.eql(Math.floor(bounds.top));
    expect(Math.floor(resizedBounds.left)).to.be.eql(Math.floor(bounds.left - dx));
    expect(Math.floor(resizedBounds.width)).to.be.eql(Math.floor(bounds.width + dx));
    expect(Math.floor(resizedBounds.height)).to.be.eql(Math.floor(bounds.height));
  });

  it('should resize content part when the overlay is resized', () => {
    resize(overlayPart.querySelector('.w'), -dx, 0);

    const resizedBounds = overlayPart.getBoundingClientRect();
    const contentPartBounds = dialog.$.overlay.$.content.getBoundingClientRect();
    expect(Math.floor(resizedBounds.top)).to.be.eql(Math.floor(contentPartBounds.top));
    expect(Math.floor(resizedBounds.left)).to.be.eql(Math.floor(contentPartBounds.left));
    expect(Math.floor(resizedBounds.width)).to.be.eql(Math.floor(contentPartBounds.width));
    expect(Math.floor(resizedBounds.height)).to.be.eql(Math.floor(contentPartBounds.height));
  });

  it('should resize content part when the overlay is expanded vertically', () => {
    resize(overlayPart.querySelector('.s'), 0, 10);

    const resizedBounds = overlayPart.getBoundingClientRect();
    const contentPartBounds = dialog.$.overlay.$.content.getBoundingClientRect();
    expect(Math.floor(resizedBounds.top)).to.be.eql(Math.floor(contentPartBounds.top));
    expect(Math.floor(resizedBounds.left)).to.be.eql(Math.floor(contentPartBounds.left));
    expect(Math.floor(resizedBounds.width)).to.be.eql(Math.floor(contentPartBounds.width));
    expect(Math.floor(resizedBounds.height)).to.be.eql(Math.floor(contentPartBounds.height));
  });

  it('should support scrollable full size content', () => {
    const container = dialog.$.overlay.firstElementChild;
    container.style.height = '100%';
    container.style.width = '100%';
    container.style.overflow = 'auto';
    container.textContent = Array(...new Array(10000))
      .map(() => 'foo')
      .join(' ');

    const resizeContainer = dialog.$.overlay.$.resizerContainer;
    expect(container.offsetHeight).to.equal(resizeContainer.offsetHeight);
  });

  it('should scroll if the content overflows', () => {
    // Fill the content with a lot of text so that it overflows the viewport
    dialog.$.overlay.firstElementChild.textContent = Array(...new Array(10000))
      .map(() => 'foo')
      .join(' ');

    const resizeContainer = dialog.$.overlay.$.resizerContainer;
    resizeContainer.scrollTop = 1;
    expect(resizeContainer.scrollTop).to.equal(1);
  });

  it('should expand content with relative height', () => {
    resize(overlayPart.querySelector('.s'), 0, 10);

    // Set the dialog content to have 100% height
    dialog.$.overlay.firstElementChild.style.height = '100%';

    const contentBounds = dialog.$.overlay.firstElementChild.getBoundingClientRect();
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
    dialog._resizeListeners.resize['n'] = sinon.spy();
    dialog._resizeListeners.stop['n'] = sinon.spy();
    dispatchMouseEvent(resizer, 'mousemove');
    dispatchMouseEvent(resizer, 'mouseup');
    expect(dialog._resizeListeners.resize['n'].called).to.be.false;
    expect(dialog._resizeListeners.stop['n'].called).to.be.false;
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

  it('should be able to resize dialog to be wider than window', () => {
    dialog.$.overlay.$.content.style.padding = '20px';
    dx = 20;
    dialog.$.overlay.setBounds({ left: -dx });
    dx = Math.floor(window.innerWidth - bounds.width + 5);
    resize(overlayPart.querySelector('.e'), dx, 0);
    const resizedBounds = overlayPart.getBoundingClientRect();
    expect(Math.floor(resizedBounds.width)).to.be.eql(Math.floor(bounds.width + dx));
  });

  it('should not set bounds again after position is set to absolute', () => {
    const spy = sinon.spy(dialog.$.overlay, 'setBounds');
    dispatchMouseEvent(overlayPart.querySelector('.n'), 'mousedown');
    dialog.$.overlay.$.overlay.style.position = 'absolute';
    dispatchMouseEvent(overlayPart.querySelector('.n'), 'mousedown');
    expect(spy.calledOnce).to.be.true;
  });

  it('should dispatch resize event with correct details', () => {
    const onResize = sinon.spy();
    const content = dialog.$.overlay.$.content;
    let detail = {};
    dialog.addEventListener('resize', onResize);
    dialog.addEventListener('resize', (e) => (detail = e.detail));
    resize(overlayPart.querySelector('.w'), -dx, 0);

    const resizedBounds = overlayPart.getBoundingClientRect();
    const contentStyles = getComputedStyle(content);
    const verticalPadding =
      parseInt(contentStyles.paddingTop) +
      parseInt(contentStyles.paddingBottom) +
      parseInt(contentStyles.borderTopWidth) +
      parseInt(contentStyles.borderBottomWidth);
    content.style.boxSizing = 'content-box';

    expect(onResize.calledOnce).to.be.true;
    expect(Math.floor(resizedBounds.width)).to.be.eql(parseInt(detail.width));
    expect(Math.floor(resizedBounds.height)).to.be.eql(parseInt(detail.height));
    expect(parseInt(detail.contentWidth)).to.be.eql(parseInt(contentStyles.width));
    expect(parseInt(detail.contentHeight)).to.be.eql(parseInt(contentStyles.height) - verticalPadding);
  });
});

describe('draggable', () => {
  let dialog, container, content, button, bounds, dx;

  function drag(target, mouseButton = 0) {
    const bounds = target.getBoundingClientRect();
    const fromXY = {
      x: Math.floor(bounds.left + bounds.width / 2),
      y: Math.floor(bounds.top + bounds.height / 2)
    };
    const toXY = { x: fromXY.x + dx, y: fromXY.y + dx };
    dispatchMouseEvent(target, 'mousedown', fromXY, mouseButton);
    dispatchMouseEvent(target, 'mousemove', fromXY, mouseButton);
    dispatchMouseEvent(target, 'mousemove', toXY, mouseButton);
    dispatchMouseEvent(target, 'mouseup', toXY, mouseButton);
  }

  beforeEach(() => {
    dialog = fixtureSync(`
      <vaadin-dialog draggable opened modeless>
        <template>
          <div>Draggable dialog</div>
          <div class="draggable">Draggable area</div>
          <internally-draggable></internally-draggable>
          <button>OK</button>
        </template>
      </vaadin-dialog>
    `);
    container = dialog.$.overlay.$.resizerContainer;
    content = dialog.$.overlay.$.content;
    button = dialog.$.overlay.querySelector('button');
    bounds = container.getBoundingClientRect();
    dx = 100;
  });

  it('should drag and move dialog if mousedown on .resizer-container', () => {
    drag(container);
    const draggedBounds = container.getBoundingClientRect();
    expect(Math.floor(draggedBounds.top)).to.be.eql(Math.floor(bounds.top + dx));
    expect(Math.floor(draggedBounds.left)).to.be.eql(Math.floor(bounds.left + dx));
  });

  it('should drag and move dialog if mousedown on [part="content"]', () => {
    drag(content);
    const draggedBounds = container.getBoundingClientRect();
    expect(Math.floor(draggedBounds.top)).to.be.eql(Math.floor(bounds.top + dx));
    expect(Math.floor(draggedBounds.left)).to.be.eql(Math.floor(bounds.left + dx));
  });

  it('should drag and move dialog if mousedown on element with [class="draggable"]', () => {
    drag(dialog.$.overlay.querySelector('.draggable'));
    const draggedBounds = container.getBoundingClientRect();
    expect(Math.floor(draggedBounds.top)).to.be.eql(Math.floor(bounds.top + dx));
    expect(Math.floor(draggedBounds.left)).to.be.eql(Math.floor(bounds.left + dx));
  });

  it('should drag and move dialog if mousedown on element with [class="draggable"] in another shadow root', () => {
    drag(dialog.$.overlay.querySelector('internally-draggable').shadowRoot.querySelector('.draggable'));
    const draggedBounds = container.getBoundingClientRect();
    expect(Math.floor(draggedBounds.top)).to.be.eql(Math.floor(bounds.top + dx));
    expect(Math.floor(draggedBounds.left)).to.be.eql(Math.floor(bounds.left + dx));
  });

  it('should not drag by a draggable-leaf-only if it is not the drag event target', () => {
    const draggable = dialog.$.overlay.querySelector('internally-draggable').shadowRoot.querySelector('.draggable');
    draggable.classList.add('draggable-leaf-only');
    const child = draggable.firstElementChild;
    drag(child);
    const draggedBounds = container.getBoundingClientRect();
    expect(Math.floor(draggedBounds.top)).to.be.eql(Math.floor(bounds.top));
    expect(Math.floor(draggedBounds.left)).to.be.eql(Math.floor(bounds.left));
  });

  it('should drag by a draggable-leaf-only if it is directly the dragged element', () => {
    const draggable = dialog.$.overlay.querySelector('internally-draggable').shadowRoot.querySelector('.draggable');
    draggable.classList.add('draggable-leaf-only');
    drag(draggable);
    const draggedBounds = container.getBoundingClientRect();
    expect(Math.floor(draggedBounds.top)).to.be.eql(Math.floor(bounds.top + dx));
    expect(Math.floor(draggedBounds.left)).to.be.eql(Math.floor(bounds.left + dx));
  });

  it('should drag by a draggable-leaf-only child if it is marked as draggable', () => {
    const draggable = dialog.$.overlay.querySelector('internally-draggable').shadowRoot.querySelector('.draggable');
    draggable.classList.add('draggable-leaf-only');
    const child = draggable.firstElementChild;
    child.classList.add('draggable');
    drag(child);
    const draggedBounds = container.getBoundingClientRect();
    expect(Math.floor(draggedBounds.top)).to.be.eql(Math.floor(bounds.top + dx));
    expect(Math.floor(draggedBounds.left)).to.be.eql(Math.floor(bounds.left + dx));
  });

  it('should drag by a draggable-leaf-only child if it is marked as draggable-leaf-only', () => {
    const draggable = dialog.$.overlay.querySelector('internally-draggable').shadowRoot.querySelector('.draggable');
    draggable.classList.add('draggable-leaf-only');
    const child = draggable.firstElementChild;
    child.classList.add('draggable-leaf-only');
    drag(child);
    const draggedBounds = container.getBoundingClientRect();
    expect(Math.floor(draggedBounds.top)).to.be.eql(Math.floor(bounds.top + dx));
    expect(Math.floor(draggedBounds.left)).to.be.eql(Math.floor(bounds.left + dx));
  });

  it('should drag by a child of a draggable node ', () => {
    const draggable = dialog.$.overlay.querySelector('internally-draggable').shadowRoot.querySelector('.draggable');
    const child = draggable.firstElementChild;
    drag(child);
    const draggedBounds = container.getBoundingClientRect();
    expect(Math.floor(draggedBounds.top)).to.be.eql(Math.floor(bounds.top + dx));
    expect(Math.floor(draggedBounds.left)).to.be.eql(Math.floor(bounds.left + dx));
  });

  it('should drag and move dialog after resizing', () => {
    resize(container.querySelector('.s'), 0, dx);
    const bounds = container.getBoundingClientRect();
    const coords = { y: bounds.top + bounds.height / 2, x: bounds.left + bounds.width / 2 };
    const target = dialog.$.overlay.shadowRoot.elementFromPoint(coords.x, coords.y);
    drag(target);
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
    content.style.width = content.clientWidth * 4 + 'px';
    const scrollbarHeight = container.offsetHeight - container.clientHeight;
    const containerBounds = container.getBoundingClientRect();
    dispatchMouseEvent(container, 'mousedown', {
      x: containerBounds.left + containerBounds.width / 2,
      y: containerBounds.top + containerBounds.height - scrollbarHeight / 2
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

  it('should not update overlay bounds with position: absolute', () => {
    const spy = sinon.spy(dialog.$.overlay, 'setBounds');
    dispatchMouseEvent(content, 'mousedown');
    dialog.$.overlay.$.overlay.style.position = 'absolute';
    dispatchMouseEvent(content, 'mousedown');
    expect(spy.calledOnce).to.be.true;
  });

  it('should not reset scroll position on dragstart', async () => {
    dialog.modeless = true;
    button.style.marginBottom = '200px';
    dialog.$.overlay.setBounds({ height: '100px' });
    await nextFrame();
    container.scrollTop = 100;
    expect(container.scrollTop).to.equal(100);
    drag(container);
    expect(container.scrollTop).to.equal(100);
  });
});

describe('touch', () => {
  function dispatchTouchEvent(target, type, coords = { x: 0, y: 0 }, multitouch = false) {
    const e = new CustomEvent(type, {
      bubbles: true,
      cancelable: true,
      composed: true
    });
    e.touches = [
      {
        clientX: coords.x,
        clientY: coords.y,
        pageX: coords.x,
        pageY: coords.y
      }
    ];

    if (multitouch) {
      e.touches.push({
        clientX: coords.x + 10,
        clientY: coords.y + 10,
        pageX: coords.x + 10,
        pageY: coords.y + 10
      });
    }
    target.dispatchEvent(e);
    return e;
  }

  function touchDrag(target, dx = 1, dy = 1, multitouch = false) {
    const bounds = target.getBoundingClientRect();
    const fromXY = {
      x: Math.floor(bounds.left + bounds.width / 2),
      y: Math.floor(bounds.top + bounds.height / 2)
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
      y: Math.floor(bounds.top + bounds.height / 2)
    };

    const toXY = { x: fromXY.x + dx, y: fromXY.y + dy };
    dispatchTouchEvent(target, 'touchstart', fromXY, multitouch);
    dispatchTouchEvent(target, 'touchmove', toXY, multitouch);
    dispatchTouchEvent(target, 'touchend', toXY);
  }

  function getFrontmostOverlayFromScreenCenter() {
    let elementFromPoint = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
    while (elementFromPoint && elementFromPoint.localName !== 'vaadin-dialog-overlay') {
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

  beforeEach(() => {
    resizable = fixtureSync(`
      <vaadin-dialog resizable opened modeless>
        <template>
          <div>Resizable dialog</div>
        </template>
      </vaadin-dialog>
    `);
    draggable = fixtureSync(`
      <vaadin-dialog draggable opened modeless>
        <template>
          <div>Draggable dialog</div>
          <div class="draggable">Draggable area</div>
          <internally-draggable></internally-draggable>
          <button>OK</button>
        </template>
      </vaadin-dialog>
    `);
    resizableOverlay = resizable.$.overlay;
    draggableOverlay = draggable.$.overlay;
    resizableContainer = resizableOverlay.$.resizerContainer;
    draggableContainer = draggableOverlay.$.resizerContainer;
    resizableOverlayPart = resizableOverlay.$.overlay;
    resizable.opened = true;
    draggable.opened = true;
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
    expect(getFrontmostOverlayFromScreenCenter()).to.equal(resizableOverlay);
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
      expect(Math.floor(resizedBounds[prop])).to.be.eql(Math.floor(bounds[prop]))
    );
  });

  it('should drag and move dialog', () => {
    const d = 1;
    const bounds = draggableContainer.getBoundingClientRect();
    touchDrag(draggableContainer, d, d);
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

  it('should resize dialog from top right corner', () => {
    const d = 100;
    const bounds = resizableOverlayPart.getBoundingClientRect();
    touchResize(resizableOverlayPart.querySelector('.ne'), d, -d);
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
  let wrapper, dialogs, modalDialog, modelessDialog;

  beforeEach(() => {
    wrapper = fixtureSync(`
      <div>
        <vaadin-dialog id="modalDialog">
          <template>
            MODAL_DIALOG
          </template>
        </vaadin-dialog>
        <vaadin-dialog id="modelessDialog" modeless>
          <template>
            MODELESS_DIALOG
          </template>
        </vaadin-dialog>
      </div>
    `);
    dialogs = wrapper.children;
    modalDialog = dialogs[0];
    modelessDialog = dialogs[1];
  });

  it('modal should not bring to front and close if a modeless dialog is on top', () => {
    modalDialog.opened = true;
    modelessDialog.opened = true;

    const expectedTextContent = modelessDialog.$.overlay.innerText.trim();

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

  beforeEach(() => {
    dialog = fixtureSync(`
      <vaadin-dialog resizable opened modeless>
        <template></template>
      </vaadin-dialog>
    `);
    overlay = dialog.$.overlay;
    overlayPart = overlay.$.overlay;
    container = overlay.$.resizerContainer;
  });

  it('should not overflow when style attribute is set on the overlay part', () => {
    const div = document.createElement('div');
    div.style.maxWidth = '300px';
    div.style.overflow = 'auto';
    div.textContent = Array(100).join('Lorem ipsum dolor sit amet');
    overlay.content.appendChild(div);
    // emulate removing "pointer-events: none"
    overlayPart.setAttribute('style', '');
    expect(overlayPart.offsetHeight).to.equal(container.offsetHeight);
  });

  it('should not overflow when using vaadin-textarea in the content', async () => {
    const textarea = document.createElement('vaadin-text-area');
    textarea.value = Array(20).join('Lorem ipsum dolor sit amet');
    overlay.content.appendChild(textarea);
    overlay.$.content.style.padding = '20px';
    resize(overlayPart.querySelector('.s'), 0, -50);
    await nextFrame();
    expect(getComputedStyle(overlayPart).height).to.equal(getComputedStyle(container).height);
  });

  it('should not reset scroll position on resize', async () => {
    const div = document.createElement('div');
    div.textContent = Array(100).join('Lorem ipsum dolor sit amet');
    overlay.content.appendChild(div);
    dialog.$.overlay.setBounds({ height: 200 });
    await nextFrame();
    overlay.$.content.style.padding = '20px';
    container.scrollTop = 100;
    resize(overlayPart.querySelector('.s'), 0, -50);
    await nextFrame();
    expect(container.scrollTop).to.equal(100);
  });
});

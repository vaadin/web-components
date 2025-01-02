/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { getElementItem, getItemsArrayOfItem, itemsEqual, WRAPPER_LOCAL_NAME } from './vaadin-dashboard-helpers.js';

const REORDER_EVENT_TIMEOUT = 200;
const REORDER_MOVE_THRESHOLD = 10;

/**
 * A controller to widget reordering inside a dashboard.
 */
export class WidgetReorderController {
  constructor(host) {
    this.host = host;
    this.draggedElementRemoveObserver = new MutationObserver(() => this.__restoreDraggedElement());

    host.addEventListener('dragstart', (e) => this.__dragStart(e));
    host.addEventListener('dragend', (e) => this.__dragEnd(e));
    host.addEventListener('dragover', (e) => this.__dragOver(e));
    host.addEventListener('drop', (e) => this.__drop(e));
    host.addEventListener('item-move', (e) => this.__itemMove(e));
  }

  /** @private */
  __dragStart(e) {
    const handle = [...e.composedPath()].find((el) => el.classList && el.classList.contains('drag-handle'));
    if (!handle) {
      return;
    }

    this.__draggedElement = e.target;

    // Avoid having the selection/focus outline styles in the drag image
    this.__draggedElement.__exitMode();
    this.__draggedElement.__focused = false;
    this.__draggedElement.__selected = false;

    this.draggedItem = getElementItem(this.__draggedElement);

    // Set the drag image to the dragged element
    const { left, top } = this.__draggedElement.getBoundingClientRect();
    e.dataTransfer.setDragImage(this.__draggedElement, e.clientX - left, e.clientY - top);
    // Set the text/plain data to enable dragging on mobile devices
    e.dataTransfer.setData('text/plain', 'item');

    // Observe the removal of the dragged element from the DOM
    this.draggedElementRemoveObserver.observe(this.host, { childList: true, subtree: true });

    requestAnimationFrame(() => {
      // Re-render to have the dragged element turn into a placeholder
      this.host.items = [...this.host.items];
    });
  }

  /** @private */
  __dragOver(e) {
    if (!this.draggedItem) {
      return;
    }

    // The location against which we measure the drag distance
    this.__startX ||= e.clientX;
    this.__startY ||= e.clientY;

    // Delta values for the current drag event
    const currentDx = e.clientX - (this.__previousX || e.clientX);
    const currentDy = e.clientY - (this.__previousY || e.clientY);
    this.__previousX = e.clientX;
    this.__previousY = e.clientY;

    if (currentDx && this.__dx && Math.sign(currentDx) !== Math.sign(this.__dx)) {
      // If the direction of the drag changes, reset the start position
      this.__startX = e.clientX;
    }
    if (currentDy && this.__dy && Math.sign(currentDy) !== Math.sign(this.__dy)) {
      // If the direction of the drag changes, reset the start position
      this.__startY = e.clientY;
    }

    // The delta values for the drag event against the start position
    this.__dx = e.clientX - this.__startX;
    this.__dy = e.clientY - this.__startY;

    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    // Get all elements that are candidates for reordering with the dragged element
    const dragContextElements = this.__getDragContextElements(this.__draggedElement);
    // Find the up-to-date element instance representing the dragged item
    const draggedElement = dragContextElements.find((element) => getElementItem(element) === this.draggedItem);
    if (!draggedElement) {
      return;
    }
    // Get all elements except the dragged element from the drag context
    const otherElements = dragContextElements.filter((element) => element !== draggedElement);
    if (otherElements.length === 0) {
      return;
    }

    // Find the element that is being dragged over
    let targetElement = otherElements.find((other) => other.contains(e.target));
    if (!targetElement) {
      // Find the element closest to the x and y coordinates of the drag event
      targetElement = this.__getClosestElement(otherElements, e.clientX, e.clientY);
    }

    // Check if the dragged element is dragged enough over the target element
    if (
      !this.__reordering &&
      this.__isDraggedOver(draggedElement, targetElement, {
        x: e.clientX,
        y: e.clientY,
        dx: this.__dx,
        dy: this.__dy,
      })
    ) {
      // Prevent reordering multiple times in quick succession
      this.__reordering = true;
      setTimeout(() => {
        this.__reordering = false;
      }, REORDER_EVENT_TIMEOUT);

      const targetItem = getElementItem(targetElement);
      const targetItems = getItemsArrayOfItem(targetItem, this.host.items);
      const targetIndex = targetItems.indexOf(targetItem);

      this.__reorderItems(this.draggedItem, targetIndex);
    }
  }

  /** @private */
  __dragEnd() {
    if (!this.draggedItem) {
      return;
    }

    this.__previousX = null;
    this.__previousY = null;
    this.__startX = null;
    this.__startY = null;
    this.__dx = null;
    this.__dy = null;

    // If the originally dragged element is restored to the DOM (as a direct child of the host),
    // to make sure "dragend" event gets dispatched, remove it to avoid duplicates
    if (this.__draggedElement.parentElement === this.host) {
      this.__draggedElement.remove();
    }

    // Dispatch the moved event
    this.__fireItemMovedEvent(this.draggedItem);

    // Reset the dragged element and item, and re-render to remove the placeholder
    this.__draggedElement = null;
    this.draggedItem = null;
    this.host.items = [...this.host.items];

    // Disconnect the observer for the dragged element removal
    this.draggedElementRemoveObserver.disconnect();
  }

  /** @private */
  __fireItemMovedEvent(item) {
    const section = this.host.items.find((hostItem) => hostItem.items && hostItem.items.includes(item));
    this.host.dispatchEvent(
      new CustomEvent('dashboard-item-moved', {
        detail: { item, items: this.host.items, section },
      }),
    );
  }

  /** @private */
  __drop(e) {
    if (!this.draggedItem) {
      return;
    }
    e.preventDefault();
  }

  /**
   * Returns the element closest to the given coordinates.
   * @private
   */
  __getClosestElement(elements, x, y) {
    return elements.reduce(
      (closest, element) => {
        const { left, top, width, height } = element.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        const distance = Math.hypot(centerX - x, centerY - y);

        return distance < closest.distance ? { element, distance } : closest;
      },
      { element: null, distance: Number.MAX_VALUE },
    ).element;
  }

  /**
   * Returns true if the dragged element is dragged enough over the target element in
   * the direction relative to their positions where x and y are the coordinates
   * of the drag event.
   * @private
   */
  __isDraggedOver(draggedElement, targetElement, { x, y, dx, dy }) {
    const draggedPos = draggedElement.getBoundingClientRect();
    const targetPos = targetElement.getBoundingClientRect();
    if (draggedPos.top >= targetPos.bottom) {
      // target is on a row above the dragged widget
      return y < targetPos.bottom && dy < -REORDER_MOVE_THRESHOLD;
    } else if (draggedPos.bottom <= targetPos.top) {
      // target is on a row below the dragged widget
      return y > targetPos.top && dy > REORDER_MOVE_THRESHOLD;
    } else if (draggedPos.left >= targetPos.right) {
      // target is on a column to the left of the dragged widget
      return x < targetPos.right && dx < -REORDER_MOVE_THRESHOLD;
    } else if (draggedPos.right <= targetPos.left) {
      // target is on a column to the right of the dragged widget
      return x > targetPos.left && dx > REORDER_MOVE_THRESHOLD;
    }
  }

  /**
   * Returns the elements (widgets or sections) that are candidates for reordering with the
   * currently dragged item. Effectively, this is the list of child widgets or sections inside
   * the same parent container (host or a section) as the dragged item.
   * @private
   */
  __getDragContextElements() {
    // Find the wrapper element representing the dragged item
    const draggedItemWrapper = [...this.host.querySelectorAll(WRAPPER_LOCAL_NAME)].find((el) =>
      itemsEqual(el.__item, this.draggedItem),
    );
    if (!draggedItemWrapper) {
      return [];
    }
    // Find all child wrappers in the same parent container as the dragged item's wrapper and
    // return their first children (the actual widgets or sections)
    return [...draggedItemWrapper.parentElement.children]
      .filter((el) => el.localName === WRAPPER_LOCAL_NAME && el.firstElementChild)
      .map((el) => el.firstElementChild);
  }

  /** @private */
  __reorderItems(draggedItem, targetIndex) {
    if (targetIndex < 0 || targetIndex >= getItemsArrayOfItem(draggedItem, this.host.items).length) {
      return;
    }
    const items = getItemsArrayOfItem(draggedItem, this.host.items);
    const draggedIndex = items.indexOf(draggedItem);
    items.splice(draggedIndex, 1);
    items.splice(targetIndex, 0, draggedItem);
    this.host.items = [...this.host.items];
  }

  /**
   * The dragged element might be removed from the DOM during the drag operation if
   * the widgets get re-rendered. This method restores the dragged element if it's not
   * present in the DOM to ensure the dragend event is fired.
   * @private
   */
  __restoreDraggedElement() {
    if (!this.host.contains(this.__draggedElement)) {
      this.__draggedElement.style.display = 'none';
      this.host.appendChild(this.__draggedElement);
    }
  }

  /**
   * Handle the item-move event dispatched by a widget / section.
   * @private
   */
  __itemMove(e) {
    e.stopImmediatePropagation();
    const item = getElementItem(e.target);
    const items = getItemsArrayOfItem(item, this.host.items);
    this.__reorderItems(item, items.indexOf(item) + e.detail.delta);
    this.__fireItemMovedEvent(item);
  }
}

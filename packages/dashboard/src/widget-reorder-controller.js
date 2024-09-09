/**
 * @license
 * Copyright (c) 2019 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const WRAPPER_LOCAL_NAME = 'vaadin-dashboard-widget-wrapper';
const REORDER_EVENT_TIMEOUT = 200;

/**
 * A controller to widget reordering inside a dashboard.
 */
export class WidgetReorderController extends EventTarget {
  constructor(host) {
    super();
    this.host = host;
    this.draggedElementRemoveObserver = new MutationObserver(() => this.__restoreDraggedElement());

    host.addEventListener('dragstart', (e) => this.__dragStart(e));
    host.addEventListener('dragend', (e) => this.__dragEnd(e));
    host.addEventListener('dragover', (e) => this.__dragOver(e));
    host.addEventListener('drop', (e) => this.__drop(e));
  }

  /** @private */
  __dragStart(e) {
    const handle = [...e.composedPath()].find((el) => el.classList && el.classList.contains('drag-handle'));
    if (!handle) {
      return;
    }

    this.__draggedElement = e.target;
    this.draggedItem = this.__getElementItem(this.__draggedElement);

    // Set the drag image to the dragged element
    const { left, top } = this.__draggedElement.getBoundingClientRect();
    e.dataTransfer.setDragImage(this.__draggedElement, e.clientX - left, e.clientY - top);
    // Set the text/plain data to enable dragging on mobile devices
    e.dataTransfer.setData('text/plain', 'item');

    // Observe the removal of the dragged element from the DOM
    this.draggedElementRemoveObserver.observe(this.host, { childList: true, subtree: true });

    this.host.dispatchEvent(new CustomEvent('dashboard-item-reorder-start'));

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

    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    // Get all elements that are candidates for reordering with the dragged element
    const dragContextElements = this.__getDragContextElements(this.__draggedElement);
    // Find the up-to-date element instance representing the dragged item
    const draggedElement = dragContextElements.find((element) => this.__getElementItem(element) === this.draggedItem);
    if (!draggedElement) {
      return;
    }
    // Get all elements except the dragged element from the drag context
    const otherElements = dragContextElements.filter((element) => element !== draggedElement);
    // Find the element closest to the x and y coordinates of the drag event
    const closestElement = this.__getClosestElement(otherElements, e.clientX, e.clientY);

    // Check if the dragged element is dragged enough over the element closest to the drag event coordinates
    if (!this.__reordering && this.__isDraggedOver(draggedElement, closestElement, e.clientX, e.clientY)) {
      // Prevent reordering multiple times in quick succession
      this.__reordering = true;
      setTimeout(() => {
        this.__reordering = false;
      }, REORDER_EVENT_TIMEOUT);

      const targetItem = this.__getElementItem(closestElement);
      const targetItems = this.__getItemsArrayOfItem(targetItem);
      const targetIndex = targetItems.indexOf(targetItem);

      const reorderEvent = new CustomEvent('dashboard-item-drag-reorder', {
        detail: { item: this.draggedItem, targetIndex },
        cancelable: true,
      });

      // Dispatch the reorder event and reorder items if the event is not canceled
      if (this.host.dispatchEvent(reorderEvent)) {
        this.__reorderItems(this.draggedItem, targetIndex);
      }
    }
  }

  /** @private */
  __dragEnd() {
    if (!this.draggedItem) {
      return;
    }

    // If the originally dragged element is restored to the DOM (as a direct child of the host),
    // to make sure "dragend" event gets dispatched, remove it to avoid duplicates
    if (this.__draggedElement.parentElement === this.host) {
      this.__draggedElement.remove();
    }

    // Reset the dragged element and item, and re-render to remove the placeholder
    this.__draggedElement = null;
    this.draggedItem = null;
    this.host.items = [...this.host.items];

    // Disconnect the observer for the dragged element removal
    this.draggedElementRemoveObserver.disconnect();

    // Dispatch the reorder end event
    this.host.dispatchEvent(new CustomEvent('dashboard-item-reorder-end'));
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
  __isDraggedOver(draggedElement, targetElement, x, y) {
    const draggedPos = draggedElement.getBoundingClientRect();
    const targetPos = targetElement.getBoundingClientRect();
    if (draggedPos.top >= targetPos.bottom) {
      // target is on a row above the dragged widget
      return y < targetPos.top + targetPos.height / 2;
    } else if (draggedPos.bottom <= targetPos.top) {
      // target is on a row below the dragged widget
      return y > targetPos.top + targetPos.height / 2;
    } else if (draggedPos.left >= targetPos.right) {
      // target is on a column to the left of the dragged widget
      return x < targetPos.left + targetPos.width / 2;
    } else if (draggedPos.right <= targetPos.left) {
      // target is on a column to the right of the dragged widget
      return x > targetPos.left + targetPos.width / 2;
    }
  }

  /** @private */
  __getElementItem(element) {
    return element.closest(WRAPPER_LOCAL_NAME).__item;
  }

  /**
   * Returns the elements (widgets or sections) that are candidates for reordering with the
   * currently dragged item. Effectively, this is the list of child widgets or sections inside
   * the same parent container (host or a section) as the dragged item.
   * @private
   */
  __getDragContextElements() {
    const draggedItemWrapper = [...this.host.querySelectorAll(WRAPPER_LOCAL_NAME)].find(
      (el) => el.__item === this.draggedItem,
    );
    if (!draggedItemWrapper) {
      return [];
    }

    const siblingWrappers = [...draggedItemWrapper.parentElement.children].filter(
      (el) => el.localName === WRAPPER_LOCAL_NAME,
    );

    return siblingWrappers.map((el) => el.firstElementChild).filter((el) => el);
  }

  /** @private */
  __reorderItems(draggedItem, targetIndex) {
    const items = this.__getItemsArrayOfItem(draggedItem);
    const draggedIndex = items.indexOf(draggedItem);
    items.splice(draggedIndex, 1);
    items.splice(targetIndex, 0, draggedItem);
    this.host.items = [...this.host.items];
  }

  /**
   * Returns the array of items that contains the given item.
   * Might be the host items or the items of a section.
   * @private
   */
  __getItemsArrayOfItem(item, items = this.host.items) {
    for (const i of items) {
      if (i === item) {
        return items;
      }
      if (i.items) {
        const result = this.__getItemsArrayOfItem(item, i.items);
        if (result) {
          return result;
        }
      }
    }
    return null;
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
}

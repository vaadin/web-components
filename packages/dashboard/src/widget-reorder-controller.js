/**
 * @license
 * Copyright (c) 2019 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const WRAPPER_LOCAL_NAME = 'vaadin-dashboard-widget-wrapper';
const REORDER_EVENT_TIMEOUT = 300;

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
  }

  /** @private */
  __dragStart(e) {
    if ([...e.composedPath()].some((el) => el.classList && el.classList.contains('drag-handle'))) {
      this.__draggedElement = e.target;
      this.draggedItem = this.__getElementItem(this.__draggedElement);

      // Set the drag image to the dragged element
      const draggedElementRect = this.__draggedElement.getBoundingClientRect();
      e.dataTransfer.setDragImage(
        this.__draggedElement,
        e.clientX - draggedElementRect.left,
        e.clientY - draggedElementRect.top,
      );

      // Observe the removal of the dragged element from the DOM
      this.draggedElementRemoveObserver.observe(this.host, { childList: true, subtree: true });

      this.host.dispatchEvent(new CustomEvent('dashboard-item-reorder-start'));

      requestAnimationFrame(() => {
        // Re-render to have the dragged element turn into a placeholder
        this.host.items = [...this.host.items];
      });
    }
  }

  /** @private */
  __dragOver(e) {
    if (this.draggedItem) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';

      // All the elements that are candidates for reordering with the dragged element
      const dragContextElements = this.__getDragContextElements(this.__draggedElement);
      // Up-to-date element instance representing the dragged item
      const draggedElement = dragContextElements.find((element) => this.__getElementItem(element) === this.draggedItem);
      // All but the dragged element from the drag context
      const otherElements = dragContextElements.filter((element) => element !== draggedElement);
      // The element that is the closest to the x and y coordinates of the drag event
      const closestElement = this.__getClosestElement(otherElements, e.clientX, e.clientY);

      // See if the dragged element is dragged enough over the element closest to the drag event coordinates
      if (!this.__reordering && this.__isDraggedOver(draggedElement, closestElement, e.clientX, e.clientY)) {
        // Use a short timeout to prevent reordering multiple times in quick succession
        this.__reordering = true;
        setTimeout(() => {
          this.__reordering = false;
        }, REORDER_EVENT_TIMEOUT);

        const targetItem = this.__getElementItem(closestElement);
        const reorderEvent = new CustomEvent('dashboard-item-drag-reorder', {
          detail: { item: this.draggedItem, target: targetItem },
          cancelable: true,
        });
        if (this.host.dispatchEvent(reorderEvent)) {
          // If the event is not canceled, reorder the items and re-render
          this.__reorderItems(this.draggedItem, targetItem);
        }
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
    this.__draggedElement = null;
    // Reset the dragged item to null and re-render to remove the placeholder
    this.draggedItem = null;
    this.host.items = [...this.host.items];
    this.draggedElementRemoveObserver.disconnect();

    this.host.dispatchEvent(new CustomEvent('dashboard-item-reorder-end'));
  }

  /**
   * Returns the closest element to the given coordinates.
   * @private
   */
  __getClosestElement(elements, x, y) {
    return elements.reduce(
      (acc, element) => {
        const rect = element.getBoundingClientRect();
        const centerOfElement = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
        const distance = Math.sqrt((centerOfElement.x - x) ** 2 + (centerOfElement.y - y) ** 2);
        if (distance < acc.distance) {
          return { element, distance };
        }
        return acc;
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
   * currently dragged item.
   * @private
   */
  __getDragContextElements() {
    const draggedItemWrapper = [...this.host.querySelectorAll(WRAPPER_LOCAL_NAME)].find(
      (el) => el.__item === this.draggedItem,
    );
    const siblingWrappers = [...draggedItemWrapper.parentElement.children].filter(
      (el) => el.localName === WRAPPER_LOCAL_NAME,
    );
    return siblingWrappers.map((el) => el.firstElementChild);
  }

  /** @private */
  __reorderItems(draggedItem, targetItem) {
    const draggedItems = this.__getItemsArrayOfItem(draggedItem);
    const targetItems = this.__getItemsArrayOfItem(targetItem);
    const draggedIndex = draggedItems.indexOf(draggedItem);
    const targetIndex = targetItems.indexOf(targetItem);
    draggedItems.splice(draggedIndex, 1);
    targetItems.splice(targetIndex, 0, draggedItem);
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
      } else if (i.items) {
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

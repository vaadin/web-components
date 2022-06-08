/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @polymerMixin
 */
export const EventContextMixin = (superClass) =>
  class EventContextMixin extends superClass {
    /**
     * Returns an object with context information about the event target:
     * - `item`: the data object corresponding to the targeted row (not specified when targeting header or footer)
     * - `column`: the column element corresponding to the targeted cell (not specified when targeting row details)
     * - `section`: whether the event targeted the body, header, footer or details of the grid
     *
     * These additional properties are included when `item` is specified:
     * - `index`: the index of the item
     * - `selected`: the selected state of the item
     * - `detailsOpened`: whether the row details are open for the item
     * - `expanded`: the expanded state of the tree toggle
     * - `level`: the tree hierarchy level
     *
     * The returned object is populated only when a grid cell, header, footer or row details is found in `event.composedPath()`.
     * This means mostly mouse and keyboard events. If such a grid part is not found in the path, an empty object is returned.
     * This may be the case eg. if the event is fired on the `<vaadin-grid>` element and not any deeper in the DOM, or if
     * the event targets the empty part of the grid body.
     *
     * @param {!Event} event
     * @return {GridEventContext}
     */
    getEventContext(event) {
      const context = {};

      // Use `composedPath()` stored by vaadin-context-menu gesture
      // to avoid problem when accessing it after a timeout on iOS
      const path = event.__composedPath || event.composedPath();
      const cell = path[path.indexOf(this.$.table) - 3];

      if (!cell) {
        return context;
      }

      context.section = ['body', 'header', 'footer', 'details'].filter(
        (section) => cell.getAttribute('part').indexOf(section) > -1,
      )[0];

      if (cell._column) {
        context.column = cell._column;
      }

      if (context.section === 'body' || context.section === 'details') {
        Object.assign(context, this.__getRowModel(cell.parentElement));
      }

      return context;
    }
  };

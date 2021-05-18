import { GridElement } from '@vaadin/vaadin-grid';

import { Templatizer } from './vaadin-template-renderer-templatizer.js';

export class GridTemplatizer extends Templatizer {
  static get is() {
    return 'vaadin-template-renderer-grid-templatizer';
  }

  __templateInstancePropertyChanged(instance, prop, value) {
    if (prop === 'index' || prop === 'item') {
      // We don’t need a change notification for these.
      return;
    }

    const originalProp = `__${prop}__`;

    // Notify for only user-action changes, not for scrolling updates. E. g.,
    // if `detailsOpened` is different from `__detailsOpened__`, which was set during render.
    if (instance[originalProp] === value) {
      return;
    }
    instance[originalProp] = value;

    // TODO: Call `_updateRow` method instead of mutating the template instances
    const row = Array.from(this.__grid.$.items.children).filter((row) =>
      this.__grid._itemsEqual(row._item, instance.item)
    )[0];
    if (row) {
      Array.from(row.children).forEach((cell) => {
        if (cell._content.__templateInstance) {
          cell._content.__templateInstance[originalProp] = value;
          cell._content.__templateInstance.notifyPath(prop, value);
        }
      });
    }

    if (prop.startsWith('item.')) {
      this.__itemPropertyChanged(instance, prop, value);
    }

    if (prop === 'expanded') {
      this.__expandedPropertyChanged(instance, prop, value);
    }

    if (prop === 'selected') {
      this.__selectedPropertyChanged(instance, prop, value);
    }

    if (prop === 'detailsOpened') {
      this.__detailsOpenedPropertyChanged(instance, prop, value);
    }
  }

  __itemPropertyChanged(instance, prop, value) {
    if (!Array.isArray(this.__grid.items)) return;

    const index = this.__grid.items.indexOf(instance.item);

    const path = prop.replace(/^item\./, '');

    this.__grid.notifyPath(`items.${index}.${path}`, value);
  }

  __expandedPropertyChanged(instance, value) {
    if (instance.item === undefined) return;

    if (value) {
      this.__grid.expandItem(instance.item);
    } else {
      this.__grid.collapseItem(instance.item);
    }
  }

  __selectedPropertyChanged(instance, value) {
    if (value) {
      this.__grid.selectItem(instance.item);
    } else {
      this.__grid.deselectItem(instance.item);
    }
  }

  __detailsOpenedPropertyChanged(instance, value) {
    if (value) {
      this.__grid.openItemDetails(instance.item);
    } else {
      this.__grid.closeItemDetails(instance.item);
    }
  }

  get __grid() {
    if (this.__component instanceof GridElement) {
      return this.__component;
    }

    return this.__component._grid;
  }
}

customElements.define(GridTemplatizer.is, GridTemplatizer);

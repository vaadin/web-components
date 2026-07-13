/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { noChange } from 'lit';
import { Directive, directive, PartType } from 'lit/directive.js';
import { updatePart, updateState } from './vaadin-grid-helpers.js';

/**
 * An element expression directive that applies cell state to the element:
 *
 * - `states`: toggles both the state attribute and the `<name>-cell`
 *   class / part token, following the `updateCellState` convention.
 * - `parts`: toggles class / part tokens only.
 * - `attributes`: sets string attributes and toggles boolean attributes only.
 *
 * The directive only manages the names it has applied itself - classes,
 * parts and attributes toggled by other code are left untouched.
 */
class CellStateDirective extends Directive {
  constructor(partInfo) {
    super(partInfo);
    if (partInfo.type !== PartType.ELEMENT) {
      throw new Error('`cellState()` can only be used as an element expression');
    }
  }

  /** @override */
  render() {
    return noChange;
  }

  /** @override */
  update(part, [{ states = {}, parts = {}, attributes = {} }]) {
    const element = part.element;

    const newParts = { ...parts };
    const newAttributes = { ...attributes };
    Object.entries(states).forEach(([name, value]) => {
      newAttributes[name] = value;
      newParts[`${name}-cell`] = value;
    });

    // Toggle class / part tokens, removing previously applied tokens
    // that no longer apply
    this.__previousParts?.forEach((name) => {
      if (!newParts[name]) {
        updatePart(element, name, false);
      }
    });
    this.__previousParts = new Set();
    Object.entries(newParts).forEach(([name, value]) => {
      updatePart(element, name, value);
      if (value) {
        this.__previousParts.add(name);
      }
    });

    // Update state attributes, removing previously applied attributes
    // that no longer apply
    this.__previousAttributes?.forEach((name) => {
      if (!(name in newAttributes)) {
        element.removeAttribute(name);
      }
    });
    this.__previousAttributes = new Set(Object.keys(newAttributes));
    Object.entries(newAttributes).forEach(([name, value]) => {
      updateState(element, name, value);
    });

    return noChange;
  }
}

export const cellState = directive(CellStateDirective);

/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { noChange } from 'lit';
import { Directive, directive, PartType } from 'lit/directive.js';

class PartMapDirective extends Directive {
  // Part names applied by the directive on the previous render,
  // used to remove names that no longer apply.
  #previousParts;

  // Part names declared statically in the attribute, never removed.
  #staticParts;

  constructor(partInfo) {
    super(partInfo);
    if (partInfo.type !== PartType.ATTRIBUTE || partInfo.name !== 'part' || partInfo.strings?.length > 2) {
      throw new Error('`partMap()` can only be used in the `part` attribute and must be the only binding in it.');
    }
  }

  render(partNameInfo) {
    // Add spaces to ensure separation from static parts
    return ` ${Object.keys(partNameInfo)
      .filter((key) => partNameInfo[key])
      .join(' ')} `;
  }

  update(part, [partNameInfo]) {
    // Remember dynamic parts on the first render
    if (this.#previousParts === undefined) {
      this.#previousParts = new Set();
      if (part.strings !== undefined) {
        this.#staticParts = new Set(
          part.strings
            .join(' ')
            .split(/\s/u)
            .filter((s) => s !== ''),
        );
      }
      Object.keys(partNameInfo).forEach((name) => {
        if (partNameInfo[name] && !this.#staticParts?.has(name)) {
          this.#previousParts.add(name);
        }
      });
      return this.render(partNameInfo);
    }

    const partList = part.element.part;

    // Remove old parts that no longer apply
    this.#previousParts.forEach((name) => {
      if (!(name in partNameInfo)) {
        partList.remove(name);
        this.#previousParts.delete(name);
      }
    });

    // Add or remove parts based on their partMap value
    Object.keys(partNameInfo).forEach((name) => {
      const value = !!partNameInfo[name];
      if (value !== this.#previousParts.has(name) && !this.#staticParts?.has(name)) {
        if (value) {
          partList.add(name);
          this.#previousParts.add(name);
        } else {
          partList.remove(name);
          this.#previousParts.delete(name);
        }
      }
    });

    return noChange;
  }
}

/**
 * A directive that applies dynamic shadow DOM part names.
 *
 * This must be used in the `part` attribute and must be the only binding in it.
 * Each property name in `partNameInfo` is added to the element's `part` list
 * if the property value is truthy, and removed if the value is falsy.
 */
export const partMap = directive(PartMapDirective);

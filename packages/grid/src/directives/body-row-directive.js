/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { nothing } from 'lit';
import { Directive, directive } from 'lit/directive.js';

/**
 * A directive that sets up a body row element when it is first rendered.
 */
class BodyRowDirective extends Directive {
  #row;

  update(part) {
    if (!this.#row) {
      this.#row = part.element;
      this.#emptyTextNodes();
    }
    return nothing;
  }

  /**
   * Empties the whitespace text nodes of the row template
   * so that a row without cells matches `:empty`.
   */
  #emptyTextNodes() {
    this.#row.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.nodeValue = '';
      }
    });
  }
}

export const bodyRow = directive(BodyRowDirective);

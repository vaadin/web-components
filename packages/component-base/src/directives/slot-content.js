/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { noChange, render } from 'lit';
import { Directive, directive, PartType } from 'lit/directive.js';

class SlotContentDirective extends Directive {
  // Comment node in the light DOM of the host that the content is rendered before.
  #marker = null;

  constructor(partInfo) {
    super(partInfo);
    if (partInfo.type !== PartType.ELEMENT) {
      throw new Error('`slotContent()` can only be used as an element expression of a `<slot>`.');
    }
  }

  render(_content) {
    return noChange;
  }

  update(part, [content]) {
    if (part.element.localName !== 'slot') {
      throw new Error('`slotContent()` can only be used as an element expression of a `<slot>`.');
    }

    const host = part.options?.host;
    if (!host) {
      throw new Error('`slotContent()` requires the template to be rendered with the `host` option.');
    }

    // Create a new marker when it was removed, e.g. when the host light DOM was cleared
    if (this.#marker?.parentNode !== host) {
      this.#marker = document.createComment('');
      host.appendChild(this.#marker);
    }

    render(content, host, { host, renderBefore: this.#marker });

    return noChange;
  }
}

/**
 * A directive that renders the content of a `<slot>` into the light DOM of
 * the host element. The content must have the `slot` attribute of that slot.
 *
 * Use it as an element expression of the `<slot>` in the template returned by
 * `render()`, e.g. `<slot name="form" ${slotContent(this._renderForm())}></slot>`.
 *
 * On the first render, the directive appends a comment marker to the host and
 * renders the content before it. Children that the host already has stay before
 * the content, and children added later go after the marker, so rendering again
 * does not move or remove them.
 *
 * Always render the directive: pass `nothing` as content instead of removing it,
 * which would leave the content in the light DOM. On the first render, the content
 * is connected before the shadow DOM of the host.
 */
export const slotContent = directive(SlotContentDirective);

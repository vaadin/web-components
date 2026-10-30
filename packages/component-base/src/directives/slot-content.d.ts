/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { DirectiveResult } from 'lit/directive.js';

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
export declare function slotContent(content: unknown): DirectiveResult;

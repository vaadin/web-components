/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-markdown>` is a web component for rendering Markdown content.
 * It takes Markdown source as input and renders the corresponding HTML.
 *
 * ### Styling
 *
 * The component does not have specific shadow DOM parts for styling the rendered Markdown content itself,
 * as the content is rendered directly into the component's light DOM via a slot.
 * You can style the rendered HTML elements using standard CSS selectors targeting the `vaadin-markdown` element.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class Markdown extends ElementMixin(ThemableMixin(HTMLElement)) {
  /**
   * The Markdown content.
   */
  content: string | null | undefined;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-markdown': Markdown;
  }
}

export { Markdown };

/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

declare class Markdown extends ElementMixin(ThemableMixin(HTMLElement)) {
  markdown: string;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-markdown': Markdown;
  }
}

export { Markdown };

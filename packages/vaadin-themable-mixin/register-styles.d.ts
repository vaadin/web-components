import type { CSSResultGroup } from 'lit';

/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
export { registerStyles, css, unsafeCSS } from './vaadin-themable-mixin.js';
export const addGlobalThemeStyles: (id: string, prefix: string, ...styles: CSSResultGroup[]) => void;

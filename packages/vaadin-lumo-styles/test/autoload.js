/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { color, typography } from '../all-imports.js';

const style = document.createElement('style');
style.innerHTML = `${color.toString()} ${typography.toString()}`;
document.head.appendChild(style);

export * from '../all-imports.js';

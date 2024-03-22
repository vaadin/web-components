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
import { colorDark, colorLight, typography } from '../all-imports.js';

const color = document.documentElement.getAttribute('theme') === 'dark' ? colorDark : colorLight;

const style = document.createElement('style');
style.innerHTML = `${color.toString().replace(':host', 'html')} ${typography.toString()}`;
document.head.appendChild(style);

export * from '../all-imports.js';

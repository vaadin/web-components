/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { colorDark, colorLight, typography } from '../all-imports.js';

const color = document.documentElement.getAttribute('theme') === 'dark' ? colorDark : colorLight;

const style = document.createElement('style');
style.innerHTML = `${color.toString().replace(':host', 'html')} ${typography.toString()}`;
document.head.appendChild(style);

export * from '../all-imports.js';

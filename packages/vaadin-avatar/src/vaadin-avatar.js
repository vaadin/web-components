/**
 * @license
 * Copyright (c) 2020 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Avatar } from '@vaadin/avatar/src/vaadin-avatar.js';

/**
 * @deprecated Import `Avatar` from `@vaadin/avatar` instead.
 */
export const AvatarElement = Avatar;

export * from '@vaadin/avatar/src/vaadin-avatar.js';

console.warn('WARNING: Since Vaadin 23.2, "@vaadin/vaadin-avatar" is deprecated. Use "@vaadin/avatar" instead.');

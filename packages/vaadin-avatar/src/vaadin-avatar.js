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
import { Avatar } from '@vaadin/avatar/src/vaadin-avatar.js';

/**
 * @deprecated Import `Avatar` from `@vaadin/avatar` instead.
 */
export const AvatarElement = Avatar;

export * from '@vaadin/avatar/src/vaadin-avatar.js';

console.warn('WARNING: Since Vaadin 23.2, "@vaadin/vaadin-avatar" is deprecated. Use "@vaadin/avatar" instead.');

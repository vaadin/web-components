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
import { AvatarGroup } from '@vaadin/avatar-group/src/vaadin-avatar-group.js';

/**
 * @deprecated Import `AvatarGroup` from `@vaadin/avatar-group` instead.
 */
export const AvatarGroupElement = AvatarGroup;

export * from '@vaadin/avatar-group/src/vaadin-avatar-group.js';

console.warn('WARNING: Since Vaadin 23.2, "@vaadin/vaadin-avatar" is deprecated. Use "@vaadin/avatar-group" instead.');

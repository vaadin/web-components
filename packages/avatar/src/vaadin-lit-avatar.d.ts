/**
 * @license
 * Copyright (c) 2020 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { LitElement } from 'lit';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { AvatarMixin } from './vaadin-avatar-mixin.js';

export { AvatarI18n } from './vaadin-avatar-mixin.js';

/**
 * LitElement based version of `<vaadin-avatar>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment not intended for publishing to npm.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
declare class Avatar extends AvatarMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement)))) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-avatar': Avatar;
  }
}

export { Avatar };

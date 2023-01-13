/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { LitElement } from 'lit';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ItemMixin } from './vaadin-item-mixin.js';

/**
 * LitElement based version of `<vaadin-item>` web component.
 * Note: this is a prototype not supposed to be used publicly.
 */
declare class Item extends ItemMixin(DirMixin(ThemableMixin(LitElement))) {}

export { Item };

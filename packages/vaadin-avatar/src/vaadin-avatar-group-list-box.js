/**
 * @license
 * Copyright (c) 2020 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ListBoxElement } from '@vaadin/vaadin-list-box/src/vaadin-list-box.js';

/**
 * The vaadin-avatar-group-list-box element.
 *
 * @extends HTMLElement
 */
class AvatarGroupListBoxElement extends ListBoxElement {
  static get is() {
    return 'vaadin-avatar-group-list-box';
  }
}

customElements.define(AvatarGroupListBoxElement.is, AvatarGroupListBoxElement);
